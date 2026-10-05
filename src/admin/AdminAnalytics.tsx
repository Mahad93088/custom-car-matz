import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Car, ArrowUpRight } from 'lucide-react';
import { api } from '../lib/api.ts';

export function AdminAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.getAnalytics().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="p-8 text-center text-xs text-gray-500 animate-pulse">Loading Analytics...</div>;
  }

  const { totalRevenue, totalOrders, averageOrderValue, conversionRate, salesHistory, topSellingProducts, makeCounts } = data;

  const maxRevenue = Math.max(...salesHistory.map((s: any) => s.revenue), 1000);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[#071A33] tracking-tight">Sales Analytics & Vehicle Reports</h1>
        <p className="text-xs text-gray-500">
          Conversion rates, revenue velocity, and popular UK vehicle make demand.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase">Gross Revenue</span>
          <p className="text-2xl font-extrabold text-[#071A33]">£{totalRevenue.toFixed(2)}</p>
          <span className="text-[11px] text-emerald-600 font-bold">+14.2% vs previous period</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase">Total Orders</span>
          <p className="text-2xl font-extrabold text-[#071A33]">{totalOrders}</p>
          <span className="text-[11px] text-gray-400 font-medium">100% UK Deliveries</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase">Average Order Value</span>
          <p className="text-2xl font-extrabold text-[#071A33]">£{averageOrderValue.toFixed(2)}</p>
          <span className="text-[11px] text-gray-400 font-medium">Basket Average</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase">E-Commerce Conversion Rate</span>
          <p className="text-2xl font-extrabold text-emerald-600">{conversionRate}</p>
          <span className="text-[11px] text-emerald-600 font-bold">Above UK Auto benchmark (2.4%)</span>
        </div>
      </div>

      {/* Weekly Revenue Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#071A33] uppercase tracking-wider">
            Daily Revenue Breakdown (£ GBP)
          </h3>
          <span className="text-xs text-gray-400">Past 7 Days</span>
        </div>

        <div className="h-48 flex items-end gap-4 pt-6">
          {salesHistory.map((day: any) => {
            const heightPercent = Math.round((day.revenue / maxRevenue) * 100);
            return (
              <div key={day.period} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  £{day.revenue}
                </span>
                <div
                  className="w-full bg-[#071A33] hover:bg-amber-400 rounded-t-xl transition-all duration-300"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[11px] font-bold text-gray-500">{day.period}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Popular Vehicle Makes & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Makes Demand */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-[#071A33] uppercase tracking-wider">
            Orders by Vehicle Manufacturer
          </h3>
          <div className="space-y-3">
            {Object.entries(makeCounts || {}).map(([mk, count]: any) => (
              <div key={mk} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-800">
                  <span>{mk}</span>
                  <span>{count} orders</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${Math.min(100, (count / (totalOrders || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-[#071A33] uppercase tracking-wider">
            Best-Selling Mat Specifications
          </h3>
          <div className="space-y-3">
            {topSellingProducts.map((p: any, idx: number) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <strong className="block text-gray-900">{p.name}</strong>
                  <span className="text-[11px] text-gray-400 font-mono">{p.sku}</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-[#071A33] block">£{p.revenue}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">{p.unitsSold} units</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
