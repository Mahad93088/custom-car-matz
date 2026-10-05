import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Mail,
  Star
} from 'lucide-react';
import { api } from '../lib/api.ts';

export function AdminDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = () => {
    api.admin.getDashboard().then(setData).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading || !data) {
    return <div className="p-8 text-center text-xs text-gray-500 animate-pulse">Loading Admin Dashboard...</div>;
  }

  const { kpi, recentOrders, lowStockProducts } = data;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#071A33] tracking-tight">Executive CMS Dashboard</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time UK manufacturing metrics, store revenue, and order pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Stripe Gateway Live
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              £
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#071A33]">£{kpi.totalRevenue.toFixed(2)}</p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +18.4% this week
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#071A33]">{kpi.totalOrders}</p>
          <span className="text-[11px] text-amber-600 font-semibold">
            {kpi.pendingOrdersCount} queued for tailoring
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Customers</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#071A33]">{kpi.activeCustomers}</p>
          <span className="text-[11px] text-gray-400">UK Registered Accounts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Action Items</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#071A33]">
            {kpi.pendingReviewsCount + kpi.unreadMessagesCount}
          </p>
          <span className="text-[11px] text-red-500 font-semibold">
            {kpi.pendingReviewsCount} reviews • {kpi.unreadMessagesCount} unread messages
          </span>
        </div>
      </div>

      {/* Recent Orders Pipeline */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#071A33] uppercase tracking-wider">
            Recent Orders & Production Queue
          </h3>
          <button
            onClick={() => onNavigate('orders')}
            className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
          >
            <span>Manage All Orders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-gray-500 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="p-3.5">Order Ref</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Vehicle</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((ord: any) => (
                <tr key={ord.id} className="hover:bg-gray-50">
                  <td className="p-3.5 font-bold font-mono text-[#071A33]">{ord.orderNumber}</td>
                  <td className="p-3.5">
                    <strong className="block text-gray-900">{ord.customerName}</strong>
                    <span className="text-[11px] text-gray-400">{ord.customerEmail}</span>
                  </td>
                  <td className="p-3.5 text-gray-700 font-medium">
                    {ord.items[0]?.vehicleDetails?.make} {ord.items[0]?.vehicleDetails?.model}
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
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="p-3.5 text-gray-400 text-[11px]">
                    {new Date(ord.createdAt).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
