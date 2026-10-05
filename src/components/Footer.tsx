import React, { useState } from 'react';
import { Car, Mail, Phone, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api.ts';
import { NewsletterSignup } from './NewsletterSignup.tsx';

interface FooterProps {
  setCurrentTab: (tab: string, param?: string) => void;
  onOpenAdminLogin: () => void;
}

export function Footer({ setCurrentTab, onOpenAdminLogin }: FooterProps) {
  return (
    <footer className="bg-[#040D1A] text-gray-300 border-t border-[#0D2A4A] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter VIP Signup Component */}
        <div className="mb-14">
          <NewsletterSignup />
        </div>

        {/* Top Feature Badges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-[#0D2A4A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#071A33] border border-amber-400/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Fitment Guarantee</h4>
              <p className="text-xs text-gray-400">Laser-scanned UK CAD patterns</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#071A33] border border-amber-400/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <span className="text-lg">🇬🇧</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Handcrafted in the UK</h4>
              <p className="text-xs text-gray-400">West Midlands master trimmers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#071A33] border border-amber-400/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">0800 488 0244</h4>
              <p className="text-xs text-gray-400">UK Freephone Mon-Fri 8am-6pm</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#071A33] border border-amber-400/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">2-Year Guarantee</h4>
              <p className="text-xs text-gray-400">Up to 5 years on Prestige Velour</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-[#0D2A4A]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#071A33] border border-amber-400/40 flex items-center justify-center">
                <Car className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">CUSTOM CAR MATS</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              The United Kingdom&apos;s specialist manufacturer of tailored car floor mats. Precision laser-cut to OEM specifications for over 4,000 UK vehicle models, featuring premium deep pile carpet, heavy-duty vulcanised rubber, and authentic floor retention clips.
            </p>
            <div className="text-xs text-gray-400 space-y-1.5 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Unit 7, Apex Automotive Centre, Coventry, West Midlands, CV3 4GB</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a href="mailto:support@customcarmats.co.uk" className="hover:text-amber-400">support@customcarmats.co.uk</a>
              </div>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-amber-400 mb-4">Shop Products</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <button onClick={() => setCurrentTab('shop')} className="hover:text-white transition-colors">
                  All Tailored Car Mats
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('materials')} className="hover:text-white transition-colors">
                  Luxury Deep Pile (850g)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('materials')} className="hover:text-white transition-colors">
                  Prestige Executive Velour (1200g)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('materials')} className="hover:text-white transition-colors">
                  All-Weather Heavy Duty Rubber
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('materials')} className="hover:text-white transition-colors">
                  Diamond Quilted Cabin Sets
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('shop')} className="hover:text-white transition-colors">
                  Tailored Boot Liners
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-amber-400 mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <button onClick={() => setCurrentTab('track')} className="text-amber-400 font-semibold hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <span>Track My Order</span>
                  <span className="text-[10px] bg-amber-400/20 px-1.5 py-0.5 rounded text-amber-300 font-mono">Live</span>
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('page', 'shipping-delivery')} className="hover:text-white transition-colors">
                  UK Delivery & Tracking
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('page', 'returns-guarantee')} className="hover:text-white transition-colors">
                  Returns & Fitment Guarantee
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('faq')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('contact')} className="hover:text-white transition-colors">
                  Contact Automotive Specialists
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('reviews')} className="hover:text-white transition-colors">
                  Verified Customer Reviews
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('account')} className="hover:text-white transition-colors">
                  Track Existing Order
                </button>
              </li>
            </ul>
          </div>

          {/* VIP Club & Offers */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-amber-400 mb-4">VIP Club & Offers</h4>
            <p className="text-xs text-gray-400 mb-3">
              Join thousands of UK drivers receiving seasonal vehicle care advice and exclusive discount releases.
            </p>
            <div className="p-3 bg-[#071A33] border border-[#1D3B63] rounded-xl space-y-1.5">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Special Offer</span>
              <p className="text-xs text-white font-medium">Use code <strong className="text-amber-400 font-mono">WELCOME10</strong> for 10% off your tailored order.</p>
            </div>
          </div>
        </div>

        {/* Bottom Legal, VAT, and Payment Badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            <p>© {new Date().getFullYear()} Custom Car Mats UK Ltd. All rights reserved.</p>
            <p className="text-[11px] text-gray-600 mt-0.5">
              Registered in England & Wales: 11928472 | VAT Registration: GB 342 9812 04
            </p>
          </div>

          {/* Payment & Security Logos */}
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-[#071A33] border border-[#1D3B63] rounded text-[11px] text-gray-400 font-semibold">
              Stripe 256-bit
            </span>
            <span className="px-2 py-1 bg-[#071A33] border border-[#1D3B63] rounded text-[11px] text-gray-400 font-semibold">
              Apple Pay
            </span>
            <span className="px-2 py-1 bg-[#071A33] border border-[#1D3B63] rounded text-[11px] text-gray-400 font-semibold">
              Google Pay
            </span>
            <span className="px-2 py-1 bg-[#071A33] border border-[#1D3B63] rounded text-[11px] text-gray-400 font-semibold">
              Visa / MC
            </span>
          </div>

          {/* Legal Links & Staff Portal */}
          <div className="flex items-center gap-4 text-xs">
            <button onClick={() => setCurrentTab('page', 'terms-conditions')} className="hover:text-gray-400">
              Terms
            </button>
            <button onClick={() => setCurrentTab('page', 'privacy-policy')} className="hover:text-gray-400">
              Privacy
            </button>
            <button onClick={onOpenAdminLogin} className="text-gray-600 hover:text-gray-400 transition-colors">
              Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
