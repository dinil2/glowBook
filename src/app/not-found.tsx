import Link from 'next/link';
import { ArrowLeft, Search, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-mesh-subtle flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-surface border border-muted-border/60 rounded-3xl p-8 shadow-glow-md">
        <div className="w-16 h-16 rounded-2xl bg-lavender flex items-center justify-center mx-auto mb-6 text-primary shadow-glow-sm">
          <Sparkles className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-widest font-bold text-primary px-3 py-1 bg-soft-purple/30 rounded-full inline-block mb-3">
          404 Not Found
        </span>
        <h1 className="text-3xl font-bold text-ink mb-3 font-display">
          Salon Not <span className="italic text-primary">Found</span>
        </h1>
        <p className="text-muted text-sm mb-8 leading-relaxed">
          The page or salon profile you were looking for doesn't exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-ink text-white font-medium hover:bg-ink-soft transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/salons"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-primary text-white font-medium hover:bg-primary-hover shadow-glow-sm transition-all text-sm"
          >
            <Search className="w-4 h-4" />
            Explore Salons
          </Link>
        </div>
      </div>
    </div>
  );
}
