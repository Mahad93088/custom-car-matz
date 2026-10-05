import React, { useState, useEffect } from 'react';
import { Mail, Check, Trash2, Clock, Phone, Car } from 'lucide-react';
import { api } from '../lib/api.ts';
import { ContactMessage } from '../types/index.ts';

export function AdminContacts() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getContacts();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'read' | 'replied') => {
    try {
      await api.admin.updateContact(id, status);
      fetchContacts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete message?')) return;
    try {
      await api.admin.deleteContact(id);
      fetchContacts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#071A33] tracking-tight">Customer Enquiries & Inbox</h1>
        <p className="text-xs text-gray-500">
          Inbound fitment requests and customer questions submitted via the public contact form.
        </p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-white p-12 text-center text-xs text-gray-400 rounded-2xl border">
            Your support inbox is clear. No customer messages.
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`p-6 rounded-2xl border transition-all space-y-3 ${
                msg.status === 'unread' ? 'bg-amber-50/50 border-amber-300 shadow-sm' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      msg.status === 'unread' ? 'bg-amber-500 animate-pulse' : 'bg-gray-300'
                    }`}
                  />
                  <div>
                    <strong className="text-sm font-bold text-gray-900">{msg.name}</strong>
                    <span className="text-xs text-gray-500 ml-2">({msg.email})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {msg.vehicleReg && (
                    <span className="px-2 py-0.5 bg-yellow-200 text-black font-mono font-bold rounded border border-black/20 text-[11px]">
                      REG: {msg.vehicleReg}
                    </span>
                  )}
                  <span className="text-gray-400">
                    {new Date(msg.createdAt).toLocaleString('en-GB')}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#071A33] mb-1">Subject: {msg.subject}</h4>
                <p className="text-xs text-gray-700 leading-relaxed bg-[#F5F7FA] p-3.5 rounded-xl border border-gray-200">
                  {msg.message}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Status: <strong className="uppercase font-bold text-gray-800">{msg.status}</strong></span>
                  {msg.phone && (
                    <span className="text-gray-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-amber-500" />
                      {msg.phone}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {msg.status !== 'replied' && (
                    <button
                      onClick={() => handleUpdateStatus(msg.id, 'replied')}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-xs hover:bg-emerald-500"
                    >
                      Mark as Replied
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
