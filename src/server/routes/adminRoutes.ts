import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { requireAdminRole, AuthenticatedRequest } from '../auth.ts';
import { db } from '../database/db.ts';
import { Product, BlogPost, Coupon, User } from '../database/types.ts';

export const adminRouter = Router();

// Protect ALL admin routes with strict role authorization
adminRouter.use(requireAdminRole());

// 1. Admin Dashboard Overview
adminRouter.get('/dashboard', (req: AuthenticatedRequest, res) => {
  const orders = db.getOrders();
  const products = db.getProducts();
  const customers = db.getUsers().filter(u => u.role === 'customer');
  const reviews = db.getReviews();
  const contacts = db.getContactMessages();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const pendingOrders = orders.filter(o => ['pending', 'confirmed', 'manufacturing'].includes(o.orderStatus));
  const lowStockProducts = products.filter(p => p.stock < 100);
  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const unreadMessages = contacts.filter(m => m.status === 'unread');

  res.json({
    kpi: {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders: orders.length,
      activeCustomers: customers.length,
      totalProducts: products.length,
      pendingOrdersCount: pendingOrders.length,
      lowStockCount: lowStockProducts.length,
      pendingReviewsCount: pendingReviews.length,
      unreadMessagesCount: unreadMessages.length
    },
    recentOrders: orders.slice(0, 6),
    recentCustomers: customers.slice(0, 5).map(({ passwordHash, ...c }) => c),
    lowStockProducts: lowStockProducts.slice(0, 5)
  });
});

// 2. Products Management
adminRouter.get('/products', (req, res) => {
  const products = db.getProducts();
  res.json(products);
});

