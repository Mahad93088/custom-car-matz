import React, { useState, useEffect } from 'react';
import { UserCog, Plus, ShieldCheck, Mail, Phone, Lock, X } from 'lucide-react';
import { api } from '../lib/api.ts';
import { User } from '../types/index.ts';

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'super_admin' | 'admin' | 'content_manager' | 'order_manager'>('admin');
  const [phone, setPhone] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.createUser({ name, email, password, role, phone });
      setIsAdding(false);
      setName('');
      setEmail('');
      setPassword('');
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Creation failed');
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.admin.updateUserRole(userId, newRole);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const roleDescriptions: Record<string, string> = {
    super_admin: 'Full unrestricted system access across all CMS, store, and role settings',
    admin: 'Operational CMS control over products, vehicles, orders, and content',
    order_manager: 'Fulfillment operations: orders, status updates, couriers, and customer support',
    content_manager: 'Editorial control: blog guides, CMS policy pages, media, and reviews',
    customer: 'Standard public retail customer'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#071A33] tracking-tight">Staff Roles & Permissions</h1>
          <p className="text-xs text-gray-500">
            Enforce role-based access control (RBAC) across private CMS operations.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#071A33] hover:bg-amber-400 hover:text-[#071A33] text-white font-bold text-xs rounded-xl shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl border-2 border-amber-400 shadow-xl space-y-4 text-xs">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-bold text-sm text-[#071A33]">Add Staff Account</h3>
            <button type="button" onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Company Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Assigned Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 font-bold"
              >
                <option value="super_admin">Super Admin (Full Access)</option>
                <option value="admin">Admin (CMS & Products)</option>
                <option value="order_manager">Order Manager (Fulfillment & Tracking)</option>
                <option value="content_manager">Content Manager (Blog & Pages)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-gray-100 rounded-lg font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#071A33] text-amber-400 font-bold rounded-lg hover:bg-amber-400 hover:text-[#071A33]"
            >
              Create Staff Account
            </button>
          </div>
        </form>
      )}

      {/* Users List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5F7FA] text-gray-500 uppercase font-bold text-[10px] tracking-wider border-b">
            <tr>
              <th className="p-3.5">User</th>
              <th className="p-3.5">Assigned Role</th>
              <th className="p-3.5">Permissions Summary</th>
              <th className="p-3.5 text-right">Role Modifier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#071A33] text-amber-400 font-bold flex items-center justify-center text-xs">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <strong className="block text-gray-900">{u.name}</strong>
                      <span className="text-[11px] text-gray-400">{u.email}</span>
                    </div>
                  </div>
                </td>
                <td className="p-3.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      u.role === 'super_admin'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : u.role === 'order_manager'
                        ? 'bg-blue-100 text-blue-900'
                        : u.role === 'content_manager'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {u.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-3.5 text-gray-600 max-w-sm leading-relaxed">
                  {roleDescriptions[u.role] || 'Standard privileges'}
                </td>
                <td className="p-3.5 text-right">
                  <select
                    value={u.role}
                    onChange={e => handleRoleChange(u.id, e.target.value)}
                    className="px-2 py-1 bg-gray-50 border rounded-lg text-xs font-bold text-gray-800"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="order_manager">Order Manager</option>
                    <option value="content_manager">Content Manager</option>
                    <option value="customer">Demote to Customer</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
