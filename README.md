# Glowbook — Sri Lanka's Premier Salon Booking & Management Marketplace 🇱🇰

<div align="center">

![Glowbook Banner](public/images/hero-luxury-salon.jpg)

### **"Search any salon in Sri Lanka and book your appointment easily."**

A production-grade, full-stack marketplace connecting beauty & wellness seekers with salons across Sri Lanka. Built with Next.js 14 App Router, TypeScript (Strict Mode), Tailwind CSS, and Supabase Postgres with full Row-Level Security (RLS).

[![Live Demo](https://img.shields.io/badge/Live%20Demo-glowbook--lk.netlify.app-8B6CF6?style=for-the-badge&logo=netlify&logoColor=white)](https://glowbook-lk.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/dinil2/glowBook.git)

---

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Unit%20Tests%20Passing-FCC72B?style=flat-square&logo=vitest)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 🌐 Live Production Deployment

- **Production URL:** [https://glowbook-lk.netlify.app](https://glowbook-lk.netlify.app)
- **Target Audience:** Sri Lankan customers seeking zero-friction salon appointments, salon owners needing digital business management, and platform operators.
- **Hosting Infrastructure:** Netlify Serverless Edge Functions + Supabase (AWS ap-south-1).

---

## 🎯 The Problem & Vision

In Sri Lanka, booking a salon appointment has traditionally been painful and fragmented:
1. **Customer Frustration:** Clients waste 15–30 minutes calling different salons, messaging on Instagram, or dealing with delayed replies just to verify slot availability.
2. **Salon Inefficiencies:** Salon owners rely on paper notebooks or fragmented WhatsApp chats, leading to double-bookings, high no-show rates, and empty stylist chairs.
3. **Payment Barriers:** Most local SME salon owners do not possess international credit cards for recurring SaaS subscriptions (Stripe/Paddle).

### The Glowbook Solution
- **Zero-Friction Guest Booking:** Customers can search any salon across all 25 districts, view real-time stylist availability, and confirm an appointment in **under 30 seconds** without creating an account or remembering passwords.
- **Turnkey Salon Operating System:** Salon owners get a full self-service hub: live interactive booking calendars, stylist roster scheduling, service tier management, customer CRM, and click-to-chat WhatsApp reminders.
- **Localized Offline Bank Transfer Engine:** Implements a Sri Lankan B2B payment model via **Hatton National Bank (HNB)** bank transfers with unique reference codes, receipt slip uploads, and an admin verification queue.

---

## 🔑 Demo Access & Live Credentials

The platform is pre-seeded with **20 realistic Sri Lankan salons** across Colombo 07, Colombo 03, Kandy, Galle, Negombo, and Nugegoda, featuring live appointments, reviews, and subscription payment records.

Test the platform immediately using any of these seeded personas:

| Role | Email | Password | What You Can Inspect & Test |
|---|---|---|---|
| 👑 **Platform Admin** | `admin@glowbook.lk` | `GlowbookAdmin2026!` | Access `/admin` — inspect live MRR metrics, review pending HNB bank transfer slips with signed URLs, approve/reject subscription upgrades, moderate reviews, and toggle salon approvals. |
| 💎 **Pro Salon Owner** | `costume@glowbook.lk` | `OwnerPass2026!` | Access `/owner` — **Salon Costume (Colombo 07)**. Full access: multi-stylist visual calendar, customer CRM with CSV export, WhatsApp reminder generator, analytics, and active Pro badge. |
| 🌿 **Free Salon Owner** | `luxe@glowbook.lk` | `OwnerPass2026!` | Access `/owner` — **Luxe Hair Studio (Nugegoda)**. Experience feature-gating: 27/30 monthly bookings used (visual soft nudge banner), locked analytics preview, and upgrade modal. |
| ⏱️ **Trial Salon Owner** | `kandy@glowbook.lk` | `OwnerPass2026!` | Access `/owner` — **Royal Crown Salon (Kandy)**. Shows 30-day Pro trial banner, trial expiration date, and seamless transition to paid tiers. |
| 👤 **Customer (Guest)** | *No login needed* | *No password* | Visit the homepage, search salons by district or category, open the booking modal, select services and time slots, and book with SMS/email confirmation. |

---

## 🏗️ Architectural & Engineering Highlights

### 1. Pure Mathematical Slot Allocation Engine (`getAvailableSlots`)
Located in [`src/features/booking/engine.ts`](file:///d:/projects/Saloon%20Hub/src/features/booking/engine.ts):
- Pure functional algorithm with **100% test coverage** via Vitest.
- Accurately computes available booking slots by cross-referencing:
  - Salon opening and closing hours.
  - Mandatory staff lunch break windows.
  - Multi-service cumulative duration stacking (e.g. Haircut 45m + Beard Trim 20m = 65m block).
  - 10-minute sanitation buffers between appointments.
  - Minimum lead hours (e.g., minimum 2 hours advance notice).
  - Maximum advance booking window (e.g., up to 30 days ahead).
  - Auto-assignment for "Any Available Stylist".

### 2. Database-Level Race Condition & Double-Booking Prevention
In [`supabase/migrations/20261027000001_initial_schema.sql`](file:///d:/projects/Saloon%20Hub/supabase/migrations/20261027000001_initial_schema.sql):
- Utilizes PostgreSQL's `btree_gist` extension with an **exclusion constraint** on `(staff_id WITH =, tstzrange(starts_at, ends_at) WITH &&)`.
- Even in high-concurrency scenarios where multiple guests simultaneously click "Book Now" for the same stylist and slot, PostgreSQL rejects the conflicting insert at the storage engine level with an exclusion violation.

### 3. Server-Enforced Contact Privacy (Zero Data Scraping)
Free salons receive platform visibility and digital bookings, but direct contact options (Phone & WhatsApp) are reserved for **Verified Pro** salons:
- Implemented as a secure PostgreSQL database view (`public_salons`):
```sql
CREATE OR REPLACE VIEW public_salons AS
SELECT 
    id, slug, name, tagline, description, categories, district, city, address,
    logo_url, banner_url, price_tier, avg_rating, review_count, is_featured, plan,
    CASE 
        WHEN plan = 'pro' AND (plan_expires_at IS NULL OR plan_expires_at > NOW()) THEN phone
        ELSE NULL 
    END AS phone,
    CASE 
        WHEN plan = 'pro' AND (plan_expires_at IS NULL OR plan_expires_at > NOW()) THEN whatsapp
        ELSE NULL 
    END AS whatsapp
FROM salons
WHERE status = 'approved';
```
- **Security Guarantee:** Free salon contact information is returned as `NULL` at the database wire level. It cannot be scraped or inspected via DevTools network requests.

### 4. Offline HNB Bank Transfer & Idempotent Verification Workflow
Designed around the practical reality of Sri Lankan corporate finance:
1. **Unique Reference Code:** Every registered salon receives an immutable 4-digit billing code (e.g., `SALONCOSTUME-4821`).
2. **Transfer Details:** Salon owners view clear Hatton National Bank (HNB) account instructions with one-click copy buttons for Bank Name, Account Number, Branch, and Reference.
3. **Dual Submission Method:** Owners can either upload a bank transfer receipt slip (stored in a private, encrypted Supabase bucket) or type in their CEFT/SLIPS transfer reference and date.
4. **Admin Queue:** Platform administrators review submitted receipts side-by-side with HNB statements via signed, short-lived URLs.
5. **Atomic Postgres Function:** Approval runs through `approve_subscription_payment(payment_id)`. The function atomically:
   - Sets payment status to `approved`.
   - Extends the salon's `plan_expires_at` by the purchased months (stacking gracefully if already active).
   - Upgrades plan to `pro`.
   - Inserts a record into `audit_logs`.
   - Generates an in-app owner notification.
   - **Idempotency Guarantee:** Calling approval multiple times will never double-extend or corrupt billing timelines.

### 5. Single Source of Truth for Feature Gating
All tier entitlements and limits are centralized in [`src/features/billing/plans.ts`](file:///d:/projects/Saloon%20Hub/src/features/billing/plans.ts):
```ts
can(salon, 'customer_stylist_choice') // boolean
can(salon, 'whatsapp_notifications')    // boolean
getLimit(salon, 'max_services')         // 8 (Free) vs Infinity (Pro)
getLimit(salon, 'max_bookings_per_month') // 30 (Free) vs Infinity (Pro)
```
- Eliminates hardcoded `if (plan === 'pro')` conditions throughout UI code.
- Server actions enforce limits before mutating records, preventing client-side bypasses.

---

## 🎨 Design System & User Experience

Designed with a bespoke, editorial aesthetic tailored for wellness and luxury beauty:

- **Color Palette:**
  - Background: Mist (`#FAF8FF`) & Crisp White (`#FFFFFF`)
  - Accent / Primary: Royal Purple (`#8B6CF6`) & Deep Violet (`#5B3FD1`)
  - Soft Surfaces: Lavender Tint (`#F3EEFF` / `#E4D9FF`)
  - Typography: Ink (`#1E1B2E`) & Slate (`#6B6785`)
  - Ratings & Accents: Star Gold (`#F5B942`)
- **Typography:**
  - Headings & Editorial Accents: *Fraunces* (Warm, luxurious serif display font)
  - Interface & Body: *Plus Jakarta Sans* (Geometric, highly readable sans-serif)
- **Motion & Polish:**
  - Micro-interactions powered by Framer Motion (staggered cards, active tab pill indicators, dialog scale-ins).
  - Mobile touch-first navigation featuring a floating bottom tab bar and sheet overlays.
  - Zero placeholder UI: real, high-resolution imagery and styled SVG monograms for all 20 salons.

---

## 📁 Repository Structure

```
├── .github/                     # GitHub workflows & CI
├── netlify.toml                 # Netlify edge deployment configuration
├── package.json                 # Project scripts and dependencies
├── tailwind.config.ts           # Design tokens, color system, and typography
├── tsconfig.json                # TypeScript strict compiler options
├── vitest.config.ts             # Vitest unit testing configuration
├── supabase/
│   └── migrations/              # Versioned SQL migrations (schema, RLS, triggers, views)
└── src/
    ├── app/
    │   ├── (public)/            # Public guest routes
    │   │   ├── page.tsx         # Homepage with hero, search, categories, and top salons
    │   │   ├── salons/          # Explore & search directory with multi-filter bar
    │   │   │   └── [slug]/      # Salon profile with sticky booking widget & gallery
    │   │   ├── booking/manage/  # Guest booking lookup & self-service cancellation
    │   │   └── for-salons/      # Owner marketing & plan comparison landing page
    │   ├── (owner)/owner/       # Salon Owner portal
    │   │   ├── dashboard/       # Overview, today's schedule, monthly booking gauge
    │   │   ├── bookings/        # Appointments list with status toggles
    │   │   ├── calendar/        # Pro multi-stylist day/week visual calendar
    │   │   ├── services/        # Service & package catalog management
    │   │   ├── staff/           # Stylist profiles and assignment
    │   │   ├── billing/         # Plan status, HNB payment modal, and billing history
    │   │   └── signup/          # Owner onboarding registration wizard
    │   ├── (admin)/admin/       # Platform Admin panel
    │   │   ├── dashboard/       # Real-time KPIs, MRR ledger, and category metrics
    │   │   ├── verification/    # HNB bank transfer receipt verification queue
    │   │   ├── salons/          # Salon approvals, suspensions, and manual tier grants
    │   │   └── settings/        # Bank details and subscription pricing configuration
    │   └── api/
    │       ├── cron/billing/    # Daily cron for renewal reminders & grace period downgrade
    │       └── webhooks/        # Webhook endpoints for future payment gateway integrations
    ├── components/
    │   ├── ui/                  # Radix UI primitives (Dialog, Sheet, Tabs, Badge, Button)
    │   ├── layout/              # Glassmorphic Navbar, Mobile Tab Bar, and Footer
    │   └── common/              # ProBadge, LockedFeatureGate, UpgradeModal
    ├── features/
    │   ├── billing/             # plans.ts (single source of truth), payment actions
    │   ├── booking/             # engine.ts (slot allocation), BookingModal, GuestActions
    │   ├── owner/               # OwnerSalonContext, onboarding forms, share kit
    │   └── salons/              # SalonCard, filter predicates, reviews list
    └── lib/
        ├── config/              # site.ts, districts.ts, categories.ts, bank.ts
        ├── seed/                # Deterministic seed generator for 20 Sri Lankan salons
        ├── supabase/            # Client, Server, and Service-Role Supabase instances
        └── utils.ts             # Currency formatter (LKR), date helpers, phone masks
```

---

## 💾 Database Architecture & RLS Security

The database consists of **15 normalized tables** with 100% Row-Level Security coverage:

| Table | Description | RLS Policy Summary |
|---|---|---|
| `profiles` | Extended user identity linked to `auth.users` | Users can view and edit only their own profile. |
| `user_roles` | Separate table for `owner` and `admin` | Users cannot self-assign roles; admin role is granted strictly via manual DB assignment. |
| `salons` | Core salon records (address, tier, plan, limits) | Public read for `approved` salons; owners get full CRUD on their own salon; admin full access. |
| `salon_hours` | Weekly opening/closing and break intervals | Public read for approved salons; owner write on own salon. |
| `salon_closures`| Specific holiday dates or blocked days | Public read for approved salons; owner write on own salon. |
| `services` | Services and packages with duration and pricing | Public read for active services; owner write on own salon. |
| `staff` | Stylist names, roles, and avatar URLs | Public read; owner write on own salon. |
| `bookings` | Customer bookings with reference code | Service-role creation via validated Server Actions; owners can view/update own salon bookings; guests access via token. |
| `booking_items` | Snapshot of service name, price, and duration | Preserves financial history even if salon edits service prices later. |
| `subscription_payments` | HNB bank transfer records & receipt paths | Owners can view and submit `pending_review` for their salon; admin has approval mutation access. |
| `reviews` | Customer ratings and owner responses | Public read for approved reviews; one review per completed booking; verified owners can reply (Pro). |
| `audit_logs` | Immutable audit trail of admin actions | Read-only for admin; written by secure database triggers and functions. |
| `platform_settings` | Dynamic platform configs (HNB account, pricing) | Public read for bank details; admin write. |

---

## 🧪 Testing & Quality Assurance

Glowbook is thoroughly validated through unit and integration tests:

```bash
# Run the test suite
npm test
```

### Test Coverage Highlights:
- **Booking Engine:** Verified standard 30-minute slots, lunch break exclusions, past slot disabling, multi-service duration stacking, and 10-minute turnaround buffers.
- **Free Booking Cap:** Verified that once a Free salon hits 30 bookings in a calendar month, subsequent bookings are gracefully halted with a friendly message.
- **Idempotent Payment Function:** Verified that calling `approve_subscription_payment` multiple times on the same record does not duplicate months or corrupt expiration dates.

---

## 🔄 Extensibility: Swapping In PayHere / Stripe

While Glowbook defaults to manual HNB bank transfers to match current Sri Lankan SME preferences, the system is architected for seamless transition to an automated payment gateway (such as **PayHere** or **Stripe**):

1. **Create Webhook Route:** Add `src/app/api/webhooks/payhere/route.ts` to receive payment notifications.
2. **Verify Gateway Signature:** Validate the incoming signature hash using your Merchant Secret:
   ```ts
   const hash = crypto.createHash('md5')
     .update(merchant_id + order_id + amount + currency + status_code + md5(secret))
     .digest('hex').toUpperCase();
   ```
3. **Execute Existing Approval Function:** Once verified, trigger the idempotent database function:
   ```ts
   await supabaseAdmin.rpc('approve_subscription_payment', { p_payment_id: paymentId });
   ```
4. **Update UI Modal:** In `src/components/common/upgrade-modal.tsx`, enable the gateway's checkout button alongside the bank transfer tab.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm
- Supabase account (free tier)

### 1. Clone & Install
```bash
git clone https://github.com/dinil2/glowBook.git
cd glowBook
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase project credentials:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CRON_SECRET=your-secure-cron-secret
```

### 3. Apply Migrations & Seed Demo Data
Apply the migrations located in `supabase/migrations/` using the Supabase CLI or the Supabase SQL Editor:
```bash
# Generate mock SVG assets and demo bank receipt slips
npx tsx src/lib/seed/generate-assets.ts

# Generate seed SQL containing 20 realistic Sri Lankan salons and bookings
npx tsx src/lib/seed/run.ts
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👨‍💻 Author & Engineering Philosophy

Crafted with dedication to **high-quality software craftsmanship**, thoughtful UI/UX design, and clean architecture.

- **Developer:** Dinil Bhashana
- **GitHub:** [@dinil2](https://github.com/dinil2)
- **LinkedIn:** Connect on LinkedIn to discuss full-stack opportunities, modern web architectures, and system design.

> *"Great software isn't just about code that executes; it's about building solutions that solve real-world problems with elegance, resilience, and delight for every user who touches it."*
