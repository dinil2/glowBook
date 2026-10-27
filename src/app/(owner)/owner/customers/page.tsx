'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LockedFeatureGate } from '@/components/common/locked-feature-gate';
import { DEMO_SALONS, DEMO_CUSTOMERS } from '@/lib/demo-data';
import { can } from '@/features/billing/plans';
import { formatLKR } from '@/lib/utils';
import { Download, Users, Search, Phone, Mail, Calendar } from 'lucide-react';
import { toast } from 'sonner';

import { useOwnerSalon } from '@/features/owner/context/owner-salon-context';

export default function OwnerCustomersPage() {
  const { currentSalon: salon } = useOwnerSalon();
  const isLocked = !can(salon, 'customerDirectoryAndExport');

  const [search, setSearch] = React.useState('');

  const customerList = React.useMemo(() => {
    return DEMO_CUSTOMERS.slice(0, 20).map((c, i) => ({
      ...c,
      id: `c-${i}`,
      visits: 2 + (i % 6),
      totalSpendLkr: (2 + (i % 6)) * 6500,
      lastVisit: new Date(Date.now() - (i * 2 + 1) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    }));
  }, []);

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Visits', 'Total Spend (LKR)', 'Last Visit'];
    const rows = customerList.map((c) => [
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      c.visits,
      c.totalSpendLkr,
      c.lastVisit,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `glowbook-${salon.slug}-customers.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Customer CSV exported successfully!');
  };

  return (
    <LockedFeatureGate
      isLocked={isLocked}
      featureName="Customer Directory & CSV Export"
      description="View full client history, total spend, appointment frequencies and export contacts for WhatsApp and SMS campaigns."
      salonName={salon.name}
      billingCode={salon.billingCode}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-ink tracking-tight">Customer Directory</h1>
            <p className="text-xs text-muted">
              Lifetime client profiles, visit frequency, and loyalty records.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-1.5" /> Export Clients to CSV
          </Button>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-mist border-b border-muted-border text-[11px] font-bold uppercase text-muted">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Total Visits</th>
                  <th className="p-4">Total Spend</th>
                  <th className="p-4">Last Visit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted-border/60">
                {customerList.map((c) => (
                  <tr key={c.id} className="hover:bg-lavender/30 transition-colors">
                    <td className="p-4 font-bold text-ink">{c.name}</td>
                    <td className="p-4">
                      <span className="text-ink block">{c.phone}</span>
                      <span className="text-muted text-[11px]">{c.email}</span>
                    </td>
                    <td className="p-4 font-semibold text-ink">{c.visits} appointments</td>
                    <td className="p-4 font-bold text-primary-deep">{formatLKR(c.totalSpendLkr)}</td>
                    <td className="p-4 text-muted">{c.lastVisit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </LockedFeatureGate>
  );
}
