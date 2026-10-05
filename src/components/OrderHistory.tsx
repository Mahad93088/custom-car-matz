import React, { useState } from 'react';
import {
  Package,
  RotateCcw,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ShoppingBag,
  Car,
  Layers,
  Scissors,
  Hammer,
  Search,
  Copy,
  Sparkles,
  Filter,
  Calendar,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Order, CartItem } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';

interface OrderHistoryProps {
  orders: Order[];
  loading: boolean;
  setCurrentTab: (tab: string, param?: string) => void;
}

export function OrderHistory({ orders, loading, setCurrentTab }: OrderHistoryProps) {
  const { addItem, openCartDrawer } = useCart();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'manufacturing' | 'dispatched' | 'delivered'>('all');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [copiedOrderNumber, setCopiedOrderNumber] = useState<string | null>(null);
  const [reorderNotification, setReorderNotification] = useState<string | null>(null);

  // Toggle order expanded card details
  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const copyOrderRef = (e: React.MouseEvent, orderNumber: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(orderNumber);
    setCopiedOrderNumber(orderNumber);
    setTimeout(() => setCopiedOrderNumber(null), 2000);
  };

  // Re-order a single item configuration
  const handleReorderItem = (e: React.MouseEvent, item: CartItem, orderNumber: string) => {
    e.stopPropagation();
    addItem({
      productId: item.productId,
      productName: item.productName,
      sku: item.sku,
      unitPrice: item.unitPrice,
      quantity: 1,
      imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
      materialName: item.materialName,
      colorName: item.colorName,
      stitchingName: item.stitchingName,
      heelPadName: item.heelPadName,
      vehicleDetails: item.vehicleDetails,
      customEmbroidery: item.customEmbroidery
    });

    const vehicleDesc = item.vehicleDetails
      ? `${item.vehicleDetails.make} ${item.vehicleDetails.model}`
      : 'tailored vehicle';

    setReorderNotification(
      `Re-ordered configuration! Added "${item.productName}" (${vehicleDesc}) to your basket.`
    );
    openCartDrawer();
    setTimeout(() => setReorderNotification(null), 5000);
  };

  // Re-order entire previous order
  const handleReorderEntireOrder = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    order.items.forEach(item => {
      addItem({
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
        materialName: item.materialName,
        colorName: item.colorName,
        stitchingName: item.stitchingName,
        heelPadName: item.heelPadName,
        vehicleDetails: item.vehicleDetails,
        customEmbroidery: item.customEmbroidery
      });
    });

    setReorderNotification(
      `Re-ordered all ${order.items.length} tailored mat set(s) from order ${order.orderNumber}! Your basket is ready.`
    );
    openCartDrawer();
    setTimeout(() => setReorderNotification(null), 5000);
  };

  // Helper for stage progress indicators
  const getStageInfo = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Order Confirmed',
          step: 1,
          color: 'bg-blue-500 text-blue-100',
          badge: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      case 'processing':
        return {
          label: 'CAD Laser Cutting',
          step: 2,
          color: 'bg-amber-500 text-amber-100',
          badge: 'bg-amber-50 text-amber-800 border-amber-300'
        };
      case 'manufacturing':
        return {
          label: 'Hand-Tailoring & Edging',
          step: 3,
          color: 'bg-amber-600 text-amber-100',
          badge: 'bg-amber-100 text-amber-900 border-amber-400'
        };
      case 'dispatched':
        return {
          label: 'Dispatched via Courier',
          step: 4,
          color: 'bg-indigo-600 text-indigo-100',
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200'
        };
      case 'delivered':
        return {
          label: 'Delivered to Door',
          step: 5,
          color: 'bg-emerald-600 text-emerald-100',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
      default:
        return {
          label: status.replace('_', ' '),
          step: 1,
          color: 'bg-gray-500 text-gray-100',
          badge: 'bg-gray-50 text-gray-700 border-gray-200'
        };
    }
  };

  // Filtering
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (statusFilter === 'manufacturing') {
      if (!['pending', 'confirmed', 'processing', 'manufacturing'].includes(order.orderStatus)) {
        return false;
      }
    } else if (statusFilter === 'dispatched') {
      if (order.orderStatus !== 'dispatched') return false;
    } else if (statusFilter === 'delivered') {
      if (order.orderStatus !== 'delivered') return false;
    }

    // Search query
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const matchesNum = order.orderNumber.toLowerCase().includes(q);
      const matchesProduct = order.items.some(
        it =>
          it.productName.toLowerCase().includes(q) ||
          it.materialName?.toLowerCase().includes(q) ||
          it.vehicleDetails?.make?.toLowerCase().includes(q) ||
          it.vehicleDetails?.model?.toLowerCase().includes(q) ||
          it.vehicleDetails?.regNumber?.toLowerCase().includes(q)
      );
      return matchesNum || matchesProduct;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification for Re-order action */}
      {reorderNotification && (
        <div className="bg-[#071A33] border border-amber-400 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5 animate-spin-reverse" />
            </div>
            <div>
              <p className="font-extrabold text-xs text-amber-300 uppercase tracking-wider">
                Configuration Added to Basket
              </p>
              <p className="text-xs text-gray-200 font-medium">{reorderNotification}</p>
            </div>
          </div>
          <button
            onClick={() => setReorderNotification(null)}
            className="text-gray-400 hover:text-white p-1 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wider mb-1">
              <Package className="w-3 h-3 text-amber-600" />
              <span>Customer Purchases</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#071A33] tracking-tight">
              Order History & Re-Order Centre
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Review previous bespoke orders, inspect live UK workshop stages, and 1-click re-order identical tailored configurations for replacements or extra vehicles.
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('shop')}
            className="px-4 py-2.5 bg-[#071A33] hover:bg-[#0D2A4A] text-amber-400 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Configure New Set</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-white text-[#071A33] shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setStatusFilter('manufacturing')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'manufacturing'
                  ? 'bg-white text-[#071A33] shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              In Workshop
            </button>
            <button
              onClick={() => setStatusFilter('dispatched')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'dispatched'
                  ? 'bg-white text-[#071A33] shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Dispatched
            </button>
            <button
              onClick={() => setStatusFilter('delivered')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'delivered'
                  ? 'bg-white text-[#071A33] shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Delivered
            </button>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by order #, vehicle, mat..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Orders List Container */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-semibold">Loading your previous purchases...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#071A33]">No matching purchases found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              {search.trim()
                ? `No orders matched "${search}". Try checking your reference number or clear filters.`
                : 'You have not placed any custom car mat orders yet. Start your bespoke car build today.'}
            </p>
          </div>
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
              setCurrentTab('shop');
            }}
            className="px-6 py-2.5 bg-[#071A33] hover:bg-[#0D2A4A] text-amber-400 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Browse Tailored Car Mats
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => {
            const stage = getStageInfo(order.orderStatus);
            const isExpanded = expandedOrders[order.id] !== false; // expanded by default

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:border-amber-400/80 transition-all space-y-0"
              >
                {/* Order Header Ribbon */}
                <div className="bg-gradient-to-r from-[#071A33] via-[#0B2344] to-[#040D1A] text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono font-extrabold text-sm sm:text-base text-amber-400 tracking-wider">
                        {order.orderNumber}
                      </span>
                      <button
                        onClick={e => copyOrderRef(e, order.orderNumber)}
                        className="p-1 rounded bg-[#0D2A4A] text-gray-300 hover:text-white transition-colors text-[10px] flex items-center gap-1 cursor-pointer"
                        title="Copy Order Number"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedOrderNumber === order.orderNumber ? 'Copied!' : 'Copy'}</span>
                      </button>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full capitalize">
                        {order.paymentStatus === 'paid' ? 'Paid via Stripe' : order.paymentStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>
                          Ordered on{' '}
                          {new Date(order.createdAt).toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </span>
                      <span>•</span>
                      <span>{order.items.length} custom product(s)</span>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex items-center gap-3 justify-between md:justify-end border-t md:border-t-0 border-[#1D3B63] pt-3 md:pt-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">
                        Total Order
                      </span>
                      <span className="text-base sm:text-lg font-extrabold text-white">
                        £{order.total.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentTab('track', order.orderNumber)}
                        className="px-3 py-2 bg-[#0D2A4A] hover:bg-[#153B66] text-amber-300 text-xs font-bold rounded-xl border border-amber-400/30 transition-all flex items-center gap-1.5 cursor-pointer"
                        title="View live CAD cutting and workshop status"
                      >
                        <Truck className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">Track Workshop</span>
                      </button>

                      <button
                        onClick={e => handleReorderEntireOrder(e, order)}
                        className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#071A33] text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                        title="Add all items from this order to basket"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Re-Order All</span>
                      </button>

                      <button
                        onClick={() => toggleExpand(order.id)}
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                        title={isExpanded ? 'Collapse items' : 'Expand items'}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 rotate-180 transition-transform" />
                        ) : (
                          <ChevronDown className="w-4 h-4 transition-transform" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="bg-[#F8FAFC] px-5 py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-extrabold text-[11px] uppercase tracking-wider border ${stage.badge}`}
                    >
                      {stage.label}
                    </span>
                    <span className="text-gray-500 font-medium">
                      Shipping via <strong className="text-gray-700">{order.shippingMethod}</strong>
                    </span>
                  </div>

                  {order.trackingNumber && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500">Tracking:</span>
                      <a
                        href={
                          order.shippingMethod?.toLowerCase().includes('dpd')
                            ? `https://www.dpd.co.uk/tracking/${order.trackingNumber}`
                            : `https://www.royalmail.com/track-your-item#/tracking-results/${order.trackingNumber}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded hover:bg-amber-100 transition-colors"
                      >
                        <span>{order.trackingNumber}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Items Breakdown (When Expanded) */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 divide-y divide-gray-100 space-y-4">
                    {order.items.map((item, idx) => {
                      const vehicle = item.vehicleDetails;

                      return (
                        <div
                          key={item.id || idx}
                          className={`pt-4 first:pt-0 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4`}
                        >
                          {/* Item Left: Image & Config Details */}
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-900 border border-gray-200 flex-shrink-0 relative">
                              <img
                                src={
                                  item.imageUrl ||
                                  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80'
                                }
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute bottom-1 right-1 bg-black/80 text-white font-mono text-[9px] px-1 rounded">
                                Qty: {item.quantity}
                              </span>
                            </div>

                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-extrabold text-sm text-[#071A33]">
                                  {item.productName}
                                </h4>
                                <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                  {item.sku}
                                </span>
                              </div>

                              {/* Vehicle Tailoring Badge */}
                              {vehicle && (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold">
                                  <Car className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                  <span>
                                    {vehicle.make} {vehicle.model}{' '}
                                    {vehicle.year ? `(${vehicle.year})` : ''}
                                    {vehicle.variant ? ` • ${vehicle.variant}` : ''}
                                  </span>
                                  {vehicle.regNumber && (
                                    <span className="bg-amber-300 text-[#071A33] px-1.5 py-0.2 rounded font-mono font-bold text-[10px] uppercase ml-1">
                                      {vehicle.regNumber}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Tailored Customization Specifications */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-gray-600 pt-1">
                                {item.materialName && (
                                  <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                                    <span className="text-[9px] uppercase font-bold text-gray-400 block">
                                      Material Core
                                    </span>
                                    <span className="font-medium text-gray-900">
                                      {item.materialName}
                                    </span>
                                  </div>
                                )}

                                {item.colorName && (
                                  <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                                    <span className="text-[9px] uppercase font-bold text-gray-400 block">
                                      Carpet/Rubber Shade
                                    </span>
                                    <span className="font-medium text-gray-900">
                                      {item.colorName}
                                    </span>
                                  </div>
                                )}

                                {item.stitchingName && (
                                  <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                                    <span className="text-[9px] uppercase font-bold text-gray-400 block">
                                      Edging & Trim
                                    </span>
                                    <span className="font-medium text-gray-900">
                                      {item.stitchingName}
                                    </span>
                                  </div>
                                )}

                                {item.heelPadName && (
                                  <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                                    <span className="text-[9px] uppercase font-bold text-gray-400 block">
                                      Driver Heel Pad
                                    </span>
                                    <span className="font-medium text-gray-900">
                                      {item.heelPadName}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {item.customEmbroidery && (
                                <p className="text-[11px] text-gray-600">
                                  Custom Embroidery:{' '}
                                  <strong className="text-[#071A33] font-mono bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                    &ldquo;{item.customEmbroidery}&rdquo;
                                  </strong>
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Item Right: Price & Re-order Configuration CTA */}
                          <div className="flex items-center lg:flex-col lg:items-end justify-between w-full lg:w-auto gap-3 pt-2 lg:pt-0">
                            <div className="lg:text-right">
                              <span className="text-sm font-extrabold text-[#071A33]">
                                £{(item.unitPrice * item.quantity).toFixed(2)}
                              </span>
                              {item.quantity > 1 && (
                                <span className="text-[11px] text-gray-400 block">
                                  (£{item.unitPrice.toFixed(2)} each)
                                </span>
                              )}
                            </div>

                            {/* RE-ORDER THIS EXACT MAT CONFIGURATION BUTTON */}
                            <button
                              onClick={e => handleReorderItem(e, item, order.orderNumber)}
                              className="px-3.5 py-2 bg-[#071A33] hover:bg-amber-400 hover:text-[#071A33] text-amber-300 font-extrabold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                              title="Re-order this exact tailored configuration"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Re-Order Configuration</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Shipping Address Summary */}
                    {order.shippingAddress && (
                      <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-gray-500 bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span>
                            Delivery to:{' '}
                            <strong className="text-gray-800">
                              {order.shippingAddress.line1}, {order.shippingAddress.city},{' '}
                              {order.shippingAddress.postcode}
                            </strong>
                          </span>
                        </div>
                        <button
                          onClick={() => setCurrentTab('track', order.orderNumber)}
                          className="text-amber-700 hover:text-amber-800 font-bold underline cursor-pointer text-xs"
                        >
                          View Full Manufacturing Timeline →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
