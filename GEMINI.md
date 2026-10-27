# **Role:**

You are a World-Class Senior Full-Stack Engineer, Product Architect and Creative Technologist. You build production-grade, award-level booking marketplaces that are visually stunning, fast, accessible and engineered to last for years. You write clean, scalable, maintainable code with a clear architecture. You never produce spaghetti code, quick hacks or unstructured files.

# **Objective:**

Build a complete, working, demo-ready salon booking marketplace for Sri Lanka, working name "SalonBook LK" (keep the name in ONE config constant so it can be renamed instantly). Customers search any salon in Sri Lanka and book in seconds with no signup. Salon owners register, build a profile and manage everything from a dashboard. The business earns through a monthly Pro plan for salons, paid by manual HNB bank transfer and approved by an admin. An admin controls the whole platform. The database must be pre-filled with realistic Sri Lankan demo data (including free and Pro salons and billing history) so the product can be judged at full scale immediately.

# **Context:**

- Core promise on the homepage: "Search any salon in Sri Lanka and book your appointment easily." It is one place to book, so nobody has to call every salon or dig through Google.
- Three roles:
  1. Customer: guest only. No signup or login. Gives name, email and phone when booking.
  2. Salon Owner: registers with email and password (Supabase Auth), then completes an onboarding wizard to build the salon profile.
  3. Admin: created manually in the database (never through public signup). Manages the whole platform, including payment approvals.
- Two salon plans: Free (to attract salons quickly) and Pro (LKR 2,000/month). Pro is bought by bank transfer to an HNB account, then verified by the admin. There is no online payment gateway for subscriptions.
- Supabase is already connected to this project. Use it for Postgres, Auth, Storage and Realtime. Never hardcode keys.
- Most customers will book from a phone. Design mobile-first, then scale up to desktop.
- Visual direction: super clean, modern, premium. White and light purple, soft glass surfaces, generous whitespace, full-motion micro-interactions.
- Timezone is Asia/Colombo (UTC+5:30). Currency is LKR. Phone format is +94 7X XXX XXXX.

# **Instructions:**

## **Instruction 1: Plan first, then build**

Before writing code, produce a short implementation plan (architecture, folder structure, schema, route map, build phases) and then execute it phase by phase without stopping for questions. Make sensible assumptions and list them in the README. Phases: (1) project setup and design system, (2) database migrations, RLS and storage, (3) plans and feature-gating foundation, (4) seed script and image generation, (5) public customer experience, (6) booking engine and flow, (7) owner dashboard, (8) upgrade and payment verification flow, (9) admin panel, (10) SEO, accessibility, performance and tests. After each phase run lint, typecheck and tests, then fix problems before continuing.

## **Instruction 2: Stack and architecture (long-term quality is mandatory)**

- Next.js (App Router) + TypeScript in strict mode (no `any`), Tailwind CSS, Framer Motion, shadcn/ui (Radix) for accessible primitives, Lucide icons, Recharts for dashboards, react-hook-form + Zod for forms and validation, date-fns (+ date-fns-tz), Sonner for toasts, Vitest for tests, ESLint + Prettier.
- Feature-based structure. Example: `src/features/{salons,booking,owner,admin,reviews,billing,notifications}/` each with `components/`, `actions/` (server actions), `queries/`, `schemas/`, `types.ts`. Shared code in `src/lib/` (supabase clients for browser/server/middleware, utils, constants, config) and `src/components/ui/`. Route groups: `(public)`, `(owner)/owner`, `(admin)/admin`.
- Strict separation: UI components render only. Business logic lives in pure, testable functions or server actions. Data access lives in query modules. No giant files, no duplicated logic, no magic numbers (use constants/config), no dead code.
- ONE source of truth for plans: `src/features/billing/plans.ts` defines every plan limit and feature flag (see Instruction 5) plus a `can(salon, feature)` helper and `getLimit(salon, limit)` helper. UI, server actions and queries must all use it. Do not scatter `if plan === 'pro'` checks around the codebase.
- Generate Supabase TypeScript types from the schema and use them everywhere.
- Every route has loading skeletons, error boundaries and empty states. All server actions validate input with Zod and return typed results.
- Add `.env.example`, a clear README (setup, scripts, architecture, demo logins, how plan billing works, how to later swap in a real payment gateway), and meaningful comments only where the logic is non-obvious.
- Build for the long run: scalable, maintainable, easy for another developer to extend. Prefer small composable modules over clever shortcuts.

