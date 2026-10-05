import { Router } from 'express';
import { db } from '../database/db.ts';
import { ContactMessage, Review } from '../database/types.ts';

export const publicRouter = Router();

// --- Vehicles ---
publicRouter.get('/vehicles/makes', (req, res) => {
  const makes = db.getMakes();
  res.json(makes);
});

publicRouter.get('/vehicles/models', (req, res) => {
  const makeId = req.query.makeId as string;
  const models = db.getModels(makeId);
  res.json(models);
});

publicRouter.get('/vehicles/years', (req, res) => {
  const modelId = req.query.modelId as string;
  const years = db.getYears(modelId);
  res.json(years);
});

publicRouter.get('/vehicles/variants', (req, res) => {
  const modelId = req.query.modelId as string;
  const variants = db.getVariants(modelId);
  res.json(variants);
});

// Full vehicle tree helper for vehicle selector
publicRouter.get('/vehicles/selector-data', (req, res) => {
  res.json({
    makes: db.getMakes(),
    models: db.getModels(),
    years: db.getYears(),
    variants: db.getVariants()
  });
});

// --- Products ---
publicRouter.get('/products', (req, res) => {
  const { makeId, materialId, minPrice, maxPrice, search, sort, featured } = req.query;
  let products = db.getProducts(true); // only published

  if (featured === 'true') {
    products = products.filter(p => p.isFeatured);
  }

  if (makeId && makeId !== 'all') {
    products = products.filter(p => p.compatibleMakes.includes('all') || p.compatibleMakes.includes(makeId as string));
  }

  if (materialId && materialId !== 'all') {
    products = products.filter(p => p.materialId === materialId);
  }

  if (minPrice) {
    products = products.filter(p => (p.salePrice || p.basePrice) >= Number(minPrice));
  }

  if (maxPrice) {
    products = products.filter(p => (p.salePrice || p.basePrice) <= Number(maxPrice));
  }

  if (search) {
    const term = (search as string).toLowerCase().trim();
    products = products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term)
    );
  }

  if (sort === 'price-asc') {
    products.sort((a, b) => (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice));
  } else if (sort === 'price-desc') {
    products.sort((a, b) => (b.salePrice || b.basePrice) - (a.salePrice || a.basePrice));
  } else if (sort === 'name') {
    products.sort((a, b) => a.name.localeCompare(b.name));
  }

  res.json(products);
});

publicRouter.get('/products/:slugOrId', (req, res) => {
  const { slugOrId } = req.params;
  const product = db.findProductBySlug(slugOrId) || db.findProductById(slugOrId);

  if (!product || !product.isPublished) {
    return res.status(404).json({ error: 'Product not found or currently unavailable' });
  }

  const material = db.getMaterials().find(m => m.id === product.materialId);

  res.json({
    ...product,
    material
  });
});

// --- Materials ---
publicRouter.get('/materials', (req, res) => {
  const materials = db.getMaterials();
  res.json(materials);
});

// --- Reviews ---
publicRouter.get('/reviews', (req, res) => {
  const { productId, featured } = req.query;
  let reviews = db.getReviews(true); // only approved

  if (productId) {
    reviews = reviews.filter(r => r.productId === productId);
  }
  if (featured === 'true') {
    reviews = reviews.filter(r => r.isFeatured);
  }

  res.json(reviews);
});

publicRouter.post('/reviews', (req, res) => {
  const { productId, productName, authorName, authorLocation, carMakeModel, rating, title, comment } = req.body;

  if (!authorName || !comment || !rating) {
    return res.status(400).json({ error: 'Please provide your name, rating, and review comments.' });
  }

  const newReview: Review = {
    id: 'rev_' + Date.now(),
    productId: productId || undefined,
    productName: productName || 'Tailored Custom Car Mats',
    authorName: authorName.trim(),
    authorLocation: authorLocation?.trim() || 'United Kingdom',
    carMakeModel: carMakeModel?.trim() || 'Verified Vehicle Owner',
    rating: Math.min(5, Math.max(1, Number(rating))),
    title: title?.trim() || 'Verified Purchase Review',
    comment: comment.trim(),
    status: 'pending', // Requires admin moderation
    isFeatured: false,
    verifiedBuyer: true,
    createdAt: new Date().toISOString()
  };

  db.createReview(newReview);

  res.status(201).json({
    message: 'Thank you! Your review has been submitted and will appear on the site once verified by our team.',
    review: newReview
  });
});

