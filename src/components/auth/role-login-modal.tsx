'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  ArrowRight,
  Mail,
  KeyRound,
  ShieldCheck,
  Store,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

interface RoleLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoleLoginModal({ open, onOpenChange }: RoleLoginModalProps) {
  const router = useRouter();
  const [identifier, setIdentifier] = React.useState('');
  const [secret, setSecret] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleUnifiedSubmit = (
    e?: React.FormEvent,
    forcedIdentifier?: string,
    forcedRole?: 'admin' | 'owner' | 'customer'
  ) => {
    if (e) e.preventDefault();
    const loginValue = (forcedIdentifier || identifier).trim().toLowerCase();

    if (!loginValue) {
      toast.error('Please enter your email address or booking reference');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);

      // Smart Role-Based Route Detection
      if (forcedRole === 'admin' || loginValue.includes('admin')) {
        toast.success('Signed in as Platform Admin');
        router.push('/admin');
      } else if (
        forcedRole === 'customer' ||
        loginValue.startsWith('sb-') ||
        loginValue.includes('booking')
      ) {
        toast.success('Loading customer booking...');
        const ref = loginValue.toUpperCase();
        router.push(`/booking/manage?ref=${encodeURIComponent(ref)}`);
      } else {
        // Salon Owner
        toast.success('Signed in as Salon Owner');
        router.push('/owner');
      }
    }, 400);
  };

  const handleQuickDemo = (role: 'admin' | 'owner' | 'customer') => {
    if (role === 'admin') {
      setIdentifier('admin@glowbook.lk');
      setSecret('••••••••••••');
      handleUnifiedSubmit(undefined, 'admin@glowbook.lk', 'admin');
    } else if (role === 'owner') {
      setIdentifier('owner@saloncostume.lk');
      setSecret('••••••••••••');
      handleUnifiedSubmit(undefined, 'owner@saloncostume.lk', 'owner');
    } else {
      setIdentifier('SB-90214X');
      setSecret('+94 77 123 4567');
      handleUnifiedSubmit(undefined, 'SB-90214X', 'customer');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-md p-6 sm:p-7 bg-white">
      {/* Header */}
      <div className="text-center pb-5 border-b border-[#E8E5DF]">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#141219] text-white shadow-sm mb-3">
          <Sparkles className="h-5 w-5 text-[#C59B27]" />
        </div>
        <h3 className="text-xl font-black text-ink tracking-tight font-sans">
          Sign In to Glowbook
        </h3>
        <p className="text-xs text-muted mt-1 leading-relaxed">
          One unified portal for Salon Owners, Admins, and Customer Bookings
        </p>
      </div>

      {/* Unified Single Login Form (Zero Clutter, Zero Tabs) */}
      <form onSubmit={(e) => handleUnifiedSubmit(e)} className="space-y-4 pt-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
            Email Address or Booking Reference
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. owner@saloncostume.lk or SB-7K3Q9X"
              className="w-full h-11 pl-10 pr-3 rounded-2xl bg-mist border border-[#E8E5DF] text-xs text-ink placeholder:text-muted/60 focus:outline-none focus:border-[#141219] focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
            Password or Phone Number
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Password (for Owners & Admin) or Mobile No"
              className="w-full h-11 pl-10 pr-3 rounded-2xl bg-mist border border-[#E8E5DF] text-xs text-ink placeholder:text-muted/60 focus:outline-none focus:border-[#141219] focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full h-11 font-bold shadow-sm mt-2"
        >
          Sign In <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </form>

      {/* 1-Click Role-Based Quick Demo Access */}
      <div className="pt-4 mt-4 border-t border-[#E8E5DF]">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2 text-center">
          1-Click Quick Demo Sign In
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('owner')}
            className="p-2 rounded-xl bg-mist border border-[#E8E5DF] hover:border-[#141219] hover:bg-white text-center transition-all cursor-pointer"
          >
            <Store className="w-4 h-4 text-ink mx-auto mb-1" />
            <span className="text-[10px] font-bold text-ink block">Salon Owner</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('admin')}
            className="p-2 rounded-xl bg-mist border border-[#E8E5DF] hover:border-[#141219] hover:bg-white text-center transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#C59B27] mx-auto mb-1" />
            <span className="text-[10px] font-bold text-ink block">Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('customer')}
            className="p-2 rounded-xl bg-mist border border-[#E8E5DF] hover:border-[#141219] hover:bg-white text-center transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#1B4332] mx-auto mb-1" />
            <span className="text-[10px] font-bold text-ink block">Customer</span>
          </button>
        </div>
      </div>

      {/* Register Salon Link */}
      <div className="text-center pt-4">
        <p className="text-xs text-muted">
          Want to list your salon?{' '}
          <Link
            href="/owner/signup"
            onClick={() => onOpenChange(false)}
            className="font-bold text-ink hover:underline inline-flex items-center gap-1"
          >
            Register Your Salon Free <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </div>
    </Dialog>
  );
}
