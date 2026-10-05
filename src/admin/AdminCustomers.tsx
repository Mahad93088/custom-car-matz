import React, { useState, useEffect } from 'react';
import { Users, Search, ShoppingCart, Mail, Phone, Calendar, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api.ts';

export function AdminCustomers() {
  const [activeTab, setActiveTab] = useState<'customers' | 'newsletter'>('customers');
  const [customers, setCustomers] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [custData, subData] = await Promise.all([
          api.admin.getCustomers(),
          api.admin.getNewsletterSubscribers().catch(() => [])
        ]);
        setCustomers(custData || []);
        setSubscribers(subData || []);
      } catch (err) {
        console.error('Failed to load admin customer data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportEmails = () => {
    const list = activeTab === 'customers'
      ? customers.map(c => c.email)
      : subscribers.map(s => s.email);
    navigator.clipboard.writeText(list.join('\n'));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#071A33] tracking-tight">Customer & Marketing Directory</h1>
          <p className="text-xs text-gray-500">
            Registered customer accounts, order histories, and newsletter VIP subscribers captured for marketing campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportEmails}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#071A33] hover:bg-[#0D2A4A] text-amber-400 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            title="Copy email addresses to clipboard for campaign tools"
          >
            {copySuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export Emails ({activeTab === 'customers' ? customers.length : subscribers.length})</span>
              </>
            )}
          </button>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'customers'
              ? 'border-amber-500 text-[#071A33]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Customer Accounts ({customers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('newsletter')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'newsletter'
              ? 'border-amber-500 text-[#071A33]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Newsletter VIP Subscribers ({subscribers.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-gray-500 bg-white rounded-2xl border">
          Loading directory records...
        </div>
      ) : activeTab === 'customers' ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-gray-500 uppercase font-bold text-[10px] tracking-wider border-b">
              <tr>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Contact Details</th>
                <th className="p-3.5">Orders Placed</th>
                <th className="p-3.5">Lifetime Spend</th>
                <th className="p-3.5">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No registered customers found matching &ldquo;{search}&rdquo;.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <strong className="block text-gray-900">{c.name}</strong>
                          <span className="text-[10px] text-gray-400">ID: {c.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="block text-gray-800">{c.email}</span>
                      <span className="text-[11px] text-gray-500">{c.phone || 'No phone'}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-md">
                        {c.ordersCount} orders
                      </span>
                    </td>
                    <td className="p-3.5 font-extrabold text-[#071A33] text-sm">
                      £{c.totalSpent.toFixed(2)}
                    </td>
                    <td className="p-3.5 text-gray-500">
                      {new Date(c.createdAt).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-gray-500 uppercase font-bold text-[10px] tracking-wider border-b">
              <tr>
                <th className="p-3.5">Subscriber Email</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Campaign Opt-in</th>
                <th className="p-3.5">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">
                    No newsletter subscribers found.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="p-3.5 font-medium text-gray-900 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-amber-500" />
                      <span>{s.email}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-500">
                      VIP Club 10% Welcome Promo
                    </td>
                    <td className="p-3.5 text-gray-500">
                      {new Date(s.subscribedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
