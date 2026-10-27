'use client';

import * as React from 'react';
import { DEMO_BOOKINGS, demoSalons } from '@/lib/demo-data';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import {
  CalendarCheck,
  Search,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from 'lucide-react';

export default function AdminBookingsPage() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [salonFilter, setSalonFilter] = React.useState<string>('all');

  // Filter platform bookings
  const filteredBookings = React.useMemo(() => {
    return DEMO_BOOKINGS.filter((b: any) => {
      const salonId = b.salonId || b.salon_id;
      const salon = demoSalons.find((s) => s.id === salonId);
      const salonName = salon ? salon.name.toLowerCase() : '';
      const ref = b.reference || b.reference_code || '';
      const custName = b.customerName || b.customer_name || '';
      const custPhone = b.customerPhone || b.customer_phone || '';

      const matchesSearch =
        ref.toLowerCase().includes(search.toLowerCase()) ||
        custName.toLowerCase().includes(search.toLowerCase()) ||
        custPhone.includes(search) ||
        salonName.includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesSalon = salonFilter === 'all' || salonId === salonFilter;

      return matchesSearch && matchesStatus && matchesSalon;
    });
  }, [search, statusFilter, salonFilter]);

  // Aggregate metrics
  const totalVolume = React.useMemo(() => {
    return DEMO_BOOKINGS.filter((b: any) => b.status === 'completed' || b.status === 'confirmed').reduce(
      (acc: number, b: any) => acc + (b.totalLkr ?? b.total_lkr ?? 0),
      0
    );
  }, []);

  const completedCount = DEMO_BOOKINGS.filter((b: any) => b.status === 'completed').length;
  const cancelledCount = DEMO_BOOKINGS.filter((b: any) => b.status === 'cancelled').length;
  const cancellationRate = Math.round((cancelledCount / Math.max(DEMO_BOOKINGS.length, 1)) * 100);

  // CSV Export
  const exportCSV = () => {
    const headers = [
      'Reference',
      'Salon Name',
      'Customer Name',
      'Customer Phone',
      'Customer Email',
      'Date & Time',
      'Total LKR',
      'Status',
    ];
    const rows = filteredBookings.map((b: any) => {
      const salonId = b.salonId || b.salon_id;
      const salon = demoSalons.find((s) => s.id === salonId);
      return [
        b.reference || b.reference_code,
        `"${salon ? salon.name.replace(/"/g, '""') : 'Unknown'}"`,
        `"${(b.customerName || b.customer_name || '').replace(/"/g, '""')}"`,
        b.customerPhone || b.customer_phone,
        b.customerEmail || b.customer_email,
        b.startsAt || b.starts_at,
        b.totalLkr ?? b.total_lkr ?? 0,
        b.status,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `glowbook_bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported bookings CSV');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink font-display flex items-center gap-2.5">
            <CalendarCheck className="w-7 h-7 text-primary" />
            Platform Bookings Ledger
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Real-time audit of all guest appointments across Sri Lanka.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface border border-muted-border hover:bg-lavender/40 text-ink text-xs font-bold transition-all shadow-subtle self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-primary" />
          Export CSV ({filteredBookings.length})
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-muted-border/60 rounded-3xl p-4 shadow-subtle">
          <span className="text-xs text-muted font-medium">Total Bookings</span>
          <p className="text-2xl font-extrabold text-ink mt-1 font-display">
            {DEMO_BOOKINGS.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Across 20 Sri Lankan salons
          </span>
        </div>

        <div className="bg-surface border border-muted-border/60 rounded-3xl p-4 shadow-subtle">
          <span className="text-xs text-muted font-medium">Gross Booking Volume</span>
          <p className="text-2xl font-extrabold text-ink mt-1 font-display">
            {formatCurrency(totalVolume)}
          </p>
          <span className="text-[11px] text-primary font-semibold mt-1 block">
            Total service value
          </span>
        </div>

        <div className="bg-surface border border-muted-border/60 rounded-3xl p-4 shadow-subtle">
          <span className="text-xs text-muted font-medium">Completed Appointments</span>
          <p className="text-2xl font-extrabold text-ink mt-1 font-display">
            {completedCount}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Satisfied customers
          </span>
        </div>

        <div className="bg-surface border border-muted-border/60 rounded-3xl p-4 shadow-subtle">
          <span className="text-xs text-muted font-medium">Platform Cancellation Rate</span>
          <p className="text-2xl font-extrabold text-ink mt-1 font-display">
            {cancellationRate}%
          </p>
          <span className="text-[11px] text-muted font-medium mt-1 block">
            Well within industry target
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-surface border border-muted-border/60 rounded-3xl p-4 shadow-subtle flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference (GB-...), customer, phone, or salon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-mist text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 border border-transparent focus:border-primary/30"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-2xl bg-mist text-xs text-ink font-medium border border-muted-border/60 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
          <select
            value={salonFilter}
            onChange={(e) => setSalonFilter(e.target.value)}
            className="px-3 py-2 rounded-2xl bg-mist text-xs text-ink font-medium border border-muted-border/60 focus:outline-none max-w-[180px] truncate"
          >
            <option value="all">All Salons</option>
            {demoSalons.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-surface border border-muted-border/60 rounded-3xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-muted-border/60 bg-mist/50 text-[11px] uppercase font-bold text-muted tracking-wider">
                <th className="p-4">Reference</th>
                <th className="p-4">Salon</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Scheduled For</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-border/40 text-xs">
              {filteredBookings.slice(0, 50).map((b: any) => {
                const salonId = b.salonId || b.salon_id;
                const salon = demoSalons.find((s) => s.id === salonId);
                const ref = b.reference || b.reference_code;
                const custName = b.customerName || b.customer_name;
                const custPhone = b.customerPhone || b.customer_phone;
                const startsAt = b.startsAt || b.starts_at;
                const total = b.totalLkr ?? b.total_lkr ?? 0;

                return (
                  <tr key={b.id} className="hover:bg-mist/30 transition-colors">
                    <td className="p-4">
                      <code className="px-2 py-1 rounded bg-lavender/50 text-deep-purple font-mono font-bold text-[11px]">
                        {ref}
                      </code>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-ink block">{salon ? salon.name : 'Unknown Salon'}</span>
                      <span className="text-[11px] text-muted capitalize">{salon ? salon.city : ''}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-ink block">{custName}</span>
                      <span className="text-[11px] text-muted">{custPhone}</span>
                    </td>
                    <td className="p-4 text-ink">
                      <span className="font-medium">
                        {new Date(startsAt).toLocaleDateString('en-LK', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="block text-[11px] text-muted">
                        {new Date(startsAt).toLocaleTimeString('en-LK', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-ink">
                      {formatCurrency(total)}
                    </td>
                    <td className="p-4">
                      {b.status === 'confirmed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Confirmed
                        </span>
                      ) : b.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-deep-purple text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      ) : b.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-star-gold/20 text-ink text-[11px] font-bold">
                          <Clock className="w-3 h-3 text-star-gold" /> Pending
                        </span>
                      ) : b.status === 'cancelled' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ruby-50 text-ruby-600 text-[11px] font-bold">
                          <XCircle className="w-3 h-3" /> Cancelled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/20 text-muted text-[11px] font-bold">
                          <AlertCircle className="w-3 h-3" /> No Show
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredBookings.length > 50 && (
          <div className="p-3 text-center border-t border-muted-border/40 text-xs text-muted">
            Showing top 50 of {filteredBookings.length} bookings. Export CSV to see full dataset.
          </div>
        )}
      </div>
    </div>
  );
}
