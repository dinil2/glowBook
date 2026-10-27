'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles } from 'lucide-react';
import { UpgradeModal } from './upgrade-modal';

export interface LockedFeatureGateProps {
  isLocked: boolean;
  featureName: string;
  description?: string;
  children: React.ReactNode;
  salonName?: string;
  billingCode?: string;
}

export function LockedFeatureGate({
  isLocked,
  featureName,
  description = 'This feature is part of Glowbook Pro. Upgrade to unlock complete access.',
  children,
  salonName,
  billingCode,
}: LockedFeatureGateProps) {
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative rounded-3xl overflow-hidden border border-muted-border/80 bg-white">
      {/* Blurred Preview of the feature */}
      <div className="pointer-events-none select-none filter blur-[3px] opacity-40">
        {children}
      </div>

      {/* Lock Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-white/70 via-white/85 to-white/95 backdrop-blur-[2px]">
        <div className="w-12 h-12 rounded-2xl bg-lavender text-primary flex items-center justify-center shadow-glow-sm mb-3">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-ink mb-1">{featureName} is a Pro Feature</h3>
        <p className="text-xs text-muted max-w-sm mb-4">{description}</p>
        <Button
          variant="primary"
          size="md"
          onClick={() => setShowUpgradeModal(true)}
          className="shadow-glow-md"
        >
          <Sparkles className="w-4 h-4 mr-1 text-star-gold" />
          Upgrade to Pro
        </Button>
      </div>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        salonName={salonName}
        billingCode={billingCode}
      />
    </div>
  );
}
