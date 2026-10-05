import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, Eye, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api.ts';
import { Review } from '../types/index.ts';

export function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getReviews();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.admin.updateReview(id, { status });
      fetchReviews();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleFeature = async (id: string, current: boolean) => {
    try {
      await api.admin.updateReview(id, { isFeatured: !current });
      fetchReviews();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete review permanently?')) return;
    try {
      await api.admin.deleteReview(id);
      fetchReviews();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#071A33] tracking-tight">Customer Reviews Moderation</h1>
        <p className="text-xs text-gray-500">
          Approve or reject customer submissions before they appear on the live store.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-gray-500 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="p-3.5">Author & Vehicle</th>
                <th className="p-3.5">Rating & Review</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Featured</th>
                <th className="p-3.5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map(rev => (
                <tr key={rev.id} className="hover:bg-gray-50">
                  <td className="p-3.5">
                    <strong className="block text-gray-900">{rev.authorName}</strong>
                    <span className="text-[11px] text-gray-500">{rev.carMakeModel}</span>
                    <span className="text-[10px] text-gray-400 block">{rev.authorLocation}</span>
                  </td>
                  <td className="p-3.5 max-w-md">
                    <div className="flex text-amber-400 mb-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <strong className="block text-gray-800 leading-tight">{rev.title}</strong>
                    <p className="text-gray-600 line-clamp-2 mt-0.5">{rev.comment}</p>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        rev.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rev.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}
                    >
                      {rev.status}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <button
                      onClick={() => handleToggleFeature(rev.id, rev.isFeatured)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rev.isFeatured ? 'bg-amber-400 text-[#071A33]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {rev.isFeatured ? 'Featured ★' : 'Standard'}
                    </button>
                  </td>
                  <td className="p-3.5 text-right space-x-1.5">
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => handleStatusChange(rev.id, 'approved')}
                        className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
                        title="Approve Review"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {rev.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(rev.id, 'rejected')}
                        className="p-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-500"
                        title="Reject Review"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      title="Delete Review"
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
    </div>
  );
}