## **Instruction 3: Database, security and RLS**

Create versioned SQL migrations in `supabase/migrations/`. Enable Row Level Security on EVERY table. Tables (adjust names sensibly, keep it normalized):

- `profiles` (id → auth.users, full_name, phone)
- `user_roles` (user_id, role: 'owner' | 'admin') as a SEPARATE table so roles can never be self-assigned. Admin is assigned only manually.
- `salons` (owner_id, slug unique, name, tagline, description, categories, gender_type [ladies|gents|unisex], district, city, address, lat, lng, phone, whatsapp, email, instagram, facebook, logo_url, banner_url, price_tier [budget|mid|premium], status [pending|approved|suspended], is_featured, avg_rating, review_count, billing_code (unique 4-digit string used as the bank-transfer reference), plan [free|pro], plan_expires_at, trial_ends_at, settings: auto_confirm, min_lead_hours, max_advance_days, cancellation_hours)
- `salon_hours` (weekday, open/close, break window, is_closed), `salon_closures` (holidays or blocked dates), `salon_images` (url, alt, sort_order)
- `services` (salon_id, kind: 'service' | 'package', name, category, description, duration_min, price_lkr, includes, is_active)
- `staff` (salon_id, name, role, photo_url, is_active)
- `bookings` (reference code like SB-7K3Q9X, salon_id, staff_id, customer_name, customer_email, customer_phone, starts_at, ends_at, status [pending|confirmed|completed|cancelled|no_show], payment_status, payment_method, total_lkr, notes, manage_token_hash) and `booking_items` (snapshot of service name, price and duration so later edits never change history)
- `subscription_payments` (salon_id, plan, months, amount_lkr, status [pending_review|approved|rejected], reference_code (the billing code used), payer_name, transfer_date, bank_reference, receipt_url (private bucket path), owner_note, submitted_at, reviewed_by, reviewed_at, reject_reason). Constraint: at least a receipt OR typed transfer details (payer_name + transfer_date + bank_reference).
- `notifications` (recipient_user_id or recipient_role, type, title, body, link, read_at, created_at)
- `reviews` (one per completed booking; rating 1-5, comment, owner_reply, status), `audit_logs`, `platform_settings` (key/value: bank_name, account_name, account_number, branch, plan_price_lkr, plan_discounts, free_booking_cap, trial_days, approval_sla_text)
- Database triggers keep salon `avg_rating` and `review_count` correct.
- Prevent double booking at the database level (btree_gist exclusion constraint on staff + time range for active bookings) so two guests can never take the same slot, even in a race.
- Public (anon) read access only for APPROVED salons and their services, staff, images, hours, reviews. IMPORTANT contact privacy: customers read salons through a public view or RPC (`public_salons`) that returns `phone` and `whatsapp` ONLY when the salon's plan is active Pro (or trial). For Free salons those fields are NULL at the database level, so they cannot be scraped from the API. Hiding buttons in the UI alone is not enough.
- Owners get full CRUD only on their own salon's rows. They can create `subscription_payments` for their own salon only as 'pending_review' and cannot change status. Admin gets full access.
- Approving a payment must happen in a single transactional SECURITY DEFINER function `approve_subscription_payment(payment_id)` that is admin-only and idempotent: it sets plan='pro', extends `plan_expires_at` from the later of now or the current expiry by the paid months, marks the payment approved, writes an audit log and creates an owner notification. A rejection function does the same with a reason.
- Guests NEVER write directly to tables: bookings are created through a validated server action or SECURITY DEFINER function using the server-side service role (never exposed to the browser), with Zod validation, a hidden honeypot field and per-IP rate limiting.
- Guest booking management uses a secure token link (hashed in the DB) plus reference + phone lookup.
- Storage buckets: `salon-images` (public read, owner write only to own salon folder, size and type limits) and `payment-receipts` (PRIVATE: owner can upload only to own salon folder, only admin can read, via short-lived signed URLs; jpg/png/pdf, max 5 MB).
- Daily billing job (pg_cron if available, otherwise a protected `/api/cron/billing` route secured by CRON_SECRET, documented in the README): sends renewal reminders to owners at 7, 3 and 1 days before expiry, and downgrades expired Pro salons to Free after a 3-day grace period. NEVER delete data on downgrade. Items above Free limits are preserved and hidden or locked, and they return when the salon upgrades again.

