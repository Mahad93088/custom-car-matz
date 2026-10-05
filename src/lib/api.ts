const TOKEN_KEY = 'custom_car_mats_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.error || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // --- Auth ---
  login: (email: string, password: string) =>
    request<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (payload: { name: string; email: string; password: string; phone?: string }) =>
    request<{ token: string; user: any; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getMe: () => request<{ user: any }>('/api/auth/me'),

  updateProfile: (payload: any) =>
    request<{ user: any; message: string }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),

  forgotPassword: (email: string) =>
    request<{ message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),

  // --- Public Data ---
  getMakes: () => request<any[]>('/api/vehicles/makes'),
  getModels: (makeId?: string) => request<any[]>(`/api/vehicles/models${makeId ? `?makeId=${makeId}` : ''}`),
  getYears: (modelId?: string) => request<any[]>(`/api/vehicles/years${modelId ? `?modelId=${modelId}` : ''}`),
  getVariants: (modelId?: string) => request<any[]>(`/api/vehicles/variants${modelId ? `?modelId=${modelId}` : ''}`),
  getVehicleSelectorData: () => request<any>('/api/vehicles/selector-data'),

  getProducts: (params?: Record<string, string | undefined>) => {
    const clean: Record<string, string> = {};
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) clean[k] = v;
      });
    }
    const query = new URLSearchParams(clean).toString();
    return request<any[]>(`/api/products${query ? `?${query}` : ''}`);
  },

  getProduct: (slugOrId: string) => request<any>(`/api/products/${slugOrId}`),
  getMaterials: () => request<any[]>('/api/materials'),
  getReviews: (params?: Record<string, string | undefined>) => {
    const clean: Record<string, string> = {};
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) clean[k] = v;
      });
    }
    const query = new URLSearchParams(clean).toString();
    return request<any[]>(`/api/reviews${query ? `?${query}` : ''}`);
  },

  submitReview: (payload: any) =>
    request<{ message: string; review: any }>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getBlogPosts: (params?: Record<string, string | undefined>) => {
    const clean: Record<string, string> = {};
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) clean[k] = v;
      });
    }
    const query = new URLSearchParams(clean).toString();
    return request<any[]>(`/api/blog${query ? `?${query}` : ''}`);
  },

  getBlogPost: (slug: string) => request<{ post: any; related: any[] }>(`/api/blog/${slug}`),
  getPage: (slug: string) => request<any>(`/api/pages/${slug}`),
  getFaqs: () => request<any[]>('/api/faqs'),

  submitContact: (payload: any) =>
    request<{ message: string; referenceId: string }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  subscribeNewsletter: (email: string) =>
    request<{ message: string }>('/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),

  validateCoupon: (code: string, subtotal: number) =>
    request<any>('/api/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal })
    }),

  getPublicSettings: () => request<any>('/api/settings/public'),

  // --- Order Tracking (Public) ---
  trackOrder: (payload: { orderNumber: string; email: string }) =>
    request<any>('/api/orders/track', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // --- Customer ---
  getCustomerOrders: () => request<any[]>('/api/customer/orders'),
  getCustomerOrder: (id: string) => request<any>(`/api/customer/orders/${id}`),
  getLoyaltyStatus: () =>
    request<{
      points: number;
      rewardValue: number;
      tier: string;
      pointsPerPound: number;
      history: any[];
    }>('/api/customer/loyalty'),
  redeemLoyaltyPoints: (pointsToRedeem: number) =>
    request<{
      success: boolean;
      message: string;
      couponCode: string;
      discountAmount: number;
      remainingPoints: number;
    }>('/api/customer/loyalty/redeem', {
      method: 'POST',
      body: JSON.stringify({ pointsToRedeem })
    }),
  getWishlist: () =>
    request<{
      wishlist: string[];
      products: any[];
    }>('/api/customer/wishlist'),
  toggleWishlist: (productId: string) =>
    request<{
      success: boolean;
      isWishlisted: boolean;
      wishlist: string[];
      message: string;
    }>('/api/customer/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ productId })
    }),

  // --- Stripe Payment ---
  createCheckoutSession: (payload: any) =>
    request<{
      url: string;
      sessionId: string;
      order: any;
    }>('/api/payments/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getOrderByCheckoutSession: (sessionId: string) =>
    request<{ order: any }>(`/api/payments/session/${sessionId}`),

  createPaymentIntent: (payload: { amount: number; customerName?: string; customerEmail?: string }) =>
    request<{
      clientSecret: string;
      paymentIntentId: string;
      amount: number;
      currency: string;
      mode: string;
    }>('/api/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  confirmOrder: (payload: any) =>
    request<{ success: boolean; order: any; message: string }>('/api/payments/confirm-order', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // --- Admin CMS (Protected) ---
  admin: {
    getDashboard: () => request<any>('/api/admin/dashboard'),

    // Products
    getProducts: () => request<any[]>('/api/admin/products'),
    createProduct: (payload: any) =>
      request<any>('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    updateProduct: (id: string, payload: any) =>
      request<any>(`/api/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      }),
    deleteProduct: (id: string) =>
      request<{ message: string }>(`/api/admin/products/${id}`, {
        method: 'DELETE'
      }),

    // Vehicles
    getVehicles: () => request<any>('/api/admin/vehicles'),
    createMake: (payload: any) =>
      request<any>('/api/admin/vehicles/makes', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    deleteMake: (id: string) =>
      request<{ success: boolean }>(`/api/admin/vehicles/makes/${id}`, {
        method: 'DELETE'
      }),
    createModel: (payload: any) =>
      request<any>('/api/admin/vehicles/models', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    deleteModel: (id: string) =>
      request<{ success: boolean }>(`/api/admin/vehicles/models/${id}`, {
        method: 'DELETE'
      }),
    createVariant: (payload: any) =>
      request<any>('/api/admin/vehicles/variants', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),

    // Orders
    getOrders: () => request<any[]>('/api/admin/orders'),
    getOrder: (id: string) => request<any>(`/api/admin/orders/${id}`),
    updateOrderStatus: (id: string, payload: { orderStatus?: string; trackingNumber?: string; courier?: string; notes?: string }) =>
      request<any>(`/api/admin/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      }),

    // Customers
    getCustomers: () => request<any[]>('/api/admin/customers'),
    getNewsletterSubscribers: () => request<any[]>('/api/admin/newsletter'),

    // Reviews Moderation
    getReviews: () => request<any[]>('/api/admin/reviews'),
    updateReview: (id: string, payload: any) =>
      request<any>(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      }),
    deleteReview: (id: string) =>
      request<{ success: boolean }>(`/api/admin/reviews/${id}`, {
        method: 'DELETE'
      }),

    // Blog
    getBlogPosts: () => request<any[]>('/api/admin/blog'),
    createBlogPost: (payload: any) =>
      request<any>('/api/admin/blog', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    updateBlogPost: (id: string, payload: any) =>
      request<any>(`/api/admin/blog/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      }),
    deleteBlogPost: (id: string) =>
      request<{ success: boolean }>(`/api/admin/blog/${id}`, {
        method: 'DELETE'
      }),

    // Pages
    getPages: () => request<any[]>('/api/admin/pages'),
    updatePage: (id: string, payload: any) =>
      request<any>(`/api/admin/pages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      }),

    // Coupons
    getCoupons: () => request<any[]>('/api/admin/coupons'),
    createCoupon: (payload: any) =>
      request<any>('/api/admin/coupons', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    deleteCoupon: (id: string) =>
      request<{ success: boolean }>(`/api/admin/coupons/${id}`, {
        method: 'DELETE'
      }),

    // Contact Messages
    getContacts: () => request<any[]>('/api/admin/contacts'),
    updateContact: (id: string, status: string) =>
      request<any>(`/api/admin/contacts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      }),
    deleteContact: (id: string) =>
      request<{ success: boolean }>(`/api/admin/contacts/${id}`, {
        method: 'DELETE'
      }),

    // Newsletter Subscribers
    getSubscribers: () => request<any[]>('/api/admin/subscribers'),

    // Media Library
    getMedia: () => request<any[]>('/api/admin/media'),

    // Analytics
    getAnalytics: () => request<any>('/api/admin/analytics'),

    // Users & Roles
    getUsers: () => request<any[]>('/api/admin/users'),
    createUser: (payload: any) =>
      request<any>('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    updateUserRole: (id: string, role: string) =>
      request<any>(`/api/admin/users/${id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role })
      }),

    // Settings
    getSettings: () => request<any>('/api/admin/settings'),
    updateSettings: (payload: any) =>
      request<any>('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(payload)
      }),

    // Audit Logs
    getAuditLogs: () => request<any[]>('/api/admin/audit-logs')
  }
};
