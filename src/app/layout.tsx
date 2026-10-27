import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Fraunces } from 'next/font/google';
import { Toaster } from 'sonner';
import { siteConfig } from '@/lib/config/site';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const viewport: Viewport = {
  themeColor: '#8B6CF6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'salon booking sri lanka',
    'hair salon colombo',
    'bridal makeup sri lanka',
    'barber shop colombo',
    'spa kandy',
    'nail studio galle',
    'glowbook',
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_LK',
    url: siteConfig.url,
    title: `${siteConfig.name} — Search Any Salon in Sri Lanka`,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — Search Any Salon in Sri Lanka`,
    description: siteConfig.description,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${fraunces.variable} scroll-smooth`}
    >
      <body className="min-h-screen font-sans bg-background text-ink antialiased selection:bg-soft-purple selection:text-ink">
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              borderRadius: '1rem',
              border: '1px solid #E4D9FF',
              fontFamily: 'var(--font-plus-jakarta)',
            },
          }}
        />
      </body>
    </html>
  );
}
