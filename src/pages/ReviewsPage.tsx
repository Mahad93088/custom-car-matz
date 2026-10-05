import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageSquarePlus, X } from 'lucide-react';
import { api } from '../lib/api.ts';
import { Review } from '../types/index.ts';
import { SEOHead } from '../components/SEOHead.tsx';

export function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number>(0);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorLocation, setAuthorLocation] = useState('');
  const [carMakeModel, setCarMakeModel] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await api.getReviews();
        setReviews(data);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  const filtered = filterRating > 0 ? reviews.filter(r => r.rating === filterRating) : reviews;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !comment) return;

    try {
      const res = await api.submitReview({
        authorName,
        authorLocation: authorLocation || 'United Kingdom',
        carMakeModel: carMakeModel || 'Verified Car Owner',
        rating,
        title: title || 'Verified Purchase',
        comment
      });
      setSubmitFeedback(res.message);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitFeedback(null);
        setAuthorName('');
        setAuthorLocation('');
        setCarMakeModel('');
        setTitle('');
        setComment('');
      }, 2500);
    } catch (err: any) {
      setSubmitFeedback(err.message || 'Submission failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SEOHead
        title="Customer Reviews & Ratings | 4.9/5 Star Custom Car Mats UK"
        description="Read verified UK reviews from motorists who upgraded to our laser-fit car floor mats. Rated 4.9 out of 5 for fitment accuracy, carpet quality, and customer support."
        canonicalPath="/reviews"
      />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600">
            Real British Motorists
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#071A33] tracking-tight mt-1">
            Customer Reviews & Feedback
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Read authentic reviews from UK drivers who upgraded to our precision-fit tailored mats.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#071A33] hover:bg-amber-400 hover:text-[#071A33] text-white font-bold text-xs rounded-xl transition-all shadow-md"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold">
        <button
          onClick={() => setFilterRating(0)}
          className={`px-4 py-2 rounded-xl transition-colors ${
            filterRating === 0 ? 'bg-[#071A33] text-amber-400' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          All Reviews ({reviews.length})
        </button>
        {[5, 4, 3].map(stars => (
          <button
            key={stars}
            onClick={() => setFilterRating(stars)}
            className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              filterRating === stars ? 'bg-[#071A33] text-amber-400' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>{stars} Stars</span>
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(rev => (
          <div
            key={rev.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                {rev.verifiedBuyer && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-[#071A33] leading-snug">
                &ldquo;{rev.title}&rdquo;
              </h4>

              <p className="text-xs text-gray-600 leading-relaxed italic">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="font-bold text-gray-900">{rev.authorName}</span>
              <span className="text-[11px] text-gray-400">{rev.carMakeModel}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 text-gray-900 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-[#071A33]">Submit Customer Review</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitFeedback ? (
              <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold text-center">
                {submitFeedback}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Star Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setRating(num)}
                        className={`p-1.5 rounded-lg border flex items-center gap-1 ${
                          rating >= num ? 'bg-amber-50 border-amber-400 text-amber-600' : 'border-gray-200 text-gray-400'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${rating >= num ? 'fill-amber-400 text-amber-400' : ''}`} />
                        <span className="font-bold">{num}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={e => setAuthorName(e.target.value)}
                      placeholder="e.g. Liam O’Connor"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Your UK City/Town</label>
                    <input
                      type="text"
                      value={authorLocation}
                      onChange={e => setAuthorLocation(e.target.value)}
                      placeholder="e.g. Manchester, UK"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Your Car Make & Model</label>
                  <input
                    type="text"
                    value={carMakeModel}
                    onChange={e => setCarMakeModel(e.target.value)}
                    placeholder="e.g. BMW 3 Series G20 (2021)"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Headline</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Better than factory OEM mats!"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Your Review *</label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Tell other UK drivers how the mats fit, the quality of stitching, and delivery..."
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#071A33] hover:bg-amber-400 hover:text-[#071A33] text-white font-bold rounded-xl transition-all shadow-md mt-2"
                >
                  Submit Review For Moderation
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