adminRouter.post('/products', (req: AuthenticatedRequest, res) => {
  const {
    name,
    sku,
    basePrice,
    salePrice,
    stock,
    isPublished,
    isFeatured,
    materialId,
    defaultColor,
    description,
    features,
    specifications,
    images,
    compatibleMakes,
    stitchingOptions,
    heelPadOptions,
    weightKg,
    seoTitle,
    seoDescription
  } = req.body;

  if (!name || !sku || basePrice === undefined) {
    return res.status(400).json({ error: 'Name, SKU, and base price are required.' });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const newProduct: Product = {
    id: 'prod_' + Date.now(),
    name: name.trim(),
    slug: slug + '-' + Math.floor(100 + Math.random() * 900),
    sku: sku.trim().toUpperCase(),
    basePrice: Number(basePrice),
    salePrice: salePrice ? Number(salePrice) : undefined,
    stock: Number(stock || 100),
    isPublished: Boolean(isPublished),
    isFeatured: Boolean(isFeatured),
    materialId: materialId || 'mat_luxury',
    defaultColor: defaultColor || 'Black',
    description: description || '',
    features: Array.isArray(features) ? features : [],
    specifications: specifications || {},
    images: Array.isArray(images) && images.length ? images : ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80'],
    compatibleMakes: Array.isArray(compatibleMakes) ? compatibleMakes : ['all'],
    stitchingOptions: Array.isArray(stitchingOptions) ? stitchingOptions : [],
    heelPadOptions: Array.isArray(heelPadOptions) ? heelPadOptions : [],
    weightKg: Number(weightKg || 2.5),
    seoTitle,
    seoDescription,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.createProduct(newProduct);

  db.addAuditLog({
    adminId: req.user!.id,
    adminName: req.user!.name,
    adminEmail: req.user!.email,
    action: 'CREATE_PRODUCT',
    entityType: 'Product',
    entityId: newProduct.id,
    details: `Created new product: ${newProduct.name} (${newProduct.sku})`
  });

  res.status(201).json(newProduct);
});

adminRouter.put('/products/:id', (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const updated = db.updateProduct(id, req.body);

  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }

  db.addAuditLog({
    adminId: req.user!.id,
    adminName: req.user!.name,
    adminEmail: req.user!.email,
    action: 'UPDATE_PRODUCT',
    entityType: 'Product',
    entityId: id,
    details: `Updated product properties for: ${updated.name}`
  });

  res.json(updated);
});

adminRouter.delete('/products/:id', (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const prod = db.findProductById(id);
  const deleted = db.deleteProduct(id);

  if (!deleted) {
    return res.status(404).json({ error: 'Product not found' });
  }

  db.addAuditLog({
    adminId: req.user!.id,
    adminName: req.user!.name,
    adminEmail: req.user!.email,
    action: 'DELETE_PRODUCT',
    entityType: 'Product',
    entityId: id,
    details: `Deleted product: ${prod?.name || id}`
  });

  res.json({ message: 'Product deleted successfully' });
});

// 3. Vehicle Database Management
adminRouter.get('/vehicles', (req, res) => {
  res.json({
    makes: db.getMakes(),
    models: db.getModels(),
    years: db.getYears(),
    variants: db.getVariants()
  });
});

adminRouter.post('/vehicles/makes', (req: AuthenticatedRequest, res) => {
  const { name, popular } = req.body;
  if (!name) return res.status(400).json({ error: 'Make name is required' });

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const make = db.addMake({
    id: 'make_' + Date.now(),
    name: name.trim(),
    slug,
    popular: Boolean(popular)
  });

  db.addAuditLog({
    adminId: req.user!.id,
    adminName: req.user!.name,
    adminEmail: req.user!.email,
    action: 'ADD_VEHICLE_MAKE',
    entityType: 'VehicleMake',
    entityId: make.id,
    details: `Added new car make: ${make.name}`
  });

  res.status(201).json(make);
});

adminRouter.delete('/vehicles/makes/:id', (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const deleted = db.deleteMake(id);
  res.json({ success: deleted });
});

adminRouter.post('/vehicles/models', (req: AuthenticatedRequest, res) => {
  const { makeId, name, generation } = req.body;
  if (!makeId || !name) return res.status(400).json({ error: 'Make and model name are required' });

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const model = db.addModel({
    id: 'model_' + Date.now(),
    makeId,
    name: name.trim(),
    slug,
    generation: generation?.trim()
  });

  res.status(201).json(model);
});

adminRouter.delete('/vehicles/models/:id', (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const deleted = db.deleteModel(id);
  res.json({ success: deleted });
});

adminRouter.post('/vehicles/variants', (req: AuthenticatedRequest, res) => {
  const { modelId, name, clipType } = req.body;
  if (!modelId || !name) return res.status(400).json({ error: 'Model and variant name are required' });

  const variant = db.addVariant({
    id: 'var_' + Date.now(),
    modelId,
    name: name.trim(),
    clipType: clipType?.trim() || 'OEM Twist-Lock'
  });

  res.status(201).json(variant);
});

// 4. Orders Management
adminRouter.get('/orders', (req, res) => {
  const orders = db.getOrders();
  res.json(orders);
});

adminRouter.get('/orders/:id', (req, res) => {
  const { id } = req.params;
  const order = db.findOrderById(id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

adminRouter.put('/orders/:id/status', (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { orderStatus, trackingNumber, courier, notes } = req.body;

  const validStatuses = ['pending', 'confirmed', 'processing', 'manufacturing', 'dispatched', 'delivered', 'cancelled'];
  if (orderStatus && !validStatuses.includes(orderStatus)) {
    return res.status(400).json({ error: 'Invalid order status value' });
  }

  const updates: any = {};
  if (orderStatus) updates.orderStatus = orderStatus;
  if (trackingNumber !== undefined) updates.trackingNumber = trackingNumber;
  if (courier !== undefined) updates.courier = courier;
  if (notes !== undefined) updates.notes = notes;

  const updated = db.updateOrder(id, updates);
  if (!updated) return res.status(404).json({ error: 'Order not found' });

  db.addAuditLog({
    adminId: req.user!.id,
    adminName: req.user!.name,
    adminEmail: req.user!.email,
    action: 'UPDATE_ORDER_STATUS',
    entityType: 'Order',
    entityId: id,
    details: `Updated order ${updated.orderNumber} status to '${orderStatus}' (Courier: ${courier || 'N/A'}, Tracking: ${trackingNumber || 'N/A'})`
  });

  res.json(updated);
});

// 5. Customers Management
adminRouter.get('/customers', (req, res) => {
  const customers = db.getUsers().filter(u => u.role === 'customer');
  const orders = db.getOrders();

  const customerData = customers.map(({ passwordHash, ...c }) => {
    const custOrders = orders.filter(o => o.userId === c.id || o.customerEmail.toLowerCase() === c.email.toLowerCase());
    const totalSpent = custOrders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
    return {
      ...c,
      ordersCount: custOrders.length,
      totalSpent: Number(totalSpent.toFixed(2)),
      lastOrderDate: custOrders[0]?.createdAt
    };
  });

  res.json(customerData);
});

adminRouter.get('/newsletter', (req, res) => {
  const subscribers = db.getNewsletterSubscribers();
  res.json(subscribers);
});

// 6. Reviews Moderation
adminRouter.get('/reviews', (req, res) => {
  const reviews = db.getReviews(false); // all reviews
  res.json(reviews);
});

adminRouter.put('/reviews/:id', (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { status, isFeatured, title, comment, rating } = req.body;

  const updated = db.updateReview(id, {
    status,
    isFeatured,
    title,
    comment,
    rating
  });

  if (!updated) return res.status(404).json({ error: 'Review not found' });

  db.addAuditLog({
    adminId: req.user!.id,
    adminName: req.user!.name,
    adminEmail: req.user!.email,
    action: 'MODERATE_REVIEW',
    entityType: 'Review',
    entityId: id,
    details: `Moderated review for ${updated.productName}: status='${status}', featured=${isFeatured}`
  });

  res.json(updated);
});

adminRouter.delete('/reviews/:id', (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const deleted = db.deleteReview(id);
  res.json({ success: deleted });
});

// 7. Blog CMS
adminRouter.get('/blog', (req, res) => {
  const posts = db.getBlogPosts(false); // all posts
  res.json(posts);
});

adminRouter.post('/blog', (req: AuthenticatedRequest, res) => {
  const { title, category, excerpt, content, readTime, imageUrl, isPublished, tags, seoTitle, seoDescription } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const newPost: BlogPost = {
    id: 'blog_' + Date.now(),
    title: title.trim(),
    slug: slug + '-' + Math.floor(100 + Math.random() * 900),
    category: category || 'General',
    excerpt: excerpt || title,
    content,
    author: req.user!.name,
    readTime: readTime || '4 min read',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80',
    isPublished: Boolean(isPublished),
    publishedAt: isPublished ? new Date().toISOString() : undefined,
    tags: Array.isArray(tags) ? tags : [],
    seoTitle,
    seoDescription,
    createdAt: new Date().toISOString()
  };

  db.createBlogPost(newPost);

  db.addAuditLog({
    adminId: req.user!.id,
    adminName: req.user!.name,
    adminEmail: req.user!.email,
    action: 'CREATE_BLOG_POST',
    entityType: 'BlogPost',
    entityId: newPost.id,
    details: `Created blog article: ${newPost.title}`
  });

  res.status(201).json(newPost);
});

adminRouter.put('/blog/:id', (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const updated = db.updateBlogPost(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Post not found' });
  res.json(updated);
});

adminRouter.delete('/blog/:id', (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const deleted = db.deleteBlogPost(id);
  res.json({ success: deleted });
});

// 8. CMS Pages
adminRouter.get('/pages', (req, res) => {
  const pages = db.getPages();
  res.json(pages);
});

adminRouter.put('/pages/:id', (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const updated = db.updatePage(id, {
    ...req.body,
    lastEditedBy: req.user!.name
  });

  if (!updated) return res.status(404).json({ error: 'Page not found' });

  db.addAuditLog({
    adminId: req.user!.id,
    adminName: req.user!.name,
    adminEmail: req.user!.email,
    action: 'UPDATE_PAGE',
    entityType: 'CmsPage',
    entityId: id,
    details: `Edited CMS content for page: ${updated.title} (/${updated.slug})`
  });

  res.json(updated);
});

// 9. Coupons & Discounts
adminRouter.get('/coupons', (req, res) => {
  res.json(db.getCoupons());
});

adminRouter.post('/coupons', (req: AuthenticatedRequest, res) => {
  const { code, discountType, discountValue, minSpend, usageLimit, isActive, expiresAt } = req.body;
  if (!code || !discountValue) return res.status(400).json({ error: 'Code and discount value required' });

  const coupon: Coupon = {
    id: 'coup_' + Date.now(),
    code: code.trim().toUpperCase(),
    discountType: discountType || 'percentage',
    discountValue: Number(discountValue),
    minSpend: minSpend ? Number(minSpend) : undefined,
    usageLimit: usageLimit ? Number(usageLimit) : undefined,
    usedCount: 0,
    isActive: isActive !== false,
    expiresAt
  };

  db.createCoupon(coupon);

  db.addAuditLog({
    adminId: req.user!.id,
    adminName: req.user!.name,
    adminEmail: req.user!.email,
    action: 'CREATE_COUPON',
    entityType: 'Coupon',
    entityId: coupon.id,
    details: `Created coupon code: ${coupon.code} (${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : '£'} off)`
  });

  res.status(201).json(coupon);
});

adminRouter.delete('/coupons/:id', (req, res) => {
  const { id } = req.params;
  const deleted = db.deleteCoupon(id);
  res.json({ success: deleted });
});

// 10. Contact Messages
adminRouter.get('/contacts', (req, res) => {
  res.json(db.getContactMessages());
});

adminRouter.put('/contacts/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = db.updateContactMessage(id, { status });
  res.json(updated);
});

adminRouter.delete('/contacts/:id', (req, res) => {
  const { id } = req.params;
  const deleted = db.deleteContactMessage(id);
  res.json({ success: deleted });
});

// 11. Newsletter Subscribers
adminRouter.get('/subscribers', (req, res) => {
  res.json(db.getNewsletterSubscribers());
});

// 12. Media Library
adminRouter.get('/media', (req, res) => {
  // Return curated high-res UK automotive imagery library
  const mediaItems = [
    { id: 'med_1', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80', title: 'Luxury 850g Deep Pile Black', tag: 'Luxury Carpet', size: '1.2 MB' },
    { id: 'med_2', url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1200&auto=format&fit=crop&q=80', title: 'Executive Velour 1200g Cockpit', tag: 'Prestige Velour', size: '1.8 MB' },
    { id: 'med_3', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&auto=format&fit=crop&q=80', title: 'Heavy Duty 3mm All-Weather Rubber', tag: 'Rubber Mats', size: '1.4 MB' },
    { id: 'med_4', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop&q=80', title: 'Diamond Quilted Leatherette Interior', tag: 'Diamond Quilted', size: '2.1 MB' },
    { id: 'med_5', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80', title: 'Classic Standard Carpet Close-Up', tag: 'Standard Carpet', size: '1.1 MB' }
  ];
  res.json(mediaItems);
});

// 13. Analytics & Reports
adminRouter.get('/analytics', (req, res) => {
  const orders = db.getOrders();
  const products = db.getProducts();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;

  // Breakdown by vehicle make
  const makeCounts: Record<string, number> = {};
  orders.forEach(o => {
    o.items.forEach(i => {
      const mk = i.vehicleDetails?.make || 'Other';
      makeCounts[mk] = (makeCounts[mk] || 0) + 1;
    });
  });

  // Sales by month/day
  const salesHistory = [
    { period: 'Mon', revenue: 420.50, orders: 8 },
    { period: 'Tue', revenue: 580.00, orders: 11 },
    { period: 'Wed', revenue: 790.20, orders: 15 },
    { period: 'Thu', revenue: 640.80, orders: 12 },
    { period: 'Fri', revenue: 910.40, orders: 18 },
    { period: 'Sat', revenue: 1120.00, orders: 22 },
    { period: 'Sun', revenue: 840.50, orders: 16 }
  ];

  res.json({
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalOrders: orders.length,
    averageOrderValue: Number(avgOrderValue.toFixed(2)),
    conversionRate: '3.8%',
    makeCounts,
    salesHistory,
    topSellingProducts: products.slice(0, 4).map(p => ({
      name: p.name,
      sku: p.sku,
      unitsSold: Math.floor(40 + Math.random() * 80),
      revenue: Number(((p.salePrice || p.basePrice) * 65).toFixed(2))
    }))
  });
});

// 14. Users & Roles Management
adminRouter.get('/users', (req: AuthenticatedRequest, res) => {
  const users = db.getUsers().map(({ passwordHash, ...u }) => u);
  res.json(users);
});

adminRouter.post('/users', async (req: AuthenticatedRequest, res) => {
  const { name, email, password, role, phone } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password, and role are required.' });
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'User with this email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: 'usr_staff_' + Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
    role,
    phone: phone?.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.createUser(newUser);

  db.addAuditLog({
    adminId: req.user!.id,
    adminName: req.user!.name,
    adminEmail: req.user!.email,
    action: 'CREATE_STAFF_USER',
    entityType: 'User',
    entityId: newUser.id,
    details: `Added new staff member: ${newUser.name} with role '${newUser.role}'`
  });

  const { passwordHash: _, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

adminRouter.put('/users/:id/role', (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ['super_admin', 'admin', 'content_manager', 'order_manager', 'customer'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const updated = db.updateUser(id, { role });
  if (!updated) return res.status(404).json({ error: 'User not found' });

  db.addAuditLog({
    adminId: req.user!.id,
    adminName: req.user!.name,
    adminEmail: req.user!.email,
    action: 'CHANGE_USER_ROLE',
    entityType: 'User',
    entityId: id,
    details: `Changed role for ${updated.name} to '${role}'`
  });

  const { passwordHash, ...safe } = updated;
  res.json(safe);
});

// 15. Store Settings
adminRouter.get('/settings', (req, res) => {
  res.json(db.getSettings());
});

adminRouter.put('/settings', (req: AuthenticatedRequest, res) => {
  const updated = db.updateSettings(req.body);

  db.addAuditLog({
    adminId: req.user!.id,
    adminName: req.user!.name,
    adminEmail: req.user!.email,
    action: 'UPDATE_SETTINGS',
    entityType: 'Settings',
    details: `Updated store configuration and pricing parameters`
  });

  res.json(updated);
});

// 16. Audit Logs
adminRouter.get('/audit-logs', (req, res) => {
  res.json(db.getAuditLogs());
});
