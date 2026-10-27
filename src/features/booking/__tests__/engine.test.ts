import { describe, it, expect } from 'vitest';
import { getAvailableSlots, isFreePlanCapReached } from '../engine';
import { can, getLimit, isProActive } from '../../billing/plans';

describe('Glowbook Slot Engine', () => {
  const baseHours = [
    { weekday: 1, openTime: '09:00', closeTime: '17:00', breakStart: '13:00', breakEnd: '14:00', isClosed: false },
    { weekday: 0, openTime: '09:00', closeTime: '17:00', isClosed: true }, // Sunday closed
  ];

  const staff = [
    { id: 'staff-1', name: 'Rohan', isActive: true },
    { id: 'staff-2', name: 'Nadeeka', isActive: true },
  ];

  it('generates 30-minute interval slots and excludes lunch break', () => {
    // A future Monday (2026-11-02)
    const testDate = new Date(2026, 10, 2, 0, 0, 0); // month is 0-indexed, 10 = Nov
    const now = new Date(2026, 9, 27, 8, 0, 0); // Oct 27 08:00

    const result = getAvailableSlots({
      date: testDate,
      now,
      totalDurationMin: 45,
      salonHours: baseHours,
      closures: [],
      existingBookings: [],
      staff,
      selectedStaffId: 'any',
      minLeadHours: 2,
    });

    expect(result.isDayClosed).toBe(false);
    expect(result.slots.length).toBeGreaterThan(0);

    // Check slot at 09:00 is available
    const slot9am = result.slots.find((s) => s.time === '09:00');
    expect(slot9am?.available).toBe(true);
    expect(slot9am?.assignedStaffName).toBe('Rohan');

    // Check 13:00 (lunch break starts at 13:00, service is 45m so it overlaps)
    const slot1pm = result.slots.find((s) => s.time === '13:00');
    expect(slot1pm?.available).toBe(false);
    expect(slot1pm?.reason).toBe('break');
  });

  it('respects 10-minute buffer and flags conflict when all staff are booked', () => {
    const testDate = new Date(2026, 10, 2, 0, 0, 0);
    const now = new Date(2026, 9, 27, 8, 0, 0);

    // Both staff booked from 10:00 to 11:00 on Nov 2
    const bookingStart = new Date(2026, 10, 2, 10, 0, 0).toISOString();
    const bookingEnd = new Date(2026, 10, 2, 11, 0, 0).toISOString();

    const existingBookings = [
      {
        id: 'b-1',
        staffId: 'staff-1',
        startsAt: bookingStart,
        endsAt: bookingEnd,
        status: 'confirmed' as const,
      },
      {
        id: 'b-2',
        staffId: 'staff-2',
        startsAt: bookingStart,
        endsAt: bookingEnd,
        status: 'confirmed' as const,
      },
    ];

    const result = getAvailableSlots({
      date: testDate,
      now,
      totalDurationMin: 30,
      salonHours: baseHours,
      closures: [],
      existingBookings,
      staff,
      selectedStaffId: 'any',
    });

    // 10:00 should be marked booked
    const slot10am = result.slots.find((s) => s.time === '10:00');
    expect(slot10am?.available).toBe(false);
    expect(slot10am?.reason).toBe('booked');
  });

  it('marks entire day closed when salon is closed on that day or on holiday closure', () => {
    // Sunday Nov 1
    const sundayDate = new Date(2026, 10, 1, 0, 0, 0);
    const resultSunday = getAvailableSlots({
      date: sundayDate,
      now: new Date(2026, 9, 27, 8, 0, 0),
      totalDurationMin: 30,
      salonHours: baseHours,
      closures: [],
      existingBookings: [],
      staff,
    });
    expect(resultSunday.isDayClosed).toBe(true);

    // Monday Nov 2 on a closure date
    const mondayDate = new Date(2026, 10, 2, 0, 0, 0);
    const resultHoliday = getAvailableSlots({
      date: mondayDate,
      now: new Date(2026, 9, 27, 8, 0, 0),
      totalDurationMin: 30,
      salonHours: baseHours,
      closures: ['2026-11-02'],
      existingBookings: [],
      staff,
    });
    expect(resultHoliday.isDayClosed).toBe(true);
  });

  it('disables slots that violate minimum lead time for today', () => {
    // Monday at 10:00 AM
    const today = new Date(2026, 9, 26, 10, 0, 0); // 2026-10-26 is Monday
    const todayHours = [
      { weekday: 1, openTime: '08:00', closeTime: '18:00', isClosed: false },
    ];

    const result = getAvailableSlots({
      date: today,
      now: today,
      totalDurationMin: 30,
      salonHours: todayHours,
      closures: [],
      existingBookings: [],
      staff,
      minLeadHours: 2, // requires 2 hours notice -> 10:00 to 12:00 PM disabled
    });

    // 10:30 is in the future relative to 10:00, but < 2 hours notice
    const slot1030 = result.slots.find((s) => s.time === '10:30');
    expect(slot1030?.available).toBe(false);
    expect(slot1030?.reason).toBe('lead_time');

    // 13:00 is 3 hours ahead -> available
    const slot1300 = result.slots.find((s) => s.time === '13:00');
    expect(slot1300?.available).toBe(true);
  });
});

describe('Glowbook Plans & Booking Cap Feature Gating', () => {
  it('correctly enforces Free plan cap of 30 bookings per month', () => {
    expect(isFreePlanCapReached(29, 'free', 30)).toBe(false);
    expect(isFreePlanCapReached(30, 'free', 30)).toBe(true);
    expect(isFreePlanCapReached(45, 'free', 30)).toBe(true);

    // Pro plans NEVER hit a booking cap
    expect(isFreePlanCapReached(30, 'pro', 30)).toBe(false);
    expect(isFreePlanCapReached(100, 'pro', 30)).toBe(false);
  });

  it('evaluates plan limits and feature flags from single source of truth', () => {
    const freeSalon = { plan: 'free', plan_expires_at: null, trial_ends_at: null };
    const proSalon = {
      plan: 'pro',
      plan_expires_at: new Date(Date.now() + 10000000).toISOString(),
      trial_ends_at: null,
    };
    const trialSalon = {
      plan: 'free',
      plan_expires_at: null,
      trial_ends_at: new Date(Date.now() + 10000000).toISOString(),
    };

    // Free limits
    expect(getLimit(freeSalon, 'maxServices')).toBe(8);
    expect(getLimit(freeSalon, 'maxStaff')).toBe(2);
    expect(getLimit(freeSalon, 'maxGalleryImages')).toBe(6);
    expect(can(freeSalon, 'publicCallAndWhatsAppButtons')).toBe(false);
    expect(can(freeSalon, 'customerStylistSelection')).toBe(false);
    expect(can(freeSalon, 'revenueAndAnalyticsReports')).toBe(false);

    // Pro limits
    expect(getLimit(proSalon, 'maxServices')).toBe(Infinity);
    expect(getLimit(proSalon, 'maxStaff')).toBe(Infinity);
    expect(can(proSalon, 'publicCallAndWhatsAppButtons')).toBe(true);
    expect(can(proSalon, 'customerStylistSelection')).toBe(true);
    expect(can(proSalon, 'revenueAndAnalyticsReports')).toBe(true);

    // Active Trial grants Pro features
    expect(isProActive(trialSalon)).toBe(true);
    expect(can(trialSalon, 'publicCallAndWhatsAppButtons')).toBe(true);
    expect(can(trialSalon, 'verifiedProBadge')).toBe(true);
  });
});
