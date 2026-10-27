import * as React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, ShieldCheck } from 'lucide-react';

export interface ProBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'pill' | 'compact' | 'glow';
}

export function ProBadge({ className, size = 'sm', variant = 'pill' }: ProBadgeProps) {
  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  };

  if (variant === 'compact') {
    return (
      <span
        title="Glowbook Verified Pro Salon"
        className={cn(
          'inline-flex items-center justify-center rounded-full bg-primary text-white p-1 shadow-sm',
          className
        )}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-bold rounded-full select-none tracking-wide uppercase',
        'bg-gradient-to-r from-primary to-primary-deep text-white shadow-glow-sm',
        sizes[size],
        className
      )}
    >
      <Sparkles className="w-3 h-3 text-star-gold fill-star-gold shrink-0 animate-pulse" />
      <span>Verified Pro</span>
    </span>
  );
}
