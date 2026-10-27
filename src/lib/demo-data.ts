/**
 * Glowbook Realistic Sri Lankan Seed & Demo Dataset
 * Deterministic and production-grade dataset covering 20 fictional salons across Sri Lanka,
 * 60 diverse customers, ~700 rolling bookings, reviews, and HNB subscription payments.
 */

export interface DemoService {
  id: string;
  name: string;
  category: string;
  description: string;
  durationMin: number;
  priceLkr: number;
  kind: 'service' | 'package';
  includes?: string[];
}

export interface DemoStaff {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
}

export interface DemoReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  ownerReply?: string;
}

export interface DemoHours {
  weekday: number; // 0=Sun, 1=Mon...
  openTime: string;
  closeTime: string;
  breakStart?: string;
  breakEnd?: string;
  isClosed: boolean;
}

export interface DemoPayment {
  id: string;
  salonId: string;
  salonName: string;
  billingCode: string;
  plan: 'pro';
  months: 1 | 3 | 12;
  amountLkr: number;
  status: 'pending_review' | 'approved' | 'rejected';
  referenceCode: string;
  payerName?: string;
  transferDate?: string;
  bankReference?: string;
  receiptUrl?: string;
  ownerNote?: string;
  submittedAt: string;
  reviewedAt?: string;
  rejectReason?: string;
}

export interface DemoBooking {
  id: string;
  reference: string;
  salonId: string;
  staffId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startsAt: string;
  endsAt: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  paymentStatus: 'pay_at_salon' | 'paid';
  totalLkr: number;
  serviceNames: string[];
  notes?: string;
}

export interface DemoSalon {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  categories: string[];
  genderType: 'ladies' | 'gents' | 'unisex';
  district: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  logoUrl: string;
  bannerUrl: string;
  galleryImages: string[];
  priceTier: 'budget' | 'mid' | 'premium';
  status: 'approved' | 'pending' | 'suspended';
  isFeatured: boolean;
  avgRating: number;
  reviewCount: number;
  billingCode: string;
  plan: 'free' | 'pro';
  planExpiresAt: string | null;
  trialEndsAt: string | null;
  autoConfirm: boolean;
  minLeadHours: number;
  maxAdvanceDays: number;
  cancellationHours: number;
  services: DemoService[];
  staff: DemoStaff[];
  hours: DemoHours[];
  reviews: DemoReview[];
  monthlyBookingsCount: number;
}

// Modern SVGs & curated high-resolution salon images
const SALON_BANNERS = [
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1600&q=80',
];

const DEFAULT_HOURS: DemoHours[] = [
  { weekday: 1, openTime: '09:00', closeTime: '19:30', breakStart: '13:00', breakEnd: '13:30', isClosed: false },
  { weekday: 2, openTime: '09:00', closeTime: '19:30', breakStart: '13:00', breakEnd: '13:30', isClosed: false },
  { weekday: 3, openTime: '09:00', closeTime: '19:30', breakStart: '13:00', breakEnd: '13:30', isClosed: false },
  { weekday: 4, openTime: '09:00', closeTime: '19:30', breakStart: '13:00', breakEnd: '13:30', isClosed: false },
  { weekday: 5, openTime: '09:00', closeTime: '20:00', breakStart: '13:00', breakEnd: '13:30', isClosed: false },
  { weekday: 6, openTime: '08:30', closeTime: '20:30', breakStart: '13:00', breakEnd: '13:30', isClosed: false },
  { weekday: 0, openTime: '09:00', closeTime: '18:00', breakStart: '13:00', breakEnd: '13:30', isClosed: false },
];

