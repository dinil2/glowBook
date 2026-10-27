import { describe, it, expect } from 'vitest';

interface SubscriptionPayment {
  id: string;
  salonId: string;
  months: 1 | 3 | 12;
  amountLkr: number;
  status: 'pending_review' | 'approved' | 'rejected';
}

interface SalonRecord {
  id: string;
  plan: 'free' | 'pro';
  planExpiresAt: string | null;
}

/**
 * Pure simulation of the PostgreSQL SECURITY DEFINER approve_subscription_payment function
 */
function approveSubscriptionPayment(
  payment: SubscriptionPayment,
  salon: SalonRecord,
  now: Date
): { payment: SubscriptionPayment; salon: SalonRecord; idempotent: boolean } {
  // Idempotency check: if already approved, do not extend plan again
  if (payment.status === 'approved') {
    return { payment, salon, idempotent: true };
  }

  // Calculate new expiry: GREATEST(COALESCE(plan_expires_at, now), now) + months
  const currentExpiry = salon.planExpiresAt ? new Date(salon.planExpiresAt) : now;
  const baseDate = currentExpiry > now ? currentExpiry : now;

  const newExpiry = new Date(baseDate);
  newExpiry.setMonth(newExpiry.getMonth() + payment.months);

  const updatedPayment: SubscriptionPayment = {
    ...payment,
    status: 'approved',
  };

  const updatedSalon: SalonRecord = {
    ...salon,
    plan: 'pro',
    planExpiresAt: newExpiry.toISOString(),
  };

  return { payment: updatedPayment, salon: updatedSalon, idempotent: false };
}

describe('Idempotent Subscription Payment Approval', () => {
  it('extends plan expiry correctly from NOW when salon had no prior expiry', () => {
    const now = new Date('2026-10-27T10:00:00Z');
    const payment: SubscriptionPayment = {
      id: 'pay-1',
      salonId: 'salon-1',
      months: 3,
      amountLkr: 5400,
      status: 'pending_review',
    };
    const salon: SalonRecord = {
      id: 'salon-1',
      plan: 'free',
      planExpiresAt: null,
    };

    const result = approveSubscriptionPayment(payment, salon, now);

    expect(result.idempotent).toBe(false);
    expect(result.payment.status).toBe('approved');
    expect(result.salon.plan).toBe('pro');

    const expectedExpiry = new Date('2027-01-27T10:00:00Z');
    expect(new Date(result.salon.planExpiresAt!).getTime()).toBe(expectedExpiry.getTime());
  });

  it('extends plan expiry from existing future expiry date when renewing early', () => {
    const now = new Date('2026-10-27T10:00:00Z');
    const futureExpiry = new Date('2026-11-27T10:00:00Z'); // 1 month left

    const payment: SubscriptionPayment = {
      id: 'pay-2',
      salonId: 'salon-1',
      months: 1,
      amountLkr: 2000,
      status: 'pending_review',
    };
    const salon: SalonRecord = {
      id: 'salon-1',
      plan: 'pro',
      planExpiresAt: futureExpiry.toISOString(),
    };

    const result = approveSubscriptionPayment(payment, salon, now);

    // Should extend from futureExpiry (2026-11-27 + 1 month = 2026-12-27), not from now
    const expectedExpiry = new Date('2026-12-27T10:00:00Z');
    expect(new Date(result.salon.planExpiresAt!).getTime()).toBe(expectedExpiry.getTime());
  });

  it('is strictly idempotent: approving twice does not extend the plan twice', () => {
    const now = new Date('2026-10-27T10:00:00Z');
    const payment: SubscriptionPayment = {
      id: 'pay-3',
      salonId: 'salon-1',
      months: 1,
      amountLkr: 2000,
      status: 'pending_review',
    };
    const salon: SalonRecord = {
      id: 'salon-1',
      plan: 'free',
      planExpiresAt: null,
    };

    // First approval
    const firstResult = approveSubscriptionPayment(payment, salon, now);
    expect(firstResult.idempotent).toBe(false);
    const firstExpiry = firstResult.salon.planExpiresAt;

    // Second approval attempt on the already approved payment
    const secondResult = approveSubscriptionPayment(
      firstResult.payment,
      firstResult.salon,
      now
    );

    expect(secondResult.idempotent).toBe(true);
    expect(secondResult.salon.planExpiresAt).toBe(firstExpiry); // Remained unchanged!
  });
});
