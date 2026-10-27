import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in Sri Lankan Rupees (LKR)
 * e.g. 4500 -> "LKR 4,500"
 */
export function formatLKR(amount: number): string {
  return `LKR ${new Intl.NumberFormat('en-LK', {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}

export const formatCurrency = formatLKR;


/**
 * Format Sri Lankan phone numbers: +94 7X XXX XXXX
 */
export function formatSLPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('94') && digits.length === 11) {
    return `+94 ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  if (digits.startsWith('0') && digits.length === 10) {
    return `+94 ${digits.slice(1, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  if (digits.length === 9) {
    return `+94 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

/**
 * Generates a clean URL slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Generates an uppercase booking reference like SB-7K3Q9X or GB-9X2M4K
 */
export function generateBookingReference(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `GB-${code}`;
}

/**
 * Generates a unique 4-digit billing code for salons
 */
export function generateBillingCode(name: string): string {
  const cleanName = name
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 12);
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `${cleanName || 'SALON'}-${randomDigits}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}
