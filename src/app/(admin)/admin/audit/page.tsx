'use client';

import * as React from 'react';
import { toast } from 'sonner';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Sparkles,
  Building2,
  Clock,
  Sliders,
} from 'lucide-react';

interface AuditEntry {
  id: string;
  action: string;
  target_type: 'payment' | 'salon' | 'settings' | 'review';
  target_id: string;
  admin_email: string;
  details: string;
  timestamp: string;
}

const INITIAL_AUDIT_LOGS: AuditEntry[] = [
  {
    id: 'log-01',
    action: 'APPROVE_PAYMENT',
    target_type: 'payment',
    target_id: 'pay-001',
    admin_email: 'admin@glowbook.lk',
    details: 'Approved 3-month Pro renewal for Salon Costume (LKR 5,400). Bank Ref: HNB-9812401',
    timestamp: '2026-10-26T14:32:00Z',
  },
  {
    id: 'log-02',
    action: 'APPROVE_PAYMENT',
    target_type: 'payment',
    target_id: 'pay-002',
    admin_email: 'admin@glowbook.lk',
    details: 'Approved 1-month Pro subscription for Crown Barber Studio (LKR 2,000).',
    timestamp: '2026-10-25T11:15:00Z',
  },
  {
    id: 'log-03',
    action: 'REJECT_PAYMENT',
    target_type: 'payment',
    target_id: 'pay-007',
    admin_email: 'admin@glowbook.lk',
    details: 'Rejected submission: Bank reference not found on HNB statement for that date.',
    timestamp: '2026-10-24T09:40:00Z',
  },
  {
    id: 'log-04',
    action: 'GRANT_TRIAL',
    target_type: 'salon',
    target_id: 'salon-15',
    admin_email: 'admin@glowbook.lk',
    details: 'Granted 30-Day Pro Trial to newly registered salon in Kandy.',
    timestamp: '2026-10-23T16:20:00Z',
  },
  {
    id: 'log-05',
    action: 'UPDATE_SETTINGS',
    target_type: 'settings',
    target_id: 'platform_settings',
    admin_email: 'admin@glowbook.lk',
    details: 'Updated HNB account details and set quarterly discount to 10%.',
    timestamp: '2026-10-22T10:00:00Z',
  },
  {
    id: 'log-06',
    action: 'APPROVE_SALON',
    target_type: 'salon',
    target_id: 'salon-08',
    admin_email: 'admin@glowbook.lk',
    details: 'Approved salon profile after onboarding review.',
    timestamp: '2026-10-21T18:45:00Z',
  },
];

export default function AdminAuditPage() {
  const [logs] = React.useState<AuditEntry[]>(INITIAL_AUDIT_LOGS);
  const [search, setSearch] = React.useState('');

  const filteredLogs = React.useMemo(() => {
    return logs.filter(
      (l) =>
        l.action.toLowerCase().includes(search.toLowerCase()) ||
        l.details.toLowerCase().includes(search.toLowerCase()) ||
        l.admin_email.toLowerCase().includes(search.toLowerCase())
    );
  }, [logs, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink font-display flex items-center gap-2.5">
          <History className="w-7 h-7 text-primary" />
          Platform Audit Logs
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Immutable event log of administrator operations, offline payment verifications, and platform overrides.
        </p>
      </div>

      {/* Search */}
      <div className="bg-surface border border-muted-border/60 rounded-3xl p-4 shadow-subtle">
        <div className="relative">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit actions, descriptions, or admin email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-mist text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 border border-transparent focus:border-primary/30"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-surface border border-muted-border/60 rounded-3xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-muted-border/60 bg-mist/50 text-[11px] uppercase font-bold text-muted tracking-wider">
                <th className="p-4">Action</th>
                <th className="p-4">Details</th>
                <th className="p-4">Target</th>
                <th className="p-4">Admin</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted-border/40 text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-mist/30 transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-bold text-deep-purple px-2 py-1 rounded bg-lavender/50 text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 max-w-md">
                    <p className="text-ink font-medium leading-relaxed">{log.details}</p>
                  </td>
                  <td className="p-4">
                    <span className="capitalize text-muted font-semibold">
                      {log.target_type} ({log.target_id})
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-ink font-semibold">{log.admin_email}</span>
                  </td>
                  <td className="p-4 text-muted whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('en-LK', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
