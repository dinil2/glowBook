-- Glowbook Initial Database Schema
-- Enables btree_gist for exclusion constraints to prevent double booking

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Profiles table (synced with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Separate user_roles table to ensure roles cannot be self-assigned
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Salons table
CREATE TABLE IF NOT EXISTS public.salons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    categories TEXT[] NOT NULL DEFAULT '{}',
    gender_type TEXT NOT NULL DEFAULT 'unisex' CHECK (gender_type IN ('ladies', 'gents', 'unisex')),
    district TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    instagram TEXT,
    facebook TEXT,
    logo_url TEXT,
    banner_url TEXT,
    price_tier TEXT NOT NULL DEFAULT 'mid' CHECK (price_tier IN ('budget', 'mid', 'premium')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended')),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    avg_rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    review_count INTEGER NOT NULL DEFAULT 0,
    billing_code TEXT NOT NULL UNIQUE,
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
    plan_expires_at TIMESTAMPTZ,
    trial_ends_at TIMESTAMPTZ,
    auto_confirm BOOLEAN NOT NULL DEFAULT TRUE,
    min_lead_hours INTEGER NOT NULL DEFAULT 2,
    max_advance_days INTEGER NOT NULL DEFAULT 30,
    cancellation_hours INTEGER NOT NULL DEFAULT 4,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Salon working hours
CREATE TABLE IF NOT EXISTS public.salon_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
    weekday INTEGER NOT NULL CHECK (weekday BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday...
    open_time TIME NOT NULL DEFAULT '09:00',
    close_time TIME NOT NULL DEFAULT '19:00',
    break_start TIME,
    break_end TIME,
    is_closed BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(salon_id, weekday)
);

-- Salon closures / holidays
CREATE TABLE IF NOT EXISTS public.salon_closures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
    closure_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(salon_id, closure_date)
);

-- Salon gallery images
CREATE TABLE IF NOT EXISTS public.salon_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Services and packages
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
    kind TEXT NOT NULL DEFAULT 'service' CHECK (kind IN ('service', 'package')),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    duration_min INTEGER NOT NULL CHECK (duration_min > 0),
    price_lkr NUMERIC(10, 2) NOT NULL CHECK (price_lkr >= 0),
    includes TEXT[] DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Staff members
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Senior Stylist',
    photo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bookings table with btree_gist exclusion to prevent double booking on staff + active time range
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference TEXT NOT NULL UNIQUE,
    salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    payment_status TEXT NOT NULL DEFAULT 'pay_at_salon' CHECK (payment_status IN ('pay_at_salon', 'paid')),
    payment_method TEXT NOT NULL DEFAULT 'cash_or_card',
    total_lkr NUMERIC(10, 2) NOT NULL DEFAULT 0,
    notes TEXT,
    manage_token_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_booking_period CHECK (ends_at > starts_at)
);

-- Create btree_gist exclusion constraint on staff_id and overlapping time range
-- for active bookings only
ALTER TABLE public.bookings ADD CONSTRAINT no_overlapping_staff_booking
EXCLUDE USING gist (
    staff_id WITH =,
    tstzrange(starts_at, ends_at) WITH &&
)
WHERE (status IN ('pending', 'confirmed'));

-- Booking items (snapshot of service details at booking time)
CREATE TABLE IF NOT EXISTS public.booking_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    price_lkr NUMERIC(10, 2) NOT NULL,
    duration_min INTEGER NOT NULL
);

-- Subscription payments table (HNB bank transfer verification)
CREATE TABLE IF NOT EXISTS public.subscription_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
    plan TEXT NOT NULL DEFAULT 'pro',
    months INTEGER NOT NULL CHECK (months IN (1, 3, 12)),
    amount_lkr NUMERIC(10, 2) NOT NULL CHECK (amount_lkr > 0),
    status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
    reference_code TEXT NOT NULL,
    payer_name TEXT,
    transfer_date DATE,
    bank_reference TEXT,
    receipt_url TEXT,
    owner_note TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    reject_reason TEXT,
    CONSTRAINT receipt_or_details_required CHECK (
        receipt_url IS NOT NULL OR (payer_name IS NOT NULL AND transfer_date IS NOT NULL AND bank_reference IS NOT NULL)
    )
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_role TEXT CHECK (recipient_role IN ('admin', 'owner')),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    link TEXT,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews (one per completed booking)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
    salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    owner_reply TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Platform settings
CREATE TABLE IF NOT EXISTS public.platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Initial indices for speed
CREATE INDEX IF NOT EXISTS idx_salons_status_district ON public.salons(status, district);
CREATE INDEX IF NOT EXISTS idx_salons_slug ON public.salons(slug);
CREATE INDEX IF NOT EXISTS idx_bookings_salon_date ON public.bookings(salon_id, starts_at);
CREATE INDEX IF NOT EXISTS idx_services_salon ON public.services(salon_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_salon ON public.subscription_payments(salon_id, status);
