import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
    discountAmount,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    shippingCost,
    total,
    freeShippingRemaining,
    isCartDrawerOpen,
    closeCartDrawer,
    openCheckout
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponFeedback(null);
    const result = await applyCouponCode(couponInput.trim());
    setCouponFeedback(result);
    setCouponLoading(false);
    if (result.success) {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={closeCartDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#071A33] border-l border-[#0D2A4A] shadow-2xl flex flex-col text-white">
          {/* Header */}
          <div className="p-5 border-b border-[#0D2A4A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-extrabold tracking-tight">Your Shopping Basket</h2>
              <span className="text-xs bg-[#0D2A4A] px-2 py-0.5 rounded-full text-amber-400 font-bold">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#0D2A4A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#040D1A] px-5 py-3 border-b border-[#0D2A4A]">
            {freeShippingRemaining > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    Add <strong className="text-amber-400 font-bold">£{freeShippingRemaining.toFixed(2)}</strong> for Free UK Delivery!
                  </span>
                  <span className="text-gray-400">{Math.round((subtotal / 49) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / 49) * 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>You qualify for FREE UK Standard Delivery!</span>
              </div>
            )}
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#0D2A4A] flex items-center justify-center mx-auto text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-gray-200">Your basket is currently empty.</p>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Find your vehicle make & model to discover custom precision mats tailored to order.
                </p>
                <button
                  onClick={closeCartDrawer}
                  className="mt-4 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#071A33] text-xs font-bold rounded-lg transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.id}
                  className="bg-[#040D1A] border border-[#1D3B63] rounded-xl p-3.5 flex gap-3 relative group"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0 bg-gray-900 border border-[#1D3B63]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate pr-6">{item.productName}</h4>

                    {/* Tailored Vehicle Details Badge */}
                    <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0D2A4A] text-[10px] text-amber-300 font-medium border border-amber-400/20">
                      <span>{item.vehicleDetails.make} {item.vehicleDetails.model}</span>
                      <span className="text-gray-400">• {item.vehicleDetails.year}</span>
                    </div>

                    {/* Specs Summary */}
                    <p className="text-[10px] text-gray-400 mt-1 truncate">
                      {item.materialName} | {item.stitchingName}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#1D3B63] rounded-md bg-[#071A33]">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:text-amber-400 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:text-amber-400 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-extrabold text-white">
                        £{(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-2.5 right-2.5 text-gray-500 hover:text-red-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#0D2A4A] bg-[#040D1A] space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
                  <input
                    type="text"
                    placeholder="Discount code (e.g. WELCOME10)"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    className="w-full pl-8 pr-3 py-2 bg-[#071A33] border border-[#1D3B63] rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={couponLoading || !couponInput.trim()}
                  className="px-4 py-2 bg-[#0D2A4A] hover:bg-[#153B66] text-amber-400 text-xs font-bold rounded-lg border border-amber-400/30 transition-colors disabled:opacity-50"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </form>

              {/* Applied Coupon Pill */}
              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs bg-emerald-950/40 border border-emerald-500/40 rounded-lg px-2.5 py-1.5">
                  <span className="text-emerald-400 font-semibold">
                    Code &apos;{appliedCoupon.code}&apos; (-£{appliedCoupon.discountAmount.toFixed(2)})
                  </span>
                  <button onClick={removeCoupon} className="text-red-400 hover:text-red-300 text-[11px] font-bold">
                    Remove
                  </button>
                </div>
              )}

              {couponFeedback && !appliedCoupon && (
                <p className={`text-[11px] ${couponFeedback.success ? 'text-emerald-400' : 'text-red-400'}`}>
                  {couponFeedback.message}
                </p>
              )}

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">£{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span>-£{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated UK Delivery</span>
                  <span>{shippingCost === 0 ? <strong className="text-emerald-400">FREE</strong> : `£${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="border-t border-[#0D2A4A] pt-2 flex justify-between text-sm font-extrabold text-white">
                  <span>Total (Inc. 20% UK VAT)</span>
                  <span className="text-amber-400 text-base">£{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={openCheckout}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#071A33] font-extrabold text-sm rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] text-gray-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Stripe 256-bit Encrypted
                </span>
                <span>•</span>
                <span>30-Day UK Returns</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
