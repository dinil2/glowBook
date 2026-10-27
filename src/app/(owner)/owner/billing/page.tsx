'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProBadge } from '@/components/common/pro-badge';
import { UpgradeModal } from '@/components/common/upgrade-modal';
import { DEMO_SALONS, DEMO_PAYMENTS, DemoPayment } from '@/lib/demo-data';
import { getBookingCapStatus } from '@/features/billing/plans';
import { formatLKR } from '@/lib/utils';
import {
  Sparkles,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';

import { useOwnerSalon } from '@/features/owner/context/owner-salon-context';

export default function OwnerBillingPage() {
  const { currentSalon: salon } = useOwnerSalon();
  const [payments, setPayments] = React.useState<DemoPayment[]>(DEMO_PAYMENTS);

  React.useEffect(() => {
    setPayments(DEMO_PAYMENTS.filter((p) => p.salonId === salon.id));
  }, [salon.id]);

  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);

  const isPro = salon.plan === 'pro';
  const capStatus = getBookingCapStatus(salon.monthlyBookingsCount, isPro ? Infinity : 30);

  const handlePaymentSubmitted = (newPaymentData: any) => {
    const newRecord: DemoPayment = {
      id: `pay-${Date.now()}`,
      salonId: salon.id,
      salonName: salon.name,
      billingCode: salon.billingCode,
      plan: 'pro',
      months: newPaymentData.months,
      amountLkr: newPaymentData.amountLkr,
      status: 'pending_review',
      referenceCode: newPaymentData.referenceCode,
      payerName: newPaymentData.payerName,
      transferDate: newPaymentData.transferDate,
      bankReference: newPaymentData.bankReference,
      receiptUrl: newPaymentData.receiptUrl,
      ownerNote: newPaymentData.ownerNote,
      submittedAt: new Date().toISOString(),
    };
    setPayments([newRecord, ...payments]);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink tracking-tight">Plan & Billing</h1>
          <p className="text-xs text-muted">
            Manage your Glowbook Pro subscription, HNB payments, and monthly booking limits.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowUpgradeModal(true)}
          className="shadow-glow-md"
        >
          <Sparkles className="w-4 h-4 mr-1.5 text-star-gold" />
          {isPro ? 'Extend / Renew Pro' : 'Upgrade to Pro'}
        </Button>
      </div>

      {/* Current Plan Overview Card */}
      <Card className="overflow-hidden border-2 border-primary/30">
        <div className="bg-gradient-to-r from-primary to-primary-deep p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-wider text-lavender">
              Current Active Subscription
            </span>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black">
                {isPro ? 'Glowbook Pro Plan' : 'Free Starter Plan'}
              </h2>
              {isPro && <ProBadge size="sm" />}
            </div>
            <p className="text-xs text-lavender/90">
              {isPro
                ? `Valid until ${new Date(salon.planExpiresAt || Date.now()).toLocaleDateString('en-LK', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}`
                : 'Free lifetime plan with 30 online bookings per calendar month.'}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-lavender">Transfer Reference Code</p>
            <p className="font-mono text-xl font-black tracking-wider text-star-gold">
              {salon.billingCode}
            </p>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Usage Meter */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-ink">Monthly Online Bookings</span>
              <span className={capStatus.isNearCap ? 'text-ruby-600' : 'text-primary-deep'}>
                {salon.monthlyBookingsCount} / {isPro ? 'Unlimited (Pro)' : '30 Max (Free)'}
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-mist overflow-hidden border border-muted-border">
              <div
                className={`h-full rounded-full transition-all ${
                  isPro ? 'bg-primary' : capStatus.isNearCap ? 'bg-amber-500' : 'bg-primary'
                }`}
                style={{
                  width: isPro ? '100%' : `${Math.min(100, (salon.monthlyBookingsCount / 30) * 100)}%`,
                }}
              />
            </div>
            {!isPro && (
              <p className="text-[11px] text-muted">
                Need more than 30 bookings? Upgrading to Pro removes all booking caps.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>HNB Bank Transfer History</CardTitle>
          <p className="text-xs text-muted">
            All submitted bank payments and admin verification statuses.
          </p>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-mist border-b border-muted-border text-[11px] font-bold uppercase text-muted">
                <tr>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4">Period & Amount</th>
                  <th className="p-4">Reference Used</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Details / Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted-border/60">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-lavender/30 transition-colors">
                    <td className="p-4 font-semibold text-ink">
                      {new Date(p.submittedAt).toLocaleDateString('en-LK', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-ink block">{formatLKR(p.amountLkr)}</span>
                      <span className="text-muted text-[11px]">
                        {p.months === 1 ? '1 Month' : `${p.months} Months`}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-primary">{p.referenceCode}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          p.status === 'approved'
                            ? 'success'
                            : p.status === 'rejected'
                            ? 'danger'
                            : 'gold'
                        }
                        className="text-[10px] font-bold capitalize"
                      >
                        {p.status === 'pending_review' ? 'Pending Verification' : p.status}
                      </Badge>
                      {p.rejectReason && (
                        <p className="text-[10px] text-ruby-600 mt-1 max-w-xs">{p.rejectReason}</p>
                      )}
                    </td>
                    <td className="p-4">
                      {p.receiptUrl ? (
                        <a
                          href={p.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary font-semibold hover:underline flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" /> View Proof
                        </a>
                      ) : (
                        <span className="text-muted text-[11px]">
                          Ref: {p.bankReference || 'Typed Details'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        salonName={salon.name}
        billingCode={salon.billingCode}
        onPaymentSubmitted={handlePaymentSubmitted}
      />
    </div>
  );
}
