import React, { useState, useEffect } from 'react';
import { Clock, ChevronLeft, User, Calendar, Tag, ChevronRight } from 'lucide-react';
import { api } from '../lib/api.ts';
import { BlogPost } from '../types/index.ts';
import { SEOHead } from '../components/SEOHead.tsx';

interface BlogPostPageProps {
  slug: string;
  setCurrentTab: (tab: string, param?: string) => void;
}

export function BlogPostPage({ slug, setCurrentTab }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        const data = await api.getBlogPost(slug);
        setPost(data.post);
        setRelated(data.related || []);
      } catch (err) {
        console.error('Failed to load article:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-64 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 space-y-3">
        <h2 className="text-xl font-bold">Article Not Found</h2>
        <button onClick={() => setCurrentTab('blog')} className="text-xs text-amber-600 underline">
          Return to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title={`${post.title} | Custom Car Mats UK`}
        description={post.excerpt}
        canonicalPath={`/blog/${post.slug}`}
        ogType="article"
        ogImage={post.imageUrl}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'headline': post.title,
          'description': post.excerpt,
          'image': post.imageUrl,
          'author': {
            '@type': 'Person',
            'name': post.author
          },
          'datePublished': post.publishedAt,
          'publisher': {
            '@type': 'Organization',
            'name': 'Custom Car Mats UK'
          }
        }}
      />
      <button
        onClick={() => setCurrentTab('blog')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-amber-600 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to All Guides</span>
      </button>

      {/* Article Header */}
      <header className="space-y-4">
        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded-lg uppercase tracking-wider">
          {post.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#071A33] tracking-tight leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-b border-gray-200 pb-4">
          <span className="flex items-center gap-1.5 font-bold text-gray-800">
            <User className="w-3.5 h-3.5 text-amber-500" />
            {post.author}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            {post.readTime}
          </span>
          <span>•</span>
          <span>Published in Great Britain</span>
        </div>
      </header>

      {/* Hero Image */}
      <div className="aspect-16/9 rounded-3xl overflow-hidden bg-gray-900 border border-gray-200 shadow-md">
        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-6 text-sm">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-2xl font-extrabold text-[#071A33] pt-4">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-lg font-bold text-[#071A33] pt-2">
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

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex items-center gap-2 pt-6 border-t border-gray-200 flex-wrap">
          <Tag className="w-4 h-4 text-gray-400" />
          {post.tags.map((t, idx) => (
            <span key={idx} className="px-2.5 py-1 bg-gray-100 rounded text-xs text-gray-600 font-medium">
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Related Posts */}
      {related.length > 0 && (
        <div className="pt-10 border-t border-gray-200 space-y-6">
          <h3 className="text-xl font-bold text-[#071A33]">Related Guides & Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map(rel => (
              <div
                key={rel.id}
                onClick={() => setCurrentTab('blog-post', rel.slug)}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:shadow-md cursor-pointer transition-all space-y-2"
              >
                <div className="aspect-16/10 rounded-lg overflow-hidden bg-gray-900">
                  <img src={rel.imageUrl} alt={rel.title} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-xs font-bold text-[#071A33] line-clamp-2 leading-snug hover:text-amber-600">
                  {rel.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
