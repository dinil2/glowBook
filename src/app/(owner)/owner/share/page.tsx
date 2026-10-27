'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DEMO_SALONS } from '@/lib/demo-data';
import { Copy, Check, Download, QrCode, Instagram, Share2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function OwnerSharePage() {
  const salon = DEMO_SALONS[0];
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [copiedBio, setCopiedBio] = React.useState(false);

  const bookingUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/salons/${salon.slug}`
    : `https://glowbook.lk/salons/${salon.slug}`;

  const instagramBioText = `✨ Haute hair, balayage & couture bridal in Colombo 07\n📅 Book your appointment online:\n👉 ${bookingUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookingUrl);
    setCopiedLink(true);
    toast.success('Booking link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyBio = () => {
    navigator.clipboard.writeText(instagramBioText);
    setCopiedBio(true);
    toast.success('Instagram bio text copied!');
    setTimeout(() => setCopiedBio(false), 2000);
  };

  const handleDownloadQr = () => {
    // Generate clean downloadable SVG QR card
    const qrSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
      <rect width="400" height="500" rx="24" fill="#5B3FD1" />
      <rect x="20" y="20" width="360" height="460" rx="16" fill="#FFFFFF" />
      <text x="200" y="65" font-family="sans-serif" font-size="20" font-weight="900" fill="#1E1B2E" text-anchor="middle">${salon.name.toUpperCase()}</text>
      <text x="200" y="85" font-family="sans-serif" font-size="12" fill="#6B6785" text-anchor="middle">Scan with camera to book online</text>
      <!-- Mock QR grid -->
      <rect x="80" y="110" width="240" height="240" rx="12" fill="#FAF8FF" stroke="#E4D9FF" stroke-width="2" />
      <rect x="100" y="130" width="50" height="50" fill="#1E1B2E" />
      <rect x="110" y="140" width="30" height="30" fill="#FFFFFF" />
      <rect x="250" y="130" width="50" height="50" fill="#1E1B2E" />
      <rect x="260" y="140" width="30" height="30" fill="#FFFFFF" />
      <rect x="100" y="280" width="50" height="50" fill="#1E1B2E" />
      <rect x="110" y="290" width="30" height="30" fill="#FFFFFF" />
      <circle cx="200" cy="230" r="24" fill="#8B6CF6" />
      <text x="200" y="390" font-family="sans-serif" font-size="13" font-weight="bold" fill="#5B3FD1" text-anchor="middle">GLOWBOOK.LK</text>
      <text x="200" y="440" font-family="sans-serif" font-size="11" fill="#9E9AA8" text-anchor="middle">Powered by Glowbook Sri Lanka</text>
    </svg>`;

    const blob = new Blob([qrSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${salon.slug}-qr-code.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('QR Code SVG downloaded!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-ink tracking-tight">Share Kit & QR Code</h1>
        <p className="text-xs text-muted">
          Promote your salon on social media and print QR appointment stickers for your reception desk.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personalized Booking Link */}
        <Card className="p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-ink">Your Direct Booking Link</h3>
            <p className="text-xs text-muted">
              Share this link directly on WhatsApp, Facebook, or your website.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={bookingUrl}
              className="flex-1 h-11 px-3.5 rounded-2xl bg-mist border border-muted-border font-mono text-xs text-ink"
            />
            <Button variant="primary" size="md" onClick={handleCopyLink} className="shrink-0">
              {copiedLink ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copiedLink ? 'Copied' : 'Copy'}
            </Button>
          </div>

          {/* Instagram Bio Text Generator */}
          <div className="pt-4 border-t border-muted-border/60 space-y-2">
            <h4 className="font-bold text-xs text-ink flex items-center gap-1.5">
              <Instagram className="w-4 h-4 text-pink-600" />
              Suggested Instagram Bio
            </h4>
            <div className="p-3.5 rounded-2xl bg-mist border border-muted-border font-mono text-xs text-ink whitespace-pre-line leading-relaxed">
              {instagramBioText}
            </div>
            <Button variant="outline" size="sm" onClick={handleCopyBio} className="w-full">
              {copiedBio ? 'Copied Bio Text!' : 'Copy Instagram Bio'}
            </Button>
          </div>
        </Card>

        {/* Downloadable QR Code */}
        <Card className="p-6 flex flex-col justify-between items-center text-center space-y-5">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-ink">Reception Desk QR Code</h3>
            <p className="text-xs text-muted">
              Download and print on counter tent cards or business cards.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-lavender/50 border-2 border-primary/20 shadow-glow-sm">
            <div className="w-40 h-40 rounded-2xl bg-white border border-muted-border flex flex-col items-center justify-center p-3">
              <QrCode className="w-28 h-28 text-primary-deep" />
              <span className="text-[10px] font-mono font-bold text-muted mt-1">
                {salon.billingCode}
              </span>
            </div>
          </div>

          <Button variant="primary" size="lg" onClick={handleDownloadQr} className="w-full shadow-glow-md">
            <Download className="w-4 h-4 mr-2" /> Download Print-Ready QR (.SVG)
          </Button>
        </Card>
      </div>
    </div>
  );
}
