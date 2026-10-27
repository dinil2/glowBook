/**
 * Glowbook Pure Booking Engine
 * Computes available time slots, handles buffer times, breaks, closures,
 * stylist auto-assignment, and Free plan monthly booking caps.
 */

export interface TimeSlot {
  time: string; // "09:30"
  datetime: string; // ISO string
  available: boolean;
  reason?: 'past' | 'closed' | 'break' | 'booked' | 'lead_time' | 'advance_limit' | 'cap_reached';
  assignedStaffId?: string;
  assignedStaffName?: string;
}

export interface SalonHoursInput {
  weekday: number; // 0=Sun, 1=Mon, ..., 6=Sat
  openTime: string; // "09:00"
  closeTime: string; // "19:00"
  breakStart?: string | null; // "13:00"
  breakEnd?: string | null; // "14:00"
  isClosed: boolean;
}

export interface ExistingBookingInput {
  id: string;
  staffId?: string | null;
  startsAt: string; // ISO string
  endsAt: string; // ISO string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
}

export interface StaffMemberInput {
  id: string;
  name: string;
  isActive: boolean;
}

export interface SlotEngineParams {
  date: Date; // The chosen appointment date
  now?: Date; // Reference current time (defaults to new Date())
  totalDurationMin: number; // Sum of selected services
  salonHours: SalonHoursInput[];
  closures: string[]; // ['2026-10-31', ...] YYYY-MM-DD
  existingBookings: ExistingBookingInput[];
  staff: StaffMemberInput[];
  selectedStaffId?: string | null; // If null or 'any', auto-assign any available staff
  minLeadHours?: number; // default 2 hours
  maxAdvanceDays?: number; // default 30 days
  gridIntervalMin?: 15 | 30; // default 30 min
  bufferMin?: number; // default 10 min
  isMonthlyCapReached?: boolean; // if Free salon reached 30/mo
}

function timeStringToMinutes(timeStr: string): number {
  const [hours, mins] = timeStr.split(':').map(Number);
  return hours * 60 + mins;
}

function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function formatDateToYYYYMMDD(d: Date): string {
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Pure, deterministic slot calculation engine
 */
export function getAvailableSlots(params: SlotEngineParams): {
  slots: TimeSlot[];
  isDayClosed: boolean;
  closedReason?: string;
  nextAvailableDate?: string;
} {
  const {
    date,
    now = new Date(),
    totalDurationMin,
    salonHours,
    closures = [],
    existingBookings,
    staff,
    selectedStaffId = null,
    minLeadHours = 2,
    maxAdvanceDays = 30,
    gridIntervalMin = 30,
    bufferMin = 10,
    isMonthlyCapReached = false,
  } = params;

  // Check Monthly Cap
  if (isMonthlyCapReached) {
    return {
      slots: [],
      isDayClosed: true,
      closedReason: 'This salon is not taking new online bookings for this month.',
    };
  }

  const dateStr = formatDateToYYYYMMDD(date);

  // Check closures
  if (closures.includes(dateStr)) {
    return {
      slots: [],
      isDayClosed: true,
      closedReason: 'Salon is closed on this date (Holiday / Special Closure).',
    };
  }

  // Check max advance days
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > maxAdvanceDays) {
    return {
      slots: [],
      isDayClosed: true,
      closedReason: `Bookings open only up to ${maxAdvanceDays} days in advance.`,
    };
  }

  // Get hours for this weekday
  const weekday = date.getDay(); // 0=Sun, 1=Mon...
  const hours = salonHours.find((h) => h.weekday === weekday);

  if (!hours || hours.isClosed) {
    return {
      slots: [],
      isDayClosed: true,
      closedReason: 'Salon is closed on this day of the week.',
    };
  }

  const openMinutes = timeStringToMinutes(hours.openTime);
  const closeMinutes = timeStringToMinutes(hours.closeTime);
  const breakStartMinutes = hours.breakStart ? timeStringToMinutes(hours.breakStart) : null;
  const breakEndMinutes = hours.breakEnd ? timeStringToMinutes(hours.breakEnd) : null;

  const activeStaff = staff.filter((s) => s.isActive);
  const targetStaffList =
    selectedStaffId && selectedStaffId !== 'any'
      ? activeStaff.filter((s) => s.id === selectedStaffId)
      : activeStaff;

  const slots: TimeSlot[] = [];

  // Active bookings filter (pending or confirmed)
  const activeBookings = existingBookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'pending'
  );

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  for (let m = openMinutes; m + totalDurationMin <= closeMinutes; m += gridIntervalMin) {
    const timeStr = minutesToTimeString(m);
    const slotDate = new Date(year, month, day, Math.floor(m / 60), m % 60, 0, 0);

    const slotStartMs = slotDate.getTime();
    const slotEndMs = slotStartMs + (totalDurationMin + bufferMin) * 60 * 1000;

    let available = true;
    let reason: TimeSlot['reason'] = undefined;
    let assignedStaffId: string | undefined = undefined;
    let assignedStaffName: string | undefined = undefined;

    // 1. Check if slot is in the past
    if (slotDate.getTime() <= now.getTime()) {
      available = false;
      reason = 'past';
    }

    // 2. Check min lead time
    const leadTimeMs = minLeadHours * 60 * 60 * 1000;
    if (available && slotDate.getTime() - now.getTime() < leadTimeMs) {
      available = false;
      reason = 'lead_time';
    }

    // 3. Check break window
    if (available && breakStartMinutes !== null && breakEndMinutes !== null) {
      const slotEndMinutes = m + totalDurationMin;
      // Overlaps if slot starts before break ends AND slot ends after break starts
      if (m < breakEndMinutes && slotEndMinutes > breakStartMinutes) {
        available = false;
        reason = 'break';
      }
    }

    // 4. Check staff availability
    if (available) {
      let foundAvailableStaff = false;

      for (const st of targetStaffList) {
        // Check if this staff member has an overlapping booking
        const hasConflict = activeBookings.some((b) => {
          if (b.staffId && b.staffId !== st.id) return false;
          const bStart = new Date(b.startsAt).getTime();
          const bEnd = new Date(b.endsAt).getTime() + bufferMin * 60 * 1000; // respect 10m buffer
          return slotStartMs < bEnd && slotEndMs > bStart;
        });

        if (!hasConflict) {
          foundAvailableStaff = true;
          assignedStaffId = st.id;
          assignedStaffName = st.name;
          break; // Assigned this free staff member
        }
      }

      if (!foundAvailableStaff) {
        available = false;
        reason = 'booked';
      }
    }

    slots.push({
      time: timeStr,
      datetime: slotDate.toISOString(),
      available,
      reason,
      assignedStaffId,
      assignedStaffName,
    });
  }

  return {
    slots,
    isDayClosed: false,
  };
}

/**
 * Checks if a Free plan salon has reached its monthly booking cap (default 30)
 * in Asia/Colombo calendar month.
 */
export function isFreePlanCapReached(
  monthlyBookingsCount: number,
  plan: 'free' | 'pro',
  cap = 30
): boolean {
  if (plan === 'pro') return false;
  return monthlyBookingsCount >= cap;
}
