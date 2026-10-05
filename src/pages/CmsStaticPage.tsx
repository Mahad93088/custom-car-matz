import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.ts';
import { CmsPage } from '../types/index.ts';
import { SEOHead } from '../components/SEOHead.tsx';

interface CmsStaticPageProps {
  slug: string;
}

export function CmsStaticPage({ slug }: CmsStaticPageProps) {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        const data = await api.getPage(slug);
        setPage(data);
      } catch (err) {
        console.error('Failed to load CMS page:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-40 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 space-y-3">
        <h2 className="text-xl font-bold">Page Not Found</h2>
        <p className="text-xs text-gray-500">The requested CMS document is not available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SEOHead
        title={`${page.title} | Custom Car Mats UK`}
        description={page.content.replace(/<[^>]*>?/gm, '').slice(0, 155)}
        canonicalPath={`/page/${page.slug}`}
      />
      <header className="border-b border-gray-200 pb-6">
        <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600">
          UK Store Policy & Information
        </span>
        <h1 className="text-3xl font-extrabold text-[#071A33] tracking-tight mt-1">
          {page.title}
        </h1>
        <p className="text-[11px] text-gray-400 mt-2">
          Last reviewed: {new Date(page.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} • Handcrafted in Great Britain
        </p>
      </header>

      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xs prose prose-sm max-w-none text-gray-700 leading-relaxed text-sm space-y-5">
        {page.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-xl font-extrabold text-[#071A33] pt-3">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-base font-bold text-[#071A33] pt-2">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('- ')) {
            const items = paragraph.split('\n').map(l => l.replace('- ', ''));
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1.5 text-gray-700">
                {items.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            );
          }
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>
    </div>
  );
}
