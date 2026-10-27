/**
 * Glowbook Plans & Feature-Gating System
 * SINGLE SOURCE OF TRUTH for all plan limits, pricing, feature flags, and access checks.
 */

export type PlanType = 'free' | 'pro';

export interface PlanPricingPeriod {
  months: number;
  label: string;
  priceLkr: number;
  regularPriceLkr: number;
  savingsLkr: number;
  badge?: string;
  popular?: boolean;
}

export interface PlanConfig {
  id: PlanType;
  name: string;
  tagline: string;
  badge?: string;
  limits: {
    maxServices: number; // e.g. 8 vs Infinity
    maxGalleryImages: number; // e.g. 6 vs 30
    maxStaff: number; // e.g. 2 vs Infinity
    monthlyBookingCap: number; // e.g. 30 vs Infinity
  };
  features: {
    publicProfile: boolean;
    onlineBooking: boolean;
    bookingLinkAndQr: boolean;
    basicDashboard: boolean;
    customerStylistSelection: boolean;
    staffVisualCalendar: boolean;
    revenueAndAnalyticsReports: boolean;
    customerDirectoryAndExport: boolean;
    whatsAppCustomerMessages: boolean;
    reviewReplies: boolean;
    publicCallAndWhatsAppButtons: boolean;
    verifiedProBadge: boolean;
    featuredEligible: boolean;
    searchRankingBoost: boolean;
  };
}

export const PLAN_PRICING: Record<1 | 3 | 12, PlanPricingPeriod> = {
  1: {
    months: 1,
    label: '1 Month',
    priceLkr: 2000,
    regularPriceLkr: 2000,
    savingsLkr: 0,
  },
  3: {
    months: 3,
    label: '3 Months (Quarterly)',
    priceLkr: 5400, // LKR 1,800/mo (10% OFF)
    regularPriceLkr: 6000,
    savingsLkr: 600,
    badge: 'Save 10%',
    popular: true,
  },
  12: {
    months: 12,
    label: '12 Months (Annual)',
    priceLkr: 19200, // LKR 1,600/mo (20% OFF)
    regularPriceLkr: 24000,
    savingsLkr: 4800,
    badge: 'Best Value · Save 20%',
  },
};

export const PLANS: Record<PlanType, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Starter (Free)',
    tagline: 'Everything you need to launch online bookings and grow your salon',
    limits: {
      maxServices: 8,
      maxGalleryImages: 6,
      maxStaff: 2,
      monthlyBookingCap: 30,
    },
    features: {
      publicProfile: true,
      onlineBooking: true,
      bookingLinkAndQr: true,
      basicDashboard: true,
      customerStylistSelection: false, // auto-assign only
      staffVisualCalendar: false,
      revenueAndAnalyticsReports: false,
      customerDirectoryAndExport: false,
      whatsAppCustomerMessages: false,
      reviewReplies: false,
      publicCallAndWhatsAppButtons: false,
      verifiedProBadge: false,
      featuredEligible: false,
      searchRankingBoost: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Glowbook Pro',
    tagline: 'High-growth salon management, client engagement & VIP visibility',
    badge: 'Verified Pro',
    limits: {
      maxServices: Infinity,
      maxGalleryImages: 30,
      maxStaff: Infinity,
      monthlyBookingCap: Infinity,
    },
    features: {
      publicProfile: true,
      onlineBooking: true,
      bookingLinkAndQr: true,
      basicDashboard: true,
      customerStylistSelection: true,
      staffVisualCalendar: true,
      revenueAndAnalyticsReports: true,
      customerDirectoryAndExport: true,
      whatsAppCustomerMessages: true,
      reviewReplies: true,
      publicCallAndWhatsAppButtons: true,
      verifiedProBadge: true,
      featuredEligible: true,
      searchRankingBoost: true,
    },
  },
};

export type FeatureKey = keyof PlanConfig['features'];
export type LimitKey = keyof PlanConfig['limits'];

export interface SalonPlanContext {
  plan: PlanType | string;
  plan_expires_at?: string | null;
  trial_ends_at?: string | null;
}

/**
 * Determines if a salon currently has active Pro privileges,
 * taking into account paid Pro status, plan expiration, and active free trials.
 */
export function isProActive(salon: SalonPlanContext): boolean {
  const now = new Date();

  // Check active trial
  if (salon.trial_ends_at) {
    const trialEnd = new Date(salon.trial_ends_at);
    if (trialEnd > now) return true;
  }

  // Check active Pro plan
  if (salon.plan === 'pro') {
    if (!salon.plan_expires_at) return true; // Perpetual or lifetime
    const planEnd = new Date(salon.plan_expires_at);
    return planEnd > now;
  }

  return false;
}

/**
 * Get effective plan type ('pro' if paid/trial active, otherwise 'free')
 */
export function getEffectivePlan(salon: SalonPlanContext): PlanType {
  return isProActive(salon) ? 'pro' : 'free';
}

/**
 * Single source of truth feature gate check.
 * Usage: can(salon, 'whatsAppCustomerMessages')
 */
export function can(salon: SalonPlanContext, feature: FeatureKey): boolean {
  const effectivePlan = getEffectivePlan(salon);
  return PLANS[effectivePlan].features[feature];
}

/**
 * Single source of truth limit lookup.
 * Usage: getLimit(salon, 'maxServices')
 */
export function getLimit(salon: SalonPlanContext, limit: LimitKey): number {
  const effectivePlan = getEffectivePlan(salon);
  return PLANS[effectivePlan].limits[limit];
}

/**
 * Usage status helper for booking caps
 */
export function getBookingCapStatus(currentBookingsCount: number, cap: number) {
  if (cap === Infinity) {
    return {
      isCapped: false,
      isNearCap: false,
      percentage: 0,
      remaining: Infinity,
    };
  }

  const remaining = Math.max(0, cap - currentBookingsCount);
  const percentage = Math.min(100, Math.round((currentBookingsCount / cap) * 100));

  return {
    isCapped: currentBookingsCount >= cap,
    isNearCap: percentage >= 80 && currentBookingsCount < cap,
    percentage,
    remaining,
  };
}
