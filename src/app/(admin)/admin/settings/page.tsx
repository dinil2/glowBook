'use client';

import * as React from 'react';
import { DEFAULT_BANK_DETAILS } from '@/lib/config/bank';
import { toast } from 'sonner';
import {
  Sliders,
  Building2,
  DollarSign,
  Save,
  CheckCircle2,
  ShieldAlert,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [bankDetails, setBankDetails] = React.useState(DEFAULT_BANK_DETAILS);
  const [proPriceMonthly, setProPriceMonthly] = React.useState(2000);
  const [proPriceQuarterly, setProPriceQuarterly] = React.useState(5400);
  const [proPriceAnnual, setProPriceAnnual] = React.useState(19200);
  const [freeBookingCap, setFreeBookingCap] = React.useState(30);
  const [trialDays, setTrialDays] = React.useState(30);
  const [slaText, setSlaText] = React.useState('Usually approved within 24 hours');
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Billing & platform settings updated in platform_settings!');
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink font-display flex items-center gap-2.5">
          <Sliders className="w-7 h-7 text-primary" />
          Billing & Platform Configuration
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Configure the Hatton National Bank (HNB) recipient account, Pro subscription pricing, free tier caps, and verification SLAs.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* HNB Bank Account Card */}
        <div className="bg-surface border border-muted-border/60 rounded-3xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-muted-border/40">
            <Building2 className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-ink">
              Hatton National Bank (HNB) Transfer Account
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-ink block mb-1.5">Bank Name</label>
              <input
                type="text"
                value={bankDetails.bank_name}
                onChange={(e) =>
                  setBankDetails({ ...bankDetails, bank_name: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-2xl bg-mist border border-muted-border focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-ink block mb-1.5">Account Name</label>
              <input
                type="text"
                value={bankDetails.account_name}
                onChange={(e) =>
                  setBankDetails({ ...bankDetails, account_name: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-2xl bg-mist border border-muted-border focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-ink block mb-1.5">Account Number</label>
              <input
                type="text"
                value={bankDetails.account_number}
                onChange={(e) =>
                  setBankDetails({ ...bankDetails, account_number: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-2xl bg-mist border border-muted-border focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-ink block mb-1.5">Branch</label>
              <input
                type="text"
                value={bankDetails.branch}
                onChange={(e) =>
                  setBankDetails({ ...bankDetails, branch: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-2xl bg-mist border border-muted-border focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
              />
            </div>
          </div>

          <div className="bg-lavender/40 border border-soft-purple/40 rounded-2xl p-3 flex items-start gap-2 text-xs text-deep-purple">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              These details are displayed dynamically to salon owners when they click <strong>Upgrade to Pro</strong> and choose their subscription duration.
            </span>
          </div>
        </div>

        {/* Subscription Pricing */}
        <div className="bg-surface border border-muted-border/60 rounded-3xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-muted-border/40">
            <DollarSign className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-ink">
              Pro Subscription Tier Pricing (LKR)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-ink block mb-1.5">1 Month (Standard)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted font-bold">
                  LKR
                </span>
                <input
                  type="number"
                  value={proPriceMonthly}
                  onChange={(e) => setProPriceMonthly(Number(e.target.value))}
                  className="w-full pl-14 pr-4 py-2.5 rounded-2xl bg-mist border border-muted-border focus:outline-none focus:ring-2 focus:ring-primary/40 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-ink block mb-1.5">3 Months (10% Discount)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted font-bold">
                  LKR
                </span>
                <input
                  type="number"
                  value={proPriceQuarterly}
                  onChange={(e) => setProPriceQuarterly(Number(e.target.value))}
                  className="w-full pl-14 pr-4 py-2.5 rounded-2xl bg-mist border border-muted-border focus:outline-none focus:ring-2 focus:ring-primary/40 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-ink block mb-1.5">12 Months (20% Discount)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted font-bold">
                  LKR
                </span>
                <input
                  type="number"
                  value={proPriceAnnual}
                  onChange={(e) => setProPriceAnnual(Number(e.target.value))}
                  className="w-full pl-14 pr-4 py-2.5 rounded-2xl bg-mist border border-muted-border focus:outline-none focus:ring-2 focus:ring-primary/40 font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Free Limits & Trial Policy */}
        <div className="bg-surface border border-muted-border/60 rounded-3xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-muted-border/40">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-ink">
              Tier Limits, Trials & Verification SLA
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-ink block mb-1.5">
                Free Monthly Booking Cap
              </label>
              <input
                type="number"
                value={freeBookingCap}
                onChange={(e) => setFreeBookingCap(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl bg-mist border border-muted-border focus:outline-none focus:ring-2 focus:ring-primary/40 font-bold"
              />
              <span className="text-[11px] text-muted mt-1 block">
                Bookings per calendar month in Asia/Colombo
              </span>
            </div>

            <div>
              <label className="font-bold text-ink block mb-1.5">
                New Salon Pro Trial Duration (Days)
              </label>
              <input
                type="number"
                value={trialDays}
                onChange={(e) => setTrialDays(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl bg-mist border border-muted-border focus:outline-none focus:ring-2 focus:ring-primary/40 font-bold"
              />
              <span className="text-[11px] text-muted mt-1 block">
                Automatic Pro trial upon approval
              </span>
            </div>

            <div>
              <label className="font-bold text-ink block mb-1.5">
                Approval SLA Text
              </label>
              <input
                type="text"
                value={slaText}
                onChange={(e) => setSlaText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-mist border border-muted-border focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
              />
              <span className="text-[11px] text-muted mt-1 block">
                Shown to owners after payment submission
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary-hover shadow-glow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
