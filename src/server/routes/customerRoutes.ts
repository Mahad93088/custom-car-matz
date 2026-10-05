import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../auth.ts';
import { db } from '../database/db.ts';

export const customerRouter = Router();

// Protect all customer routes
customerRouter.use(requireAuth);

// Get my orders
customerRouter.get('/orders', (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const allOrders = db.getOrders();
  const customerOrders = allOrders.filter(
    o => o.userId === req.user!.id || o.customerEmail.toLowerCase() === req.user!.email.toLowerCase()
  );

  res.json(customerOrders);
});

// Get single order
customerRouter.get('/orders/:id', (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  const order = db.findOrderById(id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Ensure customer can only view their own order
  if (order.userId !== req.user.id && order.customerEmail.toLowerCase() !== req.user.email.toLowerCase()) {
    return res.status(403).json({ error: 'Access denied to this order' });
  }

  res.json(order);
});

// --- Loyalty Points System ---
customerRouter.get('/loyalty', (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = db.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const points = user.loyaltyPoints || 0;
  const history = user.pointsHistory || [];
  const rewardValue = Number((points / 100).toFixed(2));
  const tier = points >= 1000 ? 'Platinum VIP' : points >= 500 ? 'Gold VIP' : points >= 200 ? 'Silver Enthusiast' : 'Bronze Club';

  res.json({
    points,
    rewardValue,
    tier,
    pointsPerPound: 5,
    history
  });
});

customerRouter.post('/loyalty/redeem', (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = db.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { pointsToRedeem } = req.body;
  const pts = Number(pointsToRedeem);

  if (!pts || pts < 100) {
    return res.status(400).json({ error: 'Minimum points redemption is 100 points (£1.00 reward).' });
  }

  const currentPoints = user.loyaltyPoints || 0;
  if (pts > currentPoints) {
    return res.status(400).json({ error: `Insufficient loyalty balance. You have ${currentPoints} points.` });
  }

  const discountValue = Number((pts / 100).toFixed(2));
  const couponCode = `REWARD-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  // Create voucher in coupons
  db.createCoupon({
    id: 'cpn_' + Date.now(),
    code: couponCode,
    description: `Loyalty Reward voucher for ${user.name} (${pts} points redeemed)`,
    discountType: 'fixed',
    discountValue,
    minSpend: discountValue * 2,
    isActive: true,
    usageLimit: 1,
    usedCount: 0,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  });

  const updatedPoints = currentPoints - pts;
  const newHistoryItem = {
    id: 'pts_' + Date.now(),
    date: new Date().toISOString(),
    points: -pts,
    type: 'redeemed' as const,
    description: `Redeemed ${pts} pts for £${discountValue.toFixed(2)} checkout voucher (${couponCode})`
  };

  const updatedHistory = [newHistoryItem, ...(user.pointsHistory || [])];
  db.updateUser(user.id, {
    loyaltyPoints: updatedPoints,
    pointsHistory: updatedHistory
  });

  res.json({
    success: true,
    message: `Successfully redeemed ${pts} points for a £${discountValue.toFixed(2)} voucher!`,
    couponCode,
    discountAmount: discountValue,
    remainingPoints: updatedPoints
  });
});

// --- Wishlist Management ---
customerRouter.get('/wishlist', (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = db.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const wishlistIds = user.wishlist || [];
  const products = db.getProducts().filter(p => wishlistIds.includes(p.id));

  res.json({
    wishlist: wishlistIds,
    products
  });
});

customerRouter.post('/wishlist/toggle', (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = db.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  const currentWishlist = user.wishlist || [];
  let updatedWishlist: string[];
  let isWishlisted: boolean;

  if (currentWishlist.includes(productId)) {
    updatedWishlist = currentWishlist.filter(id => id !== productId);
    isWishlisted = false;
  } else {
    updatedWishlist = [...currentWishlist, productId];
    isWishlisted = true;
  }

  db.updateUser(user.id, { wishlist: updatedWishlist });

  res.json({
    success: true,
    isWishlisted,
    wishlist: updatedWishlist,
    message: isWishlisted ? 'Saved to your custom car mats wishlist' : 'Removed from your wishlist'
  });
});
