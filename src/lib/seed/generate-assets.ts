import fs from 'fs';
import path from 'path';

const logosDir = path.join(process.cwd(), 'public', 'logos');
const receiptsDir = path.join(process.cwd(), 'public', 'receipts');

if (!fs.existsSync(logosDir)) fs.mkdirSync(logosDir, { recursive: true });
if (!fs.existsSync(receiptsDir)) fs.mkdirSync(receiptsDir, { recursive: true });

// Glowbook Brand Logo
const glowbookLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60">
  <defs>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B6CF6" />
      <stop offset="100%" stop-color="#5B3FD1" />
    </linearGradient>
  </defs>
  <rect x="6" y="8" width="44" height="44" rx="14" fill="url(#glowGrad)" />
  <path d="M28 17 L30.5 24 L37.5 25 L32 30 L33.5 37 L28 33.5 L22.5 37 L24 30 L18.5 25 L25.5 24 Z" fill="#FFFFFF" />
  <text x="62" y="38" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="#1E1B2E" letter-spacing="-0.5">Glow<tspan fill="#8B6CF6">book</tspan></text>
  <circle cx="218" cy="22" r="3" fill="#F5B942" />
</svg>`;
fs.writeFileSync(path.join(logosDir, 'glowbook-logo.svg'), glowbookLogoSvg);

// Generate Salon SVG Monograms
const salonLogos = [
  { file: 'salon-costume.svg', initials: 'SC', name: 'Salon Costume', bg: '#8B6CF6' },
  { file: 'aura-lounge.svg', initials: 'AL', name: 'Aura Lounge', bg: '#7A57E8' },
  { file: 'urban-barber.svg', initials: 'UB', name: 'Urban Barber', bg: '#1E1B2E' },
  { file: 'crown-veil.svg', initials: 'CV', name: 'Crown & Veil', bg: '#5B3FD1' },
  { file: 'kandy-royal.svg', initials: 'KR', name: 'Kandy Royal', bg: '#8B6CF6' },
  { file: 'galle-fort.svg', initials: 'GF', name: 'Galle Fort', bg: '#2D2942' },
  { file: 'velvet-touch.svg', initials: 'VT', name: 'Velvet Touch', bg: '#9E77ED' },
  { file: 'serendib-glow.svg', initials: 'SG', name: 'Serendib Glow', bg: '#059669' },
  { file: 'luxe-looks.svg', initials: 'LL', name: 'Luxe Looks', bg: '#6B6785' },
  { file: 'signature-cuts.svg', initials: 'SC', name: 'Signature Cuts', bg: '#423D5F' },
  { file: 'lotus-blossom.svg', initials: 'LB', name: 'Lotus Blossom', bg: '#DB2777' },
  { file: 'elegance-nail.svg', initials: 'EN', name: 'Elegance Nail', bg: '#8B5CF6' },
  { file: 'misty-hills.svg', initials: 'MH', name: 'Misty Hills', bg: '#0D9488' },
  { file: 'southern-breeze.svg', initials: 'SB', name: 'Southern Breeze', bg: '#2563EB' },
  { file: 'fortress.svg', initials: 'FB', name: 'Fortress Beauty', bg: '#D97706' },
  { file: 'golden-scissors.svg', initials: 'GS', name: 'Golden Scissors', bg: '#B45309' },
  { file: 'jaffna-heritage.svg', initials: 'JH', name: 'Jaffna Heritage', bg: '#DC2626' },
  { file: 'kingdom-glow.svg', initials: 'KG', name: 'Kingdom Glow', bg: '#7C3AED' },
  { file: 'gem-city.svg', initials: 'GC', name: 'Gem City', bg: '#4338CA' },
  { file: 'classic-touch.svg', initials: 'CT', name: 'Classic Touch', bg: '#475569' },
];

salonLogos.forEach((l) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="30" fill="${l.bg}" />
  <circle cx="50" cy="50" r="38" fill="none" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="2" />
  <text x="50" y="58" font-family="system-ui, sans-serif" font-size="34" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">${l.initials}</text>
</svg>`;
  fs.writeFileSync(path.join(logosDir, l.file), svg);
});

