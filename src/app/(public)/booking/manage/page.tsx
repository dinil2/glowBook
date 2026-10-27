'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DEMO_BOOKINGS, DEMO_SALONS } from '@/lib/demo-data';
import { formatLKR, formatSLPhone } from '@/lib/utils';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Scissors,
  ArrowRight,
  Star,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';

function ManageContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || '';


  const [reference, setReference] = React.useState(initialRef);
  const [phone, setPhone] = React.useState('');
  const [searched, setSearched] = React.useState(Boolean(initialRef));
  const [booking, setBooking] = React.useState<any>(null);
  const [salon, setSalon] = React.useState<any>(null);
  const [reviewRating, setReviewRating] = React.useState(5);
  const [reviewComment, setReviewComment] = React.useState('');
  const [reviewSubmitted, setReviewSubmitted] = React.useState(false);

  // Perform lookup
  const handleLookup = (searchRef = reference) => {
    if (!searchRef.trim()) {
      toast.error('Please enter your booking reference (e.g. GB-7K3Q9X)');
      return;
    }

    const cleanRef = searchRef.trim().toUpperCase();
    const foundBooking = DEMO_BOOKINGS.find(
      (b) => b.reference.toUpperCase() === cleanRef
    ) || DEMO_BOOKINGS[0]; // fallback to first realistic booking for preview

    if (foundBooking) {
      setBooking(foundBooking);
      const foundSalon = DEMO_SALONS.find((s) => s.id === foundBooking.salonId) || DEMO_SALONS[0];
      setSalon(foundSalon);
      setSearched(true);
    } else {
      toast.error('No booking found with this reference code.');
      setBooking(null);
    }
  };

  React.useEffect(() => {
    if (initialRef) {
      handleLookup(initialRef);
    }
  }, [initialRef]);

  const handleCancelBooking = () => {
    if (!booking) return;
    setBooking({ ...booking, status: 'cancelled' });
    toast.success('Your appointment has been cancelled successfully.');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitted(true);
    toast.success('Thank you for rating your salon experience!');
  };

  return (
    <div className="min-h-screen bg-mist py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-ink tracking-tight">
            Manage Your Appointment
          </h1>
          <p className="text-sm text-muted">
            Lookup your booking by confirmation reference code and phone number.
          </p>
        </div>

        {/* Lookup Box */}
        <Card className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Booking Reference *"
                placeholder="e.g. GB-XXXXXX"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
              <Input
                label="Phone Number"
                placeholder="e.g. +94 77 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <Button variant="primary" size="md" type="submit" className="w-full">
              <Search className="w-4 h-4 mr-1.5" />
              Find Booking
            </Button>
          </form>
        </Card>

        {/* Booking Details View */}
        {searched && booking && salon && (
          <div className="space-y-6 animate-fadeIn">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary-deep p-6 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold opacity-90">
                    Booking Reference
                  </span>
                  <p className="font-mono text-2xl font-black tracking-wider">
                    {booking.reference}
                  </p>
                </div>
                <Badge
                  variant={
                    booking.status === 'confirmed'
                      ? 'success'
                      : booking.status === 'completed'
                      ? 'purple'
                      : booking.status === 'cancelled'
                      ? 'danger'
                      : 'secondary'
                  }
                  className="capitalize font-bold text-xs px-3 py-1 bg-white/20 text-white border-white/30"
                >
                  {booking.status}
                </Badge>
              </div>

              <CardContent className="p-6 space-y-6">
                {/* Salon Info */}
                <div className="flex items-center gap-4 pb-4 border-b border-muted-border/60">
                  <img
                    src={salon.logoUrl}
                    alt={salon.name}
                    className="w-14 h-14 rounded-2xl object-cover border"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-ink">{salon.name}</h3>
                    <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> {salon.address}
                    </p>
                  </div>
                </div>

                {/* Appointment Schedule & Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-mist border border-muted-border space-y-1">
                    <span className="text-muted block text-[11px] uppercase font-bold">
                      Date & Time
                    </span>
                    <p className="font-bold text-ink text-sm flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-primary" />
                      {new Date(booking.startsAt).toLocaleDateString('en-LK', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-muted font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(booking.startsAt).toLocaleTimeString('en-LK', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-mist border border-muted-border space-y-1">
                    <span className="text-muted block text-[11px] uppercase font-bold">
                      Client
                    </span>
                    <p className="font-bold text-ink text-sm">{booking.customerName}</p>
                    <p className="text-muted">{booking.customerPhone}</p>
                    <p className="text-muted">{booking.customerEmail}</p>
                  </div>
                </div>

                {/* Services list */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted">
                    Booked Services
                  </span>
                  <div className="p-4 rounded-2xl bg-lavender/30 border border-muted-border space-y-2">
                    {booking.serviceNames.map((name: string, i: number) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-ink flex items-center gap-2">
                          <Scissors className="w-3.5 h-3.5 text-primary" /> {name}
                        </span>
                        <span className="font-bold text-primary-deep">
                          {formatLKR(booking.totalLkr)}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-muted-border flex justify-between font-bold text-sm">
                      <span>Total (Pay at salon):</span>
                      <span className="text-primary-deep">{formatLKR(booking.totalLkr)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Cancel if active */}
                {booking.status === 'confirmed' && (
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[11px] text-muted">
                      Need to reschedule? Cancel this booking and select a new slot.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelBooking}
                      className="text-ruby-600 border-ruby-200 hover:bg-ruby-50"
                    >
                      Cancel Appointment
                    </Button>
                  </div>
                )}

                {/* Review section if completed */}
                {booking.status === 'completed' && !reviewSubmitted && (
                  <div className="p-5 rounded-2xl bg-white border-2 border-primary/30 space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-ink">Rate Your Salon Experience</h4>
                      <p className="text-xs text-muted">
                        How was your appointment at {salon.name}?
                      </p>
                    </div>

                    <form onSubmit={handleReviewSubmit} className="space-y-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= reviewRating
                                  ? 'text-star-gold fill-star-gold'
                                  : 'text-muted-border'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Share feedback on cleanliness, service quality, and styling..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full p-3 rounded-xl border border-muted-border text-xs focus:outline-none focus:border-primary"
                      />
                      <Button variant="primary" size="sm" type="submit">
                        Submit Review
                      </Button>
                    </form>
                  </div>
                )}

                {reviewSubmitted && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-xs text-emerald-800 font-medium">
                    ✓ Your review has been published. Thank you!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GuestBookingManagePage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-mesh-subtle py-16 text-center text-xs text-muted">
          Loading booking details...
        </div>
      }
    >
      <ManageContent />
    </React.Suspense>
  );
}

