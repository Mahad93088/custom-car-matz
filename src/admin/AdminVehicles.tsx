import React, { useState, useEffect } from 'react';
import { Car, Plus, Trash2, Edit2, ShieldCheck, ChevronRight } from 'lucide-react';
import { api } from '../lib/api.ts';
import { VehicleMake, VehicleModel, VehicleYear, VehicleVariant } from '../types/index.ts';

export function AdminVehicles() {
  const [data, setData] = useState<{
    makes: VehicleMake[];
    models: VehicleModel[];
    years: VehicleYear[];
    variants: VehicleVariant[];
  }>({ makes: [], models: [], years: [], variants: [] });

  const [loading, setLoading] = useState(true);
  const [activeMakeId, setActiveMakeId] = useState<string>('');

  // Make creation form
  const [newMakeName, setNewMakeName] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [newModelGeneration, setNewModelGeneration] = useState('');
  const [newVariantName, setNewVariantName] = useState('');
  const [newVariantClip, setNewVariantClip] = useState('OEM Twist-Lock');

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getVehicles();
      setData(res);
      if (res.makes?.length && !activeMakeId) {
        setActiveMakeId(res.makes[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAddMake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMakeName.trim()) return;
    try {
      const res = await api.admin.createMake({ name: newMakeName.trim(), popular: true });
      setNewMakeName('');
      fetchVehicles();
      setActiveMakeId(res.id);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteMake = async (id: string) => {
    if (!window.confirm('Delete this vehicle manufacturer and all associated models?')) return;
    try {
      await api.admin.deleteMake(id);
      fetchVehicles();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelName.trim() || !activeMakeId) return;
    try {
      await api.admin.createModel({
        makeId: activeMakeId,
        name: newModelName.trim(),
        generation: newModelGeneration.trim()
      });
      setNewModelName('');
      setNewModelGeneration('');
      fetchVehicles();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteModel = async (id: string) => {
    if (!window.confirm('Delete this model?')) return;
    try {
      await api.admin.deleteModel(id);
      fetchVehicles();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const currentModels = data.models.filter(m => m.makeId === activeMakeId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#071A33] tracking-tight">
          Vehicle Database & Fitment Patterns
        </h1>
        <p className="text-xs text-gray-500">
          Manage UK automotive makes, models, chassis codes, and factory floor retention clip types.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Makes List */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#071A33]">
            1. Vehicle Manufacturers ({data.makes.length})
          </h3>

          <form onSubmit={handleAddMake} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Porsche, Jaguar..."
              value={newMakeName}
              onChange={e => setNewMakeName(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-xs focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-[#071A33] text-amber-400 font-bold text-xs rounded-lg hover:bg-amber-400 hover:text-[#071A33]"
            >
              Add
            </button>
          </form>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {data.makes.map(m => (
              <div
                key={m.id}
                onClick={() => setActiveMakeId(m.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                  activeMakeId === m.id
                    ? 'bg-[#071A33] text-white font-bold shadow-xs'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Car className="w-3.5 h-3.5 text-amber-400" />
                  <span>{m.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400">
                    {data.models.filter(mod => mod.makeId === m.id).length} models
                  </span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteMake(m.id);
                    }}
                    className="p-1 text-red-400 hover:text-red-600"
                    title="Delete Make"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Models & Variants for Active Make */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <span className="text-xs uppercase font-extrabold text-amber-600">Active Make</span>
              <h2 className="text-xl font-extrabold text-[#071A33]">
                {data.makes.find(m => m.id === activeMakeId)?.name || 'Select Make'} Models & Clip Types
              </h2>
            </div>
          </div>

          {/* Add Model Form */}
          <form onSubmit={handleAddModel} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Model Name</label>
              <input
                type="text"
                placeholder="e.g. 4 Series Gran Coupe"
                value={newModelName}
                onChange={e => setNewModelName(e.target.value)}
                className="w-full px-3 py-2 bg-white border rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Generation / Chassis</label>
              <input
                type="text"
                placeholder="e.g. G26 / F36"
                value={newModelGeneration}
                onChange={e => setNewModelGeneration(e.target.value)}
                className="w-full px-3 py-2 bg-white border rounded-lg text-xs"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-[#071A33] text-amber-400 font-bold text-xs rounded-lg hover:bg-amber-400 hover:text-[#071A33] h-[35px]"
              >
                + Add Model
              </button>
            </div>
          </form>

          {/* Models Table */}
          <div className="space-y-3">
            {currentModels.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-6 text-center">
                No models registered under this make yet. Add one above.
              </p>
            ) : (
              currentModels.map(mod => {
                const variants = data.variants.filter(v => v.modelId === mod.id);
                return (
                  <div
                    key={mod.id}
                    className="p-4 rounded-xl border border-gray-200 bg-[#F5F7FA] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm text-[#071A33]">{mod.name}</strong>
                        {mod.generation && (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-white text-gray-600 border border-gray-200 font-mono">
                            {mod.generation}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteModel(mod.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete Model"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {variants.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {variants.map(v => (
                          <span
                            key={v.id}
                            className="inline-flex items-center gap-1 text-[11px] bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-700"
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            <span>{v.name}: <strong className="text-amber-700">{v.clipType}</strong></span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
