export interface PointsHistoryItem {
  id: string;
  date: string;
  points: number;
  type: 'earned' | 'redeemed';
  description: string;
  orderNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'content_manager' | 'order_manager' | 'customer';
  phone?: string;
  addresses?: Address[];
  loyaltyPoints?: number;
  pointsHistory?: PointsHistoryItem[];
  wishlist?: string[];
  createdAt: string;
}

export interface Address {
  id: string;
  isDefault: boolean;
  addressType: 'shipping' | 'billing';
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
}

export interface VehicleMake {
  id: string;
  name: string;
  slug: string;
  popular: boolean;
  logoUrl?: string;
}

export interface VehicleModel {
  id: string;
  makeId: string;
  name: string;
  slug: string;
  generation?: string;
}

export interface VehicleYear {
  id: string;
  modelId: string;
  yearRange: string;
  startYear: number;
  endYear: number;
}

export interface VehicleVariant {
  id: string;
  modelId: string;
  name: string;
  clipType: string;
}

export interface SelectedVehicle {
  makeId: string;
  makeName: string;
  modelId: string;
  modelName: string;
  yearId?: string;
  yearRange: string;
  variantId?: string;
  variantName: string;
  regNumber?: string;
  clipType?: string;
}

export interface MaterialOption {
  id: string;
  name: string;
  code: string;
  badge: string;
  weightGsm: number;
  description: string;
  durability: string;
  priceModifier: number;
  color: string;
  imageUrl: string;
}

export interface StitchingOption {
  id: string;
  name: string;
  description: string;
  priceModifier: number;
}

export interface HeelPadOption {
  id: string;
  name: string;
  description: string;
  priceModifier: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  basePrice: number;
  salePrice?: number;
  stock: number;
  isPublished: boolean;
  isFeatured: boolean;
  materialId: string;
  defaultColor: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  images: string[];
  compatibleMakes: string[];
  stitchingOptions: StitchingOption[];
  heelPadOptions: HeelPadOption[];
  weightKg: number;
  material?: MaterialOption;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
  materialName: string;
  colorName: string;
  stitchingName: string;
  heelPadName: string;
  vehicleDetails: {
    make: string;
    model: string;
    year: string;
    variant: string;
    regNumber?: string;
    clipType?: string;
  };
  customEmbroidery?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  billingAddress: Address;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  shippingMethod: string;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'manufacturing' | 'dispatched' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  courier?: string;
  stripePaymentIntentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId?: string;
  productName: string;
  authorName: string;
  authorLocation: string;
  carMakeModel: string;
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  isFeatured: boolean;
  verifiedBuyer: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  readTime: string;
  imageUrl: string;
  isPublished: boolean;
  publishedAt?: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  vehicleReg?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  isPublished: boolean;
  lastEditedBy: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  registeredAddress: string;
  companyNumber: string;
  vatNumber: string;
  currencySymbol: string;
  currencyCode: string;
  vatRatePercentage: number;
  freeShippingThreshold: number;
  standardShippingFee: number;
  expressShippingFee: number;
  stripeConfigured: boolean;
  metaTitle: string;
  metaDescription: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
  createdAt: string;
}