// Generate Mock Bank Receipts (Watermarked "DEMO RECEIPT")
function generateReceiptSvg(ref: string, amount: string, date: string, payer: string, status: string, code: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700" width="500" height="700">
  <rect width="500" height="700" fill="#FAF8FF" />
  <rect x="20" y="20" width="460" height="660" rx="16" fill="#FFFFFF" stroke="#E4D9FF" stroke-width="2" />
  
  <!-- HNB Header -->
  <rect x="20" y="20" width="460" height="90" rx="16" fill="#5B3FD1" />
  <text x="50" y="60" font-family="sans-serif" font-size="22" font-weight="bold" fill="#FFFFFF">HATTON NATIONAL BANK</text>
  <text x="50" y="85" font-family="sans-serif" font-size="14" fill="#E4D9FF">CUSTOMER PAYMENT ADVICE / TRANSFER RECEIPT</text>
  
  <!-- Watermark -->
  <g transform="translate(250, 370) rotate(-35)">
    <text x="0" y="0" font-family="sans-serif" font-size="52" font-weight="900" fill="#8B6CF6" fill-opacity="0.12" text-anchor="middle" letter-spacing="4">DEMO RECEIPT</text>
    <text x="0" y="45" font-family="sans-serif" font-size="24" font-weight="700" fill="#8B6CF6" fill-opacity="0.12" text-anchor="middle">GLOWBOOK LK VERIFIED</text>
  </g>

  <!-- Details Table -->
  <g font-family="sans-serif" font-size="14" fill="#1E1B2E">
    <text x="60" y="160" font-weight="bold" fill="#6B6785">TRANSACTION STATUS:</text>
    <text x="240" y="160" font-weight="bold" fill="#10B981">${status.toUpperCase()}</text>

    <text x="60" y="200" font-weight="bold" fill="#6B6785">TRANSFER REFERENCE:</text>
    <text x="240" y="200" font-weight="bold" fill="#5B3FD1">${ref}</text>

    <text x="60" y="240" font-weight="bold" fill="#6B6785">BILLING CODE:</text>
    <text x="240" y="240" font-weight="bold" fill="#8B6CF6">${code}</text>

    <text x="60" y="280" font-weight="bold" fill="#6B6785">BENEFICIARY:</text>
    <text x="240" y="280">Glowbook LK Tech (Pvt) Ltd</text>

    <text x="60" y="320" font-weight="bold" fill="#6B6785">BENEFICIARY ACCT:</text>
    <text x="240" y="320">SAMPLE-0089-XXXX-4812 (HNB)</text>

    <text x="60" y="360" font-weight="bold" fill="#6B6785">PAYER NAME:</text>
    <text x="240" y="360">${payer}</text>

    <text x="60" y="400" font-weight="bold" fill="#6B6785">TRANSFER DATE:</text>
    <text x="240" y="400">${date}</text>

    <line x1="60" y1="440" x2="440" y2="440" stroke="#E8E3F5" stroke-width="1" />

    <text x="60" y="490" font-size="18" font-weight="bold" fill="#1E1B2E">TOTAL AMOUNT:</text>
    <text x="240" y="490" font-size="24" font-weight="800" fill="#5B3FD1">LKR ${amount}</text>

    <rect x="60" y="530" width="380" height="90" rx="8" fill="#FAF8FF" stroke="#E4D9FF" />
    <text x="80" y="560" font-size="12" fill="#6B6785">Hatton National Bank PLC · Colombo 03 Branch</text>
    <text x="80" y="582" font-size="12" fill="#6B6785">Electronically verified for Glowbook Pro Subscription</text>
    <text x="80" y="604" font-size="11" fill="#9E9AA8">Ref ID: HNB-${Math.floor(10000000 + Math.random() * 90000000)} · UTC+05:30</text>
  </g>
</svg>`;
}

fs.writeFileSync(path.join(receiptsDir, 'demo-receipt-1.svg'), generateReceiptSvg('HNB-TXN-8819234', '5,400', '2026-09-15', 'Rohan Jayasuriya', 'SUCCESSFUL', 'SALONCOSTUME-4821'));
fs.writeFileSync(path.join(receiptsDir, 'demo-receipt-2.svg'), generateReceiptSvg('HNB-ONLINE-992144', '2,000', '2026-10-01', 'Shalini Fernando', 'SUCCESSFUL', 'AURALOUNGE-1934'));
fs.writeFileSync(path.join(receiptsDir, 'demo-receipt-3.svg'), generateReceiptSvg('HNB-CORP-441920', '19,200', '2026-08-20', 'Malik Jayawardena', 'SUCCESSFUL', 'URBANBARBER-7261'));
fs.writeFileSync(path.join(receiptsDir, 'demo-receipt-4.svg'), generateReceiptSvg('HNB-FT-551928', '19,200', '2026-07-10', 'Manori Wijesinghe', 'SUCCESSFUL', 'CROWNVEIL-8812'));
fs.writeFileSync(path.join(receiptsDir, 'demo-receipt-5.svg'), generateReceiptSvg('HNB-ATM-119203', '5,400', '2026-09-28', 'Nuwan Kumara', 'SUCCESSFUL', 'KANDYROYAL-5521'));
fs.writeFileSync(path.join(receiptsDir, 'demo-receipt-6.svg'), generateReceiptSvg('HNB-GALLE-338291', '5,400', '2026-09-18', 'Tariq Mansoor', 'SUCCESSFUL', 'GALLEFORT-9012'));
fs.writeFileSync(path.join(receiptsDir, 'demo-receipt-pending.svg'), generateReceiptSvg('HNB-MB-902148', '2,000', new Date().toISOString().split('T')[0], 'Sanduni Rathne', 'PENDING VERIFICATION', 'LUXELOOKS-4190'));
fs.writeFileSync(path.join(receiptsDir, 'demo-receipt-rejected.svg'), generateReceiptSvg('UNKNOWN-0000', '2,000', '2026-10-14', 'Mary Fernando', 'UNMATCHED REFERENCE', 'LOTUSBRIDAL-7721'));

console.log('Successfully generated Glowbook logo, 20 salon monograms and 8 demo receipts in public directory.');
