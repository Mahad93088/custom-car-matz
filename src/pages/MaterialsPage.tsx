import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Award, Sparkles, Layers } from 'lucide-react';
import { api } from '../lib/api.ts';
import { MaterialOption } from '../types/index.ts';
import { SEOHead } from '../components/SEOHead.tsx';

interface MaterialsPageProps {
  setCurrentTab: (tab: string, param?: string) => void;
}

export function MaterialsPage({ setCurrentTab }: MaterialsPageProps) {
  const [materials, setMaterials] = useState<MaterialOption[]>([]);

  useEffect(() => {
    api.getMaterials().then(setMaterials).catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <SEOHead
        title="Car Mat Materials Guide | Luxury Deep Pile, Velour & Rubber"
        description="Explore our automotive material grades: 650g/m² Standard Tufted, 850g/m² Luxury Deep Pile, 1200g/m² Prestige Velour, and 3mm All-Weather Heavy-Duty Rubber."
        canonicalPath="/materials"
      />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600">
          Automotive Upholstery Standards
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#071A33] tracking-tight">
          British Craftsmanship Materials Guide
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          We source high-tenacity yarn, virgin vulcanised rubber, and memory-foam composites to ensure our tailored mats surpass factory original standards.
        </p>
      </div>

      {/* Materials Detailed Grid */}
      <div className="space-y-12">
        {materials.map((mat, idx) => (
          <div
            key={mat.id}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            <div className={`lg:col-span-6 aspect-16/10 rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
              <img src={mat.imageUrl} alt={mat.name} className="w-full h-full object-cover" />
            </div>

            <div className={`lg:col-span-6 space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#071A33] text-amber-400 text-xs font-extrabold rounded-lg">
                  {mat.weightGsm} g/m² Density
                </span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg">
                  {mat.durability}
                </span>
              </div>

              <h2 className="text-2xl font-extrabold text-[#071A33]">{mat.name}</h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {mat.description}
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Price Tier</span>
                  <p className="text-sm font-bold text-[#071A33]">
                    {mat.priceModifier === 0 ? 'Standard Grade Base Price' : `+£${mat.priceModifier.toFixed(2)} Upgrade`}
                  </p>
                </div>

                <button
                  onClick={() => setCurrentTab('shop')}
                  className="px-5 py-2.5 bg-[#071A33] hover:bg-amber-400 hover:text-[#071A33] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  Shop This Material
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
