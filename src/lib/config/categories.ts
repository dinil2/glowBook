export interface CategoryConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  tagline: string;
  iconName: string;
  popularServices: string[];
}

export const SALON_CATEGORIES: CategoryConfig[] = [
  {
    id: 'hair',
    name: 'Hair Care & Styling',
    slug: 'hair',
    description: 'Precision haircuts, balayage, keratin treatments, blow dries & hair spa.',
    tagline: 'Locks crafted to perfection',
    iconName: 'Scissors',
    popularServices: ['Ladies Haircut', 'Gents Haircut', 'Balayage', 'Keratin Treatment', 'Hair Spa'],
  },
  {
    id: 'barber',
    name: 'Barber & Men’s Grooming',
    slug: 'barber',
    description: 'Classic razor fades, hot towel shaves, beard sculpture & scalp massages.',
    tagline: 'Sharper looks, refined comfort',
    iconName: 'Sparkles',
    popularServices: ['Classic Fade', 'Beard Trim & Shape', 'Hot Towel Shave', 'Scalp Treatment'],
  },
  {
    id: 'bridal',
    name: 'Bridal & Occasions',
    slug: 'bridal',
    description: 'Kandyan, Western & Indian bridal dressing, saree draping & high-definition makeup.',
    tagline: 'Your dream bridal aura',
    iconName: 'Crown',
    popularServices: ['Bridal Dressing', 'Pre-Bridal Package', 'Party Makeup', 'Saree Draping'],
  },
  {
    id: 'nails',
    name: 'Nails & Pedicure',
    slug: 'nails',
    description: 'Gel extensions, nail art, luxury spa pedicures & cuticle care.',
    tagline: 'Flawless tips and toes',
    iconName: 'Gem',
    popularServices: ['Gel Manicure', 'Spa Pedicure', 'Acrylic Extensions', 'Nail Art'],
  },
  {
    id: 'facial',
    name: 'Facial & Skin Aesthetics',
    slug: 'facial',
    description: 'Hydra facials, gold glow treatments, acne therapies & anti-aging renewal.',
    tagline: 'Radiant, youthful glow',
    iconName: 'Sparkle',
    popularServices: ['HydraFacial', 'Deep Cleansing Facial', 'Gold Glow Treatment', 'Acne Care'],
  },
  {
    id: 'spa',
    name: 'Spa & Wellness',
    slug: 'spa',
    description: 'Ayurvedic head baths, full body aromatherapy, herbal scrubs & reflexology.',
    tagline: 'Deep serenity & rejuvenation',
    iconName: 'HeartHandshake',
    popularServices: ['Aromatherapy Body Massage', 'Head & Shoulder Spa', 'Herbal Body Scrub'],
  },
  {
    id: 'makeup',
    name: 'Makeup Artistry',
    slug: 'makeup',
    description: 'Red-carpet glam, evening occasion looks, photoshoot & natural day wear.',
    tagline: 'Unleash your striking beauty',
    iconName: 'Palette',
    popularServices: ['Party Glam Makeup', 'Photoshoot Makeup', 'Engagement Makeup'],
  },
];
