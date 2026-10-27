'use client';

import * as React from 'react';
import { DEMO_PAYMENTS, demoSalons } from '@/lib/demo-data';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import {
  DollarSign,
  TrendingUp,
  Download,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
} from 'lucide-react';

export default function AdminRevenuePage() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('approved');

  // Filter payments
  const filteredPayments = React.useMemo(() => {
    return DEMO_PAYMENTS.filter((p: any) => {
      const salonId = p.salonId || p.salon_id;
      const salon = demoSalons.find((s) => s.id === salonId);
      const salonName = salon ? salon.name.toLowerCase() : '';
      const ref = p.referenceCode || p.reference_code || '';
      const bankRef = p.bankReference || p.bank_reference || '';
      const payer = p.payerName || p.payer_name || '';

      const matchesSearch =
        salonName.includes(search.toLowerCase()) ||
        ref.toLowerCase().includes(search.toLowerCase()) ||
        bankRef.toLowerCase().includes(search.toLowerCase()) ||
        payer.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  // Aggregate financial metrics
  const totalApprovedRevenue = React.useMemo(() => {
    return DEMO_PAYMENTS.filter((p: any) => p.status === 'approved').reduce(
      (sum: number, p: any) => sum + (p.amountLkr ?? p.amount_lkr ?? 0),
      0
    );
  }, []);

  const activeProSalons = demoSalons.filter(
    (s: any) => s.plan === 'pro' && !(s.trialEndsAt || s.trial_ends_at)
  ).length;

  const mrr = activeProSalons * 2000;

  // CSV Export
  const exportCSV = () => {
    const headers = [
      'Payment ID',
      'Salon Name',
      'Billing Code',
      'Plan',
      'Period (Months)',
      'Amount (LKR)',
      'Status',
      'Payer Name',
      'Transfer Date',
      'Bank Reference',
      'Reviewed At',
    ];
    const rows = filteredPayments.map((p: any) => {
      const salonId = p.salonId || p.salon_id;
      const salon = demoSalons.find((s) => s.id === salonId);
      const ref = p.referenceCode || p.reference_code;
      const payer = p.payerName || p.payer_name || 'N/A';
      const transferDate = p.transferDate || p.transfer_date || 'N/A';
      const bankRef = p.bankReference || p.bank_reference || 'N/A';
      const reviewedAt = p.reviewedAt || p.reviewed_at || 'N/A';
      const amount = p.amountLkr ?? p.amount_lkr ?? 0;

      return [
        p.id,
        `"${salon ? salon.name.replace(/"/g, '""') : 'Unknown'}"`,
        ref,
        p.plan.toUpperCase(),
        p.months,
        amount,
        p.status,
        `"${payer.replace(/"/g, '""')}"`,
        transferDate,
        bankRef,
        reviewedAt,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `glowbook_subscription_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Subscription ledger exported to CSV');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink font-display flex items-center gap-2.5">
            <DollarSign className="w-7 h-7 text-primary" />
            Subscription Revenue Ledger
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Audited record of all Hatton National Bank (HNB) bank transfers for Pro salon subscriptions.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface border border-muted-border hover:bg-lavender/40 text-ink text-xs font-bold transition-all shadow-subtle self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-primary" />
          Export Ledger ({filteredPayments.length})
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-muted-border/60 rounded-3xl p-5 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Total Subscription Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              LKR
            </div>
          </div>
          <p className="text-3xl font-extrabold text-ink mt-2 font-display">
            {formatCurrency(totalApprovedRevenue)}
          </p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">
            Verified HNB deposits
          </span>
        </div>

        <div className="bg-surface border border-muted-border/60 rounded-3xl p-5 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Monthly Recurring Revenue (MRR)
            </span>
            <div className="w-8 h-8 rounded-xl bg-lavender text-primary flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-ink mt-2 font-display">
            {formatCurrency(mrr)}
          </p>
          <span className="text-xs text-primary font-semibold mt-1 block">
            {activeProSalons} active paid Pro salons @ LKR 2,000/mo
          </span>
        </div>

        <div className="bg-surface border border-muted-border/60 rounded-3xl p-5 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Average Transaction Value
            </span>
            <div className="w-8 h-8 rounded-xl bg-soft-purple/30 text-deep-purple flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-ink mt-2 font-display">
            LKR 4,800
          </p>
          <span className="text-xs text-muted font-medium mt-1 block">
            Weighted toward 3-month & 12-month prepayments
          </span>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-surface border border-muted-border/60 rounded-3xl p-4 shadow-subtle flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by salon, reference code (SALON-...-XXXX), bank ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-mist text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 border border-transparent focus:border-primary/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-2xl bg-mist text-xs text-ink font-medium border border-muted-border/60 focus:outline-none"
        >
          <option value="all">All Payment Statuses</option>
          <option value="approved">Approved</option>
          <option value="pending_review">Pending Review</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Ledger Table */}
      <div className="bg-surface border border-muted-border/60 rounded-3xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-muted-border/60 bg-mist/50 text-[11px] uppercase font-bold text-muted tracking-wider">
                <th className="p-4">Salon / Payer</th>
                <th className="p-4">Billing Reference</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Deposit Amount</th>
                <th className="p-4">HNB Reference</th>
                <th className="p-4">Transfer Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-border/40 text-xs">
              {filteredPayments.map((p: any) => {
                const salonId = p.salonId || p.salon_id;
                const salon = demoSalons.find((s) => s.id === salonId);
                const ref = p.referenceCode || p.reference_code;
                const payer = p.payerName || p.payer_name || 'N/A';
                const transferDate = p.transferDate || p.transfer_date || 'N/A';
                const bankRef = p.bankReference || p.bank_reference || 'N/A';
                const amount = p.amountLkr ?? p.amount_lkr ?? 0;

                return (
                  <tr key={p.id} className="hover:bg-mist/30 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-ink block">{salon ? salon.name : 'Unknown Salon'}</span>
                      <span className="text-[11px] text-muted">Payer: {payer}</span>
                    </td>
                    <td className="p-4">
                      <code className="px-2 py-1 rounded bg-lavender/50 text-deep-purple font-mono font-bold text-[11px]">
                        {ref}
                      </code>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-ink">
                        {p.months} {p.months === 1 ? 'Month' : 'Months'}
                      </span>
                      <span className="block text-[10px] text-muted uppercase">PRO TIER</span>
                    </td>
                    <td className="p-4">
                      <span className="font-extrabold text-ink text-sm">
                        {formatCurrency(amount)}
                      </span>
                    </td>
                    <td className="p-4">
                      <code className="font-mono text-[11px] text-ink">{bankRef}</code>
                    </td>
                    <td className="p-4 text-muted">{transferDate}</td>
                    <td className="p-4">
                      {p.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      ) : p.status === 'pending_review' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-star-gold/20 text-ink text-[11px] font-bold">
                          <Clock className="w-3 h-3 text-star-gold" /> Pending Review
                        </span>
                      ) : (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ruby-50 text-ruby-600 text-[11px] font-bold">
                            <XCircle className="w-3 h-3" /> Rejected
                          </span>
                          {p.reject_reason && (
                            <span className="block text-[10px] text-ruby-600 mt-0.5 max-w-xs truncate">
                              {p.reject_reason}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
