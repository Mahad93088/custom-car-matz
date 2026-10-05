import React, { useState, useEffect } from 'react';
import { Car, Check, ChevronRight, X, Sparkles, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api.ts';
import { useVehicle } from '../context/VehicleContext.tsx';
import { VehicleMake, VehicleModel, VehicleYear, VehicleVariant } from '../types/index.ts';

interface VehicleSelectorProps {
  isModal?: boolean;
  onSelectComplete?: () => void;
}

export function VehicleSelector({ isModal = false, onSelectComplete }: VehicleSelectorProps) {
  const { setSelectedVehicle, closeSelectorModal, selectedVehicle } = useVehicle();

  const [makes, setMakes] = useState<VehicleMake[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [years, setYears] = useState<VehicleYear[]>([]);
  const [variants, setVariants] = useState<VehicleVariant[]>([]);

  const [selectedMakeId, setSelectedMakeId] = useState<string>(selectedVehicle?.makeId || '');
  const [selectedModelId, setSelectedModelId] = useState<string>(selectedVehicle?.modelId || '');
  const [selectedYearId, setSelectedYearId] = useState<string>(selectedVehicle?.yearId || '');
  const [selectedVariantId, setSelectedVariantId] = useState<string>(selectedVehicle?.variantId || '');

  const [regInput, setRegInput] = useState<string>('');
  const [regLoading, setRegLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Load makes
  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getMakes();
        setMakes(data);
      } catch (err) {
        console.error('Failed to load makes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // When make changes, load models
  useEffect(() => {
    if (!selectedMakeId) {
      setModels([]);
      setSelectedModelId('');
      return;
    }
    api.getModels(selectedMakeId).then(data => {
      setModels(data);
      if (!data.some(m => m.id === selectedModelId)) {
        setSelectedModelId('');
      }
    });
  }, [selectedMakeId]);

  // When model changes, load years and variants
  useEffect(() => {
    if (!selectedModelId) {
      setYears([]);
      setVariants([]);
      setSelectedYearId('');
      setSelectedVariantId('');
      return;
    }
    Promise.all([
      api.getYears(selectedModelId),
      api.getVariants(selectedModelId)
    ]).then(([yrData, varData]) => {
      setYears(yrData);
      setVariants(varData);
      if (yrData.length && !selectedYearId) setSelectedYearId(yrData[0].id);
      if (varData.length && !selectedVariantId) setSelectedVariantId(varData[0].id);
    });
  }, [selectedModelId]);

  // UK Reg Lookup Simulation
  const handleRegLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regInput.trim()) return;

    setRegLoading(true);
    setTimeout(() => {
      setRegLoading(false);
      const clean = regInput.trim().toUpperCase();
      // Match sample UK reg to demo models
      if (clean.includes('WP21') || clean.includes('BMW')) {
        setSelectedMakeId('make_bmw');
        setTimeout(() => setSelectedModelId('model_bmw_3'), 50);
      } else if (clean.includes('GU72') || clean.includes('MERC')) {
        setSelectedMakeId('make_mercedes');
        setTimeout(() => setSelectedModelId('model_merc_c'), 50);
      } else if (clean.includes('AUDI') || clean.includes('8Y')) {
        setSelectedMakeId('make_audi');
        setTimeout(() => setSelectedModelId('model_audi_a3'), 50);
      } else {
        // Default to BMW 3 Series
        setSelectedMakeId('make_bmw');
        setTimeout(() => setSelectedModelId('model_bmw_3'), 50);
      }
    }, 400);
  };

  const handleApply = () => {
    const make = makes.find(m => m.id === selectedMakeId);
    const model = models.find(m => m.id === selectedModelId);
    const year = years.find(y => y.id === selectedYearId);
    const variant = variants.find(v => v.id === selectedVariantId);

    if (!make || !model) return;

    setSelectedVehicle({
      makeId: make.id,
      makeName: make.name,
      modelId: model.id,
      modelName: model.name,
      yearId: year?.id,
      yearRange: year?.yearRange || 'All Years',
      variantId: variant?.id,
      variantName: variant?.name || 'Standard Fit',
      regNumber: regInput ? regInput.trim().toUpperCase() : undefined,
      clipType: variant?.clipType || 'OEM Twist-Lock'
    });

    if (isModal) {
      closeSelectorModal();
    }
    if (onSelectComplete) {
      onSelectComplete();
    }
  };

  const currentVariant = variants.find(v => v.id === selectedVariantId);

  const containerContent = (
    <div className={`bg-[#0B1320]/95 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] p-6 sm:p-7 text-white ${isModal ? 'max-w-xl w-full' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between pb-5 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400/15 text-amber-400 border border-amber-400/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Laser-Fit Guarantee • 3D CAD Scanned</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Find Your Car
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Select your exact vehicle or enter registration for millimetre-perfect floor mats.
          </p>
        </div>

        {isModal && (
          <button
            onClick={closeSelectorModal}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* UK Number Plate Fast Lookup */}
      <div className="py-4 border-b border-white/10">
        <form onSubmit={handleRegLookup} className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="w-full sm:flex-1 relative flex items-center bg-[#FDD017] text-black font-extrabold px-3 py-2.5 rounded-xl border-2 border-black/80 shadow-inner">
            <div className="flex items-center gap-1 mr-3 pr-2.5 border-r-2 border-black/30 text-[10px] tracking-tighter">
              <span>🇬🇧</span>
              <span className="font-black">UK</span>
            </div>
            <input
              type="text"
              placeholder="ENTER REG (e.g. WP21 XKL)"
              value={regInput}
              onChange={e => setRegInput(e.target.value.toUpperCase())}
              className="bg-transparent tracking-widest text-black placeholder-black/60 font-mono text-sm uppercase font-extrabold focus:outline-none w-full"
            />
          </div>
          <button
            type="submit"
            disabled={regLoading || !regInput.trim()}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#090D14] font-black rounded-xl text-xs transition-all shadow-md whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {regLoading ? 'Scanning CAD...' : 'Find by Reg'}
          </button>
        </form>
      </div>

      {/* Cascading Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-5 pb-3">
        {/* Step 1: Make */}
        <div>
          <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>1. Make</span>
            {selectedMakeId && <Check className="w-3 h-3 text-emerald-400" />}
          </label>
          <select
            value={selectedMakeId}
            onChange={e => setSelectedMakeId(e.target.value)}
            className="w-full bg-[#050811] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all"
          >
            <option value="">-- Choose Make --</option>
            {makes.map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Model */}
        <div>
          <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>2. Model</span>
            {selectedModelId && <Check className="w-3 h-3 text-emerald-400" />}
          </label>
          <select
            value={selectedModelId}
            disabled={!selectedMakeId}
            onChange={e => setSelectedModelId(e.target.value)}
            className="w-full bg-[#050811] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 disabled:opacity-40 transition-all"
          >
            <option value="">{selectedMakeId ? '-- Choose Model --' : 'Select Make First'}</option>
            {models.map(m => (
              <option key={m.id} value={m.id}>
                {m.name} {m.generation ? `(${m.generation})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Step 3: Year / Generation */}
        <div>
          <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>3. Year Range</span>
            {selectedYearId && <Check className="w-3 h-3 text-emerald-400" />}
          </label>
          <select
            value={selectedYearId}
            disabled={!selectedModelId}
            onChange={e => setSelectedYearId(e.target.value)}
            className="w-full bg-[#050811] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 disabled:opacity-40 transition-all"
          >
            <option value="">{selectedModelId ? '-- Choose Year --' : 'Select Model First'}</option>
            {years.map(y => (
              <option key={y.id} value={y.id}>
                {y.yearRange}
              </option>
            ))}
          </select>
        </div>

        {/* Step 4: Body Variant */}
        <div>
          <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>4. Body / Variant</span>
            {selectedVariantId && <Check className="w-3 h-3 text-emerald-400" />}
          </label>
          <select
            value={selectedVariantId}
            disabled={!selectedModelId}
            onChange={e => setSelectedVariantId(e.target.value)}
            className="w-full bg-[#050811] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 disabled:opacity-40 transition-all"
          >
            <option value="">{selectedModelId ? '-- Choose Variant --' : 'Select Model First'}</option>
            {variants.map(v => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* OEM Clips Notice */}
      {currentVariant && (
        <div className="bg-[#050811] border border-emerald-500/30 rounded-xl p-3 my-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-gray-300">
              Matched Floor Clips: <strong className="text-amber-400">{currentVariant.clipType}</strong>
            </span>
          </div>
          <span className="text-emerald-400 font-bold text-[11px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
            Included Free
          </span>
        </div>
      )}

      {/* Confirmation CTA */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 mt-2">
        <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>4,000+ UK 3D Laser CAD Profiles</span>
        </div>

        <button
          onClick={handleApply}
          disabled={!selectedMakeId || !selectedModelId}
          className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-[#090D14] font-black text-xs sm:text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Find My Mats</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        {containerContent}
      </div>
    );
  }

  return containerContent;
}
