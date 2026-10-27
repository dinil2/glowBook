'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProBadge } from '@/components/common/pro-badge';
import { DEMO_SALONS, DemoSalon } from '@/lib/demo-data';
import { SRI_LANKA_DISTRICTS } from '@/lib/config/districts';
import { SALON_CATEGORIES } from '@/lib/config/categories';
import { formatLKR } from '@/lib/utils';
import {
  Search,
  MapPin,
  Star,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  X,
  Phone,
  MessageCircle,
} from 'lucide-react';

function SalonsExploreContent() {
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get('category') || 'all';
  const initialDistrict = searchParams.get('district') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [search, setSearch] = React.useState(initialQuery);
  const [district, setDistrict] = React.useState(initialDistrict);
  const [category, setCategory] = React.useState(initialCategory);
  const [gender, setGender] = React.useState<'all' | 'ladies' | 'gents' | 'unisex'>('all');
  const [priceTier, setPriceTier] = React.useState<'all' | 'budget' | 'mid' | 'premium'>('all');
  const [minRating, setMinRating] = React.useState<number>(0);
  const [sortBy, setSortBy] = React.useState<'recommended' | 'rating' | 'priceAsc' | 'priceDesc'>('recommended');

  // Filter and sort salons
  const filteredSalons = React.useMemo(() => {
    return DEMO_SALONS.filter((salon) => {
      // Query filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = salon.name.toLowerCase().includes(q);
        const matchesCity = salon.city.toLowerCase().includes(q);
        const matchesServices = salon.services.some((s) => s.name.toLowerCase().includes(q));
        if (!matchesName && !matchesCity && !matchesServices) return false;
      }

      // District filter
      if (district !== 'all' && salon.district !== district) return false;

      // Category filter
      if (category !== 'all' && !salon.categories.includes(category)) return false;

      // Gender filter
      if (gender !== 'all' && salon.genderType !== gender && salon.genderType !== 'unisex') {
        return false;
      }

      // Price tier filter
      if (priceTier !== 'all' && salon.priceTier !== priceTier) return false;

      // Minimum rating filter
      if (minRating > 0 && salon.avgRating < minRating) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') {
        return b.avgRating - a.avgRating;
      }
      if (sortBy === 'priceAsc') {
        return (a.services[0]?.priceLkr || 0) - (b.services[0]?.priceLkr || 0);
      }
      if (sortBy === 'priceDesc') {
        return (b.services[0]?.priceLkr || 0) - (a.services[0]?.priceLkr || 0);
      }
      // 'recommended': Pro salons get ranking boost first, then by rating
      const aScore = (a.plan === 'pro' ? 2 : 0) + a.avgRating;
      const bScore = (b.plan === 'pro' ? 2 : 0) + b.avgRating;
      return bScore - aScore;
    });
  }, [search, district, category, gender, priceTier, minRating, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setDistrict('all');
    setCategory('all');
    setGender('all');
    setPriceTier('all');
    setMinRating(0);
    setSortBy('recommended');
  };

  const hasActiveFilters =
    search !== '' ||
    district !== 'all' ||
    category !== 'all' ||
    gender !== 'all' ||
    priceTier !== 'all' ||
    minRating > 0;

  return (
    <div className="min-h-screen bg-mist py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-ink tracking-tight">
              Explore Salons in Sri Lanka
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Showing <strong>{filteredSalons.length}</strong> verified salon destinations
            </p>
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-ruby-600 gap-1">
              <X className="w-3.5 h-3.5" /> Clear Filters
            </Button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-3xl bg-white border border-muted-border/80 shadow-subtle space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search name or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-3 rounded-2xl bg-mist text-xs text-ink focus:outline-none focus:bg-white focus:border-primary border border-muted-border"
              />
            </div>

            {/* District */}
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="h-11 px-3 rounded-2xl bg-mist text-xs text-ink focus:outline-none focus:bg-white focus:border-primary border border-muted-border"
            >
              <option value="all">All Districts (Island-wide)</option>
              {SRI_LANKA_DISTRICTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 px-3 rounded-2xl bg-mist text-xs text-ink focus:outline-none focus:bg-white focus:border-primary border border-muted-border"
            >
              <option value="all">All Categories</option>
              {SALON_CATEGORIES.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="h-11 px-3 rounded-2xl bg-mist text-xs text-ink focus:outline-none focus:bg-white focus:border-primary border border-muted-border font-semibold"
            >
              <option value="recommended">Sort: Recommended (Pro Boost)</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="priceAsc">Sort: Price (Low to High)</option>
              <option value="priceDesc">Sort: Price (High to Low)</option>
            </select>
          </div>

          {/* Quick Filter Pills (Gender, Price Tier, Rating) */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-muted-border/60 text-xs">
            <span className="text-muted font-bold text-[11px] uppercase mr-1">Filter by:</span>

            {/* Gender Type */}
            {(['all', 'ladies', 'gents', 'unisex'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                  gender === g
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-mist text-muted hover:bg-lavender'
                }`}
              >
                {g}
              </button>
            ))}

            <span className="text-muted-border mx-1">|</span>

            {/* Price Tier */}
            {(['all', 'budget', 'mid', 'premium'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriceTier(p)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                  priceTier === p
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-mist text-muted hover:bg-lavender'
                }`}
              >
                {p}
              </button>
            ))}

            <span className="text-muted-border mx-1">|</span>

            {/* Rating */}
            {[0, 4.5, 4.8].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setMinRating(r)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  minRating === r
                    ? 'bg-star-gold text-ink font-bold shadow-sm'
                    : 'bg-mist text-muted hover:bg-lavender'
                }`}
              >
                {r === 0 ? 'All Ratings' : `★ ${r}+`}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {filteredSalons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSalons.map((salon) => {
              const isPro = salon.plan === 'pro';
              return (
                <Link
                  key={salon.id}
                  href={`/salons/${salon.slug}`}
                  className="group rounded-3xl border border-muted-border/80 bg-white overflow-hidden shadow-subtle hover:shadow-glow-md hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Banner */}
                    <div className="relative h-48 overflow-hidden bg-mist">
                      <img
                        src={salon.bannerUrl}
                        alt={salon.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {isPro && (
                        <div className="absolute top-3 right-3">
                          <ProBadge size="sm" />
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-bold text-ink shadow-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Next slot: Today 4:30 PM</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={salon.logoUrl}
                            alt={salon.name}
                            className="w-10 h-10 rounded-xl object-cover border shrink-0"
                          />
                          <div>
                            <h3 className="font-extrabold text-base text-ink group-hover:text-primary transition-colors flex items-center gap-1.5">
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

                      <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                        {salon.tagline || salon.description}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {salon.categories.map((c) => (
                          <span
                            key={c}
                            className="px-2 py-0.5 rounded-md bg-mist text-[10px] font-bold uppercase tracking-wider text-muted"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-3 border-t border-muted-border/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-muted block text-[10px] uppercase font-bold">From</span>
                      <span className="font-bold text-ink">
                        LKR {salon.services[0]?.priceLkr.toLocaleString()}
                      </span>
                    </div>

                    <span className="font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View Menu & Book <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-16 rounded-3xl bg-white border border-muted-border text-center space-y-3">
            <Search className="w-10 h-10 text-muted mx-auto" />
            <h3 className="text-lg font-bold text-ink">No salons found matching your filters</h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              Try adjusting your district, category, or search terms to discover salons island-wide.
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SalonsExplorePage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-mesh-subtle py-16 text-center text-xs text-muted">
          Loading salons across Sri Lanka...
        </div>
      }
    >
      <SalonsExploreContent />
    </React.Suspense>
  );
}

