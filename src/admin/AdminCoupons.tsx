import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api.ts';
import { Coupon } from '../types/index.ts';

export function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState('10');
  const [minSpend, setMinSpend] = useState('30');

  const fetchCoupons = async () => {
    try {
      const data = await api.admin.getCoupons();
      setCoupons(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    try {
      await api.admin.createCoupon({
        code: code.trim().toUpperCase(),
        discountType: type,
        discountValue: parseFloat(value),
        minSpend: minSpend ? parseFloat(minSpend) : undefined
      });
      setCode('');
      fetchCoupons();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete coupon?')) return;
    try {
      await api.admin.deleteCoupon(id);
      fetchCoupons();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#071A33] tracking-tight">Coupons & Promotional Discounts</h1>
        <p className="text-xs text-gray-500">
          Configure marketing discount codes for checkout basket validation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create form */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-[#071A33] uppercase text-[11px]">Generate New Coupon</h3>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. SPRING15"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border rounded-lg font-mono uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Discount Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="percentage">% Percentage</option>
                  <option value="fixed">£ Fixed Off</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Discount Value *</label>
                <input
                  type="number"
                  required
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Minimum Spend (£)</label>
              <input
                type="number"
                value={minSpend}
                onChange={e => setMinSpend(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#071A33] hover:bg-amber-400 hover:text-[#071A33] text-amber-300 font-bold rounded-xl transition-all shadow-sm"
            >
              + Create Promotional Code
            </button>
          </form>
        </div>

        {/* Existing Coupons Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-gray-500 uppercase font-bold text-[10px] tracking-wider border-b">
              <tr>
                <th className="p-3.5">Code</th>
                <th className="p-3.5">Benefit</th>
                <th className="p-3.5">Min Spend</th>
                <th className="p-3.5">Redemptions</th>
                <th className="p-3.5 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="p-3.5 font-bold font-mono text-[#071A33]">{c.code}</td>
                  <td className="p-3.5 font-semibold text-emerald-600">
                    {c.discountType === 'percentage' ? `${c.discountValue}% Off` : `£${c.discountValue.toFixed(2)} Off`}
                  </td>
                  <td className="p-3.5 text-gray-600">
                    {c.minSpend ? `£${c.minSpend.toFixed(2)}` : 'None'}
                  </td>
                  <td className="p-3.5 text-gray-700 font-medium">{c.usedCount} times</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
