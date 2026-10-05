import React, { useState, useEffect } from 'react';
import { ShieldAlert, Search, Clock, UserCheck } from 'lucide-react';
import { api } from '../lib/api.ts';
import { AuditLog } from '../types/index.ts';

export function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.admin.getAuditLogs().then(setLogs).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter(l =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.adminName.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#071A33] tracking-tight">System Security & Audit Trail</h1>
          <p className="text-xs text-gray-500">
            Immutable staff action log tracking price edits, status transitions, and role privileges.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search action or staff member..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5F7FA] text-gray-500 uppercase font-bold text-[10px] tracking-wider border-b">
            <tr>
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">Staff Operator</th>
              <th className="p-3.5">Event Action</th>
              <th className="p-3.5">Entity / Record</th>
              <th className="p-3.5">Log Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(log => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="p-3.5 text-gray-400 font-mono text-[11px] whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString('en-GB')}
                </td>
                <td className="p-3.5">
                  <strong className="block text-gray-900">{log.adminName}</strong>
                  <span className="text-[10px] text-gray-400">{log.adminEmail}</span>
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded bg-gray-100 font-mono font-bold text-[10px] text-gray-800">
                    {log.action}
                  </span>
                </td>
                <td className="p-3.5 text-gray-600 font-semibold">{log.entityType}</td>
                <td className="p-3.5 text-gray-700 leading-relaxed max-w-md">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