export const DEMO_SALONS: DemoSalon[] = [
  {
    id: 'salon-1',
    slug: 'salon-costume',
    name: 'Salon Costume',
    tagline: 'Haute coiffure, bespoke balayage & luxury bridal couture in Colombo 07',
    description:
      'Colombo 07’s premier haute hair and aesthetic studio. Renowned for custom balayage, Italian botanical treatments, and exquisite high-fashion styling in an architectural natural-light space.',
    categories: ['hair', 'bridal', 'facial'],
    genderType: 'unisex',
    district: 'colombo',
    city: 'Colombo 07',
    address: '42/1 Horton Place, Cinnamon Gardens, Colombo 07',
    lat: 6.9118,
    lng: 79.8712,
    phone: '+94 11 268 9120',
    whatsapp: '+94 77 482 1902',
    email: 'appointments@saloncostume.lk',
    instagram: 'saloncostume_official',
    facebook: 'saloncostumecolombo',
    logoUrl: '/logos/salon-costume.svg',
    bannerUrl: SALON_BANNERS[0],
    galleryImages: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    ],
    priceTier: 'premium',
    status: 'approved',
    isFeatured: true,
    avgRating: 4.92,
    reviewCount: 38,
    billingCode: 'SALONCOSTUME-4821',
    plan: 'pro',
    planExpiresAt: new Date(Date.now() + 85 * 24 * 60 * 60 * 1000).toISOString(),
    trialEndsAt: null,
    autoConfirm: true,
    minLeadHours: 2,
    maxAdvanceDays: 45,
    cancellationHours: 4,
    monthlyBookingsCount: 84,
    staff: [
      { id: 'st-1-1', name: 'Rohan Jayasuriya', role: 'Creative Director', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
      { id: 'st-1-2', name: 'Nadeeka Perera', role: 'Senior Colorist', photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
      { id: 'st-1-3', name: 'Dilan Senanayake', role: 'Master Barber', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
      { id: 'st-1-4', name: 'Chamari Gunaratne', role: 'Skin Specialist', photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
    ],
    services: [
      { id: 'srv-1-1', name: 'Signature Precision Cut & Blow Dry', category: 'hair', description: 'Consultation, scalp massage, master precision haircut and runway blowout.', durationMin: 60, priceLkr: 6500, kind: 'service' },
      { id: 'srv-1-2', name: 'Bespoke Balayage & Glossing', category: 'hair', description: 'Hand-painted dimensional contour lightening with organic bond-repair toner.', durationMin: 150, priceLkr: 32000, kind: 'service' },
      { id: 'srv-1-3', name: 'Keratin Smoothing Infusion', category: 'hair', description: 'Formaldehyde-free deep keratin glaze for frizz-free silkiness lasting 4+ months.', durationMin: 180, priceLkr: 28000, kind: 'service' },
      { id: 'srv-1-4', name: 'HydraFacial Deluxe Glow', category: 'facial', description: 'Vortex-fusion deep pore extraction, peptide infusion and LED photo-rejuvenation.', durationMin: 75, priceLkr: 14500, kind: 'service' },
      { id: 'srv-1-5', name: 'Couture Bridal Dressing Package', category: 'bridal', description: 'Full wedding day hair sculpture, airbrush makeup, saree drape & touchup kit.', durationMin: 240, priceLkr: 185000, kind: 'package', includes: ['Trial Session', 'Airbrush Makeup', 'Saree Draping', 'Jewellery Setting'] },
      { id: 'srv-1-6', name: 'Gentleman’s Royal Executive Grooming', category: 'hair', description: 'Beard sculpture, precision fade, peppermint head massage & cold compress.', durationMin: 60, priceLkr: 4500, kind: 'service' },
      { id: 'srv-1-7', name: 'Botanical Scalp & Hair Detox Spa', category: 'hair', description: 'Deep exfoliation, steam treatment with essential oils, and hot towel relaxation.', durationMin: 45, priceLkr: 6800, kind: 'service' },
    ],
    hours: DEFAULT_HOURS,
    reviews: [
      { id: 'rev-1-1', customerName: 'Kavindi Wickremasinghe', rating: 5, comment: 'Salon Costume is simply unparalleled in Sri Lanka. Rohan transformed my hair with the most seamless balayage. The ambience is 10/10.', createdAt: '2026-10-18T10:30:00Z', ownerReply: 'Thank you Kavindi! It was our pleasure creating your dream contour.' },
      { id: 'rev-1-2', customerName: 'Shehan De Silva', rating: 5, comment: 'Dilan is the best barber in Colombo. Spot on fade and zero rush. Booking was ridiculously smooth.', createdAt: '2026-10-15T14:00:00Z' },
    ],
  },
  {
    id: 'salon-2',
    slug: 'aura-lounge-spa',
    name: 'Aura Lounge & Spa',
    tagline: 'Holistic dermal therapy, Ayurvedic therapies & organic nail bar in Colombo 03',
    description: 'An oasis of serenity along Marine Drive. Offering revitalizing facials, soothing hot stone therapies and clean manicures.',
    categories: ['facial', 'spa', 'nails'],
    genderType: 'ladies',
    district: 'colombo',
    city: 'Colombo 03',
    address: '18 Deal Place, Kollupitiya, Colombo 03',
    lat: 6.9034,
    lng: 79.8519,
    phone: '+94 11 257 6389',
    whatsapp: '+94 77 193 4812',
    email: 'info@auralounge.lk',
    instagram: 'auralounge_spa',
    facebook: 'auraloungecolombo',
    logoUrl: '/logos/aura-lounge.svg',
    bannerUrl: SALON_BANNERS[1],
    galleryImages: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    ],
    priceTier: 'premium',
    status: 'approved',
    isFeatured: true,
    avgRating: 4.88,
    reviewCount: 29,
    billingCode: 'AURALOUNGE-1934',
    plan: 'pro',
    planExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    trialEndsAt: null,
    autoConfirm: true,
    minLeadHours: 1,
    maxAdvanceDays: 30,
    cancellationHours: 3,
    monthlyBookingsCount: 62,
    staff: [
      { id: 'st-2-1', name: 'Shalini Fernando', role: 'Lead Dermal Therapist', photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
      { id: 'st-2-2', name: 'Devi Rathnayake', role: 'Ayurvedic Specialist', photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80' },
    ],
    services: [
      { id: 'srv-2-1', name: '24K Gold Cellular Renewal Facial', category: 'facial', description: 'Pure 24k gold leaf masking with lymphatic drainage and peptide firming.', durationMin: 75, priceLkr: 12000, kind: 'service' },
      { id: 'srv-2-2', name: 'Aromatherapy Balinese Body Massage', category: 'spa', description: 'Full body deep relaxation with organic Sri Lankan lemongrass and clove oil.', durationMin: 90, priceLkr: 11500, kind: 'service' },
      { id: 'srv-2-3', name: 'Deluxe Gel Spa Pedicure', category: 'nails', description: 'Sea salt scrub, callus smoothing, massage and chip-resistant gel finish.', durationMin: 60, priceLkr: 5200, kind: 'service' },
    ],
    hours: DEFAULT_HOURS,
    reviews: [
      { id: 'rev-2-1', customerName: 'Fathima Rizwan', rating: 5, comment: 'The gold facial gave me an immediate radiant glow. Super clean, peaceful, and polite therapists.', createdAt: '2026-10-12T16:20:00Z' },
    ],
  },
  {
    id: 'salon-3',
    slug: 'the-urban-barber-co',
    name: 'The Urban Barber Co.',
    tagline: 'Modern street fades, precision beard sculpture & hot lather shaves in Rajagiriya',
    description: 'Rajagiriya’s high-energy barbershop crafting sharp skin fades, beard architectures, and signature face scrubs.',
    categories: ['barber', 'hair'],
    genderType: 'gents',
    district: 'colombo',
    city: 'Rajagiriya',
    address: '512 Sri Jayawardenepura Mawatha, Rajagiriya',
    lat: 6.9088,
    lng: 79.8964,
    phone: '+94 11 286 4410',
    whatsapp: '+94 77 726 1980',
    email: 'booking@urbanbarber.lk',
    instagram: 'urbanbarber_lk',
    facebook: 'urbanbarberrajagiriya',
    logoUrl: '/logos/urban-barber.svg',
    bannerUrl: SALON_BANNERS[2],
    galleryImages: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
    ],
    priceTier: 'mid',
    status: 'approved',
    isFeatured: true,
    avgRating: 4.89,
    reviewCount: 45,
    billingCode: 'URBANBARBER-7261',
    plan: 'pro',
    planExpiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    trialEndsAt: null,
    autoConfirm: true,
    minLeadHours: 1,
    maxAdvanceDays: 20,
    cancellationHours: 2,
    monthlyBookingsCount: 95,
    staff: [
      { id: 'st-3-1', name: 'Malik Jayawardena', role: 'Head Barber', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
      { id: 'st-3-2', name: 'Sanjaya Silva', role: 'Fade Specialist', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80' },
    ],
    services: [
      { id: 'srv-3-1', name: 'Urban Signature Skin Fade', category: 'barber', description: 'Foil shaver zero-taper fade with textured scissor top finish.', durationMin: 45, priceLkr: 2200, kind: 'service' },
      { id: 'srv-3-2', name: 'Hot Lather Shave & Cold Towel', category: 'barber', description: 'Steamed towel softening, straight-edge razor shave, and aftershave balm.', durationMin: 35, priceLkr: 1600, kind: 'service' },
      { id: 'srv-3-3', name: 'The Complete Groom Package', category: 'barber', description: 'Fade cut, beard sculpt, scalp massage and charcoal blackhead mask.', durationMin: 70, priceLkr: 4500, kind: 'package', includes: ['Haircut', 'Beard Trim', 'Charcoal Scrub'] },
    ],
    hours: DEFAULT_HOURS,
    reviews: [
      { id: 'rev-3-1', customerName: 'Arjun Nallathamby', rating: 5, comment: 'Hands down best barber in Colombo. Malik knows how to handle textured hair. Booking on mobile took 20 seconds.', createdAt: '2026-10-20T11:00:00Z' },
    ],
  },
  {
    id: 'salon-4',
    slug: 'crown-veil-bridal',
    name: 'Crown & Veil Bridal Studio',
    tagline: 'Bridal dressing, royal Kandyan sarees & HD bridal glam in Nugegoda',
    description: 'Sri Lanka’s celebrated destination for modern and traditional bridal transformations, pre-shoot styling, and saree artistry.',
    categories: ['bridal', 'makeup', 'hair'],
    genderType: 'ladies',
    district: 'colombo',
    city: 'Nugegoda',
    address: '89 High Level Road, Nugegoda',
    lat: 6.8722,
    lng: 79.8997,
    phone: '+94 11 282 9901',
    whatsapp: '+94 77 881 2934',
    email: 'hello@crownandveil.lk',
    instagram: 'crownandveil_bridal',
    facebook: 'crownandveilsl',
    logoUrl: '/logos/crown-veil.svg',
    bannerUrl: SALON_BANNERS[3],
    galleryImages: [
      'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    ],
    priceTier: 'premium',
    status: 'approved',
    isFeatured: true,
    avgRating: 4.95,
    reviewCount: 42,
    billingCode: 'CROWNVEIL-8812',
    plan: 'pro',
    planExpiresAt: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
    trialEndsAt: null,
    autoConfirm: true,
    minLeadHours: 6,
    maxAdvanceDays: 90,
    cancellationHours: 24,
    monthlyBookingsCount: 38,
    staff: [
      { id: 'st-4-1', name: 'Manori Wijesinghe', role: 'Celebrity Bridal Stylist', photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
      { id: 'st-4-2', name: 'Ishara Alwis', role: 'HD Makeup Artist', photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
    ],
    services: [
      { id: 'srv-4-1', name: 'Royal Kandyan Bridal Dressing Package', category: 'bridal', description: 'Complete traditional Kandyan bride with authentic hand-pleated saree and gold regalia.', durationMin: 240, priceLkr: 165000, kind: 'package', includes: ['Saree Pleating', 'HD Makeup', 'Jewellery Setting', 'Fresh Flowers'] },
      { id: 'srv-4-2', name: 'Evening Glam & Party Saree Drape', category: 'makeup', description: 'Smokey or soft-glam makeup with precision Indian or Kandyan drape.', durationMin: 90, priceLkr: 16500, kind: 'service' },
    ],
    hours: DEFAULT_HOURS,
    reviews: [
      { id: 'rev-4-1', customerName: 'Dilani Samarawickrama', rating: 5, comment: 'Manori made me feel like royalty on my wedding day! Photographers were raving about the makeup. Cannot recommend them enough!', createdAt: '2026-10-19T09:15:00Z' },
    ],
  },
  {
    id: 'salon-5',
    slug: 'kandy-royal-hair-studio',
    name: 'Kandy Royal Hair Studio',
    tagline: 'Precision cuts, highlights & hair treatments in Kandy City',
    description: 'Located in the heart of hill capital Kandy. Specialist stylists in modern textures, keratin smoothing, and bridal blow-dries.',
    categories: ['hair', 'facial'],
    genderType: 'unisex',
    district: 'kandy',
    city: 'Kandy City',
    address: '24 Dalada Vidiya, Kandy',
    lat: 7.2906,
    lng: 80.6337,
    phone: '+94 81 223 4819',
    whatsapp: '+94 77 552 1890',
    email: 'kandyroyal@glowbook.lk',
    instagram: 'kandyroyal_hair',
    facebook: 'kandyroyalhairstudio',
    logoUrl: '/logos/kandy-royal.svg',
    bannerUrl: SALON_BANNERS[4],
    galleryImages: [
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    ],
    priceTier: 'mid',
    status: 'approved',
    isFeatured: true,
    avgRating: 4.81,
    reviewCount: 31,
    billingCode: 'KANDYROYAL-5521',
    plan: 'pro',
    planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    trialEndsAt: null,
    autoConfirm: true,
    minLeadHours: 2,
    maxAdvanceDays: 30,
    cancellationHours: 3,
    monthlyBookingsCount: 52,
    staff: [
      { id: 'st-5-1', name: 'Nuwan Kumara', role: 'Senior Stylist', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
      { id: 'st-5-2', name: 'Hansika Banda', role: 'Hair & Skin Tech', photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
    ],
    services: [
      { id: 'srv-5-1', name: 'Ladies Layered Cut & Blowout', category: 'hair', description: 'Volume-enhancing precision haircut with thermal bounce styling.', durationMin: 50, priceLkr: 3800, kind: 'service' },
      { id: 'srv-5-2', name: 'Nutritive Hair Spa Treatment', category: 'hair', description: 'Deep conditioning argan oil treatment under micro-mist ozone steam.', durationMin: 45, priceLkr: 4500, kind: 'service' },
    ],
    hours: DEFAULT_HOURS,
    reviews: [
      { id: 'rev-5-1', customerName: 'Chathurika Herath', rating: 5, comment: 'Best hair spa in Kandy. Nuwan gave great advice for my dry hair.', createdAt: '2026-10-14T13:40:00Z' },
    ],
  },
  {
    id: 'salon-6',
    slug: 'galle-fort-grooming-club',
    name: 'Galle Fort Grooming Club',
    tagline: 'Heritage grooming, artisan fades & botanical beard care inside Galle Fort',
    description: 'Set within the colonial ramparts of UNESCO Galle Fort. Tailored gentlemen’s haircuts, hot towels, and cinnamon sea-salt scrubs.',
    categories: ['barber', 'spa'],
    genderType: 'gents',
    district: 'galle',
    city: 'Galle Fort',
    address: '14 Church Street, Galle Fort, Galle',
    lat: 6.0308,
    lng: 80.2173,
    phone: '+94 91 224 8190',
    whatsapp: '+94 77 901 2819',
    email: 'concierge@gallebarber.lk',
    instagram: 'gallefortgrooming',
    facebook: 'gallefortgrooming',
    logoUrl: '/logos/galle-fort.svg',
    bannerUrl: SALON_BANNERS[5],
    galleryImages: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    ],
    priceTier: 'premium',
    status: 'approved',
    isFeatured: true,
    avgRating: 4.86,
    reviewCount: 35,
    billingCode: 'GALLEFORT-9012',
    plan: 'pro',
    planExpiresAt: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    trialEndsAt: null,
    autoConfirm: true,
    minLeadHours: 1,
    maxAdvanceDays: 30,
    cancellationHours: 4,
    monthlyBookingsCount: 47,
    staff: [
      { id: 'st-6-1', name: 'Tariq Mansoor', role: 'Master Barber', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
    ],
    services: [
      { id: 'srv-6-1', name: 'Galle Fort Master Fade', category: 'barber', description: 'Bespoke gentleman haircut, neck shave, and bay rum splash.', durationMin: 45, priceLkr: 3200, kind: 'service' },
      { id: 'srv-6-2', name: 'Colonial Straight Razor Shave', category: 'barber', description: 'Hot towel infused with bergamot, badger brush lather & cold stone wrap.', durationMin: 40, priceLkr: 2400, kind: 'service' },
    ],
    hours: DEFAULT_HOURS,
    reviews: [
      { id: 'rev-6-1', customerName: 'David Sterling', rating: 5, comment: 'Phenomenal old-world barbershop inside the Fort. Tariq is an artist.', createdAt: '2026-10-17T15:30:00Z' },
    ],
  },
  {
    id: 'salon-7',
    slug: 'velvet-touch-nails',
    name: 'Velvet Touch Nails & Skin',
    tagline: 'Modern gel sculpting, Korean glass skin facials & lash extensions in Dehiwala',
    description: 'Chic beauty salon specializing in long-lasting gel nail art, collagen eye therapies, and luminous skin resurfacing.',
    categories: ['nails', 'facial'],
    genderType: 'ladies',
    district: 'colombo',
    city: 'Dehiwala',
    address: '142 Galle Road, Dehiwala',
    lat: 6.8512,
    lng: 79.8659,
    phone: '+94 11 273 8192',
    whatsapp: '+94 77 314 5928',
    email: 'hello@velvettouch.lk',
    instagram: 'velvettouch_sl',
    facebook: 'velvettouchdehiwala',
    logoUrl: '/logos/velvet-touch.svg',
    bannerUrl: SALON_BANNERS[6],
    galleryImages: [
      'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=800&q=80',
    ],
    priceTier: 'mid',
    status: 'approved',
    isFeatured: false,
    avgRating: 4.76,
    reviewCount: 24,
    billingCode: 'VELVETTOUCH-3145',
    plan: 'pro',
    planExpiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // EXPIRING IN 5 DAYS to test reminder
    trialEndsAt: null,
    autoConfirm: true,
    minLeadHours: 2,
    maxAdvanceDays: 20,
    cancellationHours: 3,
    monthlyBookingsCount: 58,
    staff: [
      { id: 'st-7-1', name: 'Pooja Vethanayagam', role: 'Nail Artist', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
    ],
    services: [
      { id: 'srv-7-1', name: 'Russian E-File Gel Manicure', category: 'nails', description: 'Flawless cuticle cleanup with reinforced rubber base & Japanese gel color.', durationMin: 75, priceLkr: 4800, kind: 'service' },
      { id: 'srv-7-2', name: 'Glass Skin Glow Facial', category: 'facial', description: 'Hyaluronic micro-needling alternative with soothing rose quartz massage.', durationMin: 60, priceLkr: 7500, kind: 'service' },
    ],
    hours: DEFAULT_HOURS,
    reviews: [
      { id: 'rev-7-1', customerName: 'Natasha Gooneratne', rating: 5, comment: 'Nails lasted 4 full weeks without a single chip. Pooja is so detail-oriented.', createdAt: '2026-10-10T14:15:00Z' },
    ],
  },
  {
    id: 'salon-8',
    slug: 'serendib-ayurvedic-glow',
    name: 'Serendib Ayurvedic Glow',
    tagline: 'Authentic Ceylon herbal head baths, body massages & facial wellness in Peradeniya',
    description: 'Tranquil retreat overlooking the Mahaweli River in Peradeniya. Pure herbal steam, Shirodhara, and therapeutic herbal compresses.',
    categories: ['spa', 'facial'],
    genderType: 'unisex',
    district: 'kandy',
    city: 'Peradeniya',
    address: '68 Old Galaha Road, Peradeniya',
    lat: 7.2612,
    lng: 80.5982,
    phone: '+94 81 238 9102',
    whatsapp: '+94 77 612 3901',
    email: 'care@serendibglow.lk',
    instagram: 'serendib_ayurglow',
    facebook: 'serendibglowkandy',
    logoUrl: '/logos/serendib-glow.svg',
    bannerUrl: SALON_BANNERS[0],
    galleryImages: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    ],
    priceTier: 'mid',
    status: 'approved',
    isFeatured: false,
    avgRating: 4.79,
    reviewCount: 22,
    billingCode: 'SERENDIB-6123',
    plan: 'pro',
    planExpiresAt: null,
    trialEndsAt: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(), // ACTIVE 30-DAY PRO TRIAL
    autoConfirm: true,
    minLeadHours: 3,
    maxAdvanceDays: 30,
    cancellationHours: 6,
    monthlyBookingsCount: 39,
    staff: [
      { id: 'st-8-1', name: 'Dr. Anura Dassanayake', role: 'Ayurvedic Consultant', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    ],
    services: [
      { id: 'srv-8-1', name: 'Traditional Shirodhara & Scalp Bath', category: 'spa', description: 'Continuous warm medicated oil stream on forehead for deep mental calming.', durationMin: 60, priceLkr: 6500, kind: 'service' },
      { id: 'srv-8-2', name: 'Herbal Compress Pinda Sweda Body Massage', category: 'spa', description: 'Hot herbal boluses to soothe joints, muscles and eliminate toxins.', durationMin: 90, priceLkr: 9200, kind: 'service' },
    ],
    hours: DEFAULT_HOURS,
    reviews: [
      { id: 'rev-8-1', customerName: 'Lakmal Gunawardena', rating: 5, comment: 'The Shirodhara cured my 2-week tension headache. Pure authentic healing.', createdAt: '2026-10-11T12:00:00Z' },
    ],
  },
  // 12 FREE SALONS (Phone and WhatsApp hidden on public page at DB level)
  {
    id: 'salon-9',
    slug: 'luxe-looks-hair-studio',
    name: 'Luxe Looks Hair Studio',
    tagline: 'Affordable ladies cuts, blow dries & root touch-ups in Pita Kotte',
    description: 'Friendly neighborhood salon in Pita Kotte offering dependable haircuts, color services, and wash & blow-dries.',
    categories: ['hair'],
    genderType: 'ladies',
    district: 'colombo',
    city: 'Pita Kotte',
    address: '320 Kotte Road, Pita Kotte',
    lat: 6.8912,
    lng: 79.9042,
    phone: '+94 11 287 4190', // HIDDEN for Free salon
    whatsapp: '+94 77 419 0293', // HIDDEN for Free salon
    email: 'luxelooks@gmail.com',
    instagram: 'luxelooks_kotte',
    facebook: 'luxelookskotte',
    logoUrl: '/logos/luxe-looks.svg',
    bannerUrl: SALON_BANNERS[1],
    galleryImages: [
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80',
    ],
    priceTier: 'budget',
    status: 'approved',
    isFeatured: false,
    avgRating: 4.54,
    reviewCount: 19,
    billingCode: 'LUXELOOKS-4190',
    plan: 'free',
    planExpiresAt: null,
    trialEndsAt: null,
    autoConfirm: true,
    minLeadHours: 1,
    maxAdvanceDays: 14,
    cancellationHours: 2,
    monthlyBookingsCount: 27, // 27 of 30 bookings used! (Shows 80%+ nudge)
    staff: [
      { id: 'st-9-1', name: 'Sanduni Rathne', role: 'Stylist', photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
      { id: 'st-9-2', name: 'Ruwanthi Silva', role: 'Junior Stylist', photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
    ],
    services: [
      { id: 'srv-9-1', name: 'Ladies Basic Haircut', category: 'hair', description: 'Trim, shape, and quick blast blow dry.', durationMin: 35, priceLkr: 1800, kind: 'service' },
      { id: 'srv-9-2', name: 'Root Colour Touch-up', category: 'hair', description: '1-inch grey coverage with ammoniac-free tint.', durationMin: 60, priceLkr: 4200, kind: 'service' },
      { id: 'srv-9-3', name: 'Wash and Blow Dry', category: 'hair', description: 'Shampoo wash with straight or curly blow dry.', durationMin: 30, priceLkr: 2200, kind: 'service' },
    ],
    hours: DEFAULT_HOURS,
    reviews: [
      { id: 'rev-9-1', customerName: 'Nimesha Perera', rating: 4, comment: 'Very fast and neat haircut. Great value for money in Kotte.', createdAt: '2026-10-16T17:00:00Z' },
    ],
  },
  {
    id: 'salon-10',
    slug: 'signature-cuts-barber',
    name: 'Signature Cuts Barber',
    tagline: 'Reliable gents haircutting & beard trimming in Gampaha',
    description: 'Clean, air-conditioned barbershop near Gampaha railway station. Quick service and classic grooming.',
    categories: ['barber'],
    genderType: 'gents',
    district: 'gampaha',
    city: 'Gampaha',
    address: '45 Yakkala Road, Gampaha',
    lat: 7.0897,
    lng: 79.9928,
    phone: '+94 33 222 3810',
    whatsapp: '+94 77 381 0291',
    email: 'sigcuts@gmail.com',
    instagram: 'sigcuts_gampaha',
    facebook: 'signaturecutsgampaha',
    logoUrl: '/logos/signature-cuts.svg',
    bannerUrl: SALON_BANNERS[2],
    galleryImages: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    ],
    priceTier: 'budget',
    status: 'approved',
    isFeatured: false,
    avgRating: 4.45,
    reviewCount: 16,
    billingCode: 'SIGNCUTS-3810',
    plan: 'free',
    planExpiresAt: null,
    trialEndsAt: null,
    autoConfirm: true,
    minLeadHours: 1,
    maxAdvanceDays: 14,
    cancellationHours: 2,
    monthlyBookingsCount: 14,
    staff: [
      { id: 'st-10-1', name: 'Kamal Jayalath', role: 'Barber', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
    ],
    services: [
      { id: 'srv-10-1', name: 'Gents Regular Haircut', category: 'barber', description: 'Scissor cut or machine trim with clean neck shave.', durationMin: 30, priceLkr: 900, kind: 'service' },
      { id: 'srv-10-2', name: 'Beard Trim & Shape', category: 'barber', description: 'Beard lining and trimming with trimmer & scissor.', durationMin: 20, priceLkr: 600, kind: 'service' },
    ],
    hours: DEFAULT_HOURS,
    reviews: [
      { id: 'rev-10-1', customerName: 'Sunil Weerakkody', rating: 5, comment: 'Very clean shop and polite barber.', createdAt: '2026-10-13T10:00:00Z' },
    ],
  },
  {
    id: 'salon-11',
    slug: 'lotus-blossom-bridal',
    name: 'Lotus Blossom Bridal',
    tagline: 'Bridal dressing & family party makeup in Negombo',
    description: 'Specializing in Western and Indian bridal sarees, hair accessories, and party makeup along the Negombo coast.',
    categories: ['bridal', 'makeup'],
    genderType: 'ladies',
    district: 'gampaha',
    city: 'Negombo',
    address: '88 St. Joseph’s Street, Negombo',
    lat: 7.2083,
    lng: 79.8358,
    phone: '+94 31 223 7721',
    whatsapp: '+94 77 772 1904',
    email: 'lotusbridal@gmail.com',
    instagram: 'lotusbridal_negombo',
    facebook: 'lotusblossombridal',
    logoUrl: '/logos/lotus-blossom.svg',
    bannerUrl: SALON_BANNERS[3],
    galleryImages: [
      'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
    ],
    priceTier: 'mid',
    status: 'approved',
    isFeatured: false,
    avgRating: 4.62,
    reviewCount: 20,
    billingCode: 'LOTUSBRIDAL-7721',
    plan: 'free',
    planExpiresAt: null,
    trialEndsAt: null,
    autoConfirm: true,
    minLeadHours: 4,
    maxAdvanceDays: 60,
    cancellationHours: 12,
    monthlyBookingsCount: 18,
    staff: [
      { id: 'st-11-1', name: 'Mary Fernando', role: 'Bridal Artist', photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
    ],
    services: [
      { id: 'srv-11-1', name: 'Western Bridal Dressing Package', category: 'bridal', description: 'Gown dressing, veil placement, bridal hairdo and makeup.', durationMin: 180, priceLkr: 65000, kind: 'package', includes: ['Makeup', 'Hair Styling', 'Veil Fixing'] },
      { id: 'srv-11-2', name: 'Party Makeup with Lashes', category: 'makeup', description: 'Evening party look with strip eyelash application.', durationMin: 60, priceLkr: 8500, kind: 'service' },
    ],
    hours: DEFAULT_HOURS,
    reviews: [
      { id: 'rev-11-1', customerName: 'Christina Cooray', rating: 5, comment: 'Mary dressed me for my homecoming and it was stunning.', createdAt: '2026-10-08T15:20:00Z' },
    ],
  },
  {
    id: 'salon-12',
    slug: 'elegance-nail-bar',
    name: 'Elegance Nail Bar',
    tagline: 'Express manicures & foot spa in Mount Lavinia',
    description: 'Relaxing beachfront nail studio with quick gel colors, nail extensions, and paraffin wax treatments.',
    categories: ['nails'],
    genderType: 'ladies',
    district: 'colombo',
    city: 'Mount Lavinia',
    address: '22 Hotel Road, Mount Lavinia',
    lat: 6.8389,
    lng: 79.8631,
    phone: '+94 11 271 5129',
    whatsapp: '+94 77 512 9043',
    email: 'elegancenails@gmail.com',
    instagram: 'elegancenails_mtl',
    facebook: 'elegancenailbarmt',
    logoUrl: '/logos/elegance-nail.svg',
    bannerUrl: SALON_BANNERS[4],
    galleryImages: [
      'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=800&q=80',
    ],
    priceTier: 'budget',
    status: 'approved',
    isFeatured: false,
    avgRating: 4.38,
    reviewCount: 14,
    billingCode: 'ELEGNCLAB-5129',
    plan: 'free',
    planExpiresAt: null,
    trialEndsAt: null,
    autoConfirm: true,
    minLeadHours: 2,
    maxAdvanceDays: 14,
    cancellationHours: 2,
    monthlyBookingsCount: 11,
    staff: [
      { id: 'st-12-1', name: 'Fathima Nazreen', role: 'Nail Technician', photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
    ],
    services: [
      { id: 'srv-12-1', name: 'Classic Pedicure & Scrub', category: 'nails', description: 'Warm foot soak, heel buffing, and regular polish.', durationMin: 45, priceLkr: 2500, kind: 'service' },
      { id: 'srv-12-2', name: 'Gel Polish Application', category: 'nails', description: 'UV-cured gel color on natural nails.', durationMin: 40, priceLkr: 3200, kind: 'service' },
    ],
    hours: DEFAULT_HOURS,
    reviews: [
      { id: 'rev-12-1', customerName: 'Rashmi Senevirathne', rating: 4, comment: 'Nice friendly service and cute nail designs.', createdAt: '2026-10-09T16:00:00Z' },
    ],
  },
  {
    id: 'salon-13',
    slug: 'misty-hills-salon',
    name: 'Misty Hills Salon',
    tagline: 'Complete family haircare & facial care in Katugastota, Kandy',
    description: 'Trusted family hair salon in Katugastota. Experienced hairdressers for gents, ladies, and children.',
    categories: ['hair', 'facial'],
    genderType: 'unisex',
    district: 'kandy',
    city: 'Katugastota',
    address: '11 Kurunegala Road, Katugastota, Kandy',
    lat: 7.3212,
    lng: 80.6189,
    phone: '+94 81 249 2938',
    whatsapp: '+94 77 293 8492',
    email: 'mistyhills@gmail.com',
    instagram: 'mistyhills_kandy',
    facebook: 'mistyhillskandy',
    logoUrl: '/logos/misty-hills.svg',
    bannerUrl: SALON_BANNERS[5],
    galleryImages: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    ],
    priceTier: 'budget',
    status: 'approved',
    isFeatured: false,
    avgRating: 4.51,
    reviewCount: 15,
    billingCode: 'MISTYHILLS-2938',
    plan: 'free',
    planExpiresAt: null,
    trialEndsAt: null,
    autoConfirm: true,
    minLeadHours: 1,
    maxAdvanceDays: 14,
    cancellationHours: 2,
    monthlyBookingsCount: 16,
    staff: [
      { id: 'st-13-1', name: 'Jagath Bandara', role: 'Stylist', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    ],
    services: [
      { id: 'srv-13-1', name: 'Family Haircut Combo', category: 'hair', description: 'Haircut for one adult and one child.', durationMin: 50, priceLkr: 2200, kind: 'service' },
      { id: 'srv-13-2', name: 'Herbal Clean Facial', category: 'facial', description: 'Turmeric & sandalwood cleansing mask.', durationMin: 45, priceLkr: 3200, kind: 'service' },
    ],
    hours: DEFAULT_HOURS,
    reviews: [
      { id: 'rev-13-1', customerName: 'Pradeep Ranasinghe', rating: 5, comment: 'Took my son for a haircut, very gentle and neat.', createdAt: '2026-10-06T11:45:00Z' },
    ],
  },
  {
    id: 'salon-14',
    slug: 'southern-breeze-hair-spa',
    name: 'Southern Breeze Hair & Spa',
    tagline: 'Ayurvedic head massages & ladies hair styling in Matara City',
    description: 'Popular Matara salon offering herbal oil head baths, straightening treatments, and waxing.',
    categories: ['hair', 'spa'],
    genderType: 'unisex',
    district: 'matara',
    city: 'Matara City',
    address: '38 Anagarika Dharmapala Mawatha, Matara',
    lat: 5.9496,
    lng: 80.5469,
    phone: '+94 41 222 6612',
    whatsapp: '+94 77 661 2893',
    email: 'southernbreeze@gmail.com',
    instagram: 'southernbreeze_matara',
    facebook: 'southernbreezespa',
    logoUrl: '/logos/southern-breeze.svg',
    bannerUrl: SALON_BANNERS[6],
    galleryImages: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    ],
    priceTier: 'budget',
    status: 'approved',
    isFeatured: false,
    avgRating: 4.47,
    reviewCount: 18,
    billingCode: 'SOUTHERNBZ-6612',
    plan: 'free',
    planExpiresAt: null,
    trialEndsAt: null,
    autoConfirm: true,
    minLeadHours: 2,
    maxAdvanceDays: 14,
    cancellationHours: 3,
    monthlyBookingsCount: 19,
    staff: [
      { id: 'st-14-1', name: 'Kusum Weerasinghe', role: 'Hairdresser', photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
    ],
    services: [
      { id: 'srv-14-1', name: 'Herbal Head Massage & Steam', category: 'spa', description: 'Ceylon neem and coconut oil scalp massage with steam.', durationMin: 40, priceLkr: 2000, kind: 'service' },
      { id: 'srv-14-2', name: 'Permanent Hair Rebonding', category: 'hair', description: 'Straight silky hair finish with matrix bond protector.', durationMin: 180, priceLkr: 16000, kind: 'service' },
    ],
    hours: DEFAULT_HOURS,
    reviews: [
      { id: 'rev-14-1', customerName: 'Sashika Lokuge', rating: 5, comment: 'Rebonding done so well. Kusum akka is very talented.', createdAt: '2026-10-07T14:10:00Z' },
    ],
  },
  {
    id: 'salon-15',
    slug: 'fortress-hair-beauty',
    name: 'Fortress Hair & Beauty',
    tagline: 'Bridal dressing & aesthetic treatments in Karapitiya, Galle',
    description: 'Conveniently situated near Karapitiya Teaching Hospital. Quality haircuts, facials and bridal sarees.',
    categories: ['hair', 'bridal'],
    genderType: 'ladies',
    district: 'galle',
    city: 'Karapitiya',
    address: '105 Hirimbura Road, Karapitiya, Galle',
    lat: 6.0645,
    lng: 80.2285,
    phone: '+94 91 228 8819',
    whatsapp: '+94 77 881 9204',
    email: 'fortresshair@gmail.com',
    instagram: 'fortressgalle',
    facebook: 'fortresshairbeauty',
    logoUrl: '/logos/fortress.svg',
    bannerUrl: SALON_BANNERS[0],
    galleryImages: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    ],
    priceTier: 'budget',
    status: 'approved',
    isFeatured: false,
    avgRating: 4.35,
    reviewCount: 11,
    billingCode: 'FORTRESS-8819',
    plan: 'free',
    planExpiresAt: null,
    trialEndsAt: null,
    autoConfirm: true,
    minLeadHours: 1,
    maxAdvanceDays: 20,
    cancellationHours: 2,
    monthlyBookingsCount: 9,
    staff: [
      { id: 'st-15-1', name: 'Nayomi Jayatissa', role: 'Beautician', photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
    ],
    services: [
      { id: 'srv-15-1', name: 'Fruit Facial Treatment', category: 'facial', description: 'Orange and papaya fruit peel for sun tan removal.', durationMin: 45, priceLkr: 3500, kind: 'service' },
      { id: 'srv-15-2', name: 'Eyebrow Threading & Upper Lip', category: 'facial', description: 'Precise hair threading and aloe vera soothing gel.', durationMin: 15, priceLkr: 500, kind: 'service' },
    ],
    hours: DEFAULT_HOURS,
    reviews: [
      { id: 'rev-15-1', customerName: 'Devika Abeyratne', rating: 4, comment: 'Threading was painless and quick.', createdAt: '2026-10-05T16:30:00Z' },
    ],
  },
  {
    id: 'salon-16',
    slug: 'golden-scissors-studio',
    name: 'Golden Scissors Studio',
    tagline: 'Modern fades & grooming in Kurunegala Town',
    description: 'Youthful barbershop in Kurunegala City known for scissor cut crops, beard fading, and grooming.',
    categories: ['barber', 'hair'],
    genderType: 'gents',
    district: 'kurunegala',
    city: 'Kurunegala City',
    address: '62 Colombo Road, Kurunegala',
    lat: 7.4863,
    lng: 80.3623,
    phone: '+94 37 222 4921',
    whatsapp: '+94 77 492 1093',
    email: 'goldenscissors@gmail.com',
    instagram: 'goldenscissors_kru',
    facebook: 'goldenscissorskurunegala',
    logoUrl: '/logos/golden-scissors.svg',
    bannerUrl: SALON_BANNERS[1],
    galleryImages: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    ],
    priceTier: 'budget',
    status: 'approved',
    isFeatured: false,
    avgRating: 4.58,
    reviewCount: 21,
    billingCode: 'GOLDENSCIS-4921',
    plan: 'free',
    planExpiresAt: null,
    trialEndsAt: null,
    autoConfirm: true,
    minLeadHours: 1,
    maxAdvanceDays: 14,
    cancellationHours: 2,
    monthlyBookingsCount: 22,
    staff: [
      { id: 'st-16-1', name: 'Asela Dissanayake', role: 'Barber', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
    ],
    services: [
      { id: 'srv-16-1', name: 'Youth Trend Fade Cut', category: 'barber', description: 'Skin fade with matte pomade styling.', durationMin: 35, priceLkr: 1200, kind: 'service' },
      { id: 'srv-16-2', name: 'Beard Trimming & Shave', category: 'barber', description: 'Beard outline razor and mustache trim.', durationMin: 20, priceLkr: 700, kind: 'service' },
    ],
    hours: DEFAULT_HOURS,
    reviews: [
      { id: 'rev-16-1', customerName: 'Danushka Madushanka', rating: 5, comment: 'Great haircut, friendly guy and good music.', createdAt: '2026-10-04T12:00:00Z' },
    ],
  },
  {
    id: 'salon-17',
    slug: 'jaffna-heritage-bridal',
    name: 'Jaffna Heritage Bridal & Salon',
    tagline: 'Traditional South Indian bridal makeup & Koorai saree drape in Jaffna Town',
    description: 'Premier bridal and beauty studio in Jaffna, renowned for traditional Tamil bridal dressing, temple jewelry setting, and jasmine garlands.',
    categories: ['bridal', 'makeup'],
    genderType: 'ladies',
    district: 'jaffna',
    city: 'Jaffna Town',
    address: '114 Stanley Road, Jaffna',
    lat: 9.6615,
    lng: 80.0255,
    phone: '+94 21 222 7193',
    whatsapp: '+94 77 719 3840',
    email: 'jaffnaheritage@gmail.com',
    instagram: 'jaffnaheritage_bridal',
    facebook: 'jaffnaheritagebridal',
    logoUrl: '/logos/jaffna-heritage.svg',
    bannerUrl: SALON_BANNERS[2],
    galleryImages: [
      'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
    ],
    priceTier: 'mid',
    status: 'approved',
    isFeatured: false,
    avgRating: 4.67,
    reviewCount: 23,
    billingCode: 'JAFFNAHER-7193',
    plan: 'free',
    planExpiresAt: null,
    trialEndsAt: null,
    autoConfirm: true,
    minLeadHours: 4,
    maxAdvanceDays: 60,
    cancellationHours: 12,
    monthlyBookingsCount: 17,
    staff: [
      { id: 'st-17-1', name: 'Priya Rajendran', role: 'Bridal Master', photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
    ],
    services: [
      { id: 'srv-17-1', name: 'South Indian Koorai Bridal Package', category: 'bridal', description: 'Authentic temple silk drape, long plait braid decoration & gold temple jewellery.', durationMin: 210, priceLkr: 75000, kind: 'package', includes: ['Koorai Saree Drape', 'Jasmine Flower Setting', 'Jewellery Setting'] },
      { id: 'srv-17-2', name: 'Engagement HD Makeup', category: 'makeup', description: 'Sweat-resistant bridal glam with long-wear base.', durationMin: 75, priceLkr: 14000, kind: 'service' },
    ],
    hours: DEFAULT_HOURS,
    reviews: [
      { id: 'rev-17-1', customerName: 'Keerthana Sivalingam', rating: 5, comment: 'Priya akka did my bridal saree and it stayed in place all through the ceremony!', createdAt: '2026-10-02T10:30:00Z' },
    ],
  },
  {
    id: 'salon-18',
    slug: 'kingdom-glow-beauty',
    name: 'Kingdom Glow Beauty Care',
    tagline: 'Herbal facials, threading & hair dressing in Anuradhapura New Town',
    description: 'Gentle aesthetic care in historic Anuradhapura. Natural herbal skincare, threading, and relaxing hair conditioning.',
    categories: ['facial', 'hair'],
    genderType: 'ladies',
    district: 'anuradhapura',
    city: 'New Town',
    address: '28 Maithripala Senanayake Mawatha, Anuradhapura',
    lat: 8.3114,
    lng: 80.4037,
    phone: '+94 25 222 1284',
    whatsapp: '+94 77 128 4902',
    email: 'kingdomglow@gmail.com',
    instagram: 'kingdomglow_anp',
    facebook: 'kingdomglowbeauty',
    logoUrl: '/logos/kingdom-glow.svg',
    bannerUrl: SALON_BANNERS[3],
    galleryImages: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    ],
    priceTier: 'budget',
    status: 'approved',
    isFeatured: false,
    avgRating: 4.42,
    reviewCount: 13,
    billingCode: 'KINGDOMGLW-1284',
    plan: 'free',
    planExpiresAt: null,
    trialEndsAt: null,
    autoConfirm: true,
    minLeadHours: 1,
    maxAdvanceDays: 14,
    cancellationHours: 2,
    monthlyBookingsCount: 12,
    staff: [
      { id: 'st-18-1', name: 'Chamila Senarath', role: 'Beautician', photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
    ],
    services: [
      { id: 'srv-18-1', name: 'Ayurvedic Aloe Vera Facial', category: 'facial', description: 'Fresh aloe vera and sandalwood extract mask for cooling sun-stressed skin.', durationMin: 45, priceLkr: 3000, kind: 'service' },
      { id: 'srv-18-2', name: 'Hair Wash & Straight Blow Dry', category: 'hair', description: 'Conditioning wash and thermal straight finish.', durationMin: 35, priceLkr: 2000, kind: 'service' },
    ],
    hours: DEFAULT_HOURS,
    reviews: [
      { id: 'rev-18-1', customerName: 'Achini Wijeratne', rating: 4, comment: 'Very refreshing facial after a hot day in Anuradhapura.', createdAt: '2026-10-01T15:00:00Z' },
    ],
  },
  {
    id: 'salon-19',
    slug: 'gem-city-barber-lounge',
    name: 'Gem City Barber Lounge',
    tagline: 'Razor shaves, modern cuts & scalp therapy in Ratnapura Town',
    description: 'Premier men’s salon in the heart of Ratnapura gem city. Relaxing scalp treatments, hot towels, and clean razor cuts.',
    categories: ['barber'],
    genderType: 'gents',
    district: 'ratnapura',
    city: 'Ratnapura Town',
    address: '53 Main Street, Ratnapura',
    lat: 6.6828,
    lng: 80.4036,
    phone: '+94 45 222 3849',
    whatsapp: '+94 77 384 9102',
    email: 'gemcitybarber@gmail.com',
    instagram: 'gemcitybarber_sl',
    facebook: 'gemcitybarbershop',
    logoUrl: '/logos/gem-city.svg',
    bannerUrl: SALON_BANNERS[4],
    galleryImages: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    ],
    priceTier: 'budget',
    status: 'approved',
    isFeatured: false,
    avgRating: 4.52,
    reviewCount: 17,
    billingCode: 'GEMCITY-3849',
    plan: 'free',
    planExpiresAt: null,
    trialEndsAt: null,
    autoConfirm: true,
    minLeadHours: 1,
    maxAdvanceDays: 14,
    cancellationHours: 2,
    monthlyBookingsCount: 15,
    staff: [
      { id: 'st-19-1', name: 'Prasad Gamage', role: 'Barber', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
    ],
    services: [
      { id: 'srv-19-1', name: 'Executive Haircut & Beard Sculpt', category: 'barber', description: 'Scissor texturizing, line up, and eucalyptus hot towel.', durationMin: 40, priceLkr: 1800, kind: 'service' },
      { id: 'srv-19-2', name: 'Anti-Dandruff Scalp Treatment', category: 'barber', description: 'Tea tree oil scalp scrub and cool rinse.', durationMin: 30, priceLkr: 1500, kind: 'service' },
    ],
    hours: DEFAULT_HOURS,
    reviews: [
      { id: 'rev-19-1', customerName: 'Nuwan Jayamaha', rating: 5, comment: 'Fast, crisp beard line up. Best in Ratnapura.', createdAt: '2026-09-30T16:15:00Z' },
    ],
  },
  {
    id: 'salon-20',
    slug: 'classic-touch-unisex-salon',
    name: 'Classic Touch Unisex Salon',
    tagline: 'Quality haircare, threading & party dressing in Kelaniya',
    description: 'Neighborhood unisex salon close to Kelaniya Raja Maha Vihara. Professional hair coloring, blow dries, and grooming.',
    categories: ['hair', 'facial'],
    genderType: 'unisex',
    district: 'gampaha',
    city: 'Kelaniya',
    address: '92 Biyagama Road, Kelaniya',
    lat: 6.9538,
    lng: 79.9169,
    phone: '+94 11 291 5519',
    whatsapp: '+94 77 551 9284',
    email: 'classictouch@gmail.com',
    instagram: 'classictouch_kelaniya',
    facebook: 'classictouchkelaniya',
    logoUrl: '/logos/classic-touch.svg',
    bannerUrl: SALON_BANNERS[5],
    galleryImages: [
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80',
    ],
    priceTier: 'budget',
    status: 'approved',
    isFeatured: false,
    avgRating: 4.31,
    reviewCount: 12,
    billingCode: 'CLASSICTCH-5519',
    plan: 'free',
    planExpiresAt: null,
    trialEndsAt: null,
    autoConfirm: true,
    minLeadHours: 1,
    maxAdvanceDays: 14,
    cancellationHours: 2,
    monthlyBookingsCount: 8,
    staff: [
      { id: 'st-20-1', name: 'Sumudu Perera', role: 'Stylist', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    ],
    services: [
      { id: 'srv-20-1', name: 'Ladies & Gents Regular Cut', category: 'hair', description: 'Clean hair trimming and styling.', durationMin: 30, priceLkr: 1400, kind: 'service' },
      { id: 'srv-20-2', name: 'Deep Conditioning Hair Mask', category: 'hair', description: 'Keratin mask to restore softness.', durationMin: 35, priceLkr: 2500, kind: 'service' },
    ],
    hours: DEFAULT_HOURS,
    reviews: [
      { id: 'rev-20-1', customerName: 'Hasitha Wickramasinghe', rating: 4, comment: 'Nice local salon with very fair prices.', createdAt: '2026-09-28T11:20:00Z' },
    ],
  },
];

// 60 Sri Lankan Customer Profiles
export const DEMO_CUSTOMERS = [
  { name: 'Kavindi Wickremasinghe', email: 'kavindi.w@gmail.com', phone: '+94 77 234 5678' },
  { name: 'Shehan De Silva', email: 'shehan.desilva@yahoo.com', phone: '+94 71 891 2345' },
  { name: 'Fathima Rizwan', email: 'fathima.rizwan@outlook.com', phone: '+94 76 543 2190' },
  { name: 'Arjun Nallathamby', email: 'arjun.nallathamby@gmail.com', phone: '+94 77 819 2834' },
  { name: 'Dilani Samarawickrama', email: 'dilani.samara@gmail.com', phone: '+94 70 345 6789' },
  { name: 'Chathurika Herath', email: 'chathurika.h@hotmail.com', phone: '+94 75 901 2345' },
  { name: 'David Sterling', email: 'david.sterling@gmail.com', phone: '+94 77 112 3344' },
  { name: 'Natasha Gooneratne', email: 'natasha.g@gmail.com', phone: '+94 71 445 5667' },
  { name: 'Lakmal Gunawardena', email: 'lakmal.g@yahoo.com', phone: '+94 76 778 8990' },
  { name: 'Nimesha Perera', email: 'nimesha.perera@gmail.com', phone: '+94 77 990 0112' },
  { name: 'Sunil Weerakkody', email: 'sunil.w@gmail.com', phone: '+94 72 334 4556' },
  { name: 'Christina Cooray', email: 'christina.c@gmail.com', phone: '+94 78 556 6778' },
  { name: 'Rashmi Senevirathne', email: 'rashmi.s@gmail.com', phone: '+94 70 123 4567' },
  { name: 'Pradeep Ranasinghe', email: 'pradeep.r@gmail.com', phone: '+94 77 654 3210' },
  { name: 'Sashika Lokuge', email: 'sashika.l@gmail.com', phone: '+94 71 987 6543' },
  { name: 'Devika Abeyratne', email: 'devika.a@gmail.com', phone: '+94 76 321 0987' },
  { name: 'Danushka Madushanka', email: 'danushka.m@gmail.com', phone: '+94 75 432 1098' },
  { name: 'Keerthana Sivalingam', email: 'keerthana.s@gmail.com', phone: '+94 77 876 5432' },
  { name: 'Achini Wijeratne', email: 'achini.w@gmail.com', phone: '+94 70 987 1234' },
  { name: 'Nuwan Jayamaha', email: 'nuwan.j@gmail.com', phone: '+94 71 234 9876' },
  { name: 'Hasitha Wickramasinghe', email: 'hasitha.w@gmail.com', phone: '+94 78 345 8765' },
  { name: 'Ayesha Mohamed', email: 'ayesha.m@gmail.com', phone: '+94 76 123 7890' },
  { name: 'Thilina Bandara', email: 'thilina.b@gmail.com', phone: '+94 77 456 1230' },
  { name: 'Sanduni Jayawardena', email: 'sanduni.j@gmail.com', phone: '+94 71 789 4561' },
  { name: 'Ravi Subramaniam', email: 'ravi.subra@gmail.com', phone: '+94 75 890 2341' },
  { name: 'Ishani Karunaratne', email: 'ishani.k@gmail.com', phone: '+94 70 234 5671' },
  { name: 'Dinesh Rodrigo', email: 'dinesh.r@gmail.com', phone: '+94 72 345 6782' },
  { name: 'Malithi Fernando', email: 'malithi.f@gmail.com', phone: '+94 77 567 8903' },
  { name: 'Kasun Rajapaksa', email: 'kasun.r@gmail.com', phone: '+94 76 678 9014' },
  { name: 'Zahra Cassim', email: 'zahra.c@gmail.com', phone: '+94 71 789 0125' },
  { name: 'Janith Dissanayake', email: 'janith.d@gmail.com', phone: '+94 78 890 1236' },
  { name: 'Pavithra Kumar', email: 'pavithra.k@gmail.com', phone: '+94 75 901 2347' },
  { name: 'Gayani Gunasekara', email: 'gayani.g@gmail.com', phone: '+94 70 012 3458' },
  { name: 'Chaminda Alwis', email: 'chaminda.a@gmail.com', phone: '+94 72 123 4569' },
  { name: 'Harini Senanayake', email: 'harini.s@gmail.com', phone: '+94 77 234 5670' },
  { name: 'Mohamed Farook', email: 'm.farook@gmail.com', phone: '+94 76 345 6781' },
  { name: 'Nilmini Jayasooriya', email: 'nilmini.j@gmail.com', phone: '+94 71 456 7892' },
  { name: 'Suresh Pillai', email: 'suresh.p@gmail.com', phone: '+94 78 567 8903' },
  { name: 'Buddhika Silva', email: 'buddhika.s@gmail.com', phone: '+94 75 678 9014' },
  { name: 'Sachini Madurangi', email: 'sachini.m@gmail.com', phone: '+94 70 789 0125' },
  { name: 'Ashen Jayatilleke', email: 'ashen.j@gmail.com', phone: '+94 72 890 1236' },
  { name: 'Ruvini Weerasinghe', email: 'ruvini.w@gmail.com', phone: '+94 77 901 2347' },
  { name: 'Irfan Nazeer', email: 'irfan.n@gmail.com', phone: '+94 76 012 3458' },
  { name: 'Nirosha Dharmasena', email: 'nirosha.d@gmail.com', phone: '+94 71 123 4569' },
  { name: 'Karthik Sivakumar', email: 'karthik.s@gmail.com', phone: '+94 78 234 5670' },
  { name: 'Dulani Mendis', email: 'dulani.m@gmail.com', phone: '+94 75 345 6781' },
  { name: 'Gayan Weerakkody', email: 'gayan.w@gmail.com', phone: '+94 70 456 7892' },
  { name: 'Anuradha Fonseka', email: 'anuradha.f@gmail.com', phone: '+94 72 567 8903' },
  { name: 'Tharindu Rathnayake', email: 'tharindu.r@gmail.com', phone: '+94 77 678 9014' },
  { name: 'Shabnam Feroze', email: 'shabnam.f@gmail.com', phone: '+94 76 789 0125' },
  { name: 'Maneesha Kulatunga', email: 'maneesha.k@gmail.com', phone: '+94 71 890 1236' },
  { name: 'Vithuran Vigneswaran', email: 'vithuran.v@gmail.com', phone: '+94 78 901 2347' },
  { name: 'Oshadi Liyanage', email: 'oshadi.l@gmail.com', phone: '+94 75 012 3458' },
  { name: 'Chathura Somaratne', email: 'chathura.s@gmail.com', phone: '+94 70 123 4569' },
  { name: 'Pooja Tharmalingam', email: 'pooja.t@gmail.com', phone: '+94 72 234 5670' },
  { name: 'Sameera Hettiarachchi', email: 'sameera.h@gmail.com', phone: '+94 77 345 6781' },
  { name: 'Shirani Wickramaratne', email: 'shirani.w@gmail.com', phone: '+94 76 456 7892' },
  { name: 'Imran Junaid', email: 'imran.j@gmail.com', phone: '+94 71 567 8903' },
  { name: 'Geethani Samaranayake', email: 'geethani.s@gmail.com', phone: '+94 78 678 9014' },
  { name: 'Prashan Abeysekara', email: 'prashan.a@gmail.com', phone: '+94 75 789 0125' },
];

// Seeded HNB Subscription Payments
export const DEMO_PAYMENTS: DemoPayment[] = [
  // Approved Pro Salons
  {
    id: 'pay-1',
    salonId: 'salon-1',
    salonName: 'Salon Costume',
    billingCode: 'SALONCOSTUME-4821',
    plan: 'pro',
    months: 3,
    amountLkr: 5400,
    status: 'approved',
    referenceCode: 'SALONCOSTUME-4821',
    payerName: 'Rohan Jayasuriya',
    transferDate: '2026-09-15',
    bankReference: 'HNB-TXN-8819234',
    receiptUrl: '/receipts/demo-receipt-1.svg',
    ownerNote: 'Quarterly payment for Salon Costume Colombo 07',
    submittedAt: '2026-09-15T09:30:00Z',
    reviewedAt: '2026-09-15T11:15:00Z',
  },
  {
    id: 'pay-2',
    salonId: 'salon-2',
    salonName: 'Aura Lounge & Spa',
    billingCode: 'AURALOUNGE-1934',
    plan: 'pro',
    months: 1,
    amountLkr: 2000,
    status: 'approved',
    referenceCode: 'AURALOUNGE-1934',
    payerName: 'Shalini Fernando',
    transferDate: '2026-10-01',
    bankReference: 'HNB-ONLINE-992144',
    receiptUrl: '/receipts/demo-receipt-2.svg',
    ownerNote: 'October Pro subscription',
    submittedAt: '2026-10-01T08:45:00Z',
    reviewedAt: '2026-10-01T09:30:00Z',
  },
  {
    id: 'pay-3',
    salonId: 'salon-3',
    salonName: 'The Urban Barber Co.',
    billingCode: 'URBANBARBER-7261',
    plan: 'pro',
    months: 12,
    amountLkr: 19200,
    status: 'approved',
    referenceCode: 'URBANBARBER-7261',
    payerName: 'Malik Jayawardena',
    transferDate: '2026-08-20',
    bankReference: 'HNB-CORP-441920',
    receiptUrl: '/receipts/demo-receipt-3.svg',
    ownerNote: 'Annual subscription with 20% discount',
    submittedAt: '2026-08-20T14:10:00Z',
    reviewedAt: '2026-08-20T15:00:00Z',
  },
  {
    id: 'pay-4',
    salonId: 'salon-4',
    salonName: 'Crown & Veil Bridal Studio',
    billingCode: 'CROWNVEIL-8812',
    plan: 'pro',
    months: 12,
    amountLkr: 19200,
    status: 'approved',
    referenceCode: 'CROWNVEIL-8812',
    payerName: 'Manori Wijesinghe',
    transferDate: '2026-07-10',
    bankReference: 'HNB-FT-551928',
    receiptUrl: '/receipts/demo-receipt-4.svg',
    submittedAt: '2026-07-10T10:20:00Z',
    reviewedAt: '2026-07-10T11:45:00Z',
  },
  {
    id: 'pay-5',
    salonId: 'salon-5',
    salonName: 'Kandy Royal Hair Studio',
    billingCode: 'KANDYROYAL-5521',
    plan: 'pro',
    months: 3,
    amountLkr: 5400,
    status: 'approved',
    referenceCode: 'KANDYROYAL-5521',
    payerName: 'Nuwan Kumara',
    transferDate: '2026-09-28',
    bankReference: 'HNB-ATM-119203',
    receiptUrl: '/receipts/demo-receipt-5.svg',
    submittedAt: '2026-09-28T16:00:00Z',
    reviewedAt: '2026-09-28T17:15:00Z',
  },
  {
    id: 'pay-6',
    salonId: 'salon-6',
    salonName: 'Galle Fort Grooming Club',
    billingCode: 'GALLEFORT-9012',
    plan: 'pro',
    months: 3,
    amountLkr: 5400,
    status: 'approved',
    referenceCode: 'GALLEFORT-9012',
    payerName: 'Tariq Mansoor',
    transferDate: '2026-09-18',
    bankReference: 'HNB-GALLE-338291',
    receiptUrl: '/receipts/demo-receipt-6.svg',
    submittedAt: '2026-09-18T13:30:00Z',
    reviewedAt: '2026-09-18T14:15:00Z',
  },
  // 2 Payments PENDING REVIEW (To demonstrate the Admin Verification Queue)
  {
    id: 'pay-pending-1',
    salonId: 'salon-9',
    salonName: 'Luxe Looks Hair Studio',
    billingCode: 'LUXELOOKS-4190',
    plan: 'pro',
    months: 1,
    amountLkr: 2000,
    status: 'pending_review',
    referenceCode: 'LUXELOOKS-4190',
    payerName: 'Sanduni Rathne',
    transferDate: new Date(Date.now() - 1000 * 60 * 120).toISOString().split('T')[0],
    bankReference: 'HNB-MB-902148',
    receiptUrl: '/receipts/demo-receipt-pending.svg',
    ownerNote: 'Upgrading to Pro because we hit our 27 booking cap. Transferred via HNB Mobile app.',
    submittedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'pay-pending-2',
    salonId: 'salon-10',
    salonName: 'Signature Cuts Barber',
    billingCode: 'SIGNCUTS-3810',
    plan: 'pro',
    months: 3,
    amountLkr: 5400,
    status: 'pending_review',
    referenceCode: 'SIGNCUTS-3810',
    payerName: 'Kamal Jayalath',
    transferDate: new Date(Date.now() - 1000 * 60 * 45).toISOString().split('T')[0],
    bankReference: 'HNB-DEP-771920',
    receiptUrl: undefined, // TYPED DETAILS ONLY to satisfy requirement
    ownerNote: 'Deposited cash at Gampaha HNB branch counter. Reference: SIGNCUTS-3810.',
    submittedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  // 1 Rejected Payment with reason
  {
    id: 'pay-rejected-1',
    salonId: 'salon-11',
    salonName: 'Lotus Blossom Bridal',
    billingCode: 'LOTUSBRIDAL-7721',
    plan: 'pro',
    months: 1,
    amountLkr: 2000,
    status: 'rejected',
    referenceCode: 'LOTUSBRIDAL-7721',
    payerName: 'Mary Fernando',
    transferDate: '2026-10-14',
    bankReference: 'UNKNOWN-0000',
    receiptUrl: '/receipts/demo-receipt-rejected.svg',
    ownerNote: 'Transferred from Commercial Bank',
    submittedAt: '2026-10-14T09:00:00Z',
    reviewedAt: '2026-10-14T11:00:00Z',
    rejectReason: 'Payment reference code LOTUSBRIDAL-7721 not found in HNB statement. Please check the reference number and resubmit.',
  },
];

/**
 * Generate 700 rolling bookings relative to today
 */
export function generateRollingBookings(): DemoBooking[] {
  const bookings: DemoBooking[] = [];
  const now = new Date();
  let bookingIdCounter = 1;

  DEMO_SALONS.forEach((salon) => {
    const isPro = salon.plan === 'pro';
    // Free salons have monthly cap <= 30
    const bookingsCount = isPro ? 40 : Math.min(salon.monthlyBookingsCount, 28);
    const staffList = salon.staff;
    const servicesList = salon.services;

    for (let i = 0; i < bookingsCount; i++) {
      // Distribute from -30 days to +25 days
      const dayOffset = Math.floor((i / bookingsCount) * 55) - 30;
      const bookingDate = new Date(now.getTime() + dayOffset * 24 * 60 * 60 * 1000);
      
      // Select staff
      const staff = staffList[i % staffList.length] || { id: 'st-any', name: 'Any Available' };
      // Select customer
      const customer = DEMO_CUSTOMERS[(bookingIdCounter + i) % DEMO_CUSTOMERS.length];
      // Select service
      const service = servicesList[i % servicesList.length] || servicesList[0];

      // Time between 9:00 and 18:00
      const hour = 9 + (i % 9);
      const minute = (i % 2) * 30;
      bookingDate.setHours(hour, minute, 0, 0);

      const startsAt = bookingDate.toISOString();
      const endsAt = new Date(bookingDate.getTime() + service.durationMin * 60 * 1000).toISOString();

      let status: DemoBooking['status'] = 'confirmed';
      if (dayOffset < 0) {
        // Past bookings: 80% completed, 8% cancelled, 4% no_show, rest confirmed
        const r = (i * 17) % 100;
        if (r < 80) status = 'completed';
        else if (r < 88) status = 'cancelled';
        else if (r < 92) status = 'no_show';
        else status = 'completed';
      } else if (dayOffset === 0) {
        status = 'confirmed';
      } else {
        status = (i % 5 === 0) ? 'pending' : 'confirmed';
      }

      bookings.push({
        id: `bkg-${bookingIdCounter++}`,
        reference: `GB-${(100000 + bookingIdCounter).toString(36).toUpperCase()}`,
        salonId: salon.id,
        staffId: staff.id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        startsAt,
        endsAt,
        status,
        paymentStatus: status === 'completed' ? 'paid' : 'pay_at_salon',
        totalLkr: service.priceLkr,
        serviceNames: [service.name],
        notes: i % 4 === 0 ? 'First time client, excited!' : undefined,
      });
    }
  });

  return bookings;
}

export const DEMO_BOOKINGS = generateRollingBookings();


// Aggregated reviews across all salons
export const DEMO_REVIEWS = DEMO_SALONS.flatMap((s) =>
  s.reviews.map((r) => ({
    ...r,
    salonId: s.id,
    salon_id: s.id,
    customer_name: r.customerName,
    created_at: r.createdAt,
    owner_reply: r.ownerReply,
  }))
);

// Aliases for convenient importing across features
export const demoSalons = DEMO_SALONS;
export const demoBookings = DEMO_BOOKINGS;
export const demoPayments = DEMO_PAYMENTS;
export const demoReviews = DEMO_REVIEWS;

