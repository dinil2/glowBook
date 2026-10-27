'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DEMO_SALONS, DemoHours } from '@/lib/demo-data';
import { Clock, Calendar, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function OwnerHoursPage() {
  const salon = DEMO_SALONS[0];
  const [hours, setHours] = React.useState<DemoHours[]>(salon.hours);
  const [closures, setClosures] = React.useState<{ date: string; reason: string }[]>([
    { date: '2026-12-25', reason: 'Christmas Day' },
    { date: '2027-01-01', reason: 'New Year Day' },
  ]);
  const [newClosureDate, setNewClosureDate] = React.useState('');
  const [newClosureReason, setNewClosureReason] = React.useState('');

  const days = [
    { weekday: 1, name: 'Monday' },
    { weekday: 2, name: 'Tuesday' },
    { weekday: 3, name: 'Wednesday' },
    { weekday: 4, name: 'Thursday' },
    { weekday: 5, name: 'Friday' },
    { weekday: 6, name: 'Saturday' },
    { weekday: 0, name: 'Sunday' },
  ];

  const handleToggleClosed = (weekday: number) => {
    setHours((prev) =>
      prev.map((h) => (h.weekday === weekday ? { ...h, isClosed: !h.isClosed } : h))
    );
  };

  const handleTimeChange = (weekday: number, field: keyof DemoHours, value: string) => {
    setHours((prev) =>
      prev.map((h) => (h.weekday === weekday ? { ...h, [field]: value } : h))
    );
  };

  const handleSaveHours = () => {
    toast.success('Salon working hours updated successfully!');
  };

  const handleAddClosure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClosureDate) {
      toast.error('Please pick a closure date');
      return;
    }
    setClosures([...closures, { date: newClosureDate, reason: newClosureReason || 'Holiday' }]);
    setNewClosureDate('');
    setNewClosureReason('');
    toast.success('Closure date added');
  };

  const handleDeleteClosure = (index: number) => {
    setClosures(closures.filter((_, i) => i !== index));
    toast.success('Closure removed');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-ink tracking-tight">Hours & Closures</h1>
        <p className="text-xs text-muted">
          Define regular opening schedules, lunch break buffers, and special holiday closures.
        </p>
      </div>

      {/* Regular Working Hours */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Weekly Working Hours & Breaks</CardTitle>
          <Button variant="primary" size="sm" onClick={handleSaveHours}>
            <Save className="w-4 h-4 mr-1.5" /> Save Changes
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {days.map((d) => {
            const h = hours.find((x) => x.weekday === d.weekday) || {
              weekday: d.weekday,
              openTime: '09:00',
              closeTime: '19:00',
              breakStart: '13:00',
              breakEnd: '13:30',
              isClosed: false,
            };

            return (
              <div
                key={d.weekday}
                className="p-3.5 rounded-2xl bg-white border border-muted-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 w-32">
                  <input
                    type="checkbox"
                    checked={!h.isClosed}
                    onChange={() => handleToggleClosed(d.weekday)}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                  <span className={`font-bold ${h.isClosed ? 'text-muted line-through' : 'text-ink'}`}>
                    {d.name}
                  </span>
                </div>

                {!h.isClosed ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted text-[11px]">Open:</span>
                      <input
                        type="time"
                        value={h.openTime}
                        onChange={(e) => handleTimeChange(d.weekday, 'openTime', e.target.value)}
                        className="p-1.5 rounded-lg border border-muted-border text-ink bg-mist text-xs font-semibold"
                      />
                      <span className="text-muted text-[11px]">to</span>
                      <input
                        type="time"
                        value={h.closeTime}
                        onChange={(e) => handleTimeChange(d.weekday, 'closeTime', e.target.value)}
                        className="p-1.5 rounded-lg border border-muted-border text-ink bg-mist text-xs font-semibold"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 pl-2 sm:border-l border-muted-border">
                      <span className="text-muted text-[11px]">Lunch Break:</span>
                      <input
                        type="time"
                        value={h.breakStart || '13:00'}
                        onChange={(e) => handleTimeChange(d.weekday, 'breakStart', e.target.value)}
                        className="p-1.5 rounded-lg border border-muted-border text-ink bg-mist text-xs font-semibold"
                      />
                      <span className="text-muted text-[11px]">-</span>
                      <input
                        type="time"
                        value={h.breakEnd || '13:30'}
                        onChange={(e) => handleTimeChange(d.weekday, 'breakEnd', e.target.value)}
                        className="p-1.5 rounded-lg border border-muted-border text-ink bg-mist text-xs font-semibold"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-ruby-500 font-bold py-1">Closed for appointments</span>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Holiday Closures */}
      <Card>
        <CardHeader>
          <CardTitle>Holiday & Special Closures</CardTitle>
          <p className="text-xs text-muted">
            The booking engine automatically marks these dates unavailable for clients.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddClosure} className="flex flex-col sm:flex-row items-end gap-3 pb-4 border-b border-muted-border">
            <div className="flex-1 w-full">
              <Input
                label="Date *"
                type="date"
                value={newClosureDate}
                onChange={(e) => setNewClosureDate(e.target.value)}
              />
            </div>
            <div className="flex-1 w-full">
              <Input
                label="Closure Reason"
                placeholder="e.g. Sinhala & Tamil New Year"
                value={newClosureReason}
                onChange={(e) => setNewClosureReason(e.target.value)}
              />
            </div>
            <Button variant="primary" size="md" type="submit" className="w-full sm:w-auto shrink-0">
              <Plus className="w-4 h-4 mr-1" /> Add Blocked Date
            </Button>
          </form>

          <div className="space-y-2">
            {closures.map((c, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white border border-muted-border flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-ink mr-2">{c.date}</span>
                  <span className="text-muted">({c.reason})</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-ruby-600 hover:bg-ruby-50"
                  onClick={() => handleDeleteClosure(idx)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
