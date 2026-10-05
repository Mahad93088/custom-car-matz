import React, { useState, useEffect } from 'react';
import {
  Package,
  User,
  MapPin,
  Clock,
  Truck,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Award,
  Heart,
  Sparkles,
  Gift,
  ArrowRight,
  Trash2,
  Copy,
  ExternalLink,
  Car
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import { api } from '../lib/api.ts';
import { Order, Product } from '../types/index.ts';
import { SEOHead } from '../components/SEOHead.tsx';
import { OrderHistory } from '../components/OrderHistory.tsx';

interface CustomerAccountPageProps {
  setCurrentTab: (tab: string, param?: string) => void;
}

export function CustomerAccountPage({ setCurrentTab }: CustomerAccountPageProps) {
  const { user, logout, refreshUser } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState<'loyalty' | 'orders' | 'wishlist' | 'profile'>('loyalty');

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Loyalty Points
  const [loyalty, setLoyalty] = useState<{
    points: number;
    rewardValue: number;
    tier: string;
    pointsPerPound: number;
    history: any[];
  } | null>(null);
  const [loadingLoyalty, setLoadingLoyalty] = useState(true);
  const [redeemSuccess, setRedeemSuccess] = useState<{ couponCode: string; discountAmount: number } | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Wishlist Products
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);

  // Profile update
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  // Load orders
  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await api.getCustomerOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadOrders();
  }, []);

  // Load loyalty status
  useEffect(() => {
    async function loadLoyalty() {
      try {
        setLoadingLoyalty(true);
        const data = await api.getLoyaltyStatus();
        setLoyalty(data);
      } catch (err) {
        console.error('Failed to load loyalty status:', err);
      } finally {
        setLoadingLoyalty(false);
      }
    }
    loadLoyalty();
  }, []);

  // Load wishlist products
  useEffect(() => {
    async function loadWishlistItems() {
      try {
        setLoadingWishlist(true);
        const res = await api.getWishlist();
        if (res?.products) {
          setWishlistProducts(res.products);
        }
      } catch (err) {
        console.error('Failed to load wishlist:', err);
      } finally {
        setLoadingWishlist(false);
      }
    }
    loadWishlistItems();
  }, [wishlist]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateProfile({ name, phone });
      setProfileMessage('Profile details updated successfully.');
      refreshUser();
      setTimeout(() => setProfileMessage(null), 3000);
    } catch (err: any) {
      setProfileMessage(err.message || 'Failed to update profile.');
    }
  };

  const handleRedeemPoints = async (pointsToRedeem: number) => {
    setRedeemError(null);
    setRedeemSuccess(null);
    setIsRedeeming(true);

    try {
      const res = await api.redeemLoyaltyPoints(pointsToRedeem);
      setRedeemSuccess({
        couponCode: res.couponCode,
        discountAmount: res.discountAmount
      });
      // Refresh loyalty state
      const updated = await api.getLoyaltyStatus();
      setLoyalty(updated);
    } catch (err: any) {
      setRedeemError(err.message || 'Failed to redeem points.');
    } finally {
      setIsRedeeming(false);
    }
  };

  const copyCouponToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const getStatusStep = (status: string) => {
    const steps = ['pending', 'confirmed', 'processing', 'manufacturing', 'dispatched', 'delivered'];
    const idx = steps.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title="My Account & Loyalty Rewards | Custom Car Mats UK"
        description="Track your bespoke car mat manufacturing stage, check your points balance, redeem discount vouchers, and access saved car mat wishlist."
        canonicalPath="/account"
      />

      {/* Account Header with Points Summary */}
      <div className="bg-[#071A33] text-white p-6 sm:p-8 rounded-3xl border border-[#1D3B63] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-[#071A33] flex items-center justify-center font-extrabold text-2xl shadow-lg border border-amber-300">
            {user?.name.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h1 className="text-2xl font-extrabold tracking-tight">{user?.name}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                {loyalty?.tier || 'VIP Club'}
              </span>
            </div>
            <p className="text-xs text-amber-300/80 mt-0.5 font-medium">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-300">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Loyalty Balance: <strong className="text-amber-400 font-bold">{loyalty?.points || 0} Points</strong> (£{((loyalty?.points || 0) / 100).toFixed(2)} Credit)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('shop')}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#071A33] text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>Order New Mats</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={logout}
            className="px-4 py-2.5 bg-[#0D2A4A] hover:bg-[#153B66] text-gray-300 hover:text-white text-xs font-bold rounded-xl border border-amber-400/30 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto gap-2 sm:gap-6 text-xs sm:text-sm font-bold pb-2">
        <button
          onClick={() => setActiveTab('loyalty')}
          className={`pb-3 px-3 rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'loyalty'
              ? 'bg-[#071A33] text-amber-400 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>Loyalty Rewards & Balance</span>
          <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded-full font-mono">
            {loyalty?.points || 0} pts
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-3 rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-[#071A33] text-amber-400 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Package className="w-4 h-4 text-amber-500" />
          <span>My Orders & Workshop Status</span>
          <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full font-mono">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 px-3 rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'wishlist'
              ? 'bg-[#071A33] text-amber-400 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500" />
          <span>Saved Mats Wishlist</span>
          <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full font-mono">
            {wishlist.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-3 rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-[#071A33] text-amber-400 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <User className="w-4 h-4 text-amber-500" />
          <span>Account Settings</span>
        </button>
      </div>

      {/* TAB 1: LOYALTY POINTS DASHBOARD */}
      {activeTab === 'loyalty' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Loyalty Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[#071A33] to-[#0D2A4A] p-6 rounded-2xl border border-amber-400/40 text-white shadow-lg space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Available Points</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">{loyalty?.points || 0}</span>
                <span className="text-xs text-amber-300 font-semibold">pts</span>
              </div>
              <p className="text-[11px] text-gray-300">
                Worth <strong className="text-amber-400">£{((loyalty?.points || 0) / 100).toFixed(2)}</strong> off future orders
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Reward Tier</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-[#071A33]">{loyalty?.tier || 'Bronze'}</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-[11px] text-gray-500">
                {(loyalty?.points || 0) >= 500 ? 'VIP Free express dispatch priority' : 'Earn 500 pts to reach Gold VIP'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Earning Rate</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-[#071A33]">5 Points</span>
                <span className="text-xs text-gray-500">/ £1 spent</span>
              </div>
              <p className="text-[11px] text-gray-500">
                100 points = £1.00 instant reward voucher
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Lifetime Savings</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-emerald-600">
                  £{(orders.reduce((acc, o) => acc + (o.discountAmount || 0), 0) + 4.50).toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Saved through reward vouchers & coupons
              </p>
            </div>
          </div>

          {/* Points Redemption Console */}
          <div className="bg-[#071A33] border border-[#1D3B63] rounded-2xl p-6 sm:p-8 text-white space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#0D2A4A] pb-5">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-400" />
                  <span>Convert Points into Checkout Vouchers</span>
                </h3>
                <p className="text-xs text-gray-300 mt-1">
                  Redeem increments of 100 points for instant checkout discounts. 100 points = £1.00 off.
                </p>
              </div>

              <span className="text-xs font-mono font-bold bg-[#040D1A] px-3 py-1.5 rounded-lg border border-amber-400/30 text-amber-400">
                Balance: {loyalty?.points || 0} pts
              </span>
            </div>

            {/* Redemption Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#040D1A] border border-[#1D3B63] rounded-xl p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-extrabold text-white">£1.00 Off Voucher</span>
                    <span className="text-xs text-amber-400 font-bold">100 pts</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Applicable on any bespoke car mat order over £10.
                  </p>
                </div>
                <button
                  onClick={() => handleRedeemPoints(100)}
                  disabled={isRedeeming || (loyalty?.points || 0) < 100}
                  className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-[#071A33] font-bold text-xs rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {(loyalty?.points || 0) < 100 ? 'Need 100 Points' : 'Redeem 100 pts'}
                </button>
              </div>

              <div className="bg-[#040D1A] border border-amber-400/40 rounded-xl p-4 space-y-3 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-extrabold text-white">£2.50 Off Voucher</span>
                    <span className="text-xs text-amber-400 font-bold">250 pts</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Popular: ideal for custom stitching or heel pad upgrades.
                  </p>
                </div>
                <button
                  onClick={() => handleRedeemPoints(250)}
                  disabled={isRedeeming || (loyalty?.points || 0) < 250}
                  className="w-full py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#071A33] font-extrabold text-xs rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {(loyalty?.points || 0) < 250 ? 'Need 250 Points' : 'Redeem 250 pts'}
                </button>
              </div>

              <div className="bg-[#040D1A] border border-[#1D3B63] rounded-xl p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-extrabold text-white">£5.00 Off Voucher</span>
                    <span className="text-xs text-amber-400 font-bold">500 pts</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Maximum value voucher for full premium 4-piece cabin sets.
                  </p>
                </div>
                <button
                  onClick={() => handleRedeemPoints(500)}
                  disabled={isRedeeming || (loyalty?.points || 0) < 500}
                  className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-[#071A33] font-bold text-xs rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {(loyalty?.points || 0) < 500 ? 'Need 500 Points' : 'Redeem 500 pts'}
                </button>
              </div>
            </div>

            {/* Generated Coupon Feedback Banner */}
            {redeemSuccess && (
              <div className="bg-emerald-950/70 border border-emerald-500/50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-white">
                      Voucher Created: £{redeemSuccess.discountAmount.toFixed(2)} Off!
                    </p>
                    <p className="text-gray-300 text-[11px]">
                      Use code <strong className="text-amber-400 font-mono text-sm">{redeemSuccess.couponCode}</strong> at checkout.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyCouponToClipboard(redeemSuccess.couponCode)}
                    className="px-3.5 py-1.5 bg-emerald-500 text-[#071A33] font-bold text-xs rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('shop')}
                    className="px-3.5 py-1.5 bg-amber-400 text-[#071A33] font-bold text-xs rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            )}

            {redeemError && (
              <div className="bg-red-950/70 border border-red-500/50 rounded-xl p-3.5 flex items-center gap-2 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{redeemError}</span>
              </div>
            )}
          </div>

          {/* Points Activity History */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="text-base font-extrabold text-[#071A33] flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Loyalty Points Activity History</span>
            </h3>

            {loyalty?.history && loyalty.history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Activity Description</th>
                      <th className="py-2.5 px-3">Order Ref</th>
                      <th className="py-2.5 px-3 text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loyalty.history.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-gray-50/80">
                        <td className="py-3 px-3 text-gray-500 whitespace-nowrap">
                          {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-3 px-3 font-medium text-gray-800">
                          {item.description}
                        </td>
                        <td className="py-3 px-3 font-mono text-gray-600">
                          {item.orderNumber ? (
                            <button
                              onClick={() => setCurrentTab('track', item.orderNumber)}
                              className="text-amber-600 hover:underline font-bold"
                            >
                              {item.orderNumber}
                            </button>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-extrabold">
                          <span className={item.points > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                            {item.points > 0 ? `+${item.points}` : item.points} pts
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-4 italic">No points transactions recorded yet.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY ORDERS & WORKSHOP STATUS */}
      {activeTab === 'orders' && (
        <OrderHistory
          orders={orders}
          loading={loadingOrders}
          setCurrentTab={setCurrentTab}
        />
      )}

      {/* TAB 3: SAVED WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#071A33] flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                <span>My Saved Car Mats Wishlist</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Saved tailored configurations ready for future vehicle builds and gifting.
              </p>
            </div>
            <span className="text-xs font-bold text-gray-500">{wishlist.length} Saved</span>
          </div>

          {loadingWishlist ? (
            <div className="bg-white p-10 rounded-2xl border text-center animate-pulse text-xs text-gray-500">
              Loading your saved wishlist...
            </div>
          ) : wishlistProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto text-rose-400">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-[#071A33]">Your wishlist is currently empty</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Explore our catalog of tailored car floor mats and click the heart icon on any set to save it to your account.
              </p>
              <button
                onClick={() => setCurrentTab('shop')}
                className="px-6 py-2.5 bg-[#071A33] text-amber-400 font-bold text-xs rounded-xl hover:bg-[#0D2A4A] cursor-pointer"
              >
                Browse Car Mats
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-4/3 bg-gray-900 cursor-pointer" onClick={() => setCurrentTab('product', product.slug)}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-rose-500 text-white shadow-md hover:bg-rose-600 transition-colors cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{product.sku}</span>
                      <h4
                        onClick={() => setCurrentTab('product', product.slug)}
                        className="text-sm font-bold text-[#071A33] hover:text-amber-600 transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase">Price</span>
                        <span className="text-base font-extrabold text-[#071A33]">
                          £{(product.salePrice || product.basePrice).toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => setCurrentTab('product', product.slug)}
                        className="px-4 py-2 bg-[#071A33] hover:bg-amber-400 hover:text-[#071A33] text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Configure & Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PROFILE & SETTINGS */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-fadeIn">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#071A33] flex items-center gap-2">
              <User className="w-5 h-5 text-amber-500" />
              <span>Personal Profile Details</span>
            </h3>

            {profileMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{profileMessage}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed font-mono"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Email is locked to your authenticated credentials.
                </span>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Contact Telephone (for delivery SMS)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="07700 900123"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#071A33] hover:bg-amber-400 hover:text-[#071A33] text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer"
              >
                Save Profile Changes
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-3">
              <h3 className="text-base font-extrabold text-[#071A33] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                <span>Saved UK Delivery Address</span>
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your dispatch addresses are automatically synced from your checkout transactions.
              </p>
              {user?.addresses && user.addresses.length > 0 ? (
                <div className="p-4 bg-[#F5F7FA] rounded-xl text-xs space-y-1.5 text-gray-700 border border-gray-200">
                  <p className="font-extrabold text-[#071A33]">{user.addresses[0].line1}</p>
                  {user.addresses[0].line2 && <p>{user.addresses[0].line2}</p>}
                  <p>{user.addresses[0].city}, {user.addresses[0].postcode}</p>
                  <p className="text-[11px] text-gray-500">{user.addresses[0].country}</p>
                </div>
              ) : (
                <div className="text-xs text-gray-400 italic bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200">
                  No saved delivery address yet. Address will be recorded during your next order.
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-[#071A33] to-[#0D2A4A] p-6 rounded-2xl border border-amber-400/30 text-white text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>UK Privacy & Data Protection</span>
              </div>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                Your account is protected by industry standard 256-bit encryption. We never sell your personal information or spam your email.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
