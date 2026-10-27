/**
 * Glowbook Platform Configuration
 * Single source of truth for site branding, locale, currency and platform constants.
 */

export const siteConfig = {
  name: 'Glowbook',
  legalName: 'Glowbook LK Technologies',
  tagline: 'Search any salon in Sri Lanka and book your appointment easily.',
  description:
    'The premier salon and beauty booking marketplace in Sri Lanka. Search trusted salons in Colombo, Kandy, Galle, and island-wide. Book in seconds with zero signup.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://glowbook.lk',
  locale: 'en-LK',
  timezone: 'Asia/Colombo', // UTC+5:30
  currency: {
    code: 'LKR',
    symbol: 'LKR',
    name: 'Sri Lankan Rupee',
    format: (amount: number) =>
      `LKR ${new Intl.NumberFormat('en-LK', {
        maximumFractionDigits: 0,
      }).format(amount)}`,
  },
  phonePrefix: '+94',
  support: {
    email: 'support@glowbook.lk',
    phone: '+94 11 234 5678',
    whatsapp: '+94 77 123 4567',
    hours: 'Mon - Sun, 8:00 AM - 8:00 PM',
  },
  links: {
    facebook: 'https://facebook.com/glowbooklk',
    instagram: 'https://instagram.com/glowbooklk',
    tiktok: 'https://tiktok.com/@glowbooklk',
  },
} as const;

export type SiteConfig = typeof siteConfig;
