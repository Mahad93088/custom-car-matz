import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, X as CloseIcon } from 'lucide-react';
import { api } from './lib/api.ts';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { VehicleProvider, useVehicle } from './context/VehicleContext.tsx';
import { CartProvider, useCart } from './context/CartContext.tsx';
import { WishlistProvider, useWishlist } from './context/WishlistContext.tsx';

// Public Components
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { VehicleSelector } from './components/VehicleSelector.tsx';
import { CookieBanner } from './components/CookieBanner.tsx';

// Public Pages
import { HomePage } from './pages/HomePage.tsx';
import { ShopPage } from './pages/ShopPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { MaterialsPage } from './pages/MaterialsPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { ReviewsPage } from './pages/ReviewsPage.tsx';
import { FaqPage } from './pages/FaqPage.tsx';
import { BlogPage } from './pages/BlogPage.tsx';
import { BlogPostPage } from './pages/BlogPostPage.tsx';
import { CmsStaticPage } from './pages/CmsStaticPage.tsx';
import { CustomerAccountPage } from './pages/CustomerAccountPage.tsx';
import { CustomerAuthPage } from './pages/CustomerAuthPage.tsx';
import { TrackOrderPage } from './pages/TrackOrderPage.tsx';

// Private Admin CMS Components
import { AdminAuthPage } from './admin/AdminAuthPage.tsx';
import { AdminLayout } from './admin/AdminLayout.tsx';
import { AdminDashboard } from './admin/AdminDashboard.tsx';
import { AdminProducts } from './admin/AdminProducts.tsx';
import { AdminVehicles } from './admin/AdminVehicles.tsx';
import { AdminOrders } from './admin/AdminOrders.tsx';
import { AdminCustomers } from './admin/AdminCustomers.tsx';
import { AdminReviews } from './admin/AdminReviews.tsx';
import { AdminBlog } from './admin/AdminBlog.tsx';
import { AdminPages } from './admin/AdminPages.tsx';
import { AdminCoupons } from './admin/AdminCoupons.tsx';
import { AdminContacts } from './admin/AdminContacts.tsx';
import { AdminMedia } from './admin/AdminMedia.tsx';
import { AdminAnalytics } from './admin/AdminAnalytics.tsx';
import { AdminUsers } from './admin/AdminUsers.tsx';
import { AdminSettings } from './admin/AdminSettings.tsx';
import { AdminAuditLogs } from './admin/AdminAuditLogs.tsx';

