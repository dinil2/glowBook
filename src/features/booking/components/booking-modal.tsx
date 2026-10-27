'use client';

import * as React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProBadge } from '@/components/common/pro-badge';
import { DemoSalon, DemoService, DemoStaff } from '@/lib/demo-data';
import { can } from '@/features/billing/plans';
import { getAvailableSlots, TimeSlot } from '../engine';
import { formatLKR, formatSLPhone, generateBookingReference } from '@/lib/utils';
import { generateBookingShareUrl } from '@/lib/services/messagingProvider';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Sparkles,
  User,
  ArrowRight,
  ArrowLeft,
  Share2,
  CalendarPlus,
  Phone,
  MessageCircle,
  AlertCircle,
  Scissors,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface BookingModalProps {
  salon: DemoSalon;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedServiceId?: string;
}

export function BookingModal({
  salon,
  open,
  onOpenChange,
  preselectedServiceId,
}: BookingModalProps) {
  const [step, setStep] = React.useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [selectedServices, setSelectedServices] = React.useState<DemoService[]>([]);
  const [selectedStaffId, setSelectedStaffId] = React.useState<string>('any');
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = React.useState<TimeSlot | null>(null);

  // Customer Details Form
  const [customerName, setCustomerName] = React.useState('');
  const [customerEmail, setCustomerEmail] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  // Confirmation Record
  const [confirmedBooking, setConfirmedBooking] = React.useState<{
    reference: string;
    totalLkr: number;
    startsAt: string;
    serviceNames: string[];
    staffName: string;
    manageLink: string;
  } | null>(null);

  const isPro = salon.plan === 'pro';
  const allowsStylistSelection = can(salon, 'customerStylistSelection');

  // Initialize preselected service if passed
  React.useEffect(() => {
    if (preselectedServiceId && salon.services.length > 0) {
      const found = salon.services.find((s) => s.id === preselectedServiceId);
      if (found) setSelectedServices([found]);
    } else if (salon.services.length > 0 && selectedServices.length === 0) {
      setSelectedServices([salon.services[0]]);
    }
  }, [preselectedServiceId, salon.services]);

  // Total Duration and Price calculations
  const totalDurationMin = React.useMemo(
    () => selectedServices.reduce((acc, s) => acc + s.durationMin, 0),
    [selectedServices]
  );
  const totalLkr = React.useMemo(
    () => selectedServices.reduce((acc, s) => acc + s.priceLkr, 0),
    [selectedServices]
  );

  // Computed next 14 days for the horizontal date strip
  const dateStrip = React.useMemo(() => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  // Compute Available Slots
  const slotData = React.useMemo(() => {
    if (selectedServices.length === 0) return { slots: [], isDayClosed: false };

    return getAvailableSlots({
      date: selectedDate,
      totalDurationMin: totalDurationMin || 30,
      salonHours: salon.hours,
      closures: [],
      existingBookings: [],
      staff: salon.staff.map((s) => ({ id: s.id, name: s.name, isActive: true })),
      selectedStaffId,
      minLeadHours: salon.minLeadHours,
      maxAdvanceDays: salon.maxAdvanceDays,
      isMonthlyCapReached: !isPro && salon.monthlyBookingsCount >= 30,
    });
  }, [selectedDate, totalDurationMin, salon, selectedStaffId, selectedServices.length, isPro]);

  // Group slots into Morning, Afternoon, Evening
  const groupedSlots = React.useMemo(() => {
    const morning: TimeSlot[] = [];
    const afternoon: TimeSlot[] = [];
    const evening: TimeSlot[] = [];

    slotData.slots.forEach((s) => {
      const hour = parseInt(s.time.split(':')[0], 10);
      if (hour < 12) morning.push(s);
      else if (hour < 16) afternoon.push(s);
      else evening.push(s);
    });

    return { morning, afternoon, evening };
  }, [slotData.slots]);

  // Service toggle helper
  const toggleService = (service: DemoService) => {
    if (selectedServices.some((s) => s.id === service.id)) {
      if (selectedServices.length === 1) return; // Keep at least one
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // Submit and confirm booking
  const handleConfirmBooking = () => {
    const errors: Record<string, string> = {};
    if (!customerName.trim()) errors.name = 'Please enter your name';
    if (!customerEmail.trim() || !customerEmail.includes('@'))
      errors.email = 'Valid email is required for your booking voucher';
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 9)
      errors.phone = 'Valid phone number (+94 7X XXX XXXX) required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const ref = generateBookingReference();
    const manageLink = `${window.location.origin}/booking/manage?ref=${ref}`;

    setConfirmedBooking({
      reference: ref,
      totalLkr,
      startsAt: selectedSlot?.datetime || new Date().toISOString(),
      serviceNames: selectedServices.map((s) => s.name),
      staffName: selectedSlot?.assignedStaffName || 'Any Available Stylist',
      manageLink,
    });

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B6CF6', '#5B3FD1', '#F5B942', '#10B981'],
    });

    setStep(6);
  };

  // Generate .ics calendar file
  const downloadCalendarEvent = () => {
    if (!confirmedBooking) return;
    const start = new Date(confirmedBooking.startsAt);
    const end = new Date(start.getTime() + totalDurationMin * 60 * 1000);

    const formatDateForIcs = (d: Date) =>
      d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Glowbook Sri Lanka//Appointment//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Appointment at ${salon.name}`,
      `DESCRIPTION:Services: ${confirmedBooking.serviceNames.join(', ')}\\nReference: ${confirmedBooking.reference}\\nTotal: LKR ${confirmedBooking.totalLkr.toLocaleString()}\\nManage: ${confirmedBooking.manageLink}`,
      `LOCATION:${salon.address}`,
      `DTSTART:${formatDateForIcs(start)}`,
      `DTEND:${formatDateForIcs(end)}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `glowbook-${confirmedBooking.reference}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedSlot(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose} className="max-w-2xl">
      {/* Header with Salon identity */}
      <div className="flex items-center justify-between pb-4 border-b border-muted-border/60">
        <div className="flex items-center gap-3">
          <img
            src={salon.logoUrl}
            alt={salon.name}
            className="w-10 h-10 rounded-xl object-cover border"
          />
          <div>
            <h3 className="font-bold text-ink text-base flex items-center gap-1.5">
              {salon.name}
              {isPro && <ProBadge size="sm" variant="compact" />}
            </h3>
            <p className="text-xs text-muted">
              {salon.city} · Step {step} of 6
            </p>
          </div>
        </div>

        {step > 1 && step < 6 && (
          <div className="text-right">
            <p className="text-[11px] text-muted">Total (Pay at salon)</p>
            <p className="text-sm font-bold text-primary-deep">{formatLKR(totalLkr)}</p>
          </div>
        )}
      </div>

      {/* STEP 1: Select Services / Packages with Rich Details */}
      {step === 1 && (
        <div className="space-y-4 pt-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-lg font-black text-ink tracking-tight">Select Services & Packages</h4>
              <p className="text-xs text-muted">
                Choose treatments to book. Pricing & duration calculate dynamically.
              </p>
            </div>
            {selectedServices.length > 0 && (
              <Badge variant="secondary" className="self-start sm:self-auto bg-sand border-[#E8E5DF] text-[#141219] text-xs font-bold py-1 px-2.5">
                {selectedServices.length} selected · {totalDurationMin} mins
              </Badge>
            )}
          </div>

          {/* Service Cards List with Rich Details */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1.5 scrollbar-thin">
            {salon.services.map((service) => {
              const isSelected = selectedServices.some((s) => s.id === service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => toggleService(service)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-[#1B4332] bg-[#EBF4F0]/50 shadow-sm ring-1 ring-[#1B4332]/30'
                      : 'border-[#E8E5DF] bg-white hover:bg-mist hover:border-[#141219]/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      {/* Name & Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-[#141219]">{service.name}</span>
                        {service.kind === 'package' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF5E6] text-[#A47E19] border border-[#C59B27]/30">
                            Package Bundle
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-mist text-muted border border-[#E8E5DF] capitalize">
                            {service.category}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted bg-white px-2 py-0.5 rounded-md border border-[#E8E5DF]">
                          <Clock className="w-3 h-3 text-[#1B4332]" />
                          {service.durationMin} mins
                        </span>
                      </div>

                      {/* Detailed Description */}
                      <p className="text-xs text-muted leading-relaxed">
                        {service.description}
                      </p>

                      {/* Inclusions Tags */}
                      {service.includes && service.includes.length > 0 && (
                        <div className="pt-1.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-light mb-1">
                            Includes:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {service.includes.map((inc, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 text-[10px] font-medium text-[#1B4332] bg-[#EBF4F0] border border-[#DDEEE7] px-2 py-0.5 rounded-lg"
                              >
                                <CheckCircle2 className="w-3 h-3 text-[#1B4332]" />
                                {inc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price & Selection Checkbox */}
                    <div className="text-right shrink-0 flex flex-col items-end justify-between self-stretch">
                      <div>
                        <span className="text-xs text-muted block text-right font-medium">Fee</span>
                        <p className="text-base font-black text-[#141219]">{formatLKR(service.priceLkr)}</p>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#1B4332] border-[#1B4332] text-white shadow-sm scale-105'
                            : 'border-[#E8E5DF] bg-white text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Bottom Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#E8E5DF]">
            <div>
              <p className="text-xs text-muted">
                Total:{' '}
                <strong className="text-base font-black text-[#141219]">
                  {formatLKR(totalLkr)}
                </strong>
              </p>
              <p className="text-[11px] text-[#1B4332] font-semibold">
                ✓ Pay in person at the salon
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              disabled={selectedServices.length === 0}
              onClick={() => setStep(allowsStylistSelection ? 2 : 3)}
              className="px-6 font-bold shadow-sm"
            >
              Continue to Schedule <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Stylist Selection (Only for Pro salons, otherwise skipped to step 3) */}
      {step === 2 && (
        <div className="space-y-5 pt-4">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-ink">Select a Stylist</h4>
            <p className="text-xs text-muted">
              Pick your preferred artist, or select &quot;Any Available&quot; for earliest opening.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto">
            {/* Any Available Option */}
            <div
              onClick={() => setSelectedStaffId('any')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                selectedStaffId === 'any'
                  ? 'border-primary bg-lavender/40 shadow-glow-sm ring-1 ring-primary/30'
                  : 'border-muted-border bg-white hover:bg-mist'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-lavender flex items-center justify-center text-primary-deep font-bold">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">Any Available</p>
                <p className="text-xs text-muted">Auto-assigns earliest free stylist</p>
              </div>
            </div>

            {salon.staff.map((st) => {
              const isSelected = selectedStaffId === st.id;
              return (
                <div
                  key={st.id}
                  onClick={() => setSelectedStaffId(st.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'border-primary bg-lavender/40 shadow-glow-sm ring-1 ring-primary/30'
                      : 'border-muted-border bg-white hover:bg-mist'
                  }`}
                >
                  <img
                    src={st.photoUrl}
                    alt={st.name}
                    className="w-10 h-10 rounded-xl object-cover border"
                  />
                  <div>
                    <p className="text-sm font-bold text-ink">{st.name}</p>
                    <p className="text-xs text-muted">{st.role}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-muted-border">
            <Button variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button variant="primary" size="md" onClick={() => setStep(3)} className="px-6">
              Continue <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Date & Time Slot Selection */}
      {step === 3 && (
        <div className="space-y-4 pt-3">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-ink">Select Date & Time</h4>
            <p className="text-xs text-muted">
              Choose an appointment date and your preferred time slot.
            </p>
          </div>

          {/* Horizontal Date Strip */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {dateStrip.map((d, idx) => {
              const isSelected =
                d.getDate() === selectedDate.getDate() &&
                d.getMonth() === selectedDate.getMonth();
              const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
              const monthName = d.toLocaleDateString('en-US', { month: 'short' });
              const dayNum = d.getDate();

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedDate(d);
                    setSelectedSlot(null);
                  }}
                  className={`flex flex-col items-center justify-center min-w-[62px] py-2.5 px-2 rounded-2xl border text-center transition-all shrink-0 ${
                    isSelected
                      ? 'border-primary bg-primary text-white shadow-glow-sm'
                      : 'border-muted-border bg-white text-ink hover:bg-mist'
                  }`}
                >
                  <span className={`text-[11px] font-semibold ${isSelected ? 'text-white/80' : 'text-muted'}`}>
                    {dayName}
                  </span>
                  <span className="text-base font-extrabold">{dayNum}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-muted-light'}`}>
                    {monthName}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Slots Content */}
          {slotData.isDayClosed ? (
            <div className="p-6 rounded-2xl bg-mist border border-muted-border text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-sm font-bold text-ink">{slotData.closedReason}</p>
              <p className="text-xs text-muted">Please select another date on the horizontal calendar.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {['Morning', 'Afternoon', 'Evening'].map((period) => {
                const list =
                  period === 'Morning'
                    ? groupedSlots.morning
                    : period === 'Afternoon'
                    ? groupedSlots.afternoon
                    : groupedSlots.evening;

                if (list.length === 0) return null;

                return (
                  <div key={period} className="space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                      {period}
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {list.map((s) => {
                        const isChosen = selectedSlot?.time === s.time;
                        return (
                          <button
                            key={s.time}
                            type="button"
                            disabled={!s.available}
                            onClick={() => setSelectedSlot(s)}
                            className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                              !s.available
                                ? 'bg-mist/80 text-muted-light border-muted-border/40 cursor-not-allowed line-through opacity-60'
                                : isChosen
                                ? 'bg-primary text-white border-primary shadow-glow-sm'
                                : 'bg-white text-ink border-muted-border hover:border-primary/50 hover:bg-lavender/30'
                            }`}
                          >
                            {s.time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-muted-border">
            <Button
              variant="ghost"
              onClick={() => setStep(allowsStylistSelection ? 2 : 1)}
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={!selectedSlot}
              onClick={() => setStep(4)}
              className="px-6"
            >
              Continue <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Customer Details Form */}
      {step === 4 && (
        <div className="space-y-4 pt-3">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-ink">Your Contact Details</h4>
            <p className="text-xs text-muted">
              No account or signup needed. We will send appointment details to your email and SMS/WhatsApp.
            </p>
          </div>

          <div className="space-y-3">
            <Input
              label="Full Name *"
              placeholder="e.g. Kavindi Wickremasinghe"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              error={formErrors.name}
            />
            <Input
              label="Email Address *"
              type="email"
              placeholder="e.g. kavindi@gmail.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              error={formErrors.email}
              helperText="Booking confirmation and calendar invite sent here."
            />
            <Input
              label="Sri Lankan Phone Number *"
              placeholder="e.g. +94 77 123 4567"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              error={formErrors.phone}
            />
            <Input
              label="Special Notes or Hair/Skin Requests (Optional)"
              placeholder="e.g. Prefer organic dyes, or allergic to specific oils."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-muted-border">
            <Button variant="ghost" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button variant="primary" size="md" onClick={() => setStep(5)} className="px-6">
              Review & Book <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: Review & Payment Method (Pay at Salon) */}
      {step === 5 && (
        <div className="space-y-5 pt-3">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-ink">Review Appointment</h4>
            <p className="text-xs text-muted">
              Confirm your booking details. You will pay directly at the salon counter.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-mist border border-muted-border space-y-3 text-xs">
            <div className="flex justify-between pb-2 border-b border-muted-border/60">
              <span className="text-muted">Salon:</span>
              <span className="font-bold text-ink">{salon.name}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-muted-border/60">
              <span className="text-muted">Date & Time:</span>
              <span className="font-bold text-ink">
                {selectedDate.toLocaleDateString('en-LK', { weekday: 'short', month: 'short', day: 'numeric' })} at {selectedSlot?.time}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-muted-border/60">
              <span className="text-muted">Services:</span>
              <span className="font-medium text-ink text-right">
                {selectedServices.map((s) => s.name).join(', ')}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-muted-border/60">
              <span className="text-muted">Stylist:</span>
              <span className="font-medium text-ink">
                {selectedSlot?.assignedStaffName || 'Any Available'}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-muted-border/60">
              <span className="text-muted">Client:</span>
              <span className="font-medium text-ink">{customerName} ({customerPhone})</span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-extrabold">
              <span className="text-ink">Total to Pay:</span>
              <span className="text-primary-deep">{formatLKR(totalLkr)}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl border border-primary/20 bg-lavender/30 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            <p className="text-xs text-ink-light">
              <strong>Pay at Salon:</strong> Cash or Card accepted upon arrival. Free cancellation up to {salon.cancellationHours} hours before appointment.
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-muted-border">
            <Button variant="ghost" onClick={() => setStep(4)}>
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleConfirmBooking}
              className="px-8 shadow-glow-md"
            >
              Confirm Appointment
            </Button>
          </div>
        </div>
      )}

      {/* STEP 6: Confirmation Screen */}
      {step === 6 && confirmedBooking && (
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-ink">Appointment Confirmed!</h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              Your appointment is booked. Confirmation details have been sent to{' '}
              <strong>{customerEmail}</strong>.
            </p>
          </div>

          {/* Reference Card */}
          <div className="p-4 rounded-2xl bg-lavender/40 border border-muted-border max-w-md mx-auto text-center space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
              BOOKING REFERENCE
            </p>
            <p className="font-mono text-2xl font-black text-primary-deep tracking-wider">
              {confirmedBooking.reference}
            </p>
            <p className="text-[11px] text-muted">
              Keep this reference to manage or reschedule your appointment.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={downloadCalendarEvent} className="gap-1.5">
              <CalendarPlus className="w-4 h-4 text-primary" />
              Add to Calendar (.ics)
            </Button>

            <a
              href={generateBookingShareUrl(
                salon.name,
                confirmedBooking.serviceNames,
                selectedSlot?.time || '',
                typeof window !== 'undefined' ? window.location.href : ''
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-1.5">
                <Share2 className="w-4 h-4 text-emerald-600" />
                WhatsApp Share
              </Button>
            </a>

            {/* Direct Call Salon ONLY if Salon is Pro */}
            {isPro && salon.phone && (
              <a href={`tel:${salon.phone}`}>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Phone className="w-4 h-4 text-primary" />
                  Call Salon
                </Button>
              </a>
            )}
          </div>

          <div className="pt-3">
            <Button variant="primary" size="md" onClick={resetAndClose} className="px-8">
              Done
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
