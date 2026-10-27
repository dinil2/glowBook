'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DEMO_PAYMENTS, DemoPayment } from '@/lib/demo-data';
import { formatLKR } from '@/lib/utils';
import {
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  ZoomIn,
  Building,
  Calendar,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminVerificationQueuePage() {
  const [payments, setPayments] = React.useState<DemoPayment[]>(DEMO_PAYMENTS);
  const [zoomedReceipt, setZoomedReceipt] = React.useState<string | null>(null);
  const [rejectModalPayment, setRejectModalPayment] = React.useState<DemoPayment | null>(null);
  const [rejectReason, setRejectReason] = React.useState('');

  const pendingList = payments.filter((p) => p.status === 'pending_review');
  const pastList = payments.filter((p) => p.status !== 'pending_review');

  const handleApprove = (payment: DemoPayment) => {
    // Idempotent approve simulation: sets status to approved
    setPayments((prev) =>
      prev.map((p) =>
        p.id === payment.id
          ? {
              ...p,
              status: 'approved',
              reviewedAt: new Date().toISOString(),
            }
          : p
      )
    );
    toast.success(
      `Payment ${payment.referenceCode} approved! Pro unlocked for ${payment.salonName}.`
    );
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalPayment) return;
    if (!rejectReason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }

    setPayments((prev) =>
      prev.map((p) =>
        p.id === rejectModalPayment.id
          ? {
              ...p,
              status: 'rejected',
              rejectReason,
              reviewedAt: new Date().toISOString(),
            }
          : p
      )
    );

    toast.success(`Payment rejected with reason: ${rejectReason}`);
    setRejectModalPayment(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-ink tracking-tight">Payment Verification Queue</h1>
        <p className="text-xs text-muted">
          Audit incoming HNB manual bank transfers against bank statement records.
        </p>
      </div>

      {/* Checklist Reminder Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
        <p className="font-bold flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          HNB Verification Protocol Checklist:
        </p>
        <p>
          Before approving, open your Hatton National Bank statement and confirm that the exact amount was received with the specified <strong>Transfer Reference Code</strong>.
        </p>
      </div>

      {/* Pending Queue */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-ink flex items-center gap-2">
          <span>Pending Audit Queue</span>
          <Badge variant="gold" className="text-xs font-black">
            {pendingList.length}
          </Badge>
        </h2>

        {pendingList.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {pendingList.map((p) => (
              <Card key={p.id} className="p-6 border-2 border-primary/20 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-muted-border/60">
                  <div>
                    <h3 className="text-lg font-extrabold text-ink">{p.salonName}</h3>
                    <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                      Billing Code & Reference:{' '}
                      <strong className="font-mono text-primary text-sm font-bold">
                        {p.referenceCode}
                      </strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted block">Subscription Amount</span>
                    <span className="text-xl font-black text-primary-deep">
                      {formatLKR(p.amountLkr)}
                    </span>
                    <span className="text-[11px] text-muted block">
                      Period: {p.months === 1 ? '1 Month' : `${p.months} Months`}
                    </span>
                  </div>
                </div>

                {/* Proof comparison side-by-side: Receipt Preview vs Typed Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Left: Receipt Preview */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block">
                      Uploaded Bank Slip Proof
                    </span>
                    {p.receiptUrl ? (
                      <div className="relative group rounded-2xl border border-muted-border overflow-hidden bg-mist max-h-56">
                        <img
                          src={p.receiptUrl}
                          alt="Bank slip proof"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setZoomedReceipt(p.receiptUrl || null)}
                          className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1"
                        >
                          <ZoomIn className="w-4 h-4" /> Click to Zoom
                        </button>
                      </div>
                    ) : (
                      <div className="p-8 rounded-2xl border border-dashed border-muted-border text-center text-xs text-muted bg-mist">
                        No image uploaded (Client provided typed transaction details)
                      </div>
                    )}
                  </div>

                  {/* Right: Typed Details & Note */}
                  <div className="space-y-3 text-xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block">
                      Client-Provided Transfer Details
                    </span>
                    <div className="p-4 rounded-2xl bg-mist border border-muted-border space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted">Payer Name:</span>
                        <span className="font-bold text-ink">{p.payerName || 'Not stated'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Transfer Date:</span>
                        <span className="font-bold text-ink">{p.transferDate || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Bank Reference #:</span>
                        <span className="font-mono font-bold text-primary">
                          {p.bankReference || 'None'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Submission Time:</span>
                        <span className="text-ink">
                          {new Date(p.submittedAt).toLocaleTimeString('en-LK', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {p.ownerNote && (
                      <div className="p-3 rounded-2xl bg-lavender/40 border border-primary/20 text-[11px] text-ink space-y-0.5">
                        <span className="font-bold text-primary-deep">Owner Note:</span>
                        <p>{p.ownerNote}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Audit Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-muted-border/60">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => {
                      setRejectModalPayment(p);
                      setRejectReason('');
                    }}
                    className="text-ruby-600 border-ruby-200 hover:bg-ruby-50"
                  >
                    <XCircle className="w-4 h-4 mr-1.5" /> Reject Payment
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleApprove(p)}
                    className="px-6 shadow-glow-md"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> Approve & Unlock Pro
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center text-xs text-muted">
            All payments have been audited. No pending submissions in the queue.
          </Card>
        )}
      </div>

      {/* Past Audited Payments */}
      <div className="space-y-4 pt-6">
        <h2 className="text-lg font-bold text-ink">Recent Audit History</h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-mist border-b border-muted-border text-[11px] font-bold uppercase text-muted">
                <tr>
                  <th className="p-4">Salon</th>
                  <th className="p-4">Reference Code</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Audit Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted-border/60">
                {pastList.map((p) => (
                  <tr key={p.id}>
                    <td className="p-4 font-bold text-ink">{p.salonName}</td>
                    <td className="p-4 font-mono font-bold text-primary">{p.referenceCode}</td>
                    <td className="p-4 font-bold text-ink">{formatLKR(p.amountLkr)}</td>
                    <td className="p-4">
                      <Badge
                        variant={p.status === 'approved' ? 'success' : 'danger'}
                        className="capitalize font-bold text-[10px]"
                      >
                        {p.status}
                      </Badge>
                      {p.rejectReason && (
                        <p className="text-[10px] text-ruby-600 mt-0.5">{p.rejectReason}</p>
                      )}
                    </td>
                    <td className="p-4 text-muted">
                      {p.reviewedAt
                        ? new Date(p.reviewedAt).toLocaleDateString('en-LK', {
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Approved'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Zoom Receipt Modal */}
      <Dialog
        open={Boolean(zoomedReceipt)}
        onOpenChange={() => setZoomedReceipt(null)}
        title="Bank Slip / Receipt Inspection"
      >
        {zoomedReceipt && (
          <div className="p-2">
            <img
              src={zoomedReceipt}
              alt="Zoomed receipt"
              className="w-full max-h-[75vh] object-contain rounded-2xl border"
            />
          </div>
        )}
      </Dialog>

      {/* Reject Payment Reason Modal */}
      <Dialog
        open={Boolean(rejectModalPayment)}
        onOpenChange={() => setRejectModalPayment(null)}
        title="Reject Bank Transfer Proof"
      >
        <form onSubmit={handleConfirmReject} className="space-y-4 pt-2">
          <p className="text-xs text-muted">
            State the exact reason why this payment cannot be verified. This reason will be emailed to the salon owner so they can rectify and resubmit.
          </p>

          <Input
            label="Rejection Reason *"
            placeholder="e.g. Reference not found on HNB statement, or slip was illegible"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-muted-border">
            <Button variant="ghost" onClick={() => setRejectModalPayment(null)}>
              Cancel
            </Button>
            <Button variant="danger" type="submit">
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
