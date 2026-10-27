'use client';

import * as React from 'react';
import { DEMO_SALONS, DemoSalon } from '@/lib/demo-data';

interface OwnerSalonContextType {
  currentSalon: DemoSalon;
  setCurrentSalonId: (id: string) => void;
  isPro: boolean;
  setShowUpgradeModal: (show: boolean) => void;
}

export const OwnerSalonContext = React.createContext<OwnerSalonContextType>({
  currentSalon: DEMO_SALONS[0],
  setCurrentSalonId: () => {},
  isPro: true,
  setShowUpgradeModal: () => {},
});

export const useOwnerSalon = () => React.useContext(OwnerSalonContext);
