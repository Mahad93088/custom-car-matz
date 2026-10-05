import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, ChevronRight, Tag, Search } from 'lucide-react';
import { api } from '../lib/api.ts';
import { BlogPost } from '../types/index.ts';
import { SEOHead } from '../components/SEOHead.tsx';

interface BlogPageProps {
  setCurrentTab: (tab: string, param?: string) => void;
}

export function BlogPage({ setCurrentTab }: BlogPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        const data = await api.getBlogPosts({
          category: category !== 'all' ? category : undefined,
          search: search.trim() || undefined
        });
        setPosts(data);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, [category, search]);

  const categories = ['all', 'Buying Guides', 'Manufacturing', 'Technical Advice'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SEOHead
        title="Guides, Car Care & Motoring Heritage | Custom Car Mats UK"
        description="Expert advice on car interior maintenance, carpet vs rubber mats, OEM anchor clips, and British coachbuilding heritage from the Custom Car Mats UK team."
        canonicalPath="/blog"
      />
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600">
          UK Automotive Insights
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#071A33] tracking-tight">
          Guides, Care & Heritage
        </h1>
        <p className="text-sm text-gray-600">
          Expert articles from our British trimming workshop covering vehicle floor protection, winter driving, and OEM clips.
        </p>

        {/* Search */}
        <div className="pt-3 max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search guides (e.g. clips, rubber, winter)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-amber-500 shadow-xs"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 justify-center overflow-x-auto text-xs font-bold">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl transition-colors ${
              category === cat
                ? 'bg-[#071A33] text-amber-400'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {cat === 'all' ? 'All Guides' : cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <article
            key={post.id}
            onClick={() => setCurrentTab('blog-post', post.slug)}
            className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="aspect-16/10 bg-gray-900 overflow-hidden relative">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#071A33]/90 text-amber-400 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                  {post.category}
                </span>
              </div>

              <div className="p-6 space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{post.readTime}</span>
                  <span>•</span>
                  <span>{post.author}</span>
                </div>

                <h3 className="text-base font-bold text-[#071A33] group-hover:text-amber-600 transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 group-hover:text-amber-700">
                Read Full Guide <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
