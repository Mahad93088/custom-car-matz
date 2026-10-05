import { Router } from 'express';
import { createStripePaymentIntent, createStripeCheckoutSession, verifyStripePayment } from '../payments/stripe.ts';
import { db } from '../database/db.ts';
import { Order, OrderItem } from '../database/types.ts';

export const stripeRouter = Router();

// Create Stripe Checkout Session (Redirect flow)
stripeRouter.post('/create-checkout-session', async (req, res) => {
  try {
    const {
      items,
      customerEmail,
      customerName,
      customerPhone,
      shippingAddress,
      billingAddress,
      shippingMethod,
      shippingCost,
      subtotal,
      discountAmount,
      total,
      notes,
      userId,
      successUrl: customSuccessUrl,
      cancelUrl: customCancelUrl
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    if (!customerEmail || !customerName) {
      return res.status(400).json({ error: 'Customer name and email are required.' });
    }

    const hostOrigin = (req.headers.origin as string) || process.env.APP_URL || 'http://localhost:3000';
    const successUrl = customSuccessUrl || `${hostOrigin}?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = customCancelUrl || `${hostOrigin}?checkout=cancel`;

    // Create session via Stripe SDK
    const session = await createStripeCheckoutSession(
      items,
      customerEmail,
      customerName,
      Number(shippingCost || 0),
      successUrl,
      cancelUrl,
      {
        customerName: customerName || '',
        customerEmail: customerEmail || '',
        site: 'Custom Car Mats UK'
      }
    );

    // Create and save Order record
    const orderNumber = 'CCM-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      orderNumber,
      userId: userId || undefined,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone?.trim() || '',
      shippingAddress: shippingAddress || {
        id: 'addr_' + Date.now(),
        isDefault: true,
        addressType: 'shipping',
        line1: 'United Kingdom Delivery',
        city: 'United Kingdom',
        postcode: 'UK',
        country: 'United Kingdom'
      },
      billingAddress: billingAddress || shippingAddress,
      items: items.map((item: any, idx: number) => ({
        id: 'item_' + Date.now() + '_' + idx,
        productId: item.productId,
        productName: item.productName,
        sku: item.sku || 'CCM-TAILORED',
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice,
        materialName: item.materialName || 'Luxury Carpet',
        colorName: item.colorName || 'Black',
        stitchingName: item.stitchingName || 'Single Stitch',
        heelPadName: item.heelPadName || 'Standard Heelpad',
        vehicleDetails: item.vehicleDetails || {
          make: 'Universal',
          model: 'All Models',
          year: 'Current',
          variant: 'Standard'
        },
        customEmbroidery: item.customEmbroidery
      })),
      subtotal: Number(subtotal || 0),
      discountAmount: Number(discountAmount || 0),
      shippingCost: Number(shippingCost || 0),
      shippingMethod: shippingMethod || 'Royal Mail 48 Tracked',
      total: Number(total || 0),
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      stripePaymentIntentId: session.sessionId,
      notes: notes?.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.createOrder(newOrder);

    // Award Loyalty Points if customer account exists (5 points per £1 spent)
    try {
      const userToAward = userId ? db.findUserById(userId) : db.findUserByEmail(customerEmail);
      if (userToAward) {
        const pointsEarned = Math.round(Number(newOrder.total) * 5);
        const updatedPts = (userToAward.loyaltyPoints || 0) + pointsEarned;
        const historyItem = {
          id: 'pts_' + Date.now(),
          date: new Date().toISOString(),
          points: pointsEarned,
          type: 'earned' as const,
          description: `Earned 5 pts per £1 on Order ${newOrder.orderNumber}`,
          orderNumber: newOrder.orderNumber
        };
        db.updateUser(userToAward.id, {
          loyaltyPoints: updatedPts,
          pointsHistory: [historyItem, ...(userToAward.pointsHistory || [])]
        });
      }
    } catch (e) {
      console.error('Error awarding loyalty points:', e);
    }

    // Audit log
    db.addAuditLog({
      adminId: 'stripe_checkout',
      adminName: 'Stripe Checkout Session',
      adminEmail: 'stripe@customcarmats.co.uk',
      action: 'CHECKOUT_SESSION_CREATED',
      entityType: 'Order',
      entityId: newOrder.id,
      details: `Created Stripe Checkout Session ${session.sessionId} for Order ${newOrder.orderNumber} (£${newOrder.total.toFixed(2)})`
    });

    res.json({
      url: session.url,
      sessionId: session.sessionId,
      order: newOrder
    });
  } catch (err: any) {
    console.error('Failed to create checkout session:', err);
    res.status(500).json({ error: err.message || 'Unable to create Stripe checkout session' });
  }
});

// Retrieve Order by Stripe Checkout Session ID
stripeRouter.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required.' });
    }

    const order = db.getOrders().find(o => o.stripePaymentIntentId === sessionId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found for this checkout session.' });
    }

    res.json({ order });
  } catch (err: any) {
    console.error('Failed to retrieve order by session ID:', err);
    res.status(500).json({ error: 'Failed to retrieve order details' });
  }
});

// Create Stripe Payment Intent (Server-side)
stripeRouter.post('/create-intent', async (req, res) => {
  try {
    const { amount, customerEmail, customerName } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid payment amount is required.' });
    }

    // Convert pounds to pence (e.g. £43.99 -> 4399 pence)
    const amountPence = Math.round(Number(amount) * 100);

    const intent = await createStripePaymentIntent(amountPence, 'gbp', {
      customerName: customerName || 'Valued Customer',
      customerEmail: customerEmail || 'guest@customcarmats.co.uk',
      site: 'Custom Car Mats UK'
    });

    res.json({
      clientSecret: intent.clientSecret,
      paymentIntentId: intent.paymentIntentId,
      amount: intent.amount,
      currency: intent.currency,
      mode: intent.mode
    });
  } catch (err: any) {
    console.error('Failed to create Stripe payment intent:', err);
    res.status(500).json({ error: err.message || 'Unable to initialise secure payment' });
  }
});

// Finalize and Confirm Order after successful payment
stripeRouter.post('/confirm-order', async (req, res) => {
  try {
    const {
      paymentIntentId,
      items,
      shippingAddress,
      billingAddress,
      customerName,
      customerEmail,
      customerPhone,
      shippingMethod,
      shippingCost,
      subtotal,
      discountAmount,
      total,
      notes,
      userId
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    if (!customerEmail || !customerName) {
      return res.status(400).json({ error: 'Customer contact details are required.' });
    }

    // Verify payment on Stripe
    const isPaid = await verifyStripePayment(paymentIntentId);
    if (!isPaid) {
      return res.status(400).json({ error: 'Payment could not be verified with Stripe.' });
    }

    const orderNumber = 'CCM-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      orderNumber,
      userId: userId || undefined,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone?.trim() || '',
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      items: items.map((item: any, idx: number) => ({
        id: 'item_' + Date.now() + '_' + idx,
        productId: item.productId,
        productName: item.productName,
        sku: item.sku || 'CCM-TAILORED',
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice,
        materialName: item.materialName || 'Luxury Carpet',
        colorName: item.colorName || 'Black',
        stitchingName: item.stitchingName || 'Single Stitch',
        heelPadName: item.heelPadName || 'Standard Heelpad',
        vehicleDetails: item.vehicleDetails || {
          make: 'Universal',
          model: 'All Models',
          year: 'Current',
          variant: 'Standard'
        },
        customEmbroidery: item.customEmbroidery
      })),
      subtotal: Number(subtotal),
      discountAmount: Number(discountAmount || 0),
      shippingCost: Number(shippingCost || 0),
      shippingMethod: shippingMethod || 'Standard Delivery',
      total: Number(total),
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      stripePaymentIntentId: paymentIntentId,
      notes: notes?.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.createOrder(newOrder);

    // Award Loyalty Points if customer account exists (5 points per £1 spent)
    try {
      const userToAward = userId ? db.findUserById(userId) : db.findUserByEmail(customerEmail);
      if (userToAward) {
        const pointsEarned = Math.round(Number(newOrder.total) * 5);
        const updatedPts = (userToAward.loyaltyPoints || 0) + pointsEarned;
        const historyItem = {
          id: 'pts_' + Date.now(),
          date: new Date().toISOString(),
          points: pointsEarned,
          type: 'earned' as const,
          description: `Earned 5 pts per £1 on Order ${newOrder.orderNumber}`,
          orderNumber: newOrder.orderNumber
        };
        db.updateUser(userToAward.id, {
          loyaltyPoints: updatedPts,
          pointsHistory: [historyItem, ...(userToAward.pointsHistory || [])]
        });
      }
    } catch (e) {
      console.error('Error awarding loyalty points:', e);
    }

    // Audit log
    db.addAuditLog({
      adminId: 'system_stripe',
      adminName: 'Stripe Gateway',
      adminEmail: 'stripe@customcarmats.co.uk',
      action: 'PAYMENT_SUCCESS',
      entityType: 'Order',
      entityId: newOrder.id,
      details: `Processed payment of £${newOrder.total.toFixed(2)} via Stripe for order ${newOrder.orderNumber}`
    });

    res.status(201).json({
      success: true,
      order: newOrder,
      message: 'Payment received successfully. Your order is now confirmed and queued for tailoring!'
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: err.message || 'Failed to place order' });
  }
});
