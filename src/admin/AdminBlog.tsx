import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit2, Trash2, Eye, EyeOff, X } from 'lucide-react';
import { api } from '../lib/api.ts';
import { BlogPost } from '../types/index.ts';

export function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Buying Guides');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getBlogPosts();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreate = () => {
    setIsEditing(true);
    setEditingId(null);
    setTitle('');
    setCategory('Buying Guides');
    setExcerpt('');
    setContent('## Article Section Title\n\nEnter article guidance here...');
    setImageUrl('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80');
    setIsPublished(true);
  };

  const handleEdit = (p: BlogPost) => {
    setIsEditing(true);
    setEditingId(p.id);
    setTitle(p.title);
    setCategory(p.category);
    setExcerpt(p.excerpt);
    setContent(p.content);
    setImageUrl(p.imageUrl);
    setIsPublished(p.isPublished);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      category,
      excerpt,
      content,
      imageUrl,
      isPublished,
      readTime: '4 min read',
      tags: ['Custom Car Mats', 'UK Automotive']
    };

    try {
      if (editingId) {
        await api.admin.updateBlogPost(editingId, payload);
      } else {
        await api.admin.createBlogPost(payload);
      }
      setIsEditing(false);
      fetchPosts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete article?')) return;
    try {
      await api.admin.deleteBlogPost(id);
      fetchPosts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#071A33] tracking-tight">Blog & Guide CMS Management</h1>
          <p className="text-xs text-gray-500">
            Publish automotive advice, seasonal mat maintenance guides, and laser technology showcases.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#071A33] hover:bg-amber-400 hover:text-[#071A33] text-white font-bold text-xs rounded-xl shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border-2 border-amber-400 shadow-xl space-y-4 text-xs">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="text-sm font-bold text-[#071A33]">{editingId ? 'Edit Article' : 'Draft New Article'}</h3>
            <button type="button" onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Article Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="Buying Guides">Buying Guides</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Technical Advice">Technical Advice</option>
                <option value="UK Motoring">UK Motoring</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Short Excerpt *</label>
              <input
                type="text"
                required
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Cover Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg font-mono text-[11px]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Article Body (Supports Headings & Bullet Points)</label>
              <textarea
                rows={8}
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={e => setIsPublished(e.target.checked)}
                className="rounded text-amber-500"
              />
              <span className="font-bold">Publish Live to Website</span>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#071A33] text-amber-400 font-bold rounded-lg hover:bg-amber-400 hover:text-[#071A33]"
              >
                Save Article
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5F7FA] text-gray-500 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200">
            <tr>
              <th className="p-3.5">Article Title</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Author</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-3.5 font-bold text-gray-900">{p.title}</td>
                <td className="p-3.5 text-gray-600 font-semibold">{p.category}</td>
                <td className="p-3.5 text-gray-500">{p.author}</td>
                <td className="p-3.5">
                  {p.isPublished ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <Eye className="w-3 h-3" /> Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      <EyeOff className="w-3 h-3" /> Draft
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="p-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-amber-100"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
