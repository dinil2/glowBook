'use client';

import * as React from 'react';
import { DEMO_REVIEWS, demoSalons } from '@/lib/demo-data';
import { toast } from 'sonner';
import {
  Star,
  Search,
  Filter,
  EyeOff,
  Eye,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface ReviewItem {
  id: string;
  salon_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  owner_reply?: string;
  created_at: string;
  status: 'published' | 'hidden';
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = React.useState<ReviewItem[]>(
    DEMO_REVIEWS.map((r) => ({ ...r, status: 'published' as const }))
  );
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'published' | 'hidden'>('all');
  const [ratingFilter, setRatingFilter] = React.useState<string>('all');

  const filteredReviews = React.useMemo(() => {
    return reviews.filter((r) => {
      const salon = demoSalons.find((s) => s.id === r.salon_id);
      const salonName = salon ? salon.name.toLowerCase() : '';

      const matchesSearch =
        salonName.includes(search.toLowerCase()) ||
        r.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        r.comment.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchesRating = ratingFilter === 'all' || r.rating === Number(ratingFilter);

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, search, statusFilter, ratingFilter]);

  const toggleHide = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextStatus = r.status === 'published' ? 'hidden' : 'published';
          toast.success(
            nextStatus === 'hidden'
              ? 'Review hidden from salon profile'
              : 'Review restored to public profile'
          );
          return { ...r, status: nextStatus };
        }
        return r;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink font-display flex items-center gap-2.5">
          <Star className="w-7 h-7 text-primary" />
          Review Moderation
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Monitor verified guest reviews, enforce community guidelines, and moderate inappropriate content.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-surface border border-muted-border/60 rounded-3xl p-4 shadow-subtle flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reviews by text, customer, or salon name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-mist text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 border border-transparent focus:border-primary/30"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 rounded-2xl bg-mist text-xs text-ink font-medium border border-muted-border/60 focus:outline-none"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-2xl bg-mist text-xs text-ink font-medium border border-muted-border/60 focus:outline-none"
          >
            <option value="all">All Moderation Status</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((r) => {
          const salon = demoSalons.find((s) => s.id === r.salon_id);
          return (
            <div
              key={r.id}
              className={`bg-surface border rounded-3xl p-5 shadow-subtle transition-all ${
                r.status === 'hidden'
                  ? 'border-ruby-500/30 bg-ruby-50/10'
                  : 'border-muted-border/60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= r.rating
                            ? 'fill-star-gold text-star-gold'
                            : 'text-muted-border'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-ink text-sm">{r.customer_name}</span>
                  <span className="text-xs text-muted">
                    reviewed{' '}
                    <strong className="text-ink font-semibold">
                      {salon ? salon.name : 'Unknown Salon'}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted">
                    {new Date(r.created_at).toLocaleDateString('en-LK', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <button
                    onClick={() => toggleHide(r.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      r.status === 'published'
                        ? 'bg-ruby-50 text-ruby-600 hover:bg-ruby-100'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }`}
                  >
                    {r.status === 'published' ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" /> Hide Review
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" /> Restore Review
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-sm text-ink/90 leading-relaxed pl-1">{r.comment}</p>

              {r.owner_reply && (
                <div className="mt-3 pl-4 border-l-2 border-primary/40 bg-lavender/30 rounded-r-2xl p-3 text-xs">
                  <span className="font-bold text-deep-purple block mb-0.5">
                    Salon Owner Response:
                  </span>
                  <p className="text-ink/80">{r.owner_reply}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
