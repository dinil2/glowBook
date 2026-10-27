import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DEMO_SALONS } from '@/lib/demo-data';
import { SALON_CATEGORIES } from '@/lib/config/categories';
import { ProBadge } from '@/components/common/pro-badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, ChevronRight, ArrowLeft } from 'lucide-react';

interface Props {
  params: {
    category: string;
  };
}

export function generateStaticParams() {
  return SALON_CATEGORIES.map((c) => ({
    category: c.slug,
  }));
}

export default function CategorySalonsPage({ params }: Props) {
  const categoryObj = SALON_CATEGORIES.find(
    (c) => c.slug.toLowerCase() === params.category.toLowerCase()
  );

  if (!categoryObj) {
    notFound();
  }

  const salons = DEMO_SALONS.filter((s) =>
    s.categories.includes(categoryObj.slug)
  );

  return (
    <div className="min-h-screen bg-mist py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <Link
            href="/salons"
            className="text-xs text-muted hover:text-ink inline-flex items-center gap-1 mb-3 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Salons
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
            {categoryObj.name} in Sri Lanka
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl">
            {categoryObj.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salons.map((salon) => (
            <Link
              key={salon.id}
              href={`/salons/${salon.slug}`}
              className="group rounded-3xl border border-muted-border/80 bg-white overflow-hidden shadow-subtle hover:shadow-glow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-mist overflow-hidden">
                  <img
                    src={salon.bannerUrl}
                    alt={salon.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {salon.plan === 'pro' && (
                    <div className="absolute top-3 right-3">
                      <ProBadge size="sm" />
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-ink group-hover:text-primary transition-colors">
                      {salon.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-lavender px-2 py-0.5 rounded-lg text-xs font-bold text-primary-deep">
                      <Star className="w-3.5 h-3.5 fill-star-gold text-star-gold" />
                      <span>{salon.avgRating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> {salon.city}, {salon.district}
                  </p>
                  <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                    {salon.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-muted-border/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-muted block text-[10px] uppercase font-bold">From</span>
                  <span className="font-bold text-ink">
                    LKR {salon.services[0]?.priceLkr.toLocaleString()}
                  </span>
                </div>
                <span className="font-bold text-primary flex items-center gap-1">
                  Book Now <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
