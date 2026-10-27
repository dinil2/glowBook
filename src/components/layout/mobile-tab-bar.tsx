'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Compass, CalendarCheck, Store } from 'lucide-react';

export function MobileTabBar() {
  const pathname = usePathname();

  // Hide mobile tab bar on owner dashboard or admin panel to avoid navigation collisions
  if (pathname.startsWith('/owner') || pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Explore', href: '/salons', icon: Compass },
    { label: 'My Booking', href: '/booking/manage', icon: CalendarCheck },
    { label: 'For Salons', href: '/for-salons', icon: Store },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/90 backdrop-blur-lg border-t border-muted-border/80 px-4 py-2 shadow-float">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200',
                isActive ? 'text-primary font-bold scale-105' : 'text-muted hover:text-ink font-medium'
              )}
            >
              <Icon className={cn('w-5 h-5 mb-0.5', isActive && 'text-primary stroke-[2.5]')} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
