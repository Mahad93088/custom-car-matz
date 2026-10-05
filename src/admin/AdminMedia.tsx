import React, { useState, useEffect } from 'react';
import { Image, Copy, Check, ExternalLink } from 'lucide-react';
import { api } from '../lib/api.ts';

export function AdminMedia() {
  const [media, setMedia] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    api.admin.getMedia().then(setMedia).catch(console.error);
  }, []);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#071A33] tracking-tight">Media & Asset Library</h1>
        <p className="text-xs text-gray-500">
          Curated high-resolution automotive imagery for products, carpet swatches, and blog articles.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {media.map(m => (
          <div key={m.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs space-y-3 p-3">
            <div className="aspect-16/10 bg-gray-900 rounded-xl overflow-hidden relative">
              <img src={m.url} alt={m.title} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#071A33]/90 text-amber-300 text-[10px] font-bold rounded">
                {m.tag}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-gray-900 truncate">{m.title}</h4>
              <p className="text-[11px] text-gray-400 font-mono truncate">{m.url}</p>
            </div>

            <button
              onClick={() => handleCopy(m.id, m.url)}
              className="w-full py-2 bg-gray-50 hover:bg-amber-50 text-gray-700 hover:text-amber-800 rounded-lg text-xs font-bold border border-gray-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedId === m.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied Image URL!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Asset URL</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
