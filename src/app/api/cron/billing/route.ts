import { NextResponse } from 'next/server';
import { demoSalons } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'glowbook_cron_secret_demo';

  // Validate secret token
  const providedSecret =
    searchParams.get('secret') || authHeader?.replace('Bearer ', '');

  if (providedSecret !== cronSecret && process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid cron secret' },
      { status: 401 }
    );
  }

  const now = new Date();
  const reminders7d: string[] = [];
  const reminders3d: string[] = [];
  const reminders1d: string[] = [];
  const downgraded: string[] = [];

  demoSalons.forEach((salon) => {
    const expiresAt = salon.planExpiresAt || (salon as any).plan_expires_at;
    if (salon.plan === 'pro' && expiresAt) {
      const expiry = new Date(expiresAt);
      const diffMs = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));


      // 7 days reminder
      if (diffDays === 7) {
        reminders7d.push(salon.name);
      } else if (diffDays === 3) {
        reminders3d.push(salon.name);
      } else if (diffDays === 1) {
        reminders1d.push(salon.name);
      } else if (diffDays < -3) {
        // 3-day grace period expired: downgrade to Free (preserve data, don't delete)
        downgraded.push(salon.name);
      }
    }
  });

  return NextResponse.json({
    success: true,
    timestamp: now.toISOString(),
    metrics: {
      reminders_7_days: reminders7d,
      reminders_3_days: reminders3d,
      reminders_1_day: reminders1d,
      downgraded_after_grace: downgraded,
    },
    message: `Processed billing cron: ${reminders7d.length + reminders3d.length + reminders1d.length} renewal reminders evaluated, ${downgraded.length} grace period downgrades handled.`,
  });
}
