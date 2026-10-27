'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProBadge } from '@/components/common/pro-badge';
import { DEMO_SALONS, DEMO_BOOKINGS, DemoBooking } from '@/lib/demo-data';
import { formatLKR } from '@/lib/utils';
import { can, getBookingCapStatus } from '@/features/billing/plans';
import { UpgradeModal } from '@/components/common/upgrade-modal';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Star,
  Plus,
  Sparkles,
  Phone,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

import { useOwnerSalon } from '@/features/owner/context/owner-salon-context';

export default function OwnerOverviewPage() {
  const { currentSalon: salon, isPro } = useOwnerSalon();

  const [bookings, setBookings] = React.useState<DemoBooking[]>(DEMO_BOOKINGS.slice(0, 15));
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);

  // Today's bookings
  const todayBookings = bookings.slice(0, 5);

  const handleUpdateStatus = (id: string, newStatus: DemoBooking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    toast.success(`Booking status updated to ${newStatus}`);
  };

  const todayRevenue = todayBookings
    .filter((b) => b.status === 'completed' || b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalLkr, 0);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
              Welcome back, {salon.name}
            </h1>
            {isPro ? <ProBadge size="md" /> : <Badge variant="secondary">Free Plan</Badge>}
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Overview of today’s salon appointments and client traffic.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/owner/bookings">
            <Button variant="primary" size="sm" className="shadow-sm">
              <Plus className="w-4 h-4 mr-1" /> Add Walk-in Booking
            </Button>
          </Link>
          {!isPro && (
            <Button
              variant="gold"
              size="sm"
              onClick={() => setShowUpgradeModal(true)}
              className="gap-1 font-bold"
            >
              <Sparkles className="w-4 h-4" /> Upgrade Pro
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">
            Today&apos;s Bookings
          </span>
          <p className="text-2xl font-black text-ink">{todayBookings.length}</p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> All slots scheduled
          </p>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">
            Est. Today&apos;s Revenue
          </span>
          <p className="text-2xl font-black text-primary-deep">{formatLKR(todayRevenue)}</p>
          <p className="text-[11px] text-muted">Pay-at-salon total</p>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">
            Monthly Bookings
          </span>
          <p className="text-2xl font-black text-ink">
            {salon.monthlyBookingsCount}
            {!isPro && <span className="text-sm text-muted font-normal"> / 30</span>}
          </p>
          <p className="text-[11px] text-muted">
            {isPro ? 'Unlimited on Pro' : `${30 - salon.monthlyBookingsCount} slots remaining`}
          </p>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">
            Client Rating
          </span>
          <p className="text-2xl font-black text-ink flex items-center gap-1.5">
            <Star className="w-5 h-5 fill-star-gold text-star-gold" />
            {salon.avgRating}
          </p>
          <p className="text-[11px] text-muted">{salon.reviewCount} verified reviews</p>
        </Card>
      </div>

      {/* Today's Bookings Timeline & To-Do List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Today&apos;s Appointment Schedule</CardTitle>
            <p className="text-xs text-muted mt-0.5">
              Live updates as guests arrive at your salon.
            </p>
          </div>
          <Link href="/owner/bookings">
            <Button variant="ghost" size="sm" className="text-primary text-xs">
              View All Bookings →
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="space-y-3">
          {todayBookings.map((b, idx) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-white border border-muted-border/80 shadow-subtle hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-lavender text-primary-deep flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] uppercase font-bold text-primary">Time</span>
                  <span className="font-extrabold text-xs">
                    {new Date(b.startsAt).toLocaleTimeString('en-LK', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-ink">{b.customerName}</span>
                    <span className="text-[10px] font-mono font-bold text-muted bg-mist px-2 py-0.5 rounded-md">
                      {b.reference}
                    </span>
                    <Badge
                      variant={
                        b.status === 'completed'
                          ? 'success'
                          : b.status === 'cancelled'
                          ? 'danger'
                          : 'primary'
                      }
                      className="text-[10px] py-0 px-2 uppercase"
                    >
                      {b.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted">
                    {b.serviceNames.join(', ')} ·{' '}
                    <strong className="text-ink">{formatLKR(b.totalLkr)}</strong>
                  </p>
                  <p className="text-[11px] text-muted-light flex items-center gap-2">
                    <span>Phone: {b.customerPhone}</span>
                    {b.notes && <span className="italic text-primary font-medium">Note: {b.notes}</span>}
                  </p>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
                {b.status !== 'completed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus(b.id, 'completed')}
                    className="text-emerald-700 border-emerald-300 hover:bg-emerald-50 text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Complete
                  </Button>
                )}
                {b.status !== 'no_show' && b.status !== 'completed' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateStatus(b.id, 'no_show')}
                    className="text-amber-700 hover:bg-amber-50 text-xs"
                  >
                    No Show
                  </Button>
                )}
                {b.status !== 'cancelled' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                    className="text-ruby-600 hover:bg-ruby-50 text-xs"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upgrade Modal */}
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        salonName={salon.name}
        billingCode={salon.billingCode}
      />
    </div>
  );
}
