'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DEMO_SALONS, DEMO_PAYMENTS, DEMO_BOOKINGS } from '@/lib/demo-data';
import { formatLKR } from '@/lib/utils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import {
  ShieldCheck,
  Building2,
  CalendarCheck,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const mrrGrowthData = [
  { month: 'Jun', mrr: 8000, proCount: 4 },
  { month: 'Jul', mrr: 10000, proCount: 5 },
  { month: 'Aug', mrr: 12000, proCount: 6 },
  { month: 'Sep', mrr: 14000, proCount: 7 },
  { month: 'Oct', mrr: 16000, proCount: 8 },
];

export default function AdminOverviewPage() {
  const pendingPayments = DEMO_PAYMENTS.filter((p) => p.status === 'pending_review');
  const proSalons = DEMO_SALONS.filter((s) => s.plan === 'pro');
  const freeSalons = DEMO_SALONS.filter((s) => s.plan === 'free');

  // MRR: Pro salons * LKR 2,000/mo
  const currentMrr = proSalons.length * 2000;
  const conversionRate = Math.round((proSalons.length / DEMO_SALONS.length) * 100);

  // Expiring within 7 days:
  const expiringSoon = proSalons.filter(
    (s) => s.planExpiresAt && new Date(s.planExpiresAt).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
              Platform Administration
            </h1>
            <Badge variant="purple" className="text-xs">
              Live System
            </Badge>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Island-wide salon performance, subscription MRR, and payment verification queue.
          </p>
        </div>

        {pendingPayments.length > 0 && (
          <Link href="/admin/verification">
            <Button variant="primary" size="md" className="shadow-glow-md">
              <AlertCircle className="w-4 h-4 mr-1.5 text-star-gold" />
              {pendingPayments.length} Payments Need Review →
            </Button>
          </Link>
        )}
      </div>

      {/* Subscription & MRR KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Subscription MRR
          </span>
          <p className="text-2xl font-black text-primary-deep">{formatLKR(currentMrr)}</p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 8 Active Pro Subscriptions
          </p>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Active Salons
          </span>
          <p className="text-2xl font-black text-ink">{DEMO_SALONS.length}</p>
          <p className="text-[11px] text-muted">
            {proSalons.length} Pro · {freeSalons.length} Free Starter
          </p>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Free → Pro Conversion
          </span>
          <p className="text-2xl font-black text-ink">{conversionRate}%</p>
          <p className="text-[11px] text-muted">Exceeds 25% target</p>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Expiring in 7 Days
          </span>
          <p className="text-2xl font-black text-amber-600">{expiringSoon.length} Salons</p>
          <p className="text-[11px] text-muted">Velvet Touch (Renewal queued)</p>
        </Card>
      </div>

      {/* MRR Growth Chart */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>Platform MRR & Subscription Growth</CardTitle>
          <span className="text-xs font-bold text-primary">Monthly Recurring Revenue (LKR)</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mrrGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E3F5" />
              <XAxis dataKey="month" stroke="#6B6785" fontSize={12} />
              <YAxis
                stroke="#6B6785"
                fontSize={12}
                tickFormatter={(val) => `LKR ${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip formatter={(val: any) => [`LKR ${Number(val).toLocaleString()}`, 'MRR']} />
              <Bar dataKey="mrr" fill="#8B6CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Urgent Action Row: Pending Review Payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              Subscription Payments Awaiting Verification ({pendingPayments.length})
            </CardTitle>
            <p className="text-xs text-muted mt-0.5">
              Offline HNB bank transfers requiring admin audit.
            </p>
          </div>
          <Link href="/admin/verification">
            <Button variant="outline" size="sm">
              Open Verification Queue →
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingPayments.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-mist border border-muted-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div>
                <span className="font-bold text-ink text-sm block">{p.salonName}</span>
                <span className="font-mono text-primary font-bold">{p.referenceCode}</span>
                <span className="text-muted ml-2">
                  Amount: <strong>{formatLKR(p.amountLkr)}</strong> ({p.months} month(s))
                </span>
                <span className="text-muted-light block mt-0.5">
                  Submitted {new Date(p.submittedAt).toLocaleTimeString('en-LK')} · Payer:{' '}
                  {p.payerName || 'Bank Slip Upload'}
                </span>
              </div>
              <Link href="/admin/verification">
                <Button variant="primary" size="sm">
                  Review & Approve
                </Button>
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
