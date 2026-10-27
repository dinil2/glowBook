'use client';

import * as React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PLAN_PRICING, PlanPricingPeriod } from '@/features/billing/plans';
import { DEFAULT_PLATFORM_BANK_SETTINGS } from '@/lib/config/bank';
import { formatLKR } from '@/lib/utils';
import {
  Check,
  Sparkles,
  Copy,
  CheckCircle2,
  Upload,
  ArrowRight,
  ArrowLeft,
  Building,
  ShieldCheck,
  Clock,
  MessageSquare,
  BarChart3,
  Users,
  PhoneCall,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salonName?: string;
  billingCode?: string;
  onPaymentSubmitted?: (data: {
    months: 1 | 3 | 12;
    amountLkr: number;
    referenceCode: string;
    payerName?: string;
    transferDate?: string;
    bankReference?: string;
    receiptUrl?: string;
    ownerNote?: string;
  }) => void;
}

export function UpgradeModal({
  open,
  onOpenChange,
  salonName = 'Salon Costume',
  billingCode = 'SALONCOSTUME-4821',
  onPaymentSubmitted,
}: UpgradeModalProps) {
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [selectedPeriod, setSelectedPeriod] = React.useState<1 | 3 | 12>(3);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  // Manual payment form fields
  const [payerName, setPayerName] = React.useState('');
  const [transferDate, setTransferDate] = React.useState(
    new Date().toISOString().split('T')[0]
  );
  const [bankReference, setBankReference] = React.useState('');
  const [ownerNote, setOwnerNote] = React.useState('');
  const [receiptFile, setReceiptFile] = React.useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const planOption = PLAN_PRICING[selectedPeriod];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Receipt file must be under 5 MB');
        return;
      }
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
      setFormError(null);
    }
  };

  const handleSubmitPayment = async () => {
    // Validate constraint: at least a receipt OR (payerName + transferDate + bankReference)
    const hasReceipt = Boolean(receiptFile || receiptPreview);
    const hasTypedDetails = Boolean(payerName.trim() && transferDate && bankReference.trim());

    if (!hasReceipt && !hasTypedDetails) {
      setFormError('Please upload a bank receipt OR fill in your transfer details below.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      // Simulate submission or invoke action
      await new Promise((r) => setTimeout(r, 900));

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#8B6CF6', '#5B3FD1', '#F5B942', '#10B981'],
      });

      if (onPaymentSubmitted) {
        onPaymentSubmitted({
          months: selectedPeriod,
          amountLkr: planOption.priceLkr,
          referenceCode: billingCode,
          payerName: payerName || undefined,
          transferDate: transferDate || undefined,
          bankReference: bankReference || undefined,
          receiptUrl: receiptPreview || '/receipts/demo-receipt-pending.svg',
          ownerNote: ownerNote || undefined,
        });
      }

      setStep(3); // Success step
    } catch {
      setFormError('Failed to record payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setFormError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose} className="max-w-2xl">
      {/* STEP 1: Feature Comparison & Period Selector */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-lavender text-primary-deep mb-1">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-black text-ink tracking-tight">
              Upgrade to <span className="text-primary">Glowbook Pro</span>
            </h2>
            <p className="text-sm text-muted max-w-md mx-auto">
              Unlock unlimited clients, direct WhatsApp calls, visual staff scheduling, and VIP search ranking.
            </p>
          </div>

          {/* Pricing Period Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {([1, 3, 12] as const).map((period) => {
              const opt = PLAN_PRICING[period];
              const isSelected = selectedPeriod === period;
              return (
                <button
                  key={period}
                  type="button"
                  onClick={() => setSelectedPeriod(period)}
                  className={`relative p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-lavender/50 shadow-glow-sm ring-2 ring-primary/20'
                      : 'border-muted-border bg-white hover:bg-mist'
                  }`}
                >
                  {opt.badge && (
                    <span className="absolute -top-2.5 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-star-gold text-ink shadow-sm">
                      {opt.badge}
                    </span>
                  )}
                  <p className="text-xs font-semibold text-muted">{opt.label}</p>
                  <p className="text-lg font-extrabold text-ink mt-1">
                    {formatLKR(opt.priceLkr)}
                  </p>
                  <p className="text-[11px] text-muted mt-0.5">
                    {period === 1 ? 'Monthly' : `LKR ${Math.round(opt.priceLkr / period).toLocaleString()}/mo`}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Feature List Comparison */}
          <div className="rounded-2xl border border-muted-border/80 bg-mist/60 p-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
              Everything Pro Unlocks for {salonName}:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink-light">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Unlimited</strong> bookings (no 30/mo cap)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Direct Call & WhatsApp</strong> public buttons</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Stylist selection</strong> for clients</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Visual calendar</strong> (Day & Week views)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Revenue & Analytics</strong> reports</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>WhatsApp click-to-chat</strong> templates</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Verified Pro</strong> badge & search boost</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Unlimited services & up to 30 gallery photos</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" onClick={resetAndClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setStep(2)}
              className="px-8 shadow-glow-md"
            >
              Continue to Bank Transfer
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Bank Transfer Details & Proof Upload */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="text-xs text-muted hover:text-ink flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to plan selection
            </button>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-lavender text-primary-deep">
              Step 2 of 2
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-ink">HNB Bank Transfer Details</h3>
            <p className="text-xs text-muted">
              Transfer <strong>{formatLKR(planOption.priceLkr)}</strong> for {planOption.label} to our corporate account.
            </p>
          </div>

          {/* Highlighted Reference Box */}
          <div className="rounded-2xl border-2 border-primary/40 bg-gradient-to-r from-lavender/80 to-soft-purple/30 p-4 space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary-deep">
              CRITICAL: USE THIS AS YOUR TRANSFER REFERENCE
            </p>
            <div className="flex items-center justify-between gap-2 mt-1">
              <span className="font-mono text-lg font-black text-ink tracking-wider">
                {billingCode}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy(billingCode, 'code')}
                className="bg-white shrink-0"
              >
                {copiedKey === 'code' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copiedKey === 'code' ? 'Copied' : 'Copy Code'}
              </Button>
            </div>
            <p className="text-[11px] text-muted">
              Entering this in your bank remarks ensures automatic, rapid verification within 24 hours.
            </p>
          </div>

          {/* Bank Account Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-muted-border bg-white flex justify-between items-center">
              <div>
                <span className="text-muted block text-[10px] uppercase font-bold">Bank</span>
                <span className="font-semibold text-ink">{DEFAULT_PLATFORM_BANK_SETTINGS.bankName}</span>
              </div>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleCopy(DEFAULT_PLATFORM_BANK_SETTINGS.bankName, 'bank')}>
                {copiedKey === 'bank' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted" />}
              </Button>
            </div>

            <div className="p-3 rounded-xl border border-muted-border bg-white flex justify-between items-center">
              <div>
                <span className="text-muted block text-[10px] uppercase font-bold">Account Name</span>
                <span className="font-semibold text-ink truncate max-w-[170px] block">{DEFAULT_PLATFORM_BANK_SETTINGS.accountName}</span>
              </div>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleCopy(DEFAULT_PLATFORM_BANK_SETTINGS.accountName, 'accName')}>
                {copiedKey === 'accName' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted" />}
              </Button>
            </div>

            <div className="p-3 rounded-xl border border-muted-border bg-white flex justify-between items-center">
              <div>
                <span className="text-muted block text-[10px] uppercase font-bold">Account Number</span>
                <span className="font-mono font-bold text-ink">{DEFAULT_PLATFORM_BANK_SETTINGS.accountNumber}</span>
              </div>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleCopy(DEFAULT_PLATFORM_BANK_SETTINGS.accountNumber, 'accNum')}>
                {copiedKey === 'accNum' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted" />}
              </Button>
            </div>

            <div className="p-3 rounded-xl border border-muted-border bg-white flex justify-between items-center">
              <div>
                <span className="text-muted block text-[10px] uppercase font-bold">Branch</span>
                <span className="font-semibold text-ink">{DEFAULT_PLATFORM_BANK_SETTINGS.branch}</span>
              </div>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleCopy(DEFAULT_PLATFORM_BANK_SETTINGS.branch, 'branch')}>
                {copiedKey === 'branch' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted" />}
              </Button>
            </div>
          </div>

          {/* Proof Submission: EITHER Receipt OR Typed Details */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
              Submit Proof of Transfer:
            </h4>

            {/* Option A: Upload Receipt */}
            <div className="border border-dashed border-primary/30 rounded-2xl p-4 text-center bg-mist hover:bg-lavender/30 transition-colors">
              <input
                type="file"
                id="receiptUpload"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <label htmlFor="receiptUpload" className="cursor-pointer block">
                {receiptPreview ? (
                  <div className="space-y-2">
                    <img
                      src={receiptPreview}
                      alt="Receipt preview"
                      className="mx-auto max-h-32 rounded-lg border shadow-sm"
                    />
                    <p className="text-xs text-primary font-semibold">Click to change receipt file</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-6 h-6 text-primary mx-auto mb-1" />
                    <p className="text-xs font-semibold text-ink">
                      Upload Bank Slip or Transfer Screenshot
                    </p>
                    <p className="text-[11px] text-muted">JPG, PNG or PDF (Max 5 MB)</p>
                  </div>
                )}
              </label>
            </div>

            <div className="relative text-center my-2">
              <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-muted font-bold relative z-10">
                OR Enter Transfer Details
              </span>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted-border" />
              </div>
            </div>

            {/* Option B: Typed Transfer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Payer Account Name"
                placeholder="e.g. Rohan Jayasuriya"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
              />
              <Input
                label="Transfer Date"
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
              />
            </div>
            <Input
              label="Bank Transaction / Reference ID"
              placeholder="e.g. HNB-TXN-881920 or Counter Slip #"
              value={bankReference}
              onChange={(e) => setBankReference(e.target.value)}
            />
            <Input
              label="Optional Note to Admin"
              placeholder="e.g. Transferred via HNB Mobile app at 10:30 AM"
              value={ownerNote}
              onChange={(e) => setOwnerNote(e.target.value)}
            />

            {formError && (
              <p className="text-xs font-semibold text-ruby-600 bg-ruby-50 p-2.5 rounded-xl border border-ruby-200">
                {formError}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-muted-border">
            <Button variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              onClick={handleSubmitPayment}
              className="px-8 shadow-glow-md"
            >
              Done Payment
              <Check className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Submission Confirmation State */}
      {step === 3 && (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-ink">Payment Submitted!</h3>
            <p className="text-sm text-muted max-w-md mx-auto">
              {DEFAULT_PLATFORM_BANK_SETTINGS.approvalSlaText}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-lavender/40 border border-muted-border max-w-md mx-auto text-left text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted">Plan:</span>
              <span className="font-semibold text-ink">Glowbook Pro ({planOption.label})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Amount:</span>
              <span className="font-bold text-primary-deep">{formatLKR(planOption.priceLkr)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Transfer Reference:</span>
              <span className="font-mono font-bold text-ink">{billingCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Status:</span>
              <span className="font-semibold text-amber-600">Pending Verification</span>
            </div>
          </div>

          <Button variant="primary" size="lg" onClick={resetAndClose} className="px-8">
            Return to Dashboard
          </Button>
        </div>
      )}
    </Dialog>
  );
}
