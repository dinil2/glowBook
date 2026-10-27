'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  position?: 'bottom' | 'right' | 'top';
  className?: string;
  title?: string;
}

export function Sheet({
  open,
  onOpenChange,
  children,
  position = 'bottom',
  className,
  title,
}: SheetProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  const animations = {
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
      container: 'inset-x-0 bottom-0 rounded-t-3xl max-h-[92vh]',
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      container: 'inset-y-0 right-0 w-full max-w-md h-full rounded-l-3xl',
    },
    top: {
      initial: { y: '-100%' },
      animate: { y: 0 },
      exit: { y: '-100%' },
      container: 'inset-x-0 top-0 rounded-b-3xl max-h-[85vh]',
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
          />

          {/* Sheet Container */}
          <motion.div
            initial={animations[position].initial}
            animate={animations[position].animate}
            exit={animations[position].exit}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={cn(
              'fixed z-50 bg-white p-6 shadow-glow-lg overflow-y-auto flex flex-col',
              animations[position].container,
              className
            )}
          >
            {/* Grab indicator for bottom sheet */}
            {position === 'bottom' && (
              <div className="mx-auto w-12 h-1.5 rounded-full bg-muted-border mb-4 shrink-0" />
            )}

            <div className="flex items-center justify-between mb-4">
              {title ? <h2 className="text-lg font-bold text-ink">{title}</h2> : <div />}
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-full p-2 text-muted hover:bg-lavender hover:text-ink transition-colors"
                aria-label="Close sheet"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