## **Instruction 4: Booking engine**

Create a pure, fully unit-tested `getAvailableSlots()` function: inputs are salon hours, breaks, closures, existing bookings, staff, total duration of selected services, date, optional staff. It respects a 10-minute buffer, min lead time, max advance window, 15 or 30 minute grid, and "any available stylist" (auto-assigns a free staff member). Slots that are already taken or in the past appear disabled, never hidden silently. Show "Next available" when the chosen day is full. Re-validate at submit time, and if a slot was just taken show a friendly message with the nearest alternative times.

Free plan cap: Free salons accept up to `free_booking_cap` (default 30) bookings per calendar month (Asia/Colombo, counted by appointment date). Enforce it server-side inside the booking action. When the cap is reached, customers see a friendly "This salon isn't taking new online bookings right now" message on that month's dates, and the owner sees an upgrade prompt. Pro has no cap.

## **Instruction 5: Plans and feature gating (single source of truth)**

Define in `plans.ts` (all values configurable, never scattered):

- Free ("Starter"): profile page (logo, banner, description, address, map, hours), up to 8 services/packages, 6 gallery photos, up to 2 staff members auto-assigned (customers cannot choose a stylist), 30 bookings per month, email confirmations, basic overview (today's bookings list and simple counts), read-only reviews, booking link and basic QR code, listed in search with normal ranking. Customers do NOT see Call or WhatsApp buttons on a Free salon's public page.
- Pro (LKR 2,000/month; 3 months LKR 5,400; 12 months LKR 19,200, all configurable): unlimited bookings, unlimited services, up to 30 gallery photos, unlimited staff with the visual staff calendar (day and week columns) and customer stylist selection, revenue and analytics reports, customer list with CSV export, WhatsApp reminder and confirmation messages to customers (v1: click-to-chat links with pre-filled message templates from the dashboard, built behind a `MessagingProvider` interface so the official WhatsApp API can be added later), review replies, Call and WhatsApp buttons on the public page, "Verified Pro" badge, boosted search ranking and eligibility for Featured.
- Trial: every newly approved salon gets `trial_days` (default 30) of Pro automatically, so owners taste the paid features. Admin can grant, extend or revoke trials and plans manually.
- Enforce every limit and feature on the SERVER (server actions, queries, public views), never only in the UI.
- Locked-feature UX: show a tasteful preview (blurred or sample data) with a lock icon and a clear "Upgrade to Pro" button instead of hiding the feature, and open the plan comparison pop-up from it. Show a usage meter in the dashboard (for example "18 of 30 bookings used this month"), a soft nudge at 80%, and a firm but friendly banner at the cap.
- Do not over-nag: show the plan comparison pop-up automatically at most once per day per owner, always dismissible, and never during the booking-critical flows.

## **Instruction 6: Upgrade and payment verification flow**

Owner side:
1. "Plan and Billing" page shows the current plan, expiry date, trial status, usage meter, payment history with statuses (pending review, approved, rejected with reason) and a clear Free vs Pro comparison.
2. Plan comparison pop-up (animated, highlighting what Pro unlocks and what the owner is missing right now) with a main button "Upgrade to Pro". Include a short explanation of the benefits, the price per month and the 3/12-month discounts.
3. Payment pop-up (second step): choose period (1, 3 or 12 months, with the amount updating), then show the HNB bank details from `platform_settings` (bank, account name, account number, branch) each with a copy button, plus a highlighted "Use this as your transfer reference" box containing the salon name (shortened) and the salon's unique 4-digit billing code (for example SALONCOSTUME-4821, max 20 characters, with a copy button). Explain why the reference matters.
4. The owner then EITHER uploads the receipt (image or PDF, with preview) OR types the transfer details (payer name, transfer date, bank reference number). At least one is required. Add an optional note.
5. Clicking "Done payment" creates a `pending_review` payment, shows a success state ("We're checking your payment. Usually approved within 24 hours." from `approval_sla_text`) and the Plan page shows "Pending review". Prevent duplicate pending submissions for the same period.
6. After approval the owner gets an in-app notification and an email, the dashboard animates the unlock (confetti-light, Pro badge, unlocked features highlighted) and the public page immediately shows Call and WhatsApp buttons. After rejection the owner sees the reason and can resubmit.

Admin side:
- A bell icon with a live unread count (Supabase Realtime) and a notification center. A new submitted payment creates an admin notification and an email via the `EmailProvider` interface.
- "Payments to verify" queue: salon name, billing code, amount, period, submitted time, receipt preview (signed URL, zoomable) and typed details side by side, with a checklist reminder ("Confirm the money arrived in the HNB account with this reference"). Actions: Approve (calls `approve_subscription_payment`) and Reject (requires a reason). All actions are written to the audit log. Approving twice must not extend the plan twice.

## **Instruction 7: Customer experience (public site)**

Design system: white (#FFFFFF), mist (#FAF8FF), lavender (#F3EEFF), soft purple (#E4D9FF), primary purple (#8B6CF6), deep purple (#5B3FD1), ink (#1E1B2E), muted (#6B6785), star-gold (#F5B942). Fonts: Plus Jakarta Sans for UI, Fraunces (italic accent words) for display headlines. Rounded-2xl/3xl corners, soft purple-tinted shadows, subtle grain overlay, glassmorphism navbar (backdrop-blur), generous spacing.

Motion (Framer Motion, transform/opacity only, 60fps, respects prefers-reduced-motion): smooth page transitions, staggered scroll reveals, hover lifts and magnetic buttons on desktop, animated count-up stats, animated filter/layout changes, spring bottom sheets on mobile, shimmer skeletons.

Homepage, in this order:
1. Floating glass navbar: logo, SEARCH at the top right (desktop: expanding search with live autocomplete for salon names, areas and services, so typing "Salon Costume" shows it instantly. Mobile: search icon opening a full-screen search sheet), "List your salon" button, owner login.
2. Hero: headline "Search any salon in Sri Lanka and book your appointment easily." with an italic Fraunces accent word, a prominent search card (salon or service + district + date), category chips, soft animated purple gradient blobs, floating tilt cards showing a live booking preview, and a pinned, animated scroll-down cue.
3. Animated trust stats (salons, bookings, districts, average rating).
4. Browse by category (Hair, Barber, Bridal, Nails, Facial & Skin, Spa, Makeup) with icon cards.
5. Featured top-rated salons carousel. Each card has banner, logo, rating, district, "from LKR X" and a live "Next slot: Today 4:30 PM" chip. Featured is driven by our own ratings and review counts among eligible (Pro) salons. Do NOT scrape Google data.
6. A pinned scroll-story "How it works" (Search, Choose, Book) with scroll-linked progress and phone mockups.
7. Popular districts grid with salon counts, a bridal collection spotlight, and trending services.
8. "Why book here instead of calling" comparison, testimonials (from seeded reviews), a "Grow your salon" section aimed at owners (free listing, fill empty slots, own booking link and QR code, Pro benefits), FAQ accordion and a footer.
9. Mobile: bottom tab bar (Home, Explore, My Booking, For Salons) and a sticky CTA where useful.

"For Salons" page `/for-salons`: a persuasive owner landing page with benefits, an animated Free vs Pro pricing table (LKR 2,000/month, with 3 and 12 month savings), how the bank-transfer upgrade works, FAQ and a "Register your salon free" button.

Explore page `/salons`: filters (district, category, ladies/gents/unisex, price tier, minimum rating, open now, available today), sorting (Pro salons get a small ranking boost on the default "Recommended" sort), animated results grid, and SEO landing pages like `/salons/in/colombo` and `/salons/category/bridal`.

Salon page `/salons/[slug]`: banner with overlapping logo, name, rating, badges ("Verified Pro" only for Pro salons), district; action row: Book, Share, Directions (always), plus Call and WhatsApp ONLY when the salon data includes them (Pro). Sticky section nav: Services & Packages (with prices and durations), Gallery (lightbox), About, Team, Reviews, Location (OpenStreetMap/Leaflet, no paid API key) and Opening hours with an "Open now" indicator. Desktop has a sticky booking card. Mobile has a sticky bottom bar "Book now · from LKR X". The page must look complete and professional for a Free salon too (no awkward empty space where the contact buttons would be).

Booking flow (desktop modal, mobile bottom sheet): (1) pick services or packages with live total and duration, (2) pick a stylist or "Any available" (stylist choice only for Pro salons, otherwise auto-assign), (3) horizontal date strip + time slots grouped Morning/Afternoon/Evening, (4) details: name, email, phone (+94 mask), notes, with inline Zod validation, (5) payment: customers "Pay at salon" (no online payment in this version), (6) animated confirmation with reference code, Add to Calendar (.ics), WhatsApp share of the booking, manage link, and a Call Salon button only if the salon is Pro. Send a confirmation email through an `EmailProvider` interface (console logger in dev, Resend adapter when an API key exists).

Guest manage page: lookup by reference + phone, or via the secure link. View, cancel or reschedule within the salon's cancellation window. After a completed booking, a review link lets the guest rate the salon.

## **Instruction 8: Salon owner dashboard (`/owner`)**

Signup with email and password (verification email), then an onboarding wizard: salon basics, location, hours and breaks, services and packages, gallery upload (logo, banner, photos), live preview, submit for approval. Show a clear "Pending approval" state until the admin approves, then the welcome screen mentions the Pro trial. Dashboard sections: Overview (today's bookings as a timeline/to-do list, KPI cards, usage meter), Bookings (table with filters, confirm, complete, no-show, cancel, manual walk-in booking), Services and Packages CRUD, Staff, Gallery manager, Hours and Closures, Reviews, Settings (auto-confirm, lead time, booking window, cancellation policy), Share Kit (booking link, downloadable QR code, Instagram bio text), and Plan and Billing (Instruction 6). Pro-only sections are visible but locked for Free owners with the upgrade UX from Instruction 5: Staff Calendar (day and week view with staff columns), Analytics and Revenue Reports (charts, revenue per service, busiest hours, no-show rate), Customers (visit count, total spend, CSV export), WhatsApp Messages (templates and one-tap click-to-chat for confirmations and reminders), review replies, and calling/WhatsApp contact controls.

## **Instruction 9: Admin panel (`/admin`)**

Overview KPIs: bookings, active salons, new owners, cancellation rate, top districts and categories, and subscription metrics: MRR, active Pro salons, Free to Pro conversion rate, trials ending soon, plans expiring within 7 days, and payments waiting for review. Charts for all of them. Approval queue for new salons. "Payments to verify" queue and notification center (Instruction 6). Salons table (approve, suspend, feature or unfeature, change plan, grant or extend a Pro trial, revoke Pro, view as owner). Platform-wide bookings and customers. Subscription revenue ledger (all approved payments with filters and monthly totals). Reviews moderation (hide or restore). Manage districts, categories and featured placement. Audit log of admin actions. A Billing Settings page to edit the HNB bank details, plan price, period discounts, free booking cap, trial days and approval SLA text. CSV export on every major table. Strictly protected by middleware, server checks and RLS.

## **Instruction 10: Demo data (seed script)**

Write an idempotent, deterministic seed script (`npm run seed` and `npm run seed:reset`, fixed random seed, service role used server-side only):
- 1 admin and 20 owner accounts (print demo logins at the end and document them in the README, development only).
- 20 FICTIONAL but realistic salons (do not use real business names or real people), including one called "Salon Costume" (Colombo 07). Spread across Colombo 03/07, Nugegoda, Rajagiriya, Dehiwala, Pita Kotte, Gampaha/Negombo, Kandy (3), Galle (2), Matara, Kurunegala, Jaffna, Anuradhapura and Ratnapura. Mix ladies, gents/barber, unisex, bridal specialists and nail/spa studios across budget, mid and premium tiers. Each has a tagline, a real-sounding description, address, phone (+94), WhatsApp, hours with lunch breaks and a weekly closed day where realistic, 8-14 services/packages, 2-5 staff with Sri Lankan names, a logo, a banner and 4 gallery images. Each has a unique 4-digit billing code.
- Plan mix: about 8 Pro salons (one still on its trial, one expiring in 5 days to show the renewal reminder) and about 12 Free salons (one at 27 of 30 monthly bookings to show the nudge). Make sure the demo clearly shows that Free salon pages have no Call/WhatsApp buttons while Pro salon pages do.
- Billing history over the last 2 months: approved subscription payments for the Pro salons (so MRR and revenue charts have data), 2 payments pending review (one with an uploaded receipt, one with typed details), and 1 rejected payment with a reason. Generate the receipt images in code as simple mock bank-slip images watermarked "DEMO RECEIPT". Seed the bank details in `platform_settings` with clearly marked SAMPLE placeholder values (for example "SAMPLE - replace in Admin > Billing Settings"), never realistic-looking real account numbers.
- Realistic LKR price ranges: gents haircut 600-4,500; beard trim 400-1,500; ladies haircut 1,000-9,000; blow dry 1,500-6,000; global hair colour 6,000-25,000; highlights/balayage 12,000-45,000; rebonding/keratin 12,000-45,000; hair spa 3,500-9,500; facial 3,500-12,000; manicure 1,800-4,500; pedicure 2,200-5,500; gel nails 3,500-8,000; threading 300-800; waxing 1,500-8,000; head massage 1,500-3,500; body massage 6,000-18,000; party makeup 8,000-35,000; saree draping 3,000-8,000; kids haircut 700-1,800; groom package 15,000-45,000; bridal packages 45,000-85,000 (budget), 95,000-180,000 (mid), 200,000-450,000 (premium). Scale prices by tier and district (Colombo premium above regional towns).
- About 60 guest customers with a natural mix of Sinhala, Tamil and Muslim names, with Sri Lankan phone numbers and emails.
- About 700 bookings in a ROLLING window relative to today (30 days back to 30 days ahead) so the data always looks fresh. Past bookings are about 80% completed, 8% cancelled, 4% no-show, the rest confirmed. Future bookings are mostly confirmed or pending. Weekends and evenings are busier, with no overlapping bookings per stylist. Respect the Free cap (at most 30 per month for Free salons) so the data is consistent with the rules.
- 8-25 reviews per salon tied to completed bookings, ratings skewed realistically between 4.0 and 4.9 with varied, natural comments. Averages come from the trigger. Mark the top 6 Pro salons as featured.
- Images: use Antigravity's image generation to create banners and gallery photos (bright, modern, natural-light salon interiors and styling scenes in a Sri Lankan setting, no text or brand logos in the images), upload them to Supabase Storage and save the URLs. Generate logos in code as clean SVG monograms in the purple palette. If image generation hits limits, generate a themed pool per category and assign it across salons, never leave an empty image slot.

## **Instruction 11: Quality, SEO, accessibility and verification**

- SEO: slug URLs, dynamic metadata, Open Graph images, JSON-LD (HairSalon/LocalBusiness with aggregateRating; include the telephone only for Pro salons), sitemap.xml, robots.txt.
- Performance: next/image with proper sizes, lazy loading, minimal client JS, target Lighthouse 90+ on mobile.
- Accessibility: WCAG AA contrast, visible focus rings, keyboard navigation, aria labels, 44px minimum touch targets, safe-area insets, reduced-motion support. Pop-ups must trap focus and close with Escape.
- Mobile is first class. Verify at 360px, 390px, 768px and 1440px with no horizontal scroll and no overlapping elements. The upgrade pop-ups must be comfortable on a phone (bottom sheet, large copy buttons, easy receipt upload from the camera or gallery).
- Tests: Vitest unit tests for the slot engine, price/duration totals, Zod schemas, double-booking rules, plan limits and `can()` helpers, the Free monthly booking cap, and the idempotent payment approval (approving twice extends the plan only once, and expiry extends from the later of now or the current expiry).
- Finish by running the app, using the browser to click through the full flows at mobile and desktop sizes: home search, guest booking, a Free salon page (no Call/WhatsApp) versus a Pro salon page, owner signup and onboarding, the locked-feature upgrade flow with receipt upload, admin payment approval and the instant unlock on the owner side, and the booking cap nudge. Fix every visual or functional issue you find, then give a short summary of what was built and how to run it.

# **Notes:**

- No placeholders, no lorem ipsum, no empty image slots. Everything shown must look real and finished.
- Never use real business names, real people or scraped Google ratings and reviews. All demo data is fictional.
- Never expose the Supabase service role key to the browser. Never skip RLS. Admin can never be created through the public UI. Payment receipts live in a private bucket and are only visible to the admin through signed URLs.
- Contact privacy for Free salons must be enforced at the database/API level, not only hidden in the UI.
- Keep the Free plan genuinely useful, because the first goal is to get many salons on board. Upgrade prompts must be helpful and gentle, never blocking or annoying, and the plan numbers (prices, caps, trial days) must be easy to change from Billing Settings or one config file.
- Never delete an owner's data when a plan expires or downgrades. Lock or hide, and restore on re-upgrade.
- Format money as "LKR 4,500" (Intl.NumberFormat 'en-LK'), times in Asia/Colombo, phones as +94.
- Keep every file focused and small, with consistent naming, shared constants and no duplicated logic. If something feels hacky, refactor it before moving on.
- Everything must feel like a polished product from day one: smooth, fast, trustworthy and beautiful on a phone. Build a booking experience people trust, not a template.