'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LockedFeatureGate } from '@/components/common/locked-feature-gate';
import { DEMO_SALONS, DEMO_BOOKINGS } from '@/lib/demo-data';
import { can } from '@/features/billing/plans';
import {
  generateWhatsAppConfirmationUrl,
  generateWhatsAppReminderUrl,
} from '@/lib/services/messagingProvider';
import { MessageSquare, Send, CheckCircle2, Clock, Sparkles } from 'lucide-react';

import { useOwnerSalon } from '@/features/owner/context/owner-salon-context';

export default function OwnerMessagesPage() {
  const { currentSalon: salon } = useOwnerSalon();
  const isLocked = !can(salon, 'whatsAppCustomerMessages');

  const upcomingBookings = DEMO_BOOKINGS.filter((b) => b.status === 'confirmed').slice(0, 6);

  return (
    <LockedFeatureGate
      isLocked={isLocked}
      featureName="WhatsApp Client Notifications"
      description="Send 1-tap WhatsApp appointment confirmations and automated reminder links to eliminate no-shows."
      salonName={salon.name}
      billingCode={salon.billingCode}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-ink tracking-tight">WhatsApp Reminders</h1>
          <p className="text-xs text-muted">
            Send instant WhatsApp confirmations and 24h reminders directly to clients.
          </p>
        </div>

        <div className="space-y-3">
          {upcomingBookings.map((b) => {
            const templateData = {
              customerName: b.customerName,
              salonName: salon.name,
              dateTime: `${new Date(b.startsAt).toLocaleDateString('en-LK', {
                month: 'short',
                day: 'numeric',
              })} at ${new Date(b.startsAt).toLocaleTimeString('en-LK', {
                hour: '2-digit',
                minute: '2-digit',
              })}`,
              serviceNames: b.serviceNames,
              reference: b.reference,
              manageLink: `https://glowbook.lk/booking/manage?ref=${b.reference}`,
            };

            const confirmUrl = generateWhatsAppConfirmationUrl(b.customerPhone, templateData);
            const reminderUrl = generateWhatsAppReminderUrl(b.customerPhone, templateData);

            return (
              <Card key={b.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-ink">{b.customerName}</span>
                    <span className="font-mono text-xs font-bold text-primary">{b.reference}</span>
                  </div>
                  <p className="text-xs text-muted">
                    {b.serviceNames.join(', ')} ·{' '}
                    <strong className="text-ink">{templateData.dateTime}</strong>
                  </p>
                  <p className="text-[11px] text-muted-light">Phone: {b.customerPhone}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a href={confirmUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="text-emerald-700 border-emerald-300 hover:bg-emerald-50 text-xs">
                      <Send className="w-3.5 h-3.5 mr-1" /> Send Confirmation
                    </Button>
                  </a>

                  <a href={reminderUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="text-primary border-primary/30 hover:bg-lavender text-xs">
                      <Clock className="w-3.5 h-3.5 mr-1" /> Send 24h Reminder
                    </Button>
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </LockedFeatureGate>
  );
}
