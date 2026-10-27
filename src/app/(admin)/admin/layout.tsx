'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { DEMO_PAYMENTS } from '@/lib/demo-data';
import {
  LayoutDashboard,
  ShieldCheck,
  CheckSquare,
  Building2,
  CalendarCheck,
  DollarSign,
  Star,
  Sliders,
  History,
  Bell,
  Sparkles,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Unread pending verification payments
  const pendingCount = DEMO_PAYMENTS.filter((p) => p.status === 'pending_review').length;

  const adminNav = [
    { label: 'Platform Overview', href: '/admin', icon: LayoutDashboard },
    {
      label: 'Verify Payments',
      href: '/admin/verification',
      icon: CheckSquare,
      badge: pendingCount > 0 ? `${pendingCount}` : undefined,
    },
    { label: 'Manage Salons', href: '/admin/salons', icon: Building2 },
    { label: 'Platform Bookings', href: '/admin/bookings', icon: CalendarCheck },
    { label: 'Subscription Ledger', href: '/admin/revenue', icon: DollarSign },
    { label: 'Moderate Reviews', href: '/admin/reviews', icon: Star },
    { label: 'Billing Settings', href: '/admin/settings', icon: Sliders },
    { label: 'Audit Logs', href: '/admin/audit', icon: History },
  ];

  return (
    <div className="min-h-screen bg-mist flex flex-col md:flex-row">
      {/* Mobile Admin Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-ink text-white sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-star-gold" />
          <span className="font-extrabold text-sm">Glowbook Admin Panel</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-ink text-white p-4 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2 pt-2">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-primary text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base">Glowbook</span>
                <span className="block text-[10px] uppercase font-bold text-lavender/60 tracking-wider">
                  Admin System
                </span>
              </div>
            </Link>
          </div>

          <nav className="space-y-1">
            {adminNav.map((item) => {
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
                      : 'text-lavender/70 hover:text-white hover:bg-white/10'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-star-gold text-ink text-[10px] font-black animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-2">
          <div className="px-2 text-xs">
            <p className="font-bold text-white">Administrator</p>
            <p className="text-[11px] text-lavender/60">admin@glowbook.lk</p>
          </div>
          <Link href="/">
            <button className="w-full flex items-center gap-2 px-2 py-2 rounded-xl text-xs text-lavender/60 hover:text-white hover:bg-white/5 transition-colors">
              <LogOut className="w-4 h-4" /> Exit to Public Site
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
