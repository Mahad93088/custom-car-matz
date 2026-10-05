import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

export function CookieBanner({ onOpenPrivacy }: { onOpenPrivacy: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('custom_car_mats_cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('custom_car_mats_cookie_consent', 'accepted');
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem('custom_car_mats_cookie_consent', 'essential_only');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-[#040D1A] border border-[#1D3B63] rounded-2xl p-5 shadow-2xl text-white animate-slideUp">
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Cookie & Privacy Preferences (UK GDPR)
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed">
            We use essential cookies to maintain your shopping basket, vehicle preferences, and secure Stripe payment processing.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={accept}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#071A33] text-xs font-bold rounded-lg transition-colors"
            >
              Accept All
            </button>
            <button
              onClick={decline}
              className="px-3.5 py-1.5 bg-[#0D2A4A] hover:bg-[#153B66] text-gray-300 text-xs font-semibold rounded-lg transition-colors"
            >
              Essential Only
            </button>
            <button
              onClick={onOpenPrivacy}
              className="text-[11px] text-gray-400 underline hover:text-white ml-auto"
            >
              Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
