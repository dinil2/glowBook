'use client';

import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DEMO_SALONS, DemoSalon, DemoService } from '@/lib/demo-data';
import { can } from '@/features/billing/plans';
import { formatLKR, formatSLPhone } from '@/lib/utils';
import { BookingModal } from '@/features/booking/components/booking-modal';
import { ProBadge } from '@/components/common/pro-badge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Star,
  Clock,
  Phone,
  MessageCircle,
  Share2,
  Navigation,
  Sparkles,
  Check,
  CheckCircle2,
  Calendar,
  Instagram,
  Facebook,
  ChevronRight,
  User,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  params: {
    slug: string;
  };
}

export default function SalonProfilePage({ params }: Props) {
  const salon = DEMO_SALONS.find((s) => s.slug === params.slug);

  if (!salon) {
    notFound();
  }

  const [activeTab, setActiveTab] = React.useState<'services' | 'gallery' | 'about' | 'team' | 'reviews' | 'hours'>('services');
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);
  const [selectedServiceId, setSelectedServiceId] = React.useState<string | undefined>(undefined);
  const [selectedCategoryTab, setSelectedCategoryTab] = React.useState<string>('all');
  const [activeGalleryImage, setActiveGalleryImage] = React.useState<string | null>(null);

  // Contact privacy rule: phone and whatsapp are present ONLY if Pro
  const isPro = salon.plan === 'pro';
  const showContactButtons = can(salon, 'publicCallAndWhatsAppButtons');
  const phone = showContactButtons ? salon.phone : null;
  const whatsapp = showContactButtons ? salon.whatsapp : null;

  const handleBookService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setIsBookingOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${salon.name} - Glowbook Sri Lanka`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Salon link copied to clipboard!');
    }
  };

  const filteredServices = React.useMemo(() => {
    if (selectedCategoryTab === 'all') return salon.services;
    return salon.services.filter((s) => s.category.toLowerCase() === selectedCategoryTab.toLowerCase());
  }, [salon.services, selectedCategoryTab]);

  return (
    <div className="min-h-screen bg-mist pb-28 md:pb-16">
      {/* 1. Header Banner */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full bg-ink/10 overflow-hidden">
        <img
          src={salon.bannerUrl}
          alt={salon.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
      </div>

      {/* 2. Overlapping Salon Header Info & Action Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-muted-border/80 shadow-glow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Overlapping Logo */}
              <img
                src={salon.logoUrl}
                alt={salon.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-glow-sm bg-white shrink-0"
              />

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
                    {salon.name}
                  </h1>
                  {isPro && <ProBadge size="md" />}
                  <Badge variant="secondary" className="capitalize text-xs">
                    {salon.genderType}
                  </Badge>
                  <Badge variant="outline" className="capitalize text-xs">
                    {salon.priceTier} tier
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-muted font-medium">
                  {salon.tagline || salon.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-ink-light pt-1">
                  <span className="flex items-center gap-1 font-bold text-ink">
                    <Star className="w-3.5 h-3.5 fill-star-gold text-star-gold" />
                    {salon.avgRating} ({salon.reviewCount} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {salon.address}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Open today until 7:30 PM
                  </span>
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <Button
                variant="gradient"
                size="lg"
                onClick={() => setIsBookingOpen(true)}
                className="flex-1 md:flex-none font-bold shadow-glow-sm"
              >
                <Calendar className="w-4 h-4 mr-1.5" /> Book Appointment
              </Button>

              {/* Pro-only Direct Call Button */}
              {showContactButtons && phone && (
                <a href={`tel:${phone}`} className="shrink-0">
                  <Button variant="outline" size="lg" className="gap-1.5 text-primary border-primary/30">
                    <Phone className="w-4 h-4" /> Call
                  </Button>
                </a>
              )}

              {/* Pro-only WhatsApp Button */}
              {showContactButtons && whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(salon.name)}!%20Found%20you%20on%20Glowbook.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <Button variant="outline" size="lg" className="gap-1.5 text-emerald-600 border-emerald-500/30">
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </Button>
                </a>
              )}

              <Button variant="outline" size="lg" onClick={handleShare} className="shrink-0">
                <Share2 className="w-4 h-4 mr-1 text-muted" /> Share
              </Button>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(salon.name + ' ' + salon.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Button variant="outline" size="lg" className="shrink-0">
                  <Navigation className="w-4 h-4 mr-1 text-muted" /> Directions
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sticky Section Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex items-center gap-1.5 border-b border-muted-border overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'services', label: 'Services & Packages' },
            { id: 'gallery', label: `Gallery (${salon.galleryImages.length})` },
            { id: 'about', label: 'About & Amenities' },
            { id: 'team', label: `Team (${salon.staff.length})` },
            { id: 'reviews', label: `Reviews (${salon.reviews.length})` },
            { id: 'hours', label: 'Hours & Location' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-ink hover:bg-lavender/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Main Body: Content + Desktop Sticky Booking Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left/Main Column: Active Section */}
          <div className="lg:col-span-8 space-y-6">
            {/* SERVICES TAB */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-ink">Treatment Menu</h2>
                  <span className="text-xs text-muted">
                    {salon.services.length} services available
                  </span>
                </div>

                <div className="space-y-3">
                  {filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className="p-5 rounded-3xl bg-white border border-muted-border/80 shadow-subtle hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm sm:text-base text-ink">
                            {service.name}
                          </h4>
                          {service.kind === 'package' && (
                            <Badge variant="purple" className="text-[10px] py-0 px-2">
                              Package
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted leading-relaxed max-w-lg">
                          {service.description}
                        </p>
                        <p className="text-[11px] text-muted-light flex items-center gap-1 pt-1">
                          <Clock className="w-3.5 h-3.5" /> {service.durationMin} minutes
                        </p>
                      </div>

                      <div className="flex items-center sm:flex-col justify-between sm:items-end gap-3 shrink-0">
                        <span className="text-base sm:text-lg font-black text-primary-deep">
                          {formatLKR(service.priceLkr)}
                        </span>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleBookService(service.id)}
                          className="px-5 shadow-sm"
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-ink">Salon Gallery</h2>
                  <span className="text-xs text-muted">Interior & styling aesthetics</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {salon.galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveGalleryImage(img)}
                      className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer border border-muted-border/80 bg-white"
                    >
                      <img
                        src={img}
                        alt={`${salon.name} showcase ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                        Click to view
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ABOUT TAB */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-ink">About {salon.name}</h2>
                <div className="p-6 rounded-3xl bg-white border border-muted-border/80 space-y-4">
                  <p className="text-xs sm:text-sm text-ink-light leading-relaxed">
                    {salon.description}
                  </p>
                  <div className="pt-4 border-t border-muted-border/60 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-muted block text-[10px] uppercase font-bold">Gender</span>
                      <span className="font-semibold text-ink capitalize">{salon.genderType}</span>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px] uppercase font-bold">Price Tier</span>
                      <span className="font-semibold text-ink capitalize">{salon.priceTier}</span>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px] uppercase font-bold">Cancellation Policy</span>
                      <span className="font-semibold text-ink">{salon.cancellationHours} hours notice</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TEAM TAB */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-ink">Our Stylists & Artists</h2>
                  <span className="text-xs text-muted">{salon.staff.length} professionals</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {salon.staff.map((st) => (
                    <div
                      key={st.id}
                      className="p-4 rounded-3xl bg-white border border-muted-border/80 flex items-center gap-4 shadow-subtle"
                    >
                      <img
                        src={st.photoUrl}
                        alt={st.name}
                        className="w-14 h-14 rounded-2xl object-cover border"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-ink">{st.name}</h4>
                        <p className="text-xs text-muted">{st.role}</p>
                        <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Available for booking
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-ink">Verified Client Reviews</h2>
                  <div className="flex items-center gap-1.5 font-black text-sm text-ink">
                    <Star className="w-4 h-4 fill-star-gold text-star-gold" />
                    {salon.avgRating} / 5.0
                  </div>
                </div>

                <div className="space-y-3">
                  {salon.reviews.map((r) => (
                    <div
                      key={r.id}
                      className="p-5 rounded-3xl bg-white border border-muted-border/80 space-y-3 shadow-subtle"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-xs text-ink">{r.customerName}</p>
                          <p className="text-[10px] text-muted">
                            {new Date(r.createdAt).toLocaleDateString('en-LK', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="flex items-center text-star-gold">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-star-gold" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">&ldquo;{r.comment}&rdquo;</p>
                      {r.ownerReply && (
                        <div className="p-3 rounded-2xl bg-lavender/40 border-l-2 border-primary text-[11px] text-ink-light space-y-0.5">
                          <p className="font-bold text-primary-deep">Response from Salon:</p>
                          <p>{r.ownerReply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HOURS & LOCATION TAB */}
            {activeTab === 'hours' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-ink">Opening Hours & Location</h2>
                <div className="p-6 rounded-3xl bg-white border border-muted-border/80 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => {
                      const weekday = idx === 6 ? 0 : idx + 1;
                      const h = salon.hours.find((x) => x.weekday === weekday);
                      return (
                        <div
                          key={day}
                          className="flex justify-between p-2.5 rounded-xl bg-mist border border-muted-border/40"
                        >
                          <span className="font-semibold text-ink">{day}</span>
                          <span className={h?.isClosed ? 'text-ruby-500 font-bold' : 'text-muted'}>
                            {h?.isClosed ? 'Closed' : `${h?.openTime} - ${h?.closeTime}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* OpenStreetMap iframe / embed */}
                  <div className="pt-4 border-t border-muted-border/60">
                    <p className="text-xs font-bold text-ink mb-2">Location Map (OpenStreetMap)</p>
                    <div className="w-full h-64 rounded-2xl overflow-hidden border border-muted-border">
                      <iframe
                        title="Salon Location Map"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${salon.lng - 0.01}%2C${salon.lat - 0.01}%2C${salon.lng + 0.01}%2C${salon.lat + 0.01}&layer=mapnik&marker=${salon.lat}%2C${salon.lng}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Desktop Booking Card */}
          <div className="lg:col-span-4 hidden lg:block sticky top-24">
            <div className="p-6 rounded-3xl bg-white border border-muted-border shadow-glow-sm space-y-5">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  Quick Appointment
                </span>
                <h3 className="text-lg font-black text-ink">Ready to look your best?</h3>
                <p className="text-xs text-muted">
                  Select your treatment and reserve your slot instantly. Pay upon arrival at the salon counter.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-mist border border-muted-border/60 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted">Starting from:</span>
                  <span className="font-extrabold text-primary-deep text-base">
                    LKR {salon.services[0]?.priceLkr.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-muted">
                  <span>Cancellation:</span>
                  <span>Free up to {salon.cancellationHours}h before</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsBookingOpen(true)}
                className="w-full shadow-glow-md"
              >
                Book Appointment Online
              </Button>

              <div className="text-center">
                <p className="text-[11px] text-muted flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Salon · Instant Confirmation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Sticky Bottom Bar for Mobile Only */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden p-3 bg-white/95 backdrop-blur-md border-t border-muted-border/80 shadow-float flex items-center justify-between">
        <div>
          <span className="text-[10px] text-muted block uppercase font-bold">Services From</span>
          <span className="text-base font-extrabold text-ink">
            LKR {salon.services[0]?.priceLkr.toLocaleString()}
          </span>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsBookingOpen(true)}
          className="px-6 shadow-glow-md"
        >
          Book Now
        </Button>
      </div>

      {/* Booking Modal */}
      <BookingModal
        salon={salon}
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        preselectedServiceId={selectedServiceId}
      />
    </div>
  );
}
