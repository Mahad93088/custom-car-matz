import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Truck, Check, Edit2, Clock, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { api } from '../lib/api.ts';
import { Order } from '../types/index.ts';

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status update state
  const [statusVal, setStatusVal] = useState('');
  const [trackingVal, setTrackingVal] = useState('');
  const [courierVal, setCourierVal] = useState('');
  const [notesVal, setNotesVal] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenDetail = (ord: Order) => {
    setSelectedOrder(ord);
    setStatusVal(ord.orderStatus);
    setTrackingVal(ord.trackingNumber || '');
    setCourierVal(ord.courier || 'DPD Express Tracked');
    setNotesVal(ord.notes || '');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const updated = await api.admin.updateOrderStatus(selectedOrder.id, {
        orderStatus: statusVal,
        trackingNumber: trackingVal.trim() || undefined,
        courier: courierVal.trim() || undefined,
        notes: notesVal.trim() || undefined
      });
      setSelectedOrder(updated);
      fetchOrders();
      alert(`Order ${updated.orderNumber} updated to '${statusVal}'`);
    } catch (err: any) {
      alert(err.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const filtered = orders.filter(o => {
    const matchesStatus = filterStatus === 'all' || o.orderStatus === filterStatus;
    const matchesSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#071A33] tracking-tight">Order Management & Fulfillment</h1>
          <p className="text-xs text-gray-500">
            Track cutting bay pipeline, dispatch parcels, and add tracking numbers.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
          {['all', 'confirmed', 'manufacturing', 'dispatched', 'delivered'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                filterStatus === st ? 'bg-[#071A33] text-amber-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search order ref, customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-gray-500 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="p-3.5">Order Ref</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Vehicle Specs</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Courier & Tracking</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(ord => (
                <tr key={ord.id} className="hover:bg-gray-50">
                  <td className="p-3.5 font-bold font-mono text-[#071A33]">{ord.orderNumber}</td>
                  <td className="p-3.5">
                    <strong className="block text-gray-900">{ord.customerName}</strong>
                    <span className="text-[11px] text-gray-400">{ord.customerEmail}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-gray-800 block">
                      {ord.items[0]?.vehicleDetails?.make} {ord.items[0]?.vehicleDetails?.model}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {ord.items[0]?.vehicleDetails?.year} ({ord.items[0]?.materialName})
                    </span>
                  </td>
                  <td className="p-3.5 font-extrabold text-gray-900">£{ord.total.toFixed(2)}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        ord.orderStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.orderStatus === 'dispatched'
                          ? 'bg-blue-100 text-blue-800'
                          : ord.orderStatus === 'manufacturing'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {ord.trackingNumber ? (
                      <span className="font-mono text-[11px] text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                        {ord.trackingNumber}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic text-[11px]">Unassigned</span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleOpenDetail(ord)}
                      className="px-3 py-1.5 bg-[#071A33] text-amber-400 font-bold rounded-lg hover:bg-amber-400 hover:text-[#071A33]"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 text-gray-900 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold">Managing Order</span>
                <h3 className="text-lg font-extrabold text-[#071A33] font-mono">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleUpdateStatus} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 text-xs">
              <h4 className="font-bold text-gray-800 uppercase tracking-wider text-[11px]">
                Update Production & Dispatch Status
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={statusVal}
                    onChange={e => setStatusVal(e.target.value)}
                    className="w-full px-3 py-2 bg-white border rounded-lg font-bold"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="manufacturing">Manufacturing (Laser Bay)</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Courier Service</label>
                  <select
                    value={courierVal}
                    onChange={e => setCourierVal(e.target.value)}
                    className="w-full px-3 py-2 bg-white border rounded-lg font-medium"
                  >
                    <option value="DPD Express Tracked">DPD Express Tracked</option>
                    <option value="Royal Mail 48 Tracked">Royal Mail 48 Tracked</option>
                    <option value="DHL Express UK">DHL Express UK</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Courier Tracking Number</label>
                <input
                  type="text"
                  placeholder="e.g. DPD1592039281 or GB184920491RM"
                  value={trackingVal}
                  onChange={e => setTrackingVal(e.target.value)}
                  className="w-full px-3 py-2 bg-white border rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Internal Notes</label>
                <input
                  type="text"
                  placeholder="Workshop notes or customer requests..."
                  value={notesVal}
                  onChange={e => setNotesVal(e.target.value)}
                  className="w-full px-3 py-2 bg-white border rounded-lg text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-2.5 bg-[#071A33] hover:bg-amber-400 hover:text-[#071A33] text-white font-bold rounded-xl transition-all shadow-sm"
              >
                {updating ? 'Saving Status...' : 'Update Order Status & Send Notification'}
              </button>
            </form>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <span className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">Customer Details</span>
                <p className="font-bold text-gray-900">{selectedOrder.customerName}</p>
                <p className="text-gray-500">{selectedOrder.customerEmail}</p>
                <p className="text-gray-500">{selectedOrder.customerPhone || 'No phone'}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <span className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">Delivery Destination</span>
                <p className="font-medium text-gray-800">{selectedOrder.shippingAddress.line1}</p>
                <p className="text-gray-800 font-bold">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postcode}</p>
                <p className="text-[11px] text-gray-500">{selectedOrder.shippingAddress.country}</p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              <h5 className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">Manufactured Items</h5>
              {selectedOrder.items.map(it => (
                <div key={it.id} className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
                  <div>
                    <strong className="text-gray-900 block">{it.productName} ({it.sku})</strong>
                    <span className="text-[11px] text-gray-500">
                      Vehicle: {it.vehicleDetails.make} {it.vehicleDetails.model} ({it.vehicleDetails.year}) - {it.vehicleDetails.variant}
                    </span>
                    <span className="block text-[11px] text-amber-700 font-medium">
                      Trim: {it.stitchingName} | Heel Pad: {it.heelPadName}
                    </span>
                  </div>
                  <span className="font-extrabold text-sm text-[#071A33]">
                    {it.quantity}x £{it.unitPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
