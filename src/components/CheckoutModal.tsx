import React, { useState } from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, Truck, AlertCircle, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useVehicle } from '../context/VehicleContext.tsx';
import { api } from '../lib/api.ts';
import { Order } from '../types/index.ts';

interface CheckoutModalProps {
  onOrderComplete?: (order: Order) => void;
}

export function CheckoutModal({ onOrderComplete }: CheckoutModalProps) {
  const {
    isCheckoutOpen,
    closeCheckout,
    items,
    subtotal,
    discountAmount,
    shippingMethod,
    setShippingMethod,
    shippingCost,
    total,
    clearCart
  } = useCart();
  const { user } = useAuth();
  const { selectedVehicle } = useVehicle();

  // Form states
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');

  // UK Delivery Address
  const [line1, setLine1] = useState('14 Parkside Gardens');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('Bristol');
  const [county, setCounty] = useState('Somerset');
  const [postcode, setPostcode] = useState('BS8 4LJ');
  const [orderNotes, setOrderNotes] = useState('');

  // Processing & Redirect States
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const handlePayWithStripe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerName.trim() || !customerEmail.trim() || !line1.trim() || !city.trim() || !postcode.trim()) {
      setErrorMessage('Please fill in all mandatory customer contact and UK delivery address fields.');
      return;
    }

    if (!customerEmail.includes('@') || !customerEmail.includes('.')) {
      setErrorMessage('Please provide a valid email address for your order confirmation and dispatch updates.');
      return;
    }

    if (!items || items.length === 0) {
      setErrorMessage('Your basket is empty. Please add tailored car mats before proceeding.');
      return;
    }

    setIsProcessing(true);

    try {
      const shippingAddress = {
        id: 'addr_' + Date.now(),
        isDefault: true,
        addressType: 'shipping' as const,
        line1: line1.trim(),
        line2: line2.trim(),
        city: city.trim(),
        county: county.trim(),
        postcode: postcode.trim().toUpperCase(),
        country: 'United Kingdom'
      };

      const hostOrigin = window.location.origin || 'http://localhost:3000';
      const successUrl = `${hostOrigin}?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${hostOrigin}?checkout=cancel`;

      // Call /api/payments/create-checkout-session to initiate Stripe Checkout Session
      const sessionResult = await api.createCheckoutSession({
        items,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        shippingAddress,
        billingAddress: shippingAddress,
        shippingMethod: shippingMethod === 'express' ? 'DPD Next Day Express' : 'Royal Mail 48 Tracked',
        shippingCost,
        subtotal,
        discountAmount,
        total,
        notes: orderNotes.trim(),
        userId: user?.id,
        successUrl,
        cancelUrl
      });

      if (!sessionResult || !sessionResult.url) {
        throw new Error('Did not receive a valid Stripe Checkout Session URL from the server.');
      }

      // Store the session URL and prepare redirect
      setRedirectUrl(sessionResult.url);

      if (sessionResult.order) {
        setConfirmedOrder(sessionResult.order);
        if (onOrderComplete) {
          onOrderComplete(sessionResult.order);
        }
      }

      // Clear the local basket since the order has been created and handed off to Stripe
      clearCart();

      // Redirect the user to the secure Stripe-hosted payment page
      window.location.href = sessionResult.url;
    } catch (err: any) {
      console.error('Failed to create Stripe Checkout session:', err);
      setErrorMessage(err.message || 'An error occurred while connecting to Stripe Checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#071A33] border border-[#1D3B63] rounded-2xl shadow-2xl max-w-3xl w-full text-white overflow-hidden my-8 animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-[#0D2A4A] flex items-center justify-between bg-[#040D1A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0D2A4A] border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold tracking-tight">Custom Car Mats Checkout</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  Stripe Hosted
                </span>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted • Official Stripe Payment Gateway</span>
              </p>
            </div>
          </div>

          <button
            onClick={closeCheckout}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#0D2A4A] transition-colors disabled:opacity-50"
            title="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Vehicle Tailoring Badge */}
        {selectedVehicle && (
          <div className="bg-amber-400/10 border-b border-amber-400/20 px-6 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>
                Tailored for: <strong className="text-white font-semibold">{selectedVehicle.makeName} {selectedVehicle.modelName} {selectedVehicle.variantName} ({selectedVehicle.yearRange})</strong>
              </span>
            </div>
            <span className="text-[11px] text-amber-400 font-mono hidden sm:inline">Laser CAD Precision Fit</span>
          </div>
        )}

        {/* Redirecting State View */}
        {redirectUrl ? (
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-amber-400 animate-pulse">
              <ExternalLink className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                Stripe Gateway Connected
              </span>
              <h3 className="text-2xl font-extrabold text-white">
                Redirecting to Secure Stripe Checkout...
              </h3>
              <p className="text-sm text-gray-300 max-w-md mx-auto">
                You are being transferred to Stripe’s secure hosted checkout page to complete your payment with Credit/Debit card, Apple Pay, or Google Pay.
              </p>
            </div>

            <div className="bg-[#040D1A] border border-[#1D3B63] rounded-xl p-4 max-w-md mx-auto text-xs text-gray-400 space-y-2">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>PCI-DSS Level 1 Certified Secure Payment</span>
              </div>
              <p className="text-[11px]">
                If your browser does not redirect you automatically within a few seconds, please click the button below:
              </p>
            </div>

            <div className="pt-2">
              <a
                href={redirectUrl}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-[#071A33] font-extrabold text-sm rounded-xl transition-all shadow-xl hover:shadow-amber-400/20"
              >
                <span>Continue to Stripe Payment Page</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : confirmedOrder ? (
          /* Confirmation Screen View */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                Stripe Payment Confirmed • Order Placed
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                Thank you for your order, {confirmedOrder.customerName.split(' ')[0]}!
              </h3>
              <p className="text-sm text-gray-300 mt-2">
                Order Reference: <strong className="text-amber-400 font-mono text-base">{confirmedOrder.orderNumber}</strong>
              </p>
            </div>

            <div className="bg-[#040D1A] border border-[#1D3B63] rounded-xl p-5 text-left max-w-lg mx-auto text-xs space-y-3">
              <div className="flex justify-between border-b border-[#0D2A4A] pb-2">
                <span className="text-gray-400">Confirmation Sent To:</span>
                <span className="font-semibold text-white">{confirmedOrder.customerEmail}</span>
              </div>
              <div className="flex justify-between border-b border-[#0D2A4A] pb-2">
                <span className="text-gray-400">UK Delivery Address:</span>
                <span className="font-semibold text-white text-right">
                  {confirmedOrder.shippingAddress.line1}, {confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.postcode}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#0D2A4A] pb-2">
                <span className="text-gray-400">Production Bay Status:</span>
                <span className="font-bold text-amber-400">Queued for Laser CAD Tailoring</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-400">Total Paid (Stripe):</span>
                <span className="font-extrabold text-white text-sm">£{confirmedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  closeCheckout();
                  if (onOrderComplete) onOrderComplete(confirmedOrder);
                }}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#071A33] font-extrabold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Track Manufacturing Stage Live</span>
              </button>
              <button
                onClick={closeCheckout}
                className="w-full sm:w-auto px-6 py-3 bg-[#0D2A4A] hover:bg-[#1D3B63] text-gray-300 hover:text-white font-bold text-xs rounded-xl transition-colors border border-[#1D3B63] cursor-pointer"
              >
                Continue Browsing Store
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <form onSubmit={handlePayWithStripe} className="p-6 sm:p-8 space-y-6">
            {errorMessage && (
              <div className="p-3.5 bg-red-950/70 border border-red-500/50 rounded-xl flex items-center gap-2.5 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Customer & Delivery Details */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-amber-400 border-b border-[#0D2A4A] pb-2 flex items-center justify-between">
                  <span>1. Customer & Contact</span>
                  <span className="text-[10px] text-gray-400 font-normal lowercase">Required for order tracking</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="e.g. James Reynolds"
                      className="w-full bg-[#040D1A] border border-[#1D3B63] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={e => setCustomerEmail(e.target.value)}
                        placeholder="you@example.co.uk"
                        className="w-full bg-[#040D1A] border border-[#1D3B63] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 mb-1">Mobile (Courier SMS)</label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                        placeholder="07700 900123"
                        className="w-full bg-[#040D1A] border border-[#1D3B63] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="text-xs uppercase font-extrabold tracking-wider text-amber-400 border-b border-[#0D2A4A] pb-2 pt-2 flex items-center justify-between">
                  <span>2. UK Delivery Address</span>
                  <span className="text-[10px] text-gray-400 font-normal lowercase">United Kingdom Only</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">Address Line 1 *</label>
                    <input
                      type="text"
                      required
                      value={line1}
                      onChange={e => setLine1(e.target.value)}
                      placeholder="e.g. 14 Parkside Gardens"
                      className="w-full bg-[#040D1A] border border-[#1D3B63] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={line2}
                      onChange={e => setLine2(e.target.value)}
                      placeholder="e.g. Flat 3B or Business Park"
                      className="w-full bg-[#040D1A] border border-[#1D3B63] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 mb-1">Town / City *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="e.g. Bristol"
                        className="w-full bg-[#040D1A] border border-[#1D3B63] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 mb-1">UK Postcode *</label>
                      <input
                        type="text"
                        required
                        value={postcode}
                        onChange={e => setPostcode(e.target.value.toUpperCase())}
                        placeholder="e.g. BS8 4LJ"
                        className="w-full bg-[#040D1A] border border-[#1D3B63] rounded-lg px-3 py-2 text-xs text-white font-mono uppercase placeholder-gray-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 mb-1">Workshop or Safe Place Instructions</label>
                    <input
                      type="text"
                      value={orderNotes}
                      onChange={e => setOrderNotes(e.target.value)}
                      placeholder="e.g. Leave in porch if not in, or specific mat fixings note"
                      className="w-full bg-[#040D1A] border border-[#1D3B63] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Courier & Stripe Hosted Gateway */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-amber-400 border-b border-[#0D2A4A] pb-2">
                  3. Shipping Method
                </h3>

                <div className="space-y-2">
                  <label
                    onClick={() => setShippingMethod('standard')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      shippingMethod === 'standard'
                        ? 'border-amber-400 bg-[#0D2A4A]/80 shadow-md'
                        : 'border-[#1D3B63] bg-[#040D1A] hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs font-bold text-white">Royal Mail 48 Tracked</p>
                        <p className="text-[11px] text-gray-400">2-3 working days following production</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white">
                      {subtotal >= 49 ? <span className="text-emerald-400">FREE</span> : '£3.99'}
                    </span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('express')}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      shippingMethod === 'express'
                        ? 'border-amber-400 bg-[#0D2A4A]/80 shadow-md'
                        : 'border-[#1D3B63] bg-[#040D1A] hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs font-bold text-white">DPD Next Day Express</p>
                        <p className="text-[11px] text-gray-400">1-hour SMS time slot & GPS tracking</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white">£6.99</span>
                  </label>
                </div>

                <h3 className="text-xs uppercase font-extrabold tracking-wider text-amber-400 border-b border-[#0D2A4A] pb-2 pt-2">
                  4. Secure Stripe Hosted Checkout
                </h3>

                {/* Stripe Hosted Information Card */}
                <div className="bg-[#040D1A] border border-[#1D3B63] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      Stripe Hosted Payment Page
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                      256-bit SSL
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    When you click below, you will be redirected to the official Stripe payment portal to complete your order securely.
                  </p>

                  <div className="pt-1 border-t border-[#0D2A4A]/80 flex flex-wrap items-center gap-2 text-[10px] text-gray-400">
                    <span className="bg-[#071A33] px-2 py-1 rounded border border-[#1D3B63] font-semibold text-white">
                      Visa
                    </span>
                    <span className="bg-[#071A33] px-2 py-1 rounded border border-[#1D3B63] font-semibold text-white">
                      Mastercard
                    </span>
                    <span className="bg-[#071A33] px-2 py-1 rounded border border-[#1D3B63] font-semibold text-white">
                      American Express
                    </span>
                    <span className="bg-[#071A33] px-2 py-1 rounded border border-[#1D3B63] font-semibold text-white">
                      Apple Pay
                    </span>
                    <span className="bg-[#071A33] px-2 py-1 rounded border border-[#1D3B63] font-semibold text-white">
                      Google Pay
                    </span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-[#0D2A4A]/50 border border-[#1D3B63] rounded-xl p-3.5 space-y-1.5 text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-white font-medium">£{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Discount:</span>
                      <span>-£{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>UK Delivery ({shippingMethod === 'express' ? 'DPD' : 'Royal Mail'}):</span>
                    <span>{shippingCost === 0 ? <strong className="text-emerald-400 font-bold">FREE</strong> : `£${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t border-[#1D3B63] pt-1.5 flex justify-between text-sm font-extrabold text-white">
                    <span>Total (Inc. 20% UK VAT):</span>
                    <span className="text-amber-400 text-base">£{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit Payment CTA */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-[#071A33] font-extrabold text-sm rounded-xl transition-all shadow-xl hover:shadow-amber-400/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#071A33] border-t-transparent rounded-full animate-spin" />
                      <span>Connecting to Stripe Checkout...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Proceed to Stripe Checkout • £{total.toFixed(2)}</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-gray-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Full UK Buyer Protection • 100% Fit Guarantee • 30-Day Returns</span>
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
