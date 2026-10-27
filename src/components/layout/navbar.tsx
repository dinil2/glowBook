'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/sheet';
import { siteConfig } from '@/lib/config/site';
import { DEMO_SALONS } from '@/lib/demo-data';
import { SRI_LANKA_DISTRICTS } from '@/lib/config/districts';
import { SALON_CATEGORIES } from '@/lib/config/categories';
import {
  Search,
  Sparkles,
  MapPin,
  Calendar,
  X,
  Store,
  User,
  Scissors,
  CheckCircle2,
} from 'lucide-react';
import { RoleLoginModal } from '@/components/auth/role-login-modal';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);

  // Live autocomplete results
  const filteredSalons = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return DEMO_SALONS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        s.categories.some((c) => c.toLowerCase().includes(q)) ||
        s.services.some((srv) => srv.name.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [searchQuery]);

  const handleSelectSalon = (slug: string) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
    router.push(`/salons/${slug}`);
  };

  return (
    <>
      <header
        className={cn(
          'z-40 w-full px-4 sm:px-6 py-3 transition-all',
          isHomePage ? 'absolute top-0 left-0 right-0' : 'sticky top-0 bg-mist/80 backdrop-blur-md'
        )}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex h-16 items-center justify-between gap-4 rounded-3xl border border-muted-border/80 bg-white/90 px-4 sm:px-6 shadow-glow-sm backdrop-blur-md">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 select-none group">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#141219] text-white shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5 text-[#C59B27]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-ink font-sans">
                  Glow<span className="text-[#1B4332]">book</span>
                </span>
                <span className="text-[10px] font-bold text-muted -mt-1 tracking-widest uppercase">
                  Sri Lanka
                </span>
              </div>
            </Link>

          {/* Desktop Live Search Bar */}
          <div className="relative hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search salons, services or areas (e.g. Salon Costume, Colombo)..."
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                className="w-full h-10 pl-10 pr-9 rounded-2xl border border-muted-border/80 bg-mist/60 text-xs text-ink placeholder:text-muted/70 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Desktop Autocomplete Popover */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div
                className="absolute top-12 left-0 right-0 z-50 rounded-2xl border border-muted-border bg-white p-2 shadow-glow-lg"
                onMouseLeave={() => setIsSearchOpen(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-muted tracking-wider">
                  Salons & Services
                </div>
                {filteredSalons.length > 0 ? (
                  <div className="space-y-1">
                    {filteredSalons.map((salon) => (
                      <button
                        key={salon.id}
                        type="button"
                        onClick={() => handleSelectSalon(salon.slug)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-lavender/60 text-left transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={salon.logoUrl}
                            alt={salon.name}
                            className="w-8 h-8 rounded-lg object-cover border"
                          />
                          <div>
                            <p className="text-xs font-bold text-ink flex items-center gap-1.5">
                              {salon.name}
                              {salon.plan === 'pro' && (
                                <Sparkles className="w-3 h-3 text-star-gold fill-star-gold" />
                              )}
                            </p>
                            <p className="text-[11px] text-muted flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {salon.city}, {salon.district}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-primary">
                          from LKR {salon.services[0]?.priceLkr.toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-muted">
                    No salons found matching &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-2xl border border-muted-border bg-mist text-ink hover:bg-lavender"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <Link
              href="/salons"
              className="hidden sm:inline-flex text-xs font-bold text-ink hover:text-primary transition-colors px-2.5 py-1.5 rounded-xl hover:bg-mist"
            >
              Explore Salons
            </Link>

            {/* Unified Role-Based Login Trigger (Customer, Owner, Admin) */}
            <Button
              onClick={() => setIsLoginModalOpen(true)}
              variant="outline"
              size="sm"
              className="gap-2 border-[#E8E5DF] hover:border-[#141219] hover:bg-[#FBFBF9] text-[#141219] font-bold shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-[#141219]" />
              <span>Log In</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Full-Screen Mobile Search Sheet */}
      <Sheet
        open={isMobileSearchOpen}
        onOpenChange={setIsMobileSearchOpen}
        position="top"
        title="Search Glowbook"
      >
        <div className="space-y-4 pt-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              autoFocus
              placeholder="Type salon, haircut, bridal, Colombo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-2xl border border-muted-border bg-white text-sm focus:outline-none focus:border-primary shadow-sm"
            />
          </div>

          {searchQuery && (
            <div className="space-y-1 max-h-72 overflow-y-auto">
              {filteredSalons.map((salon) => (
                <button
                  key={salon.id}
                  onClick={() => handleSelectSalon(salon.slug)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-lavender/50 text-left"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={salon.logoUrl}
                      alt={salon.name}
                      className="w-9 h-9 rounded-xl object-cover border"
                    />
                    <div>
                      <p className="text-sm font-bold text-ink">{salon.name}</p>
                      <p className="text-xs text-muted">
                        {salon.city} · {salon.categories.join(', ')}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary">
                    ★ {salon.avgRating}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="pt-2">
            <p className="text-xs font-bold uppercase text-muted mb-2">Popular Categories</p>
            <div className="flex flex-wrap gap-1.5">
              {SALON_CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  href={`/salons?category=${c.slug}`}
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-mist text-xs font-medium text-ink hover:bg-lavender"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Sheet>

      {/* Role-Based Authentication & Booking Lookup Modal */}
      <RoleLoginModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
      />
    </header>
  </>
  );
}
