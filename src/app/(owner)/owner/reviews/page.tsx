'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DEMO_SALONS, DemoReview } from '@/lib/demo-data';
import { can } from '@/features/billing/plans';
import { UpgradeModal } from '@/components/common/upgrade-modal';
import { Star, MessageCircle, Send, Lock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function OwnerReviewsPage() {
  const salon = DEMO_SALONS[0];
  const [reviews, setReviews] = React.useState<DemoReview[]>(salon.reviews);
  const [replyText, setReplyText] = React.useState<Record<string, string>>({});
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);

  const allowsReplies = can(salon, 'reviewReplies');

  const handleSendReply = (reviewId: string) => {
    if (!allowsReplies) {
      setShowUpgradeModal(true);
      return;
    }
    const text = replyText[reviewId];
    if (!text?.trim()) return;

    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, ownerReply: text } : r))
    );
    setReplyText((prev) => ({ ...prev, [reviewId]: '' }));
    toast.success('Reply published to public salon page');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink tracking-tight">Client Reviews</h1>
          <p className="text-xs text-muted">
            Read client feedback and build customer loyalty with verified owner responses.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-muted-border">
          <Star className="w-5 h-5 fill-star-gold text-star-gold" />
          <span className="font-extrabold text-sm text-ink">{salon.avgRating}</span>
          <span className="text-xs text-muted">({reviews.length} reviews)</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <Card key={r.id} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-ink">{r.customerName}</h4>
                <p className="text-[11px] text-muted">
                  {new Date(r.createdAt).toLocaleDateString('en-LK', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-center text-star-gold">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-star-gold" />
                ))}
              </div>
            </div>

            <p className="text-xs text-ink-light leading-relaxed">&ldquo;{r.comment}&rdquo;</p>

            {r.ownerReply ? (
              <div className="p-3.5 rounded-2xl bg-lavender/50 border-l-2 border-primary text-xs space-y-1">
                <span className="font-bold text-primary-deep block">Your Response:</span>
                <p className="text-ink">{r.ownerReply}</p>
              </div>
            ) : (
              <div className="pt-2">
                {allowsReplies ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a warm response to this client..."
                      value={replyText[r.id] || ''}
                      onChange={(e) =>
                        setReplyText({ ...replyText, [r.id]: e.target.value })
                      }
                      className="flex-1 h-10 px-3 rounded-xl border border-muted-border text-xs focus:outline-none focus:border-primary"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSendReply(r.id)}
                      className="px-4"
                    >
                      <Send className="w-3.5 h-3.5 mr-1" /> Reply
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => setShowUpgradeModal(true)}
                    className="p-3 rounded-2xl bg-mist border border-muted-border/80 flex items-center justify-between text-xs cursor-pointer hover:bg-lavender/40 transition-colors"
                  >
                    <span className="text-muted flex items-center gap-1.5 font-medium">
                      <Lock className="w-3.5 h-3.5 text-primary" />
                      Public review replies unlocked on Glowbook Pro
                    </span>
                    <span className="text-primary font-bold text-xs">Upgrade to Reply →</span>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        salonName={salon.name}
        billingCode={salon.billingCode}
      />
    </div>
  );
}
