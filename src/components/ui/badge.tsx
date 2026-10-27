import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'success' | 'danger' | 'purple';
}

export function Badge({ className, variant = 'primary', ...props }: BadgeProps) {
  const variants = {
    primary: 'bg-primary/10 text-primary-deep border-primary/20',
    secondary: 'bg-mist text-ink-light border-muted-border',
    outline: 'bg-transparent text-ink border-muted-border',
    gold: 'bg-star-gold/20 text-[#A66F00] border-star-gold/30 font-semibold',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-500/20',
    danger: 'bg-ruby-50 text-ruby-600 border-ruby-500/20',
    purple: 'bg-primary text-white border-transparent',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
