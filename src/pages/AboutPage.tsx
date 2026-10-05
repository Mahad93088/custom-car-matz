import React from 'react';
import { Award, ShieldCheck, Truck, Users, CheckCircle2 } from 'lucide-react';
import { SEOHead } from '../components/SEOHead.tsx';

export function AboutPage({ setCurrentTab }: { setCurrentTab: (tab: string, param?: string) => void }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <SEOHead
        title="About Us | British Master Car Mat Trimmers"
        description="Learn about Custom Car Mats UK in Coventry, West Midlands. Handcrafting bespoke, laser-measured car mats for over 4,000 UK vehicle models since 2018."
        canonicalPath="/about"
      />
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600">
          Coventry, West Midlands • British Automotive Heritage
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#071A33] tracking-tight">
          About Custom Car Mats
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Crafting bespoke, millimetre-accurate automotive floor protection for discerning British motorists since 2018.
        </p>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-sm">
        <div className="space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <h2 className="text-2xl font-extrabold text-[#071A33]">
            Engineered for Precision, Handcrafted with Pride
          </h2>
          <p>
            Located in the heart of the West Midlands—the historic heartbeat of the British motor industry—**Custom Car Mats** was founded on a simple premise: your car floor deserves protection that matches the precision engineering of your vehicle.
          </p>
          <p>
            Unlike mass-produced supermarket mats that slide uncontrollably under pedals, every single set we produce is custom CAD cut from physical 3D optical scans of genuine UK right-hand-drive vehicles.
          </p>
          <p>
            From our entry-level 650g/m² tufted carpets to our opulent 1200g/m² Prestige Executive Velour and heavy-duty 3mm virgin rubber, our materials are rigorously tested to resist British winters, countryside mud, and daily commuter wear.
          </p>

          <div className="pt-2 grid grid-cols-2 gap-4">
            <div className="bg-[#F5F7FA] p-4 rounded-xl border border-gray-200">
              <span className="text-2xl font-extrabold text-[#071A33]">4,000+</span>
              <p className="text-[11px] text-gray-500 font-semibold mt-0.5">UK Vehicle Patterns</p>
            </div>
            <div className="bg-[#F5F7FA] p-4 rounded-xl border border-gray-200">
              <span className="text-2xl font-extrabold text-[#071A33]">100%</span>
              <p className="text-[11px] text-gray-500 font-semibold mt-0.5">Fitment Guarantee</p>
            </div>
          </div>
        </div>

        <div className="aspect-4/3 rounded-2xl overflow-hidden bg-gray-950 border border-gray-200 shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1000&auto=format&fit=crop&q=80"
            alt="British Automotive Workshop"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3">
          <Award className="w-8 h-8 text-amber-500" />
          <h3 className="text-base font-bold text-[#071A33]">British Manufacturing</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            We support British industry by employing experienced upholsterers and master trimmers in our Coventry facility.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3">
          <ShieldCheck className="w-8 h-8 text-emerald-500" />
          <h3 className="text-base font-bold text-[#071A33]">Road Safety First</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Mat slippage is an MOT hazard. Every set includes OEM-matching twist pegs or snap pins to anchor mats safely to factory floor studs.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-3">
          <Truck className="w-8 h-8 text-amber-500" />
          <h3 className="text-base font-bold text-[#071A33]">Direct Factory Delivery</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            By tailoring directly to order and shipping straight from our workshop floor, we eliminate middleman retail markups.
          </p>
        </div>
      </div>
    </div>
  );
}
