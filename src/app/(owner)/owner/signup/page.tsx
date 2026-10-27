'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck,
  Smartphone,
  Banknote,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

export default function OwnerSignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email and password are required');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Account created! Welcome to Glowbook.');
      router.push('/owner/onboarding');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 sm:p-6 lg:p-12">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Reassurance & 3-Step Guide for non-technical salon owners */}
        <div className="lg:col-span-6 space-y-6">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-neutral-900 tracking-tight font-display">
                Glowbook
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-emerald-700 -mt-1">
                For Salon Owners
              </span>
            </div>
          </Link>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Free Salon Listing · 3-Minute Setup
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight font-display leading-tight">
              Start accepting online bookings for your salon.
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed">
              No technical experience needed. Join top salons in Colombo, Kandy, Galle and across Sri Lanka.
              Set up your profile once, share your booking link, and let clients book 24/7.
            </p>
          </div>

          {/* 3 Step Visual Path */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
              How it works (Step 1 of 3)
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white border-2 border-primary/30 shadow-sm">
                <div className="w-7 h-7 rounded-xl bg-primary text-white flex items-center justify-center text-xs font-black shrink-0">
                  1
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-900">Create your owner login</div>
                  <div className="text-xs text-neutral-500">
                    Takes 30 seconds. Enter your name and contact details.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/70 border border-neutral-200">
                <div className="w-7 h-7 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-700">Add your salon details & hours</div>
                  <div className="text-xs text-neutral-500">
                    Our simple 5-step wizard asks for your services, prices, and opening hours.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/70 border border-neutral-200">
                <div className="w-7 h-7 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-700">Go live & accept appointments</div>
                  <div className="text-xs text-neutral-500">
                    Get your verified public salon page and direct link for Instagram & WhatsApp.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Peace of mind badges */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-neutral-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>0% booking commission</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Cash counter payments</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Free forever plan option</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>30-Day Pro trial included</span>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Card */}
        <div className="lg:col-span-6">
          <Card className="p-6 sm:p-8 space-y-6 shadow-xl border border-neutral-200/80 bg-white">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-neutral-900 tracking-tight font-display">
                Create Salon Account
              </h2>
              <p className="text-xs text-neutral-500">
                Sign up as an owner to manage bookings, staff, and your online presence.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Your Full Name *"
                placeholder="e.g. Nadeeka Perera"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Salon Email Address *"
                type="email"
                placeholder="e.g. royalhairstudio@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Owner Mobile / WhatsApp *"
                placeholder="+94 77 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Input
                label="Create a Password *"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="xl"
                  type="submit"
                  isLoading={loading}
                  className="w-full justify-center shadow-md bg-neutral-900 hover:bg-neutral-800 text-white font-bold"
                >
                  Continue to Salon Setup <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>

            <div className="text-center pt-3 border-t border-neutral-100 text-xs text-neutral-500">
              Already registered your salon?{' '}
              <Link href="/login" className="font-bold text-emerald-700 hover:underline">
                Sign in to your dashboard
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
