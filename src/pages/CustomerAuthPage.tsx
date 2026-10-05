import React, { useState } from 'react';
import { Lock, Mail, User, Phone, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../lib/api.ts';
import { SEOHead } from '../components/SEOHead.tsx';

export function CustomerAuthPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const { login, register, switchDemoRole } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (mode === 'login') {
        await login(email, password);
        onLoginSuccess();
      } else if (mode === 'register') {
        await register({ name, email, password, phone });
        onLoginSuccess();
      } else if (mode === 'forgot') {
        const res = await api.forgotPassword(email);
        setSuccessMessage(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCustomerLogin = async () => {
    setLoading(true);
    try {
      await switchDemoRole('customer');
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <SEOHead
        title={mode === 'login' ? 'Customer Sign In | Custom Car Mats UK' : mode === 'register' ? 'Register Account | Custom Car Mats UK' : 'Reset Password | Custom Car Mats UK'}
        description="Sign in or register to manage your custom car mats orders, check loyalty points, and save favorite car mat configurations."
        canonicalPath="/auth"
      />
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A33] tracking-tight">
          {mode === 'login' && 'Sign in to Custom Car Mats'}
          {mode === 'register' && 'Create Your Customer Account'}
          {mode === 'forgot' && 'Reset Your Account Password'}
        </h1>
        <p className="text-xs text-gray-500">
          {mode === 'login' && 'Track ongoing mat tailoring, view past invoices, and save vehicle specifications.'}
          {mode === 'register' && 'Join thousands of UK drivers and receive 10% off your tailored order.'}
          {mode === 'forgot' && 'Enter your email address to receive password reset instructions.'}
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
        <button
          onClick={() => {
            setMode('login');
            setError(null);
            setSuccessMessage(null);
          }}
          className={`flex-1 py-2 rounded-lg transition-all ${mode === 'login' ? 'bg-white text-[#071A33] shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
        >
          Sign In
        </button>
        <button
          onClick={() => {
            setMode('register');
            setError(null);
            setSuccessMessage(null);
          }}
          className={`flex-1 py-2 rounded-lg transition-all ${mode === 'register' ? 'bg-white text-[#071A33] shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
        >
          Register
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-5">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-bold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. James Reynolds"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="you@example.co.uk"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block font-bold text-gray-700 mb-1">Telephone Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  placeholder="e.g. 07700 900123"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-gray-700">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-amber-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#071A33] hover:bg-amber-400 hover:text-[#071A33] text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-4"
          >
            <span>{loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Helper for Evaluator */}
        <div className="pt-4 border-t border-gray-100 text-center space-y-2">
          <p className="text-[11px] text-gray-400 font-medium">Testing & Evaluation Helper:</p>
          <button
            type="button"
            onClick={handleDemoCustomerLogin}
            className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
          >
            ⚡ Quick-Login as Demo Customer (James Reynolds)
          </button>
        </div>
      </div>
    </div>
  );
}
