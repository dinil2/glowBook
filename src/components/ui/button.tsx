'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold' | 'gradient' | 'mint';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer';

    const variants = {
      primary:
        'bg-[#141219] text-white shadow-sm hover:bg-[#262432] active:bg-[#0D0B10]',
      gradient:
        'bg-[#1B4332] text-white shadow-sm hover:bg-[#143527] active:bg-[#0D241A]',
      mint:
        'bg-[#F0F7F4] text-[#1B4332] border border-[#DDEEE7] hover:bg-[#DDEEE7] font-semibold',
      secondary:
        'bg-[#F7F5F0] text-[#141219] hover:bg-[#EFECE4] border border-[#E8E5DF]',
      outline:
        'border border-[#E8E5DF] bg-white text-[#141219] hover:bg-[#FBFBF9] hover:border-[#141219]',
      ghost:
        'text-[#141219] hover:bg-[#F7F5F0]',
      danger:
        'bg-ruby-500 text-white hover:bg-ruby-600 shadow-sm',
      gold:
        'bg-[#C59B27] text-white font-semibold shadow-sm hover:bg-[#B38A1D]',
    };

    const sizes = {
      sm: 'text-xs h-8 px-3.5 gap-1.5',
      md: 'text-sm h-10 px-5 gap-2',
      lg: 'text-base h-12 px-6 gap-2.5 font-semibold',
      xl: 'text-lg h-14 px-8 gap-3 font-semibold rounded-3xl',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
