'use client';

import * as React from 'react';
import Link from 'next/link';
import { demoSalons, type DemoSalon } from '@/lib/demo-data';
import { ProBadge } from '@/components/common/pro-badge';
import { isProActive } from '@/features/billing/plans';
import { toast } from 'sonner';
import {
  Building2,
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Clock,
  Check,
  Star,
  RefreshCw,
} from 'lucide-react';

export default function AdminSalonsPage() {
  const [salons, setSalons] = React.useState<DemoSalon[]>(demoSalons);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'approved' | 'pending' | 'suspended'>('all');
  const [planFilter, setPlanFilter] = React.useState<'all' | 'pro' | 'free'>('all');

  // Filter salons
  const filteredSalons = React.useMemo(() => {
    return salons.filter((s: any) => {
      const code = s.billingCode || s.billing_code || '';
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.city.toLowerCase().includes(search.toLowerCase()) ||
        code.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      const pro = isProActive(s);
      const matchesPlan =
        planFilter === 'all' || (planFilter === 'pro' ? pro : !pro);

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [salons, search, statusFilter, planFilter]);

  // Actions
  const handleToggleStatus = (id: string, newStatus: 'approved' | 'suspended') => {
    setSalons((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    toast.success(`Salon status changed to ${newStatus}`);
  };

  const handleToggleFeatured = (id: string) => {
    setSalons((prev) =>
      prev.map((s: any) =>
        s.id === id ? { ...s, isFeatured: !s.isFeatured, is_featured: !s.isFeatured } : s
      )
    );
    toast.success('Featured status updated');
  };

  const handleGrantTrial = (id: string) => {
    const trialEnd = new Date(Date.now() + 30 * 86400000).toISOString();
    setSalons((prev) =>
      prev.map((s: any) =>
        s.id === id
          ? {
              ...s,
              plan: 'pro',
              trialEndsAt: trialEnd,
              trial_ends_at: trialEnd,
              planExpiresAt: trialEnd,
              plan_expires_at: trialEnd,
            }
          : s
      )
    );
    toast.success('Granted 30-Day Pro Trial to salon!');
  };

  const handleTogglePlan = (id: string) => {
    setSalons((prev) =>
      prev.map((s: any) => {
        if (s.id === id) {
          const currentlyPro = isProActive(s);
          const newExpires = currentlyPro
            ? null
            : new Date(Date.now() + 30 * 86400000).toISOString();
          return {
            ...s,
            plan: currentlyPro ? 'free' : 'pro',
            planExpiresAt: newExpires,
            plan_expires_at: newExpires,
          };
        }
        return s;
      })
    );
    toast.success('Salon subscription plan updated');
  };

  // CSV Export
  const exportCSV = () => {
    const headers = [
      'ID',
      'Name',
      'Billing Code',
      'District',
      'City',
      'Plan',
      'Status',
      'Rating',
      'Reviews',
      'Featured',
    ];
    const rows = filteredSalons.map((s: any) => [
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      s.billingCode || s.billing_code,
      s.district,
      s.city,
      isProActive(s) ? 'Pro' : 'Free',
      s.status,
      s.avgRating ?? s.avg_rating,
      s.reviewCount ?? s.review_count,
      (s.isFeatured || s.is_featured) ? 'Yes' : 'No',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `glowbook_salons_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported salons CSV successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink font-display flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-primary" />
            Salon Management
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Review, approve, suspend, and configure subscription plans for all Sri Lankan salons.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface border border-muted-border hover:bg-lavender/40 text-ink text-xs font-bold transition-all shadow-subtle self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-primary" />
          Export CSV ({filteredSalons.length})
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-surface border border-muted-border/60 rounded-3xl p-4 shadow-subtle flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by salon name, city, or billing code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-mist text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 border border-transparent focus:border-primary/30"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-2xl bg-mist text-xs text-ink font-medium border border-muted-border/60 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value as any)}
            className="px-3 py-2 rounded-2xl bg-mist text-xs text-ink font-medium border border-muted-border/60 focus:outline-none"
          >
            <option value="all">All Plans</option>
            <option value="pro">Pro Only</option>
            <option value="free">Free Only</option>
          </select>
        </div>
      </div>

      {/* Salons Table */}
      <div className="bg-surface border border-muted-border/60 rounded-3xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-muted-border/60 bg-mist/50 text-[11px] uppercase font-bold text-muted tracking-wider">
                <th className="p-4">Salon</th>
                <th className="p-4">District / City</th>
                <th className="p-4">Billing Code</th>
                <th className="p-4">Plan Status</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Platform Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-border/40 text-xs">
              {filteredSalons.map((salon: any) => {
                const pro = isProActive(salon);
                const isFeatured = salon.isFeatured || salon.is_featured;
                const billingCode = salon.billingCode || salon.billing_code;
                const avgRating = salon.avgRating ?? salon.avg_rating ?? 5.0;
                const reviewCount = salon.reviewCount ?? salon.review_count ?? 0;
                const genderType = salon.genderType || salon.gender_type;
                const priceTier = salon.priceTier || salon.price_tier;
                const hasTrial = salon.trialEndsAt || salon.trial_ends_at;

                return (
                  <tr key={salon.id} className="hover:bg-mist/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-lavender/60 border border-soft-purple/40 flex items-center justify-center font-bold text-primary shrink-0 overflow-hidden">
                          {salon.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-ink">{salon.name}</span>
                            {isFeatured && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-star-gold/20 text-ink text-[10px] font-bold">
                                <Star className="w-3 h-3 fill-star-gold text-star-gold" /> Featured
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-muted capitalize">
                            {genderType} · {priceTier} tier
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-ink capitalize">{salon.city}</span>
                      <span className="block text-[11px] text-muted capitalize">{salon.district}</span>
                    </td>
                    <td className="p-4">
                      <code className="px-2 py-1 rounded bg-lavender/50 text-deep-purple font-mono font-bold text-[11px]">
                        {billingCode}
                      </code>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-start gap-1">
                        {pro ? (
                          <ProBadge size="sm" />
                        ) : (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-mist border border-muted-border font-bold text-muted uppercase">
                            Free
                          </span>
                        )}
                        {hasTrial && (
                          <span className="text-[10px] text-primary font-semibold">
                            Trial active
                          </span>
                        )}
                      </div>

                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 font-bold text-ink">
                        <Star className="w-3.5 h-3.5 fill-star-gold text-star-gold" />
                        <span>{Number(avgRating).toFixed(1)}</span>
                        <span className="text-[10px] text-muted font-normal">({reviewCount})</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {salon.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      ) : salon.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-star-gold/20 text-ink text-[11px] font-bold">
                          <Clock className="w-3 h-3 text-star-gold" /> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ruby-50 text-ruby-600 text-[11px] font-bold">
                          <XCircle className="w-3 h-3" /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/salons/${salon.slug}`}
                          target="_blank"
                          title="View public profile"
                          className="p-1.5 rounded-xl hover:bg-lavender text-muted hover:text-ink transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleToggleFeatured(salon.id)}
                          title={isFeatured ? 'Remove Featured' : 'Make Featured'}
                          className={`p-1.5 rounded-xl transition-colors ${
                            isFeatured
                              ? 'bg-star-gold/20 text-ink'
                              : 'hover:bg-lavender text-muted hover:text-ink'
                          }`}
                        >
                          <Star className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleGrantTrial(salon.id)}
                          title="Grant 30-day Pro Trial"
                          className="p-1.5 rounded-xl hover:bg-lavender text-primary hover:text-deep-purple transition-colors"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleTogglePlan(salon.id)}
                          title={pro ? 'Downgrade to Free' : 'Promote to Pro'}
                          className="p-1.5 rounded-xl hover:bg-lavender text-muted hover:text-primary transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>

                        {salon.status === 'approved' ? (
                          <button
                            onClick={() => handleToggleStatus(salon.id, 'suspended')}
                            title="Suspend Salon"
                            className="p-1.5 rounded-xl hover:bg-ruby-50 text-muted hover:text-ruby-600 transition-colors"
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(salon.id, 'approved')}
                            title="Approve Salon"
                            className="p-1.5 rounded-xl hover:bg-emerald-50 text-muted hover:text-emerald-600 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
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
