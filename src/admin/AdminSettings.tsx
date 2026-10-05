import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, CreditCard, Save } from 'lucide-react';
import { api } from '../lib/api.ts';
import { StoreSettings } from '../types/index.ts';

export function AdminSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.admin.getSettings().then(setSettings).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const updated = await api.admin.updateSettings(settings);
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading || !settings) {
    return <div className="p-8 text-center text-xs text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#071A33] tracking-tight">Store Settings & Parameters</h1>
        <p className="text-xs text-gray-500">
          UK VAT percentages, free delivery thresholds, contact phone, and payment gateway configuration.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6 text-xs">
        {saved && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg">
            Store settings saved to database successfully.
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-extrabold text-[#071A33] uppercase text-[11px] tracking-wider border-b pb-2">
            1. UK Business & Legal Registration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Store Brand Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={e => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Support Freephone</label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={e => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Company Reg Number</label>
              <input
                type="text"
                value={settings.companyNumber}
                onChange={e => setSettings({ ...settings, companyNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">UK VAT Registration Number</label>
              <input
                type="text"
                value={settings.vatNumber}
                onChange={e => setSettings({ ...settings, vatNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-extrabold text-[#071A33] uppercase text-[11px] tracking-wider border-b pb-2">
            2. Financial & Delivery Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Standard UK VAT Rate (%)</label>
              <input
                type="number"
                value={settings.vatRatePercentage}
                onChange={e => setSettings({ ...settings, vatRatePercentage: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Free Delivery Threshold (£)</label>
              <input
                type="number"
                step="0.01"
                value={settings.freeShippingThreshold}
                onChange={e => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Royal Mail 48 Standard (£)</label>
              <input
                type="number"
                step="0.01"
                value={settings.standardShippingFee}
                onChange={e => setSettings({ ...settings, standardShippingFee: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 font-bold"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-extrabold text-[#071A33] uppercase text-[11px] tracking-wider border-b pb-2">
            3. Stripe Payment Gateway Architecture
          </h3>

          <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <div>
                <strong className="text-emerald-900 block text-xs">Stripe API Ready & Secure</strong>
                <p className="text-[11px] text-emerald-700">
                  Credentials managed server-side. Zero sensitive client keys exposed. Supports 3D Secure, Apple Pay, and Google Pay.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-600 text-white font-extrabold text-[10px] rounded-lg">
              ACTIVE
            </span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#071A33] hover:bg-amber-400 hover:text-[#071A33] text-amber-400 font-extrabold rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Parameters</span>
          </button>
        </div>
      </form>
    </div>
  );
}
