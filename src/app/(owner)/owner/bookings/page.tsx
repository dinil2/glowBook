'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { DEMO_SALONS, DEMO_BOOKINGS, DemoBooking } from '@/lib/demo-data';
import { formatLKR } from '@/lib/utils';
import {
  Search,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  User,
  Scissors,
} from 'lucide-react';
import { toast } from 'sonner';

export default function OwnerBookingsPage() {
  const salon = DEMO_SALONS[0];
  const [bookings, setBookings] = React.useState<DemoBooking[]>(DEMO_BOOKINGS);
  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  const [search, setSearch] = React.useState<string>('');
  const [walkInOpen, setWalkInOpen] = React.useState(false);

  // Walk-in form state
  const [walkInName, setWalkInName] = React.useState('');
  const [walkInPhone, setWalkInPhone] = React.useState('');
  const [walkInService, setWalkInService] = React.useState(salon.services[0]?.id || '');
  const [walkInTime, setWalkInTime] = React.useState('14:00');

  const filteredBookings = React.useMemo(() => {
    return bookings.filter((b) => {
      if (filterStatus !== 'all' && b.status !== filterStatus) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = b.customerName.toLowerCase().includes(q);
        const matchesRef = b.reference.toLowerCase().includes(q);
        const matchesPhone = b.customerPhone.includes(q);
        if (!matchesName && !matchesRef && !matchesPhone) return false;
      }
      return true;
    });
  }, [bookings, filterStatus, search]);

  const handleUpdateStatus = (id: string, status: DemoBooking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    toast.success(`Booking ${id} marked as ${status}`);
  };

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim()) {
      toast.error('Client name is required');
      return;
    }

    const selectedSrv = salon.services.find((s) => s.id === walkInService) || salon.services[0];
    const newBooking: DemoBooking = {
      id: `walkin-${Date.now()}`,
      reference: `GB-WK${Math.floor(1000 + Math.random() * 9000)}`,
      salonId: salon.id,
      staffId: salon.staff[0]?.id || 'st-1',
      customerName: walkInName,
      customerEmail: 'walkin@client.lk',
      customerPhone: walkInPhone || '+94 77 000 0000',
      startsAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      status: 'confirmed',
      paymentStatus: 'pay_at_salon',
      totalLkr: selectedSrv.priceLkr,
      serviceNames: [selectedSrv.name],
      notes: 'Walk-in Client',
    };

    setBookings([newBooking, ...bookings]);
    setWalkInOpen(false);
    setWalkInName('');
    setWalkInPhone('');
    toast.success('Walk-in booking recorded successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink tracking-tight">Bookings Manager</h1>
          <p className="text-xs text-muted">
            Manage upcoming, completed and walk-in client appointments.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setWalkInOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> New Walk-in Booking
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search reference, client name, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-3 rounded-2xl bg-mist text-xs text-ink focus:outline-none focus:bg-white border border-muted-border"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['all', 'confirmed', 'completed', 'cancelled', 'no_show'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  filterStatus === status
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-mist text-muted hover:bg-lavender'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Bookings Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-mist border-b border-muted-border text-[11px] font-bold uppercase text-muted">
              <tr>
                <th className="p-4">Reference & Client</th>
                <th className="p-4">Services</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-border/60">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-lavender/30 transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-bold text-primary block">{b.reference}</span>
                    <span className="font-bold text-ink">{b.customerName}</span>
                    <span className="text-[11px] text-muted block">{b.customerPhone}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-ink">{b.serviceNames.join(', ')}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-ink block">
                      {new Date(b.startsAt).toLocaleDateString('en-LK', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="text-muted">
                      {new Date(b.startsAt).toLocaleTimeString('en-LK', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-ink">{formatLKR(b.totalLkr)}</td>
                  <td className="p-4">
                    <Badge
                      variant={
                        b.status === 'completed'
                          ? 'success'
                          : b.status === 'cancelled'
                          ? 'danger'
                          : b.status === 'no_show'
                          ? 'outline'
                          : 'primary'
                      }
                      className="text-[10px] capitalize font-bold"
                    >
                      {b.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                    {b.status !== 'completed' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUpdateStatus(b.id, 'completed')}
                        className="text-emerald-700 hover:bg-emerald-50 h-7 text-xs"
                      >
                        Complete
                      </Button>
                    )}
                    {b.status !== 'cancelled' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                        className="text-ruby-600 hover:bg-ruby-50 h-7 text-xs"
                      >
                        Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Walk-in Booking Modal */}
      <Dialog open={walkInOpen} onOpenChange={setWalkInOpen} title="Record Walk-in Booking">
        <form onSubmit={handleCreateWalkIn} className="space-y-4 pt-2">
          <Input
            label="Client Name *"
            placeholder="e.g. Ruwan Silva"
            value={walkInName}
            onChange={(e) => setWalkInName(e.target.value)}
          />
          <Input
            label="Phone Number"
            placeholder="e.g. +94 77 123 4567"
            value={walkInPhone}
            onChange={(e) => setWalkInPhone(e.target.value)}
          />
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink uppercase tracking-wider block">
              Select Service
            </label>
            <select
              value={walkInService}
              onChange={(e) => setWalkInService(e.target.value)}
              className="w-full h-11 px-3 rounded-2xl bg-white border border-muted-border text-xs text-ink focus:outline-none focus:border-primary"
            >
              {salon.services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - LKR {s.priceLkr.toLocaleString()} ({s.durationMin} min)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-muted-border">
            <Button variant="ghost" onClick={() => setWalkInOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Booking
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
