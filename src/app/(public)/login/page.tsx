'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Mail, KeyRound, Store, ShieldCheck, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FBFBF9]">
      <div className="w-full max-w-md rounded-4xl bg-white p-6 sm:p-8 border border-[#E8E5DF] shadow-card">
        {/* Header */}
        <div className="text-center pb-5 border-b border-[#E8E5DF]">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#141219] text-white shadow-sm mb-3">
            <Sparkles className="h-6 w-6 text-[#C59B27]" />
          </div>
          <h1 className="text-2xl font-black text-ink tracking-tight font-sans">
            Sign In to Glowbook
          </h1>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            One unified portal for Salon Owners, Admins, and Customer Bookings
          </p>
        </div>

        {/* Unified Single Login Form */}
        <form onSubmit={(e) => handleUnifiedSubmit(e)} className="space-y-4 pt-5">
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
        <div className="pt-4 mt-5 border-t border-[#E8E5DF]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2 text-center">
            1-Click Quick Demo Sign In
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('owner')}
              className="p-2.5 rounded-xl bg-mist border border-[#E8E5DF] hover:border-[#141219] hover:bg-white text-center transition-all cursor-pointer"
            >
              <Store className="w-4 h-4 text-ink mx-auto mb-1" />
              <span className="text-[10px] font-bold text-ink block">Salon Owner</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="p-2.5 rounded-xl bg-mist border border-[#E8E5DF] hover:border-[#141219] hover:bg-white text-center transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#C59B27] mx-auto mb-1" />
              <span className="text-[10px] font-bold text-ink block">Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="p-2.5 rounded-xl bg-mist border border-[#E8E5DF] hover:border-[#141219] hover:bg-white text-center transition-all cursor-pointer"
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
              className="font-bold text-ink hover:underline inline-flex items-center gap-1"
            >
              Register Your Salon Free <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
