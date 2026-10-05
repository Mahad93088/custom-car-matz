import React, { useState, useEffect } from 'react';
import { FileText, Edit2, Check, X, Eye } from 'lucide-react';
import { api } from '../lib/api.ts';
import { CmsPage } from '../types/index.ts';

export function AdminPages() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<CmsPage | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchPages = async () => {
    try {
      const data = await api.admin.getPages();
      setPages(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleSelect = (p: CmsPage) => {
    setSelectedPage(p);
    setTitle(p.title);
    setContent(p.content);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) return;
    setSaving(true);
    try {
      await api.admin.updatePage(selectedPage.id, { title, content });
      alert(`Page '${title}' updated successfully. Changes are now live on public website.`);
      setSelectedPage(null);
      fetchPages();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#071A33] tracking-tight">CMS Content & Policy Pages</h1>
        <p className="text-xs text-gray-500">
          Edit public legal, shipping, and brand policy documents dynamically without touching source code.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Pages List */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            Available CMS Pages
          </h3>
          {pages.map(p => (
            <div
              key={p.id}
              onClick={() => handleSelect(p)}
              className={`p-3.5 rounded-xl cursor-pointer border text-xs transition-all ${
                selectedPage?.id === p.id
                  ? 'border-amber-400 bg-[#071A33] text-white shadow-sm'
                  : 'border-gray-200 bg-gray-50 hover:bg-white text-gray-800'
              }`}
            >
              <div className="font-bold">{p.title}</div>
              <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                <span>/{p.slug}</span>
                <span>Edited by {p.lastEditedBy}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          {selectedPage ? (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-bold text-[#071A33]">
                  Editing: /{selectedPage.slug}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedPage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Page Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Page Markdown Body</label>
                <textarea
                  rows={16}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPage(null)}
                  className="px-4 py-2 bg-gray-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#071A33] hover:bg-amber-400 hover:text-[#071A33] text-amber-300 font-bold rounded-lg transition-all"
                >
                  {saving ? 'Publishing...' : 'Save & Publish to Public Web'}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-12 text-center text-xs text-gray-400 italic">
              Select a page on the left to edit its content and live policies.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
