import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { api } from '../lib/api.ts';
import { SEOHead } from '../components/SEOHead.tsx';

export function FaqPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  useEffect(() => {
    api.getFaqs().then(setFaqs).catch(console.error);
  }, []);

  // Construct Schema.org FAQPage structured data
  const faqJsonLd = useMemo(() => {
    if (!faqs || faqs.length === 0) return undefined;
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(item => ({
        '@type': 'Question',
        'name': item.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.answer
        }
      }))
    };
  }, [faqs]);

  const categories = ['all', ...Array.from(new Set(faqs.map(f => f.category)))];

  const filtered = faqs.filter(f => {
    const matchesCat = activeCategory === 'all' || f.category === activeCategory;
    const matchesSearch =
      !search ||
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SEOHead
        title="Frequently Asked Questions (FAQ) | Custom Car Mats UK"
        description="Got questions about custom car mats? Discover details on precision UK vehicle fitment, floor anchors, carpet thickness, all-weather rubber, delivery and returns."
        canonicalPath="/faq"
        jsonLd={faqJsonLd}
      />

      <div className="text-center space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600">
          Knowledge Base & Help
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#071A33] tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-gray-600">
          Find answers about UK vehicle fitment, fixing clip compatibility, materials, delivery, and guarantees.
        </p>

        {/* Search */}
        <div className="pt-4 max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search keywords (e.g. clips, rubber, delivery)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-amber-500 shadow-xs"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 text-xs font-bold justify-center">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl capitalize whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-[#071A33] text-amber-400'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {cat === 'all' ? 'All Questions' : cat}
          </button>
        ))}
      </div>

      {/* Accordion */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-8 text-center text-xs text-gray-500 rounded-2xl border">
            No matching questions found for &ldquo;{search}&rdquo;. Try another term or contact our UK team.
          </div>
        ) : (
          filtered.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#071A33] hover:text-amber-600 transition-colors"
              >
                <span>{item.question}</span>
                <span className="text-gray-400">
                  {openIdx === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {item.answer}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
