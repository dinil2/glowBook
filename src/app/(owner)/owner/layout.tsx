'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { DEMO_SALONS, DemoSalon } from '@/lib/demo-data';
import { can, getBookingCapStatus } from '@/features/billing/plans';
import { ProBadge } from '@/components/common/pro-badge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UpgradeModal } from '@/components/common/upgrade-modal';

import {
  LayoutDashboard,
  CalendarCheck,
  CalendarRange,
  Scissors,
  Users,
  Image as ImageIcon,
  Clock,
  Star,
  UserCheck,
  BarChart3,
  MessageSquare,
  QrCode,
  CreditCard,
  Settings,
  Sparkles,
  Lock,
  LogOut,
  ExternalLink,
  Menu,
  X,
  AlertTriangle,
} from 'lucide-react';

import { OwnerSalonContext } from '@/features/owner/context/owner-salon-context';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthOrOnboarding = pathname === '/owner/signup' || pathname === '/owner/onboarding';

  if (isAuthOrOnboarding) {
    return <>{children}</>;
  }

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);

  // For demo/development switching: default to Salon Costume (Pro) or Luxe Looks (Free)
  const [currentSalonId, setCurrentSalonId] = React.useState<string>('salon-1');
  const currentSalon: DemoSalon =
    DEMO_SALONS.find((s) => s.id === currentSalonId) || DEMO_SALONS[0];

  const isPro = currentSalon.plan === 'pro';
  const capStatus = getBookingCapStatus(currentSalon.monthlyBookingsCount, isPro ? Infinity : 30);

  const navLinks = [
    { label: 'Overview', href: '/owner', icon: LayoutDashboard },
    { label: 'Bookings', href: '/owner/bookings', icon: CalendarCheck },
    {
      label: 'Staff Calendar',
      href: '/owner/calendar',
      icon: CalendarRange,
      isProOnly: !can(currentSalon, 'staffVisualCalendar'),
    },
    { label: 'Services', href: '/owner/services', icon: Scissors },
    { label: 'Staff Team', href: '/owner/staff', icon: Users },
    { label: 'Gallery', href: '/owner/gallery', icon: ImageIcon },
    { label: 'Working Hours', href: '/owner/hours', icon: Clock },
    { label: 'Client Reviews', href: '/owner/reviews', icon: Star },
    {
      label: 'Customers & Export',
      href: '/owner/customers',
      icon: UserCheck,
      isProOnly: !can(currentSalon, 'customerDirectoryAndExport'),
    },
    {
      label: 'Revenue Analytics',
      href: '/owner/analytics',
      icon: BarChart3,
      isProOnly: !can(currentSalon, 'revenueAndAnalyticsReports'),
    },
    {
      label: 'WhatsApp Messages',
      href: '/owner/messages',
      icon: MessageSquare,
      isProOnly: !can(currentSalon, 'whatsAppCustomerMessages'),
    },
    { label: 'Share Kit & QR', href: '/owner/share', icon: QrCode },
    { label: 'Plan & Billing', href: '/owner/billing', icon: CreditCard },
    { label: 'Settings', href: '/owner/settings', icon: Settings },
  ];

  return (
    <OwnerSalonContext.Provider value={{ currentSalon, setCurrentSalonId, isPro, setShowUpgradeModal }}>
      <div className="min-h-screen bg-mist flex flex-col md:flex-row">
      {/* Mobile Owner Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-muted-border sticky top-0 z-30">
        <Link href="/owner" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 text-star-gold" />
          </div>
          <span className="font-extrabold text-ink text-base">Glowbook Partner</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-muted hover:bg-mist"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-muted-border p-4 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="space-y-6 overflow-y-auto">
          {/* Logo & Platform link */}
          <div className="flex items-center justify-between px-2 pt-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-primary-deep text-white flex items-center justify-center shadow-glow-sm">
                <Sparkles className="w-4 h-4 text-star-gold fill-star-gold" />
              </div>
              <div>
                <span className="font-extrabold text-ink text-base">Glowbook</span>
                <span className="block text-[10px] uppercase font-bold text-muted -mt-1 tracking-wider">
                  Partner Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Active Salon Selector */}
          <div className="p-3 rounded-2xl bg-mist border border-muted-border/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-muted tracking-wider">Active Salon</span>
              {isPro ? <ProBadge size="sm" /> : <Badge variant="secondary">Free Tier</Badge>}
            </div>
            <select
              value={currentSalonId}
              onChange={(e) => setCurrentSalonId(e.target.value)}
              className="w-full p-2 text-xs font-bold rounded-xl bg-white border border-muted-border text-ink focus:outline-none focus:border-primary shadow-sm"
              title="Select active salon profile"
            >
              <option value="salon-1">Salon Costume (Colombo 07 - Pro)</option>
              <option value="salon-9">Luxe Looks (Pita Kotte - Free 27/30)</option>
              <option value="salon-8">Serendib Glow (Kandy - 30D Trial)</option>
            </select>
            <div className="flex items-center justify-between pt-0.5">
              <Link
                href={`/salons/${currentSalon.slug}`}
                target="_blank"
                className="text-[11px] font-semibold text-primary flex items-center gap-1 hover:underline"
              >
                <ExternalLink className="w-3 h-3" /> View Public Profile
              </Link>
              <span className="text-[10px] text-muted">Switch location</span>
            </div>
          </div>

          {/* Monthly Booking Cap Meter for Free Salons */}
          {!isPro && (
            <div className="p-3 rounded-2xl bg-lavender/50 border border-primary/20 space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-ink">Free Booking Cap</span>
                <span className={capStatus.isNearCap ? 'text-ruby-600 font-extrabold' : 'text-primary-deep'}>
                  {currentSalon.monthlyBookingsCount} / 30
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    capStatus.isNearCap ? 'bg-amber-500' : 'bg-primary'
                  )}
                  style={{ width: `${Math.min(100, (currentSalon.monthlyBookingsCount / 30) * 100)}%` }}
                />
              </div>
              {capStatus.isNearCap && (
                <p className="text-[10px] text-amber-700 font-semibold flex items-center gap-1 pt-0.5">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  {capStatus.remaining} bookings left this month
                </p>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowUpgradeModal(true)}
                className="w-full text-xs h-7 mt-1"
              >
                Upgrade to Pro
              </Button>
            </div>
          )}

          {/* Nav List */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-primary text-white shadow-glow-sm'
                      : 'text-muted hover:text-ink hover:bg-mist'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-muted')} />
                    <span>{item.label}</span>
                  </div>
                  {item.isProOnly && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-star-gold/20 text-ink text-[9px] font-extrabold">
                      <Lock className="w-2.5 h-2.5" /> PRO
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Logout */}
        <div className="pt-4 border-t border-muted-border space-y-2">
          <div className="flex items-center gap-3 px-2">
            <img
              src={currentSalon.logoUrl}
              alt={currentSalon.name}
              className="w-9 h-9 rounded-xl object-cover border"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-ink truncate">{currentSalon.name}</p>
              <p className="text-[10px] text-muted truncate">{currentSalon.email}</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="w-full justify-start text-muted text-xs">
              <LogOut className="w-3.5 h-3.5 mr-2" /> Exit to Homepage
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Owner Content */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full">{children}</main>

      {/* Upgrade Modal */}
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        salonName={currentSalon.name}
        billingCode={currentSalon.billingCode}
      />
      </div>
    </OwnerSalonContext.Provider>
  );
}
