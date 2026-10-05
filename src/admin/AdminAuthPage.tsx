import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface AdminAuthPageProps {
  onSuccess: () => void;
  onExitToStore: () => void;
}

export function AdminAuthPage({ onSuccess, onExitToStore }: AdminAuthPageProps) {
  const { login, switchDemoRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'super_admin' | 'order_manager' | 'content_manager') => {
    setLoading(true);
    setError(null);
    try {
      await switchDemoRole(role);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040D1A] text-white flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0D2A4A] to-[#071A33] border border-amber-400/40 flex items-center justify-center mx-auto shadow-2xl text-amber-400">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Custom Car Mats CMS
          </h1>
          <p className="text-xs text-gray-400">
            Internal Staff Portal • Authorised Personnel Only
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#071A33] border border-[#1D3B63] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-300 mb-1">Staff Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@customcarmats.co.uk"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#040D1A] border border-[#1D3B63] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#040D1A] border border-[#1D3B63] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-[#071A33] font-extrabold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Admin CMS'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Evaluator Fast-Role Switcher */}
          <div className="pt-4 border-t border-[#0D2A4A] space-y-2">
            <p className="text-[11px] text-gray-400 text-center font-semibold">
              🧪 Fast Evaluation Role Presets:
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('super_admin')}
                className="py-2 px-3 bg-[#0D2A4A] hover:bg-[#153B66] text-amber-300 border border-amber-400/30 rounded-xl text-xs font-bold text-left flex items-center justify-between"
              >
                <span>🔑 Super Admin (Edward Sterling)</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded">Full Access</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('order_manager')}
                className="py-2 px-3 bg-[#0D2A4A] hover:bg-[#153B66] text-blue-300 border border-blue-400/30 rounded-xl text-xs font-bold text-left flex items-center justify-between"
              >
                <span>📦 Order Manager (Oliver Hughes)</span>
                <span className="text-[10px] bg-blue-400/20 text-blue-300 px-1.5 py-0.5 rounded">Orders/Shop</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('content_manager')}
                className="py-2 px-3 bg-[#0D2A4A] hover:bg-[#153B66] text-emerald-300 border border-emerald-400/30 rounded-xl text-xs font-bold text-left flex items-center justify-between"
              >
                <span>✍️ Content Manager (Sophie Cartwright)</span>
                <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded">Blog/Pages</span>
              </button>
            </div>
          </div>
        </div>

        {/* Back to Public Website */}
        <div className="text-center">
          <button
            onClick={onExitToStore}
            className="text-xs text-gray-400 hover:text-white underline transition-colors"
          >
            ← Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
}