// --- Blog ---
publicRouter.get('/blog', (req, res) => {
  const { category, search } = req.query;
  let posts = db.getBlogPosts(true); // only published

  if (category && category !== 'all') {
    posts = posts.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase().trim();
    posts = posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q)
    );
  }

  res.json(posts);
});

publicRouter.get('/blog/:slug', (req, res) => {
  const { slug } = req.params;
  const post = db.findBlogPostBySlug(slug);

  if (!post || !post.isPublished) {
    return res.status(404).json({ error: 'Article not found' });
  }

  // Related posts from same category
  const related = db.getBlogPosts(true)
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  res.json({ post, related });
});

// --- CMS Pages ---
publicRouter.get('/pages/:slug', (req, res) => {
  const { slug } = req.params;
  const page = db.findPageBySlug(slug);

  if (!page || !page.isPublished) {
    return res.status(404).json({ error: 'Page not found' });
  }

  res.json(page);
});

// --- FAQs ---
publicRouter.get('/faqs', (req, res) => {
  const faqs = [
    {
      category: 'Fitment & Compatibility',
      question: 'How do you guarantee the mats will fit my exact car?',
      answer: 'Every pattern in our database is created via 3D laser point-cloud scanning of physical UK right-hand-drive vehicles. We account for floor pan curves, pedal clearance, and exact OEM fixing peg coordinates. If they do not fit, we replace or refund them under our 100% Fitment Guarantee.'
    },
    {
      category: 'Fitment & Compatibility',
      question: 'Are OEM fixing clips and floor anchors included?',
      answer: 'Yes! All front driver and passenger mats are supplied with the correct factory-matching retaining clips (BMW twist-pegs, Audi push-pins, Mercedes oval eyelets, etc.) pre-installed into the mats.'
    },
    {
      category: 'Materials & Craftsmanship',
      question: 'What is the difference between Luxury (850g) and Prestige Velour (1200g)?',
      answer: 'Our 850g/m² Luxury carpet is a deep twist-pile that exceeds typical factory mats by 40%. Our 1200g/m² Prestige Executive Velour is our thickest spun velour, offering showroom-grade plushness, superior acoustic road-noise insulation, and hand-piped nubuck edging.'
    },
    {
      category: 'Materials & Craftsmanship',
      question: 'Do the all-weather rubber mats have a chemical or rubber smell?',
      answer: 'No. We use 100% virgin odourless automotive vulcanised rubber, certified free of petroleum odour. You can install them straight out of the box with zero fumes.'
    },
    {
      category: 'UK Delivery & Tracking',
      question: 'How long does UK delivery take?',
      answer: 'Because mats are tailored to order in our West Midlands facility, production takes 1-2 working days. Standard Royal Mail 48 Tracked delivery takes 2-3 working days (£3.99, or FREE on orders over £49). DPD Next Day Tracked is available at checkout for £6.99.'
    },
    {
      category: 'Returns & Guarantee',
      question: 'What is your returns policy?',
      answer: 'We offer a 30-day return window and a minimum 2-year manufacturer guarantee on all workmanship, stitching, and heel pads. Simply email our customer care team at support@customcarmats.co.uk.'
    }
  ];
  res.json(faqs);
});

// --- Contact Form ---
publicRouter.post('/contact', (req, res) => {
  const { name, email, phone, vehicleReg, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please provide your name, email, and message.' });
  }

  const newContact: ContactMessage = {
    id: 'msg_' + Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim(),
    vehicleReg: vehicleReg?.trim()?.toUpperCase(),
    subject: subject?.trim() || 'General Customer Enquiry',
    message: message.trim(),
    status: 'unread',
    createdAt: new Date().toISOString()
  };

  db.createContactMessage(newContact);

  res.status(201).json({
    message: 'Thank you for contacting Custom Car Mats. One of our UK automotive specialists will reply within 24 business hours.',
    referenceId: newContact.id
  });
});

// --- Newsletter ---
publicRouter.post('/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const added = db.addNewsletterSubscriber(email);
  if (added) {
    res.json({ message: 'Welcome to the Custom Car Mats club! Use code WELCOME10 for 10% off your first order.' });
  } else {
    res.json({ message: 'You are already registered on our VIP list!' });
  }
});

