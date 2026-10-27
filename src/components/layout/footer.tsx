'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/lib/config/site';
import { POPULAR_DISTRICTS } from '@/lib/config/districts';
import { SALON_CATEGORIES } from '@/lib/config/categories';
import { Sparkles, Phone, Mail, MapPin, Heart } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  // On salon profile and booking pages, render only a clean minimal bar to prevent cluttering the booking flow
  if (!isHomepage) {
    return (
      <footer className="w-full bg-white border-t border-muted-border/60 py-6 text-ink">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr from-[#B26CFF] via-[#C654C3] to-[#2391FF] text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-ink">Glowbook Sri Lanka</span>
            <span>· Zero Signup Salon Booking</span>
          </div>
          <p>© {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-white border-t border-muted-border/80 pt-16 pb-24 md:pb-12 text-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-muted-border/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#B26CFF] via-[#C654C3] to-[#2391FF] text-white shadow-glow-sm">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-ink">
                Glow<span className="text-[#B26CFF]">book</span>
              </span>
            </Link>
            <p className="text-xs text-muted leading-relaxed max-w-sm">
              Sri Lanka’s premier salon booking network. Search trusted salons in Colombo, Kandy, Galle and across the island. Book your appointment in seconds with zero signup required.
            </p>
            <div className="space-y-1.5 text-xs text-ink-light pt-2">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B26CFF]" /> {siteConfig.support.phone}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B26CFF]" /> {siteConfig.support.email}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B26CFF]" /> Colombo 03, Sri Lanka
              </p>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink">Services & Categories</h4>
            <ul className="space-y-2 text-xs text-muted">
              {SALON_CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link href={`/salons?category=${c.slug}`} className="hover:text-[#B26CFF] transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Districts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink">Top Locations</h4>
            <ul className="space-y-2 text-xs text-muted">
              {POPULAR_DISTRICTS.map((d) => (
                <li key={d.id}>
                  <Link href={`/salons/in/${d.id}`} className="hover:text-[#B26CFF] transition-colors">
                    Salons in {d.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/salons" className="font-semibold text-[#B26CFF] hover:underline">
                  View All Districts →
                </Link>
              </li>
            </ul>
          </div>

          {/* For Salons & Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink">Salon Partners</h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <Link href="/for-salons" className="hover:text-[#B26CFF] transition-colors font-medium text-ink">
                  List Your Salon Free
                </Link>
              </li>
              <li>
                <Link href="/for-salons" className="hover:text-[#B26CFF] transition-colors">
                  Pro Plan (LKR 2,000/mo)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#B26CFF] transition-colors">
                  Owner Dashboard Login
                </Link>
              </li>
              <li>
                <Link href="/booking/manage" className="hover:text-[#B26CFF] transition-colors">
                  Lookup Customer Booking
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#B26CFF] transition-colors">
                  Platform Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-ruby-500 fill-ruby-500" /> for Sri Lanka.
          </p>
        </div>
      </div>
    </footer>
  );
}
