'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PLAN_PRICING, PLANS } from '@/features/billing/plans';
import { DEFAULT_PLATFORM_BANK_SETTINGS } from '@/lib/config/bank';
import { formatLKR } from '@/lib/utils';
import {
  Sparkles,
  Check,
  X,
  Store,
  Calendar,
  Users,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  MessageCircle,
  Building,
  CreditCard,
  QrCode,
  HelpCircle,
} from 'lucide-react';

export default function ForSalonsPage() {
  const [billingPeriod, setBillingPeriod] = React.useState<1 | 3 | 12>(3);
  const planOption = PLAN_PRICING[billingPeriod];

  return (
    <div className="min-h-screen bg-mist">
      {/* Hero */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-mist border-b border-muted-border/60">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="purple" className="px-3.5 py-1 text-xs">
            Glowbook for Salon Owners & Independent Stylists
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-ink tracking-tight leading-tight">
            Stop losing bookings to missed calls.{' '}
            <span className="font-display italic font-normal text-primary">Grow your salon.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Put your salon online in 5 minutes. Accept instant online appointments, get your own booking link and QR code, and streamline your team.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/owner/signup">
              <Button variant="primary" size="xl" className="shadow-glow-md">
                Register Your Salon Free <ArrowRight className="w-5 h-5 ml-1.5" />
              </Button>
            </Link>
            <Link href="/owner">
              <Button variant="outline" size="xl">
                Owner Dashboard Login
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted">
            ✓ Free listing · No credit card required · 30-day Pro trial automatically included
          </p>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-lavender text-primary flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-ink">Fill Empty Chairs 24/7</h3>
            <p className="text-xs text-muted leading-relaxed">
              Clients can book late at night or during your busiest shifts without interrupting your haircuts or treatments.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-soft-purple text-primary-deep flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-ink">Your Own Booking Link & QR</h3>
            <p className="text-xs text-muted leading-relaxed">
              Place your personalized Glowbook link on Instagram bio, TikTok, and WhatsApp business. Print your QR code on appointment cards.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-glow-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-ink">Keep 100% of Service Revenue</h3>
            <p className="text-xs text-muted leading-relaxed">
              Clients pay directly at your counter. Glowbook charges zero commission per appointment.
            </p>
          </Card>
        </div>
      </section>

      {/* Free vs Pro Pricing Table */}
      <section className="py-16 bg-white border-y border-muted-border/60 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-ink tracking-tight">
              Transparent, Simple Plans
            </h2>
            <p className="text-sm text-muted">
              Start with Free, upgrade to Pro anytime via simple HNB bank transfer.
            </p>

            {/* Period Switcher */}
            <div className="inline-flex p-1 rounded-2xl bg-mist border border-muted-border mt-4">
              {([1, 3, 12] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setBillingPeriod(period)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    billingPeriod === period
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {period === 1 ? '1 Month' : period === 3 ? '3 Months (Save 10%)' : 'Annual (Save 20%)'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Free Plan */}
            <div className="rounded-3xl border border-muted-border p-8 bg-mist/60 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <Badge variant="secondary">Starter</Badge>
                <div>
                  <h3 className="text-2xl font-bold text-ink">Free Plan</h3>
                  <p className="text-xs text-muted mt-1">Great for new or home-based stylists</p>
                </div>
                <div className="text-3xl font-black text-ink">LKR 0</div>

                <div className="space-y-2.5 pt-4 border-t border-muted-border text-xs text-ink-light">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Up to 30 online bookings per month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Up to 8 services / packages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Up to 2 staff members (auto-assigned)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Up to 6 gallery photos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Personalized booking link & basic QR code</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-light line-through">
                    <X className="w-4 h-4 text-muted-border" />
                    <span>Direct Call & WhatsApp buttons (Hidden)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-light line-through">
                    <X className="w-4 h-4 text-muted-border" />
                    <span>Client stylist selection</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-light line-through">
                    <X className="w-4 h-4 text-muted-border" />
                    <span>Revenue & Analytics reports</span>
                  </div>
                </div>
              </div>

              <Link href="/owner/signup">
                <Button variant="outline" size="lg" className="w-full">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="rounded-3xl border-2 border-primary bg-white p-8 shadow-glow-lg flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3 right-8">
                <span className="bg-star-gold text-ink text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
                  ★ Most Popular
                </span>
              </div>

              <div className="space-y-4">
                <Badge variant="purple">Verified Pro</Badge>
                <div>
                  <h3 className="text-2xl font-bold text-ink">Glowbook Pro</h3>
                  <p className="text-xs text-muted mt-1">For busy salons seeking full capacity</p>
                </div>

                <div className="space-y-0.5">
                  <div className="text-3xl font-black text-primary-deep">
                    {formatLKR(planOption.priceLkr)}
                  </div>
                  <p className="text-xs text-muted">
                    Billed as {planOption.label} · Zero booking commission
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-muted-border text-xs text-ink-light">
                  <div className="flex items-center gap-2 font-bold text-ink">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Unlimited bookings (Zero monthly cap)</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-ink">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Direct Call & WhatsApp buttons visible on profile</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-ink">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Client stylist picker enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Unlimited services & up to 30 gallery photos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Visual staff calendar (Day & Week columns)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Revenue & Analytics reports + Customer CSV export</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>WhatsApp reminders & confirmation templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Verified Pro badge & search ranking boost</span>
                  </div>
                </div>
              </div>

              <Link href="/owner/signup">
                <Button variant="primary" size="lg" className="w-full shadow-glow-md">
                  Register with 30-Day Pro Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How the HNB Bank Transfer Works */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="secondary">Bank Transfer Process</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">
            How Upgrading to Pro Works
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Simple, secure manual bank transfer verified by our team within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-3xl bg-white border border-muted-border space-y-2">
            <span className="w-10 h-10 rounded-2xl bg-lavender text-primary-deep font-black flex items-center justify-center mx-auto">
              1
            </span>
            <h4 className="font-bold text-sm text-ink">Get Your Reference</h4>
            <p className="text-xs text-muted leading-relaxed">
              Your salon has a unique 4-digit code (e.g. <code>SALONCOSTUME-4821</code>) generated automatically in your dashboard.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-muted-border space-y-2">
            <span className="w-10 h-10 rounded-2xl bg-lavender text-primary-deep font-black flex items-center justify-center mx-auto">
              2
            </span>
            <h4 className="font-bold text-sm text-ink">Transfer to HNB</h4>
            <p className="text-xs text-muted leading-relaxed">
              Transfer via your banking app, online portal or counter deposit. Enter your billing code in the remarks field.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-muted-border space-y-2">
            <span className="w-10 h-10 rounded-2xl bg-lavender text-primary-deep font-black flex items-center justify-center mx-auto">
              3
            </span>
            <h4 className="font-bold text-sm text-ink">Instant Verification</h4>
            <p className="text-xs text-muted leading-relaxed">
              Upload your slip or enter reference details. Our team approves your payment, instantly unlocking Pro features.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
