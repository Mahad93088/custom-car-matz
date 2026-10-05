import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Sparkles, Gift, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api.ts';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setFeedback('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setFeedback(null);

    try {
      const res = await api.subscribeNewsletter(email.trim());
      setStatus('success');
      setFeedback(res.message || 'Welcome to the Custom Car Mats VIP Club!');
      setVoucherCode('WELCOME10');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setFeedback(err.message || 'Subscription could not be processed. Please try again.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#071A33] via-[#0B2344] to-[#040D1A] border border-[#1D3B63] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Heading and Value Proposition */}
        <div className="lg:col-span-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5" />
            <span>VIP Club • Exclusive 10% Discount</span>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Join the Custom Car Mats Club
          </h3>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-lg">
            Subscribe for your instant <strong className="text-amber-400 font-semibold">10% discount voucher</strong>, seasonal carpet & rubber maintenance guides, and private vehicle releases stored securely for UK campaigns.
          </p>

          <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-1">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Zero spam guarantee
            </span>
            <span>•</span>
            <span>Unsubscribe with 1 click anytime</span>
          </div>
        </div>

        {/* Right Column: Form and Feedback */}
        <div className="lg:col-span-6">
          {status === 'success' ? (
            <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-6 text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">You&apos;re On the VIP List!</h4>
              <p className="text-xs text-emerald-200">
                {feedback}
              </p>
              {voucherCode && (
                <div className="bg-[#040D1A] border border-amber-400/40 rounded-xl p-3 max-w-xs mx-auto">
                  <span className="text-[10px] text-gray-400 uppercase block tracking-wider font-bold">Your Checkout Voucher:</span>
                  <span className="text-base font-extrabold font-mono text-amber-400 tracking-wider">{voucherCode}</span>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your UK email (e.g. driver@example.co.uk)"
                    className="w-full pl-10 pr-4 py-3.5 bg-[#040D1A] border border-[#1D3B63] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 shadow-inner"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="py-3.5 px-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-[#071A33] font-extrabold text-xs rounded-xl transition-all shadow-xl hover:shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 flex-shrink-0"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#071A33] border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>Get 10% Off Code</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && feedback && (
                <div className="p-2.5 bg-red-950/70 border border-red-500/50 rounded-xl flex items-center gap-2 text-xs text-red-200">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <span>{feedback}</span>
                </div>
              )}

              <p className="text-[10px] text-gray-500">
                By subscribing you agree to receive tailored product offers in accordance with our UK GDPR Privacy Policy.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