function MainApp() {
  const { user, isStaff } = useAuth();
  const { isSelectorModalOpen } = useVehicle();
  const { feedbackMessage, clearFeedback } = useWishlist();

  // Navigation State
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return window.location.pathname.startsWith('/admin');
  });

  const [currentPublicTab, setCurrentPublicTab] = useState<string>(() => {
    const path = window.location.pathname.replace(/^\//, '');
    if (path === 'track' || path === 'track-order') return 'track';
    return path || 'home';
  });
  const [currentParam, setCurrentParam] = useState<string>('tailored-luxury-carpet-car-mats-4pc');
  const [currentAdminTab, setCurrentAdminTab] = useState<string>('dashboard');
  const [stripeNotification, setStripeNotification] = useState<{
    type: 'success' | 'cancelled';
    message: string;
    orderNumber?: string;
  } | null>(null);

  // Handle URL synchronization and Stripe redirect returns
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const checkoutStatus = urlParams.get('checkout');
      const sessionId = urlParams.get('session_id');

      if (checkoutStatus === 'success') {
        if (sessionId) {
          api.getOrderByCheckoutSession(sessionId)
            .then(res => {
              if (res?.order) {
                setStripeNotification({
                  type: 'success',
                  message: `Payment successful! Order ${res.order.orderNumber} is confirmed and queued for precision tailoring.`,
                  orderNumber: res.order.orderNumber
                });
              } else {
                setStripeNotification({
                  type: 'success',
                  message: 'Payment received! Your custom car mats order is confirmed and queued for tailoring.'
                });
              }
            })
            .catch(() => {
              setStripeNotification({
                type: 'success',
                message: 'Payment received! Your custom car mats order is confirmed and queued for tailoring.'
              });
            });
        } else {
          setStripeNotification({
            type: 'success',
            message: 'Payment received! Your custom car mats order is confirmed and queued for tailoring.'
          });
        }
        window.history.replaceState({}, '', window.location.pathname);
      } else if (checkoutStatus === 'cancel') {
        setStripeNotification({
          type: 'cancelled',
          message: 'Stripe checkout was cancelled. Your selected tailored car mats are still saved in your basket.'
        });
        window.history.replaceState({}, '', window.location.pathname);
      }
    } catch {}

    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        setIsAdminMode(true);
      } else {
        setIsAdminMode(false);
        const cleanPath = path.replace(/^\//, '');
        if (cleanPath === 'track' || cleanPath === 'track-order') {
          setCurrentPublicTab('track');
        } else if (cleanPath) {
          setCurrentPublicTab(cleanPath);
        } else {
          setCurrentPublicTab('home');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigatePublic = (tab: string, param?: string) => {
    setIsAdminMode(false);
    setCurrentPublicTab(tab);
    if (param) setCurrentParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState({}, '', `/${tab === 'home' ? '' : tab}`);
    } catch {}
  };

  const navigateAdmin = (tab: string) => {
    setCurrentAdminTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdminLogin = () => {
    setIsAdminMode(true);
    try {
      window.history.pushState({}, '', '/admin');
    } catch {}
  };

  const handleExitAdmin = () => {
    setIsAdminMode(false);
    try {
      window.history.pushState({}, '', '/');
    } catch {}
  };

  // --- PRIVATE ADMIN CMS ROUTE ---
  if (isAdminMode) {
    if (!user || !isStaff) {
      return (
        <AdminAuthPage
          onSuccess={() => setIsAdminMode(true)}
          onExitToStore={handleExitAdmin}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={currentAdminTab}
        setCurrentTab={navigateAdmin}
        onExitToStore={handleExitAdmin}
      >
        {currentAdminTab === 'dashboard' && <AdminDashboard onNavigate={navigateAdmin} />}
        {currentAdminTab === 'products' && <AdminProducts />}
        {currentAdminTab === 'vehicles' && <AdminVehicles />}
        {currentAdminTab === 'orders' && <AdminOrders />}
        {currentAdminTab === 'customers' && <AdminCustomers />}
        {currentAdminTab === 'reviews' && <AdminReviews />}
        {currentAdminTab === 'blog' && <AdminBlog />}
        {currentAdminTab === 'pages' && <AdminPages />}
        {currentAdminTab === 'coupons' && <AdminCoupons />}
        {currentAdminTab === 'contacts' && <AdminContacts />}
        {currentAdminTab === 'media' && <AdminMedia />}
        {currentAdminTab === 'analytics' && <AdminAnalytics />}
        {currentAdminTab === 'users' && <AdminUsers />}
        {currentAdminTab === 'settings' && <AdminSettings />}
        {currentAdminTab === 'audit-logs' && <AdminAuditLogs />}
      </AdminLayout>
    );
  }

  // --- PUBLIC WEBSITE ROUTE ---
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-[#111827]">
      {/* Header */}
      <Header currentTab={currentPublicTab} setCurrentTab={navigatePublic} />

      {/* Stripe Payment Status Notification Banner */}
      {stripeNotification && (
        <div
          className={`py-3 px-4 border-b flex items-center justify-between transition-all ${
            stripeNotification.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/80 border-amber-500/40 text-amber-200'
          }`}
        >
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-2.5 flex-wrap">
              {stripeNotification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              )}
              <span>{stripeNotification.message}</span>
              {stripeNotification.orderNumber && (
                <button
                  onClick={() => navigatePublic('track', stripeNotification.orderNumber)}
                  className="underline text-amber-300 hover:text-white font-bold text-xs ml-2 cursor-pointer"
                >
                  Track Manufacturing Stage Live →
                </button>
              )}
            </div>
            <button
              onClick={() => setStripeNotification(null)}
              className="p-1 rounded hover:bg-black/20 text-gray-400 hover:text-white transition-colors"
              title="Dismiss notification"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Public Content */}
      <main className="flex-1">
        {currentPublicTab === 'home' && <HomePage setCurrentTab={navigatePublic} />}
        {currentPublicTab === 'shop' && <ShopPage setCurrentTab={navigatePublic} />}
        {currentPublicTab === 'product' && (
          <ProductDetailPage slug={currentParam} setCurrentTab={navigatePublic} />
        )}
        {currentPublicTab === 'materials' && <MaterialsPage setCurrentTab={navigatePublic} />}
        {currentPublicTab === 'about' && <AboutPage setCurrentTab={navigatePublic} />}
        {currentPublicTab === 'contact' && <ContactPage setCurrentTab={navigatePublic} />}
        {currentPublicTab === 'reviews' && <ReviewsPage />}
        {currentPublicTab === 'faq' && <FaqPage />}
        {currentPublicTab === 'blog' && <BlogPage setCurrentTab={navigatePublic} />}
        {currentPublicTab === 'blog-post' && (
          <BlogPostPage slug={currentParam} setCurrentTab={navigatePublic} />
        )}
        {currentPublicTab === 'page' && <CmsStaticPage slug={currentParam} />}
        {currentPublicTab === 'account' && (
          user ? (
            <CustomerAccountPage setCurrentTab={navigatePublic} />
          ) : (
            <CustomerAuthPage onLoginSuccess={() => setCurrentPublicTab('account')} />
          )
        )}
        {currentPublicTab === 'auth' && (
          <CustomerAuthPage onLoginSuccess={() => setCurrentPublicTab('account')} />
        )}
        {currentPublicTab === 'track' && (
          <TrackOrderPage
            setCurrentTab={navigatePublic}
            initialOrderNumber={currentParam && currentParam !== 'tailored-luxury-carpet-car-mats-4pc' ? currentParam : ''}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setCurrentTab={navigatePublic}
        onOpenAdminLogin={handleOpenAdminLogin}
      />

      {/* Floating Drawers & Modals */}
      <CartDrawer />
      <CheckoutModal
        onOrderComplete={(order) => {
          setCurrentParam(order.orderNumber);
          setCurrentPublicTab('track');
        }}
      />
      {isSelectorModalOpen && <VehicleSelector isModal={true} />}
      <CookieBanner onOpenPrivacy={() => navigatePublic('page', 'privacy-policy')} />

      {/* Floating Wishlist Toast Notification */}
      {feedbackMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-[#071A33] border border-amber-400 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold">
            <span className="text-amber-400">★</span>
            <span>{feedbackMessage}</span>
            <button
              onClick={clearFeedback}
              className="text-gray-400 hover:text-white ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <VehicleProvider>
        <CartProvider>
          <WishlistProvider>
            <MainApp />
          </WishlistProvider>
        </CartProvider>
      </VehicleProvider>
    </AuthProvider>
  );
}
