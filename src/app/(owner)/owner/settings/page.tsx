'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DEMO_SALONS } from '@/lib/demo-data';
import { can } from '@/features/billing/plans';
import { Save, Settings, ShieldCheck, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function OwnerSettingsPage() {
  const salon = DEMO_SALONS[0];
  const isPro = salon.plan === 'pro';

  const [autoConfirm, setAutoConfirm] = React.useState(salon.autoConfirm);
  const [minLeadHours, setMinLeadHours] = React.useState(salon.minLeadHours);
  const [maxAdvanceDays, setMaxAdvanceDays] = React.useState(salon.maxAdvanceDays);
  const [cancellationHours, setCancellationHours] = React.useState(salon.cancellationHours);

  // Contact details
  const [phone, setPhone] = React.useState(salon.phone || '');
  const [whatsapp, setWhatsapp] = React.useState(salon.whatsapp || '');
  const [instagram, setInstagram] = React.useState(salon.instagram || '');
  const [facebook, setFacebook] = React.useState(salon.facebook || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Salon booking and policy settings updated successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink tracking-tight">Business Settings</h1>
        <p className="text-xs text-muted">
          Configure appointment lead times, advance booking windows, and contact integrations.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Booking Engine Rules */}
        <Card className="p-6 space-y-4">
          <CardTitle>Appointment Rules & Policy</CardTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Minimum Notice (Lead Time in Hours)"
              type="number"
              value={minLeadHours}
              onChange={(e) => setMinLeadHours(Number(e.target.value))}
              helperText="Clients cannot book slots with less notice than this."
            />
            <Input
              label="Max Advance Booking Window (Days)"
              type="number"
              value={maxAdvanceDays}
              onChange={(e) => setMaxAdvanceDays(Number(e.target.value))}
              helperText="How far ahead in the future clients are allowed to book."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Input
              label="Cancellation Window (Hours)"
              type="number"
              value={cancellationHours}
              onChange={(e) => setCancellationHours(Number(e.target.value))}
              helperText="Minimum notice required for clients to cancel online."
            />

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="autoConfirm"
                checked={autoConfirm}
                onChange={(e) => setAutoConfirm(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
              <label htmlFor="autoConfirm" className="text-xs font-semibold text-ink cursor-pointer">
                Automatically confirm incoming guest bookings
              </label>
            </div>
          </div>
        </Card>

        {/* Public Contact Integrations */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>Direct Contact & Socials</CardTitle>
            {!isPro && (
              <span className="text-[11px] font-bold text-muted flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-primary" />
                Phone & WhatsApp visible publicly on Pro plan
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Salon Reception Phone Number"
              placeholder="+94 11 268 9120"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="Salon WhatsApp Number"
              placeholder="+94 77 482 1902"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Instagram Username"
              placeholder="e.g. saloncostume_official"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
            <Input
              label="Facebook Page Name"
              placeholder="e.g. saloncostumecolombo"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" size="lg" type="submit" className="px-8 shadow-glow-md">
            <Save className="w-4 h-4 mr-1.5" /> Save Business Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
