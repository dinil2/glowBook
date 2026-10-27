'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SRI_LANKA_DISTRICTS } from '@/lib/config/districts';
import { SALON_CATEGORIES } from '@/lib/config/categories';
import { generateBillingCode, slugify } from '@/lib/utils';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Scissors,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OwnerOnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = React.useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Step 1: Basics
  const [salonName, setSalonName] = React.useState('');
  const [tagline, setTagline] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [genderType, setGenderType] = React.useState<'ladies' | 'gents' | 'unisex'>('unisex');
  const [priceTier, setPriceTier] = React.useState<'budget' | 'mid' | 'premium'>('mid');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(['hair']);

  // Step 2: Location
  const [district, setDistrict] = React.useState('colombo');
  const [city, setCity] = React.useState('');
  const [address, setAddress] = React.useState('');

  // Step 3: Hours
  const [openTime, setOpenTime] = React.useState('09:00');
  const [closeTime, setCloseTime] = React.useState('19:00');
  const [breakStart, setBreakStart] = React.useState('13:00');
  const [breakEnd, setBreakEnd] = React.useState('13:30');

  // Step 4: Services
  const [initialService, setInitialService] = React.useState('Signature Haircut & Styling');
  const [initialPrice, setInitialPrice] = React.useState(2500);
  const [initialDuration, setInitialDuration] = React.useState(45);

  const toggleCategory = (slug: string) => {
    if (selectedCategories.includes(slug)) {
      if (selectedCategories.length === 1) return;
      setSelectedCategories(selectedCategories.filter((c) => c !== slug));
    } else {
      setSelectedCategories([...selectedCategories, slug]);
    }
  };

  const handleSubmitWizard = () => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });
    setStep(6); // Success pending approval
  };

  return (
    <div className="min-h-screen bg-mist py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Progress Tracker */}
        <div className="text-center space-y-2">
          <Badge variant="purple" className="px-3 py-1 text-xs font-bold">
            Onboarding Wizard · Step {step > 5 ? '5' : step} of 5
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            Build Your Salon Profile
          </h1>
        </div>

        <Card className="p-6 sm:p-8 space-y-6">
          {/* STEP 1: BASICS */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-ink">1. Salon Basics</h3>
                <p className="text-xs text-muted">
                  What is the name of your studio and who do you cater to?
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Salon Business Name *"
                  placeholder="e.g. Royal Coiffure & Aesthetics"
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                />
                <Input
                  label="Tagline / Catchphrase"
                  placeholder="e.g. Precision cuts and balayage in Colombo"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                />
                <Input
                  label="Brief Description"
                  placeholder="Describe your atmosphere, stylists, and specialties..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-ink block">
                      Gender Focus
                    </label>
                    <select
                      value={genderType}
                      onChange={(e: any) => setGenderType(e.target.value)}
                      className="w-full h-11 px-3 rounded-2xl bg-white border border-muted-border text-xs text-ink"
                    >
                      <option value="unisex">Unisex (All Clients)</option>
                      <option value="ladies">Ladies Only</option>
                      <option value="gents">Gents Only</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-ink block">
                      Pricing Tier
                    </label>
                    <select
                      value={priceTier}
                      onChange={(e: any) => setPriceTier(e.target.value)}
                      className="w-full h-11 px-3 rounded-2xl bg-white border border-muted-border text-xs text-ink"
                    >
                      <option value="budget">Budget-Friendly</option>
                      <option value="mid">Mid-Range</option>
                      <option value="premium">Premium / Luxury</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-ink block">
                    Select Your Specialties
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SALON_CATEGORIES.map((c) => {
                      const isSel = selectedCategories.includes(c.slug);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleCategory(c.slug)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            isSel
                              ? 'bg-primary text-white shadow-sm'
                              : 'bg-mist text-muted hover:bg-lavender'
                          }`}
                        >
                          {c.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-muted-border">
                <Button
                  variant="primary"
                  size="md"
                  disabled={!salonName.trim()}
                  onClick={() => setStep(2)}
                >
                  Next: Location Details <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-ink">2. Salon Location</h3>
                <p className="text-xs text-muted">
                  Where can clients find you across Sri Lanka?
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-ink block">
                    District *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full h-11 px-3 rounded-2xl bg-white border border-muted-border text-xs text-ink"
                  >
                    {SRI_LANKA_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} District
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="City / Town *"
                  placeholder="e.g. Colombo 07 / Nugegoda / Kandy City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />

                <Input
                  label="Full Street Address *"
                  placeholder="e.g. 45/2 Horton Place, Cinnamon Gardens, Colombo 07"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="flex justify-between pt-4 border-t border-muted-border">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  disabled={!city.trim() || !address.trim()}
                  onClick={() => setStep(3)}
                >
                  Next: Hours & Breaks <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: HOURS & BREAKS */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-ink">3. Working Hours & Breaks</h3>
                <p className="text-xs text-muted">
                  Set daily opening hours and lunch break window.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Opening Time"
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                  />
                  <Input
                    label="Closing Time"
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Lunch Break Start"
                    type="time"
                    value={breakStart}
                    onChange={(e) => setBreakStart(e.target.value)}
                  />
                  <Input
                    label="Lunch Break End"
                    type="time"
                    value={breakEnd}
                    onChange={(e) => setBreakEnd(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-muted-border">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button variant="primary" size="md" onClick={() => setStep(4)}>
                  Next: First Service <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: FIRST SERVICE */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-ink">4. Add Your Primary Treatment</h3>
                <p className="text-xs text-muted">
                  You can add more services and packages anytime in your dashboard.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Service Name *"
                  placeholder="e.g. Signature Cut & Thermal Blowout"
                  value={initialService}
                  onChange={(e) => setInitialService(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Price (LKR) *"
                    type="number"
                    value={initialPrice}
                    onChange={(e) => setInitialPrice(Number(e.target.value))}
                  />
                  <Input
                    label="Duration (Minutes) *"
                    type="number"
                    value={initialDuration}
                    onChange={(e) => setInitialDuration(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-muted-border">
                <Button variant="ghost" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  disabled={!initialService.trim()}
                  onClick={() => setStep(5)}
                >
                  Next: Review & Submit <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & SUBMIT */}
          {step === 5 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-ink">5. Review & Submit for Approval</h3>
                <p className="text-xs text-muted">
                  Confirm your details before submitting for platform admin verification.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-mist border border-muted-border space-y-2 text-xs">
                <p>
                  <strong>Salon Name:</strong> {salonName}
                </p>
                <p>
                  <strong>Location:</strong> {address}, {city} ({district} District)
                </p>
                <p>
                  <strong>Hours:</strong> {openTime} - {closeTime} (Break: {breakStart} - {breakEnd})
                </p>
                <p>
                  <strong>First Service:</strong> {initialService} (LKR {initialPrice.toLocaleString()})
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-lavender/50 border border-primary/30 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary shrink-0" />
                <p className="text-xs text-ink">
                  Upon approval, your salon is automatically activated with a{' '}
                  <strong>30-day Pro Trial</strong> to enjoy full analytics, staff calendars, and direct WhatsApp contact.
                </p>
              </div>

              <div className="flex justify-between pt-4 border-t border-muted-border">
                <Button variant="ghost" onClick={() => setStep(4)}>
                  Back
                </Button>
                <Button variant="primary" size="lg" onClick={handleSubmitWizard}>
                  Submit Profile for Approval
                </Button>
              </div>
            </div>
          )}

          {/* STEP 6: PENDING APPROVAL CONFIRMATION */}
          {step === 6 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-ink">Profile Submitted for Review!</h3>
                <p className="text-xs text-muted max-w-sm mx-auto">
                  Our quality team reviews all new salon listings to verify location accuracy. Listings are typically approved within 12-24 hours.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-mist border border-muted-border max-w-md mx-auto text-xs space-y-1 text-left">
                <div className="flex justify-between">
                  <span className="text-muted">Status:</span>
                  <Badge variant="gold">Pending Admin Review</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Your Billing Code:</span>
                  <span className="font-mono font-bold text-ink">
                    {generateBillingCode(salonName)}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/owner">
                  <Button variant="primary" size="lg" className="px-8 shadow-glow-md">
                    Go to Partner Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