// --- Coupon Validation ---
publicRouter.post('/coupons/validate', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Coupon code required' });
  }

  const coupon = db.findCouponByCode(code);
  if (!coupon || !coupon.isActive) {
    return res.status(404).json({ error: 'Invalid or expired promotional code' });
  }

  if (coupon.minSpend && Number(subtotal || 0) < coupon.minSpend) {
    return res.status(400).json({
      error: `Coupon code '${coupon.code}' requires a minimum spend of £${coupon.minSpend.toFixed(2)}.`
    });
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (Number(subtotal || 0) * coupon.discountValue) / 100;
  } else {
    discount = Math.min(Number(subtotal || 0), coupon.discountValue);
  }

  res.json({
    valid: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount: Number(discount.toFixed(2))
  });
});

// --- Public Settings (Store phone, email, delivery rates) ---
publicRouter.get('/settings/public', (req, res) => {
  const settings = db.getSettings();
  res.json({
    storeName: settings.storeName,
    supportEmail: settings.supportEmail,
    supportPhone: settings.supportPhone,
    registeredAddress: settings.registeredAddress,
    currencySymbol: settings.currencySymbol,
    freeShippingThreshold: settings.freeShippingThreshold,
    standardShippingFee: settings.standardShippingFee,
    expressShippingFee: settings.expressShippingFee,
    vatRatePercentage: settings.vatRatePercentage,
    stripeConfigured: true
  });
});

// --- Public Order Tracking (No login required) ---
publicRouter.post('/orders/track', (req, res) => {
  const { orderNumber, email } = req.body;

  if (!orderNumber || !email) {
    return res.status(400).json({
      error: 'Please enter both your Order Number (e.g. CCM-72177) and the email address used at checkout.'
    });
  }

  const cleanOrderNum = String(orderNumber).trim().toUpperCase();
  const cleanEmail = String(email).trim().toLowerCase();

  const orders = db.getOrders();
  const order = orders.find(o => {
    const matchesNum =
      o.orderNumber.toUpperCase() === cleanOrderNum ||
      o.orderNumber.toUpperCase().replace('CCM-', '') === cleanOrderNum.replace('CCM-', '') ||
      o.id.toUpperCase() === cleanOrderNum;
    const matchesEmail = o.customerEmail.toLowerCase() === cleanEmail;
    return matchesNum && matchesEmail;
  });

  if (!order) {
    return res.status(404).json({
      error: `No order found matching "${orderNumber}" and "${email}". Please verify your details against your order confirmation email and try again.`
    });
  }

  // Calculate estimated delivery date: 3-4 working days from creation for standard, 1-2 for express
  const orderDate = new Date(order.createdAt);
  const isExpress = order.shippingMethod?.toLowerCase().includes('dpd') || order.shippingMethod?.toLowerCase().includes('express');
  const addDays = isExpress ? 2 : 4;
  const estimatedDate = new Date(orderDate);
  estimatedDate.setDate(orderDate.getDate() + addDays);

  const courierName = order.courier || (isExpress ? 'DPD Local Tracked' : 'Royal Mail Tracked 48');
  const trackingNumber = order.trackingNumber || (
    ['dispatched', 'delivered'].includes(order.orderStatus)
      ? `GB${order.orderNumber.replace(/[^0-9]/g, '') || '98273'}RM`
      : undefined
  );

  // Return public-safe tracking payload
  res.json({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    estimatedDelivery: estimatedDate.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    shippingMethod: order.shippingMethod,
    courier: courierName,
    trackingNumber,
    trackingUrl: trackingNumber
      ? isExpress
        ? `https://www.dpd.co.uk/tracking/${trackingNumber}`
        : `https://www.royalmail.com/track-your-item#/tracking-results/${trackingNumber}`
      : undefined,
    shippingAddress: {
      line1: order.shippingAddress.line1,
      city: order.shippingAddress.city,
      county: order.shippingAddress.county,
      postcode: order.shippingAddress.postcode,
      country: order.shippingAddress.country
    },
    items: order.items.map(it => ({
      id: it.id,
      productName: it.productName,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      materialName: it.materialName,
      colorName: it.colorName,
      stitchingName: it.stitchingName,
      heelPadName: it.heelPadName,
      vehicleDetails: it.vehicleDetails,
      customEmbroidery: it.customEmbroidery
    })),
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    discountAmount: order.discountAmount,
    total: order.total,
    notes: order.notes
  });
});

publicRouter.get('/orders/track', (req, res) => {
  const { orderNumber, email } = req.query;
  if (!orderNumber || !email) {
    return res.status(400).json({
      error: 'Please provide both orderNumber and email query parameters.'
    });
  }

  // Forward to POST handler logic
  req.body = { orderNumber, email };
  return (publicRouter as any).handle(req, res);
});
