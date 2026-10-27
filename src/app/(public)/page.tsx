'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProBadge } from '@/components/common/pro-badge';
import { siteConfig } from '@/lib/config/site';
import { DEMO_SALONS } from '@/lib/demo-data';
import { SRI_LANKA_DISTRICTS } from '@/lib/config/districts';
import { SALON_CATEGORIES } from '@/lib/config/categories';
import { formatLKR } from '@/lib/utils';
import { BookingModal } from '@/features/booking/components/booking-modal';
import {
  Search,
  MapPin,
  Calendar,
  Sparkles,
  Scissors,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Crown,
  Heart,
  ChevronDown,
  ChevronRight,
  UserCheck,
  TrendingUp,
  Store,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedDistrict, setSelectedDistrict] = React.useState('all');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [activeFaq, setActiveFaq] = React.useState<number | null>(null);

  // Hero interactive salon switcher ("I want more")
  const heroShowcaseSalons = [DEMO_SALONS[0], DEMO_SALONS[1], DEMO_SALONS[2]];
  const [activeHeroSalonIndex, setActiveHeroSalonIndex] = React.useState(0);
  const currentHeroSalon = heroShowcaseSalons[activeHeroSalonIndex] || DEMO_SALONS[0];

  // Direct Booking Modal state from homepage hero
  const [isHeroBookingOpen, setIsHeroBookingOpen] = React.useState(false);
  const [heroBookingSalon, setHeroBookingSalon] = React.useState(DEMO_SALONS[0]);

  const handleOpenHeroBooking = (salon: typeof DEMO_SALONS[0]) => {
    setHeroBookingSalon(salon);
    setIsHeroBookingOpen(true);
  };

  // Featured top-rated salons
  const featuredSalons = React.useMemo(
    () => DEMO_SALONS.filter((s) => s.isFeatured),
    []
  );

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    if (selectedDistrict !== 'all') params.set('district', selectedDistrict);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    router.push(`/salons?${params.toString()}`);
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* ========================================================
          1. HERO & TRUST STATS VIEWPORT CONTAINER (Full Viewport Fit on 24" monitors)
          ======================================================== */}
      <div className="relative min-h-screen flex flex-col justify-between overflow-hidden pt-24 sm:pt-28">
        {/* Real High-End Salon Interior Background Image - Full Viewport, Edge-to-Edge */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="/images/hero-salon-bg.jpg"
            alt="Luxury Salon Interior"
            className="w-full h-full object-cover object-center"
          />
          {/* Uniform luxury overlay: allows the full salon interior (chairs, mirrors, lush plants) to shine through edge-to-edge with no cutoffs */}
          <div className="absolute inset-0 bg-neutral-950/45 backdrop-blur-[0.5px]" />
        </div>

        {/* Hero Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1 flex items-center py-8 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full">
            {/* Left Column: Headlines & Search Form */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Sri Lanka’s Curated Salon Booking Network</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] drop-shadow-md"
              >
                Search any salon in Sri Lanka and book your appointment{' '}
                <span className="font-display italic font-normal text-amber-300">
                  easily.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2 }}
                className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal drop-shadow-sm"
              >
                One trusted place to discover top salons in Colombo, Kandy, Galle and across the island. Book verified slots in seconds with zero signup required.
              </motion.p>

              {/* Prominent Search Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="p-4 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-xl border border-[#E8E5DF] shadow-card max-w-2xl mx-auto lg:mx-0"
              >
                <form onSubmit={handleHeroSearch} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Salon / Service Name */}
                    <div className="sm:col-span-6 relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6B78]" />
                      <input
                        type="text"
                        placeholder="Salon name or service (e.g. Balayage)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-12 pl-10 pr-3 rounded-2xl bg-[#FBFBF9] text-xs text-[#141219] placeholder:text-[#6E6B78] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#141219]/10 border border-[#E8E5DF] focus:border-[#141219] transition-all font-medium"
                      />
                    </div>

                    {/* District Dropdown */}
                    <div className="sm:col-span-6 relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6B78]" />
                      <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="w-full h-12 pl-10 pr-8 rounded-2xl bg-[#FBFBF9] text-xs text-[#141219] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#141219]/10 border border-[#E8E5DF] focus:border-[#141219] transition-all font-medium appearance-none cursor-pointer"
                      >
                        <option value="all">All Districts (Island-wide)</option>
                        {SRI_LANKA_DISTRICTS.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} District
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6B78] pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                    {/* Quick category filter with prefetch */}
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                      <span className="text-[11px] font-bold uppercase text-[#6E6B78] shrink-0 mr-1">
                        Trending:
                      </span>
                      {[
                        { id: 'hair', label: 'Hair' },
                        { id: 'barber', label: 'Barber' },
                        { id: 'bridal', label: 'Bridal' },
                        { id: 'facial', label: 'Facial' },
                        { id: 'nails', label: 'Nails' },
                      ].map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/salons?category=${cat.id}`}
                          prefetch={true}
                          className="px-2.5 py-1 rounded-xl bg-[#FBFBF9] hover:bg-[#F4F2EB] text-[11px] font-semibold text-[#141219] shrink-0 border border-[#E8E5DF] transition-colors"
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      className="w-full sm:w-auto px-7 font-bold shadow-sm"
                    >
                      <Search className="w-4 h-4 mr-1.5" />
                      Search Salons
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>

            {/* Right Column: Floating Luxury Salon Cards celebrating real background photography */}
            <div className="lg:col-span-5 relative hidden lg:block">
              {/* Floating Featured Salon Spotlight Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative ml-auto max-w-sm rounded-3xl bg-white/95 backdrop-blur-md p-5 border border-[#E8E5DF] shadow-card space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1B4332] bg-[#EBF4F0] px-2.5 py-0.5 rounded-full">
                    Featured Spotlight
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#141219]">
                    <Star className="w-3.5 h-3.5 text-[#C59B27] fill-[#C59B27]" />
                    <span>4.92 (38 reviews)</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-black text-lg text-[#141219] tracking-tight">
                    Salon Costume
                  </h3>
                  <p className="text-xs text-[#6E6B78] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#1B4332]" /> 42/1 Horton Place, Cinnamon Gardens, Colombo 07
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FBFBF9] border border-[#E8E5DF] space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[#6E6B78]">
                    <span>Signature Treatment</span>
                    <span className="font-semibold text-[#1B4332]">150 mins</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-[#141219] pt-0.5">
                    <span>Bespoke Balayage & Glossing</span>
                    <span className="text-sm font-black">LKR 32,000</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => handleOpenHeroBooking(DEMO_SALONS[0])}
                  className="w-full font-bold shadow-sm"
                >
                  Book at Salon Costume →
                </Button>
              </motion.div>

              {/* Floating Instant Booking Trust Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-4 ml-auto max-w-sm rounded-2xl bg-white/95 backdrop-blur-md p-3.5 border border-[#E8E5DF] shadow-card flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EBF4F0] text-[#1B4332] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#1B4332]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#141219]">Instant Appointment Confirmed</p>
                  <p className="text-[11px] text-[#6E6B78]">Zero signup · No advance deposit · Pay at salon</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* 2. DOCKED TRUST STATS BAR (Anchored at the bottom of the hero fold with zero awkward gap on 24" screens) */}
        <section className="relative z-10 w-full bg-neutral-950/70 backdrop-blur-md border-t border-white/10 py-5 sm:py-6 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">20+</p>
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                  Premier Salons
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">700+</p>
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                  Monthly Bookings
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">12</p>
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                  Districts Covered
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">4.9 ★</p>
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                  Average Rating
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================
          3. BROWSE BY CATEGORY
          ======================================================== */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Explore by Treatment & Category
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              From signature precision haircuts to luxury bridal couture and spa therapies.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3.5">
            {SALON_CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/salons?category=${category.slug}`}
                className="group p-4 rounded-3xl bg-white border border-muted-border/80 shadow-subtle hover:shadow-glow-sm hover:border-primary/50 transition-all duration-300 text-center flex flex-col items-center justify-between"
              >
                <div className="w-12 h-12 rounded-2xl bg-lavender text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-3">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-ink group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-[10px] text-muted line-clamp-1 mt-1">
                    {category.popularServices[0]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. FEATURED TOP-RATED SALONS CAROUSEL
          ======================================================== */}
      <section className="py-16 md:py-24 bg-white border-y border-muted-border/60 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-star-gold fill-star-gold" />
                <span>Handpicked Elite</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                Featured Top-Rated Salons
              </h2>
            </div>
            <Link href="/salons">
              <Button variant="outline" size="sm">
                View All Salons <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSalons.slice(0, 6).map((salon) => (
              <Link
                key={salon.id}
                href={`/salons/${salon.slug}`}
                className="group rounded-3xl border border-muted-border/80 bg-white overflow-hidden shadow-subtle hover:shadow-glow-md hover:border-primary/40 transition-all duration-300 flex flex-col"
              >
                {/* Banner & Logo */}
                <div className="relative h-48 overflow-hidden bg-mist">
                  <img
                    src={salon.bannerUrl}
                    alt={salon.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <ProBadge size="sm" />
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-bold text-ink shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Next slot: Today 4:30 PM</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={salon.logoUrl}
                          alt={salon.name}
                          className="w-10 h-10 rounded-xl object-cover border shrink-0"
                        />
                        <div>
                          <h3 className="font-extrabold text-base text-ink group-hover:text-primary transition-colors">
                            {salon.name}
                          </h3>
                          <p className="text-xs text-muted flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary" /> {salon.city}, {salon.district}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-lavender px-2 py-0.5 rounded-lg text-xs font-bold text-primary-deep shrink-0">
                        <Star className="w-3.5 h-3.5 fill-star-gold text-star-gold" />
                        <span>{salon.avgRating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted line-clamp-2 mt-2 leading-relaxed">
                      {salon.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-muted-border/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-muted block text-[10px] uppercase font-bold">Services From</span>
                      <span className="font-bold text-ink">
                        LKR {salon.services[0]?.priceLkr.toLocaleString()}
                      </span>
                    </div>

                    <span className="font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Book Now <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. PINNED SCROLL-STORY "HOW IT WORKS"
          ======================================================== */}
      <section className="py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Simple 3-Step Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
              How Glowbook Works
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Zero accounts to register. Book in under 30 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-muted-border/80 shadow-subtle hover:shadow-glow-sm transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-lavender text-primary-deep font-extrabold text-lg flex items-center justify-center">
                1
              </div>
              <h3 className="text-lg font-bold text-ink">Search & Discover</h3>
              <p className="text-xs text-muted leading-relaxed">
                Filter verified salons across Sri Lanka by location, treatment, gender, or price tier. See ratings and transparent pricing upfront.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-muted-border/80 shadow-subtle hover:shadow-glow-sm transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-soft-purple text-primary-deep font-extrabold text-lg flex items-center justify-center">
                2
              </div>
              <h3 className="text-lg font-bold text-ink">Pick Slot & Stylist</h3>
              <p className="text-xs text-muted leading-relaxed">
                Choose your favorite stylist (at Pro salons) and select a convenient time from real-time calendar openings with buffer times respected.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-muted-border/80 shadow-subtle hover:shadow-glow-sm transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white font-extrabold text-lg flex items-center justify-center shadow-glow-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-ink">Book & Pay at Salon</h3>
              <p className="text-xs text-muted leading-relaxed">
                Receive an instant booking voucher code and calendar invite. Pay simply with cash or card directly when you visit the salon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. POPULAR DISTRICTS GRID
          ======================================================== */}
      <section className="py-16 bg-white border-t border-muted-border/60 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                Salons Across Sri Lanka
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-1">
                Find trusted beauty experts in your hometown or travel hub.
              </p>
            </div>
            <Link href="/salons">
              <Button variant="ghost" size="sm">
                Explore All Districts →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SRI_LANKA_DISTRICTS.slice(0, 12).map((district) => {
              const salonCount = DEMO_SALONS.filter((s) => s.district === district.id).length;
              return (
                <Link
                  key={district.id}
                  href={`/salons/in/${district.id}`}
                  className="p-4 rounded-2xl bg-mist hover:bg-lavender/60 border border-muted-border transition-colors text-center"
                >
                  <p className="text-xs font-bold text-ink">{district.name}</p>
                  <p className="text-[10px] text-muted mt-0.5">{salonCount} Salons Listed</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. "WHY BOOK HERE INSTEAD OF CALLING"
          ======================================================== */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-mist to-lavender/30">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              The Smarter Way to Book
            </span>
            <h2 className="text-3xl font-extrabold text-ink tracking-tight">
              Why Book Online Instead of Calling?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Old Calling Way */}
            <div className="p-6 rounded-3xl bg-white/70 border border-ruby-200/60 space-y-4">
              <div className="flex items-center gap-2 text-ruby-600 font-bold text-sm">
                <span>The Frustrating Old Way</span>
              </div>
              <ul className="space-y-3 text-xs text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-ruby-500 font-bold">✕</span>
                  <span>Endless engaged tones and unanswered calls during busy salon hours.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ruby-500 font-bold">✕</span>
                  <span>Unclear prices until you reach the billing counter.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ruby-500 font-bold">✕</span>
                  <span>Double-booked slots or showing up only to wait 45 minutes.</span>
                </li>
              </ul>
            </div>

            {/* Glowbook Way */}
            <div className="p-6 rounded-3xl bg-white border border-primary/40 shadow-glow-sm space-y-4">
              <div className="flex items-center gap-2 text-primary-deep font-bold text-sm">
                <Sparkles className="w-4 h-4 text-star-gold fill-star-gold" />
                <span>The Glowbook Experience</span>
              </div>
              <ul className="space-y-3 text-xs text-ink-light">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Real-time live openings visible 24/7 from your phone.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Transparent menu prices and treatment durations upfront.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Instant confirmation reference code with free cancellation window.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. GROW YOUR SALON (OWNER CTA)
          ======================================================== */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto rounded-4xl bg-gradient-to-r from-primary-deep to-primary text-white p-8 sm:p-14 shadow-glow-lg relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <Badge variant="gold" className="bg-white/20 text-white border-white/30 text-xs">
                For Salon Owners & Beauticians
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                List your salon free and fill empty appointment slots.
              </h2>
              <p className="text-sm text-lavender/90 max-w-xl leading-relaxed">
                Join Sri Lanka’s fastest-growing salon network. Receive online appointments, share your custom booking link and QR code, and upgrade to Pro anytime for LKR 2,000/mo.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/for-salons">
                  <Button variant="gold" size="lg">
                    Register Your Salon Free
                  </Button>
                </Link>
                <Link href="/owner">
                  <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                    Owner Dashboard
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 hidden lg:flex justify-end">
              <div className="w-40 h-40 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center p-4 text-center space-y-2">
                <Store className="w-12 h-12 text-star-gold" />
                <span className="text-xs font-bold">Zero Setup Fees</span>
                <span className="text-[10px] text-white/80">30-day Pro Trial Included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          9. FAQ ACCORDION
          ======================================================== */}
      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-ink">Frequently Asked Questions</h2>
          <p className="text-xs text-muted">Everything you need to know about booking on Glowbook</p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Do I need to create an account to book a salon?',
              a: 'No! Customers book as guests with zero signup or passwords. Simply enter your name, email and phone number to secure your appointment.',
            },
            {
              q: 'How and when do I pay for my appointment?',
              a: 'All bookings are "Pay at Salon". You can pay using cash or debit/credit card directly upon arriving at the salon counter.',
            },
            {
              q: 'Can I cancel or reschedule my appointment?',
              a: 'Yes. Every booking includes a reference code and manage link. You can easily cancel or pick a new slot within the salon’s cancellation policy window.',
            },
            {
              q: 'Why do some salon pages have Call and WhatsApp buttons while others do not?',
              a: 'Salons on the Glowbook Pro plan have verified priority status and direct phone/WhatsApp contact integration enabled for clients.',
            },
            {
              q: 'How can I list my salon on Glowbook?',
              a: 'Visit the "For Salons" page or click "Register your salon free". Complete our 5-minute onboarding wizard, and once approved by admin, you are live island-wide with a 30-day Pro trial!',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-muted-border bg-white overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-sm text-ink flex items-center justify-between hover:bg-mist transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted transition-transform ${
                    activeFaq === idx ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="p-4 pt-0 text-xs text-muted leading-relaxed border-t border-muted-border/40">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Direct Booking Modal triggered from Hero Showcase */}
      {heroBookingSalon && (
        <BookingModal
          salon={heroBookingSalon}
          open={isHeroBookingOpen}
          onOpenChange={setIsHeroBookingOpen}
        />
      )}
    </div>
  );
}
