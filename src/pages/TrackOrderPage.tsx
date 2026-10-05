import React, { useState, useEffect } from 'react';
import {
  Search,
  Package,
  Scissors,
  Hammer,
  Truck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
  Calendar,
  MapPin,
  ArrowRight,
  Car
} from 'lucide-react';
import { api } from '../lib/api.ts';
import { SEOHead } from '../components/SEOHead.tsx';

interface TrackOrderPageProps {
  setCurrentTab: (tab: string, param?: string) => void;
  initialOrderNumber?: string;
  initialEmail?: string;
}

interface TrackedOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'manufacturing' | 'dispatched' | 'delivered' | 'cancelled';
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
  shippingMethod: string;
  courier: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shippingAddress: {
    line1: string;
    city: string;
    county?: string;
    postcode: string;
    country: string;
  };
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
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
    };
    customEmbroidery?: string;
  }>;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  notes?: string;
}

export function TrackOrderPage({ setCurrentTab, initialOrderNumber = '', initialEmail = '' }: TrackOrderPageProps) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  // Auto-search if initialOrderNumber and initialEmail are supplied
  useEffect(() => {
    // Check URL parameters for track / orderNumber query
    try {
      const params = new URLSearchParams(window.location.search);
      const urlOrder = params.get('order') || params.get('track') || initialOrderNumber;
      const urlEmail = params.get('email') || initialEmail;

      if (urlOrder) setOrderNumber(urlOrder);
      if (urlEmail) setEmail(urlEmail);

      if (urlOrder && urlEmail) {
        performTracking(urlOrder, urlEmail);
      }
    } catch {}
  }, []);

  const performTracking = async (searchOrder: string, searchEmail: string) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const data = await api.trackOrder({
        orderNumber: searchOrder.trim(),
        email: searchEmail.trim()
      });
      setOrder(data);
    } catch (err: any) {
      console.error('Tracking query error:', err);
      setOrder(null);
      setErrorMessage(
        err.message || 'Unable to locate order. Please check that your order number and email match your receipt.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !email.trim()) {
      setErrorMessage('Please enter both your order number and email address.');
      return;
    }
    performTracking(orderNumber, email);
  };

  const fillDemoOrder = () => {
    setOrderNumber('CCM-10842');
    setEmail('customer@example.co.uk');
    performTracking('CCM-10842', 'customer@example.co.uk');
  };

  // Define Manufacturing & Delivery Pipeline stages
  const STAGES = [
    {
      key: 'confirmed',
      title: 'Order Confirmed',
      description: 'Payment verified & vehicle CAD pattern selected from our database of 2,500+ UK models.',
      icon: Package
    },
    {
      key: 'processing',
      title: 'Precision CAD Laser Cutting',
      description: 'Heavyweight carpet or rubber core cut with robotic laser accuracy to exact vehicle chassis contours.',
      icon: Scissors
    },
    {
      key: 'manufacturing',
      title: 'Hand-Tailoring & Edging',
      description: 'Master British machinists hand-apply edge trim binding, fit reinforced heel pads, and embed floor clips.',
      icon: Hammer
    },
    {
      key: 'dispatched',
      title: 'UK Courier Dispatched',
      description: 'Packed securely in weather-sealed UK packaging and handed to courier with full GPS tracking.',
      icon: Truck
    },
    {
      key: 'delivered',
      title: 'Delivered',
      description: 'Safely delivered to your UK address or designated safe place.',
      icon: CheckCircle2
    }
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 0;
      case 'processing':
        return 1;
      case 'manufacturing':
        return 2;
      case 'dispatched':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStageIndex = order ? getStageIndex(order.orderStatus) : 0;

  return (
    <div className="bg-[#040D1A] min-h-[85vh] text-white py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={order ? `Track Order ${order.orderNumber} | Live Workshop Status` : 'Track Your Order | Custom Car Mats UK'}
        description="Check your bespoke car mats manufacturing, laser-cutting, hand-trimming, and Royal Mail or DPD tracking stage live without logging in."
        canonicalPath="/track"
      />
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D2A4A] border border-amber-400/30 text-amber-400 text-xs font-bold tracking-wide uppercase">
            <Truck className="w-3.5 h-3.5" />
            <span>UK Workshop Live Tracking</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Track Your Custom Car Mats
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Follow your tailored car mats step-by-step from laser cutting and hand-stitching to Royal Mail or DPD dispatch.
            No login required.
          </p>
        </div>

        {/* Tracking Search Card */}
        <div className="bg-[#071A33] border border-[#1D3B63] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Order Reference Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={orderNumber}
                    onChange={e => setOrderNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. CCM-72177 or CCM-10001"
                    className="w-full bg-[#040D1A] border border-[#1D3B63] rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-gray-500 focus:outline-none focus:border-amber-400 uppercase"
                  />
                  <div className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none">
                    <Search className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Customer Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. you@example.co.uk"
                  className="w-full bg-[#040D1A] border border-[#1D3B63] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-red-950/70 border border-red-500/50 rounded-xl flex items-center gap-2.5 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={fillDemoOrder}
                className="text-xs text-amber-400 hover:text-amber-300 underline font-medium transition-colors cursor-pointer"
              >
                Click here to test with Demo Order (CCM-10842)
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-[#071A33] font-extrabold text-sm rounded-xl transition-all shadow-xl hover:shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#071A33] border-t-transparent rounded-full animate-spin" />
                    <span>Searching Workshop Database...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Track My Order</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Order Details & Live Stage Visualizer */}
        {order && (
          <div className="space-y-8 animate-fadeIn">
            {/* Status Hero Banner */}
            <div className="bg-[#071A33] border border-[#1D3B63] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0D2A4A] pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/30 font-bold">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-gray-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
                    Order Status: <span className="text-amber-400 capitalize">{order.orderStatus.replace('_', ' ')}</span>
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">Estimated UK Delivery</span>
                    <span className="text-sm font-bold text-white flex items-center gap-1.5 justify-end">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      {order.estimatedDelivery}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Manufacturing Stage Stepper */}
              <div className="space-y-6">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Workshop Production Pipeline</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                  {STAGES.map((stage, idx) => {
                    const isCompleted = idx < currentStageIndex || order.orderStatus === 'delivered';
                    const isCurrent = idx === currentStageIndex && order.orderStatus !== 'delivered';
                    const isPending = idx > currentStageIndex && order.orderStatus !== 'delivered';
                    const IconComponent = stage.icon;

                    return (
                      <div
                        key={stage.key}
                        className={`rounded-xl p-4 border transition-all ${
                          isCurrent
                            ? 'bg-[#0D2A4A] border-amber-400 shadow-lg shadow-amber-400/10 ring-1 ring-amber-400'
                            : isCompleted
                            ? 'bg-[#040D1A]/90 border-emerald-500/40'
                            : 'bg-[#040D1A]/40 border-gray-800 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                              isCurrent
                                ? 'bg-amber-400 text-[#071A33]'
                                : isCompleted
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-[#071A33] text-gray-400'
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>

                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isCurrent
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse'
                                : isCompleted
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-gray-800 text-gray-400'
                            }`}
                          >
                            {isCurrent ? 'In Progress' : isCompleted ? 'Completed' : `Step ${idx + 1}`}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white mb-1">{stage.title}</h4>
                        <p className="text-[11px] text-gray-400 leading-snug">{stage.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Courier Tracking Dispatch Card */}
              {['dispatched', 'delivered'].includes(order.orderStatus) && (
                <div className="bg-[#040D1A] border border-amber-400/40 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Courier: {order.courier}
                      </h4>
                      <p className="text-xs text-gray-400 font-mono">
                        Consignment Number: <strong className="text-amber-400 font-bold">{order.trackingNumber}</strong>
                      </p>
                    </div>
                  </div>

                  {order.trackingUrl && (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#071A33] font-bold text-xs rounded-lg transition-colors shadow"
                    >
                      <span>Track with {order.courier.includes('DPD') ? 'DPD' : 'Royal Mail'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Order Details & Tailored Vehicle Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left 2 Cols: Mat Items & Vehicle Tailoring */}
              <div className="md:col-span-2 bg-[#071A33] border border-[#1D3B63] rounded-2xl p-6 space-y-5">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-amber-400 border-b border-[#0D2A4A] pb-2 flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  <span>Tailored Products In This Order</span>
                </h3>

                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="bg-[#040D1A] border border-[#1D3B63] rounded-xl p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-bold text-white">{item.productName}</h4>
                          <p className="text-xs text-amber-300 font-semibold mt-0.5">
                            Vehicle: {item.vehicleDetails?.make} {item.vehicleDetails?.model} {item.vehicleDetails?.variant} ({item.vehicleDetails?.year})
                          </p>
                        </div>
                        <span className="text-sm font-extrabold text-white">
                          £{(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      {/* Custom Specs Pills */}
                      <div className="flex flex-wrap gap-2 text-[11px] pt-1 border-t border-[#0D2A4A]">
                        <span className="bg-[#071A33] px-2 py-0.5 rounded text-gray-300 border border-[#1D3B63]">
                          Material: <strong className="text-white">{item.materialName}</strong>
                        </span>
                        <span className="bg-[#071A33] px-2 py-0.5 rounded text-gray-300 border border-[#1D3B63]">
                          Colour: <strong className="text-white">{item.colorName}</strong>
                        </span>
                        <span className="bg-[#071A33] px-2 py-0.5 rounded text-gray-300 border border-[#1D3B63]">
                          Stitching: <strong className="text-white">{item.stitchingName}</strong>
                        </span>
                        <span className="bg-[#071A33] px-2 py-0.5 rounded text-gray-300 border border-[#1D3B63]">
                          Heelpad: <strong className="text-white">{item.heelPadName}</strong>
                        </span>
                        {item.customEmbroidery && (
                          <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                            Embroidery: &apos;{item.customEmbroidery}&apos;
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <div className="p-3 bg-[#0D2A4A]/50 border border-[#1D3B63] rounded-lg text-xs text-gray-300">
                    <span className="font-bold text-amber-400">Workshop / Safe Place Note: </span>
                    {order.notes}
                  </div>
                )}
              </div>

              {/* Right Col: UK Delivery Address & Totals */}
              <div className="space-y-6">
                {/* Delivery Address */}
                <div className="bg-[#071A33] border border-[#1D3B63] rounded-2xl p-6 space-y-3">
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-amber-400 border-b border-[#0D2A4A] pb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>UK Delivery Address</span>
                  </h3>
                  <div className="text-xs text-gray-300 space-y-1">
                    <p className="font-bold text-white">{order.customerName}</p>
                    <p>{order.shippingAddress.line1}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.postcode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-[#071A33] border border-[#1D3B63] rounded-2xl p-6 space-y-3">
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-amber-400 border-b border-[#0D2A4A] pb-2">
                    Order Summary
                  </h3>

                  <div className="space-y-2 text-xs text-gray-300">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="text-white">£{order.subtotal.toFixed(2)}</span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Discount:</span>
                        <span>-£{order.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping ({order.shippingMethod}):</span>
                      <span>{order.shippingCost === 0 ? <strong className="text-emerald-400">FREE</strong> : `£${order.shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="border-t border-[#0D2A4A] pt-2 flex justify-between text-sm font-extrabold text-white">
                      <span>Total Paid:</span>
                      <span className="text-amber-400 text-base">£{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* British Quality Guarantee */}
                <div className="bg-gradient-to-br from-[#0D2A4A] to-[#071A33] border border-amber-400/30 rounded-2xl p-5 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>100% Fitment Guarantee</span>
                  </div>
                  <p className="text-gray-300 text-[11px] leading-relaxed">
                    Every mat is precision cut to OEM floor anchors and manufactured in the UK. If your mats don&apos;t fit your vehicle, we replace them free of charge.
                  </p>
                  <button
                    onClick={() => setCurrentTab('contact')}
                    className="text-amber-400 hover:text-amber-300 underline font-semibold text-[11px] block pt-1"
                  >
                    Need assistance with this order? Contact our UK team →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help & Support CTA */}
        <div className="text-center pt-4">
          <p className="text-xs text-gray-400">
            Have questions about your car mat tailoring schedule?{' '}
            <button
              onClick={() => setCurrentTab('contact')}
              className="text-amber-400 hover:text-amber-300 underline font-semibold transition-colors"
            >
              Get in touch with our UK workshop support team
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
