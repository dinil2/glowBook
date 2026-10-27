'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LockedFeatureGate } from '@/components/common/locked-feature-gate';
import { DEMO_SALONS, DEMO_BOOKINGS } from '@/lib/demo-data';
import { can } from '@/features/billing/plans';
import { Calendar, ChevronLeft, ChevronRight, Clock, Plus } from 'lucide-react';

import { useOwnerSalon } from '@/features/owner/context/owner-salon-context';

export default function StaffCalendarPage() {
  const { currentSalon: salon } = useOwnerSalon();
  const [view, setView] = React.useState<'day' | 'week'>('day');
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const isLocked = !can(salon, 'staffVisualCalendar');

  const staffMembers = salon.staff;
  const timeHours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  return (
    <LockedFeatureGate
      isLocked={isLocked}
      featureName="Visual Staff Calendar"
      description="View real-time day and week schedules by staff member column. Prevent clashes and coordinate appointments with ease."
      salonName={salon.name}
      billingCode={salon.billingCode}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-ink tracking-tight">Staff Calendar</h1>
            <p className="text-xs text-muted">
              Interactive multi-column schedule for each team member.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1 rounded-2xl bg-white border border-muted-border flex">
              <button
                onClick={() => setView('day')}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                  view === 'day' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-ink'
                }`}
              >
                Day View
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                  view === 'week' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-ink'
                }`}
              >
                Week View
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid Container */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-mist border-b border-muted-border flex flex-row items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-bold text-sm text-ink">
                {currentDate.toLocaleDateString('en-LK', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <div className="min-w-[650px]">
              {/* Staff Column Headers */}
              <div className="grid grid-cols-5 border-b border-muted-border bg-white text-xs font-bold text-ink">
                <div className="p-3 border-r border-muted-border text-center text-muted uppercase text-[10px]">
                  Time
                </div>
                {staffMembers.map((st) => (
                  <div key={st.id} className="p-3 border-r border-muted-border last:border-r-0 flex items-center gap-2">
                    <img src={st.photoUrl} alt={st.name} className="w-7 h-7 rounded-lg object-cover border" />
                    <div>
                      <p className="font-bold truncate">{st.name}</p>
                      <p className="text-[10px] text-muted truncate">{st.role}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="divide-y divide-muted-border/60">
                {timeHours.map((hour) => (
                  <div key={hour} className="grid grid-cols-5 h-20">
                    <div className="p-2 border-r border-muted-border bg-mist/50 text-[11px] font-mono font-bold text-muted text-center">
                      {hour}:00
                    </div>
                    {staffMembers.map((st, idx) => {
                      // Mock appointment for demonstration
                      const hasMockBooking = (hour + idx) % 3 === 0;
                      return (
                        <div
                          key={st.id}
                          className="p-1 border-r border-muted-border last:border-r-0 relative hover:bg-lavender/20 transition-colors"
                        >
                          {hasMockBooking && (
                            <div className="h-full rounded-xl bg-lavender/80 border border-primary/30 p-2 text-[11px] flex flex-col justify-between shadow-sm">
                              <span className="font-bold text-primary-deep truncate">
                                Cut & Blowout
                              </span>
                              <span className="text-[10px] text-muted truncate">
                                Client: Kavindi W.
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </LockedFeatureGate>
  );
}
