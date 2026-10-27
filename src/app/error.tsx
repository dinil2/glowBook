'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-mesh-subtle flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-surface border border-ruby-500/20 rounded-3xl p-8 shadow-glow-md">
        <div className="w-16 h-16 rounded-2xl bg-ruby-50 flex items-center justify-center mx-auto mb-6 text-ruby-600 shadow-glow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-widest font-bold text-ruby-600 px-3 py-1 bg-ruby-50 rounded-full inline-block mb-3">
          Something went wrong
        </span>
        <h1 className="text-2xl font-bold text-ink mb-3 font-display">
          We encountered a hiccup
        </h1>
        <p className="text-muted text-sm mb-8 leading-relaxed">
          {error.message || 'An unexpected error occurred while loading this view. Please try again.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-primary text-white font-medium hover:bg-primary-hover shadow-glow-sm transition-all text-sm"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-surface border border-muted-border text-ink font-medium hover:bg-mist transition-all text-sm"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
