-- Database Triggers, Secure Contact Privacy Views, and Transactional Functions

-- 1. Contact Privacy View: public_salons
-- Returns phone and whatsapp ONLY when the salon has active Pro plan or active Trial.
-- For Free salons, phone and whatsapp are strictly NULL at the DB level to prevent API scraping.
CREATE OR REPLACE VIEW public.public_salons AS
SELECT 
    s.id,
    s.slug,
    s.name,
    s.tagline,
    s.description,
    s.categories,
    s.gender_type,
    s.district,
    s.city,
    s.address,
    s.lat,
    s.lng,
    CASE 
        WHEN (s.plan = 'pro' AND (s.plan_expires_at IS NULL OR s.plan_expires_at > NOW()))
             OR (s.trial_ends_at IS NOT NULL AND s.trial_ends_at > NOW())
        THEN s.phone 
        ELSE NULL 
    END AS phone,
    CASE 
        WHEN (s.plan = 'pro' AND (s.plan_expires_at IS NULL OR s.plan_expires_at > NOW()))
             OR (s.trial_ends_at IS NOT NULL AND s.trial_ends_at > NOW())
        THEN s.whatsapp 
        ELSE NULL 
    END AS whatsapp,
    s.email,
    s.instagram,
    s.facebook,
    s.logo_url,
    s.banner_url,
    s.price_tier,
    s.status,
    s.is_featured,
    s.avg_rating,
    s.review_count,
    s.plan,
    s.plan_expires_at,
    s.trial_ends_at,
    s.auto_confirm,
    s.min_lead_hours,
    s.max_advance_days,
    s.cancellation_hours,
    s.created_at,
    CASE 
        WHEN (s.plan = 'pro' AND (s.plan_expires_at IS NULL OR s.plan_expires_at > NOW()))
             OR (s.trial_ends_at IS NOT NULL AND s.trial_ends_at > NOW())
        THEN TRUE 
        ELSE FALSE 
    END AS is_pro_active
FROM public.salons s
WHERE s.status = 'approved';

-- 2. Trigger function to keep salon avg_rating and review_count synchronized
CREATE OR REPLACE FUNCTION public.handle_review_stats_update()
RETURNS TRIGGER AS $$
DECLARE
    target_salon_id UUID;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        target_salon_id := OLD.salon_id;
    ELSE
        target_salon_id := NEW.salon_id;
    END IF;

    UPDATE public.salons
    SET 
        avg_rating = COALESCE((
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM public.reviews
            WHERE salon_id = target_salon_id AND status = 'published'
        ), 5.00),
        review_count = (
            SELECT COUNT(*)
            FROM public.reviews
            WHERE salon_id = target_salon_id AND status = 'published'
        )
    WHERE id = target_salon_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_review_change
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.handle_review_stats_update();

-- 3. Idempotent payment approval function (Admin only)
CREATE OR REPLACE FUNCTION public.approve_subscription_payment(p_payment_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_payment RECORD;
    v_salon RECORD;
    v_new_expiry TIMESTAMPTZ;
    v_admin_id UUID := auth.uid();
BEGIN
    -- Authorization check
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Only platform administrators can approve subscription payments';
    END IF;

    -- Fetch payment record with row lock
    SELECT * INTO v_payment 
    FROM public.subscription_payments 
    WHERE id = p_payment_id 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Subscription payment not found: %', p_payment_id;
    END IF;

    -- Idempotency check: if already approved, do not extend plan again
    IF v_payment.status = 'approved' THEN
        RETURN jsonb_build_object(
            'success', true, 
            'message', 'Payment was already approved previously (idempotent)',
            'payment_id', p_payment_id
        );
    END IF;

    -- Fetch salon record
    SELECT * INTO v_salon 
    FROM public.salons 
    WHERE id = v_payment.salon_id 
    FOR UPDATE;

    -- Calculate new expiry date from the later of NOW() or existing plan_expires_at
    v_new_expiry := GREATEST(COALESCE(v_salon.plan_expires_at, NOW()), NOW()) + (v_payment.months || ' month')::INTERVAL;

    -- Update salon to Pro and set expiry
    UPDATE public.salons
    SET 
        plan = 'pro',
        plan_expires_at = v_new_expiry,
        updated_at = NOW()
    WHERE id = v_payment.salon_id;

    -- Mark payment approved
    UPDATE public.subscription_payments
    SET 
        status = 'approved',
        reviewed_by = v_admin_id,
        reviewed_at = NOW()
    WHERE id = p_payment_id;

    -- Write to audit log
    INSERT INTO public.audit_logs (actor_id, action, target_type, target_id, metadata)
    VALUES (
        v_admin_id,
        'APPROVE_SUBSCRIPTION_PAYMENT',
        'subscription_payments',
        p_payment_id::text,
        jsonb_build_object(
            'salon_id', v_payment.salon_id,
            'months', v_payment.months,
            'amount_lkr', v_payment.amount_lkr,
            'new_expiry', v_new_expiry
        )
    );

    -- Notify the salon owner
    INSERT INTO public.notifications (recipient_user_id, type, title, body, link)
    VALUES (
        v_salon.owner_id,
        'subscription_approved',
        'Pro Subscription Activated!',
        format('Your payment of LKR %s for %s month(s) was verified. Pro features are now unlocked until %s.', 
               v_payment.amount_lkr, v_payment.months, to_char(v_new_expiry, 'YYYY-MM-DD')),
        '/owner/billing'
    );

    RETURN jsonb_build_object(
        'success', true,
        'payment_id', p_payment_id,
        'new_expiry', v_new_expiry,
        'salon_id', v_payment.salon_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Payment rejection function (Admin only)
CREATE OR REPLACE FUNCTION public.reject_subscription_payment(p_payment_id UUID, p_reason TEXT)
RETURNS JSONB AS $$
DECLARE
    v_payment RECORD;
    v_salon RECORD;
    v_admin_id UUID := auth.uid();
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Only platform administrators can reject subscription payments';
    END IF;

    SELECT * INTO v_payment 
    FROM public.subscription_payments 
    WHERE id = p_payment_id 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Subscription payment not found';
    END IF;

    SELECT * INTO v_salon FROM public.salons WHERE id = v_payment.salon_id;

    UPDATE public.subscription_payments
    SET 
        status = 'rejected',
        reject_reason = p_reason,
        reviewed_by = v_admin_id,
        reviewed_at = NOW()
    WHERE id = p_payment_id;

    INSERT INTO public.audit_logs (actor_id, action, target_type, target_id, metadata)
    VALUES (
        v_admin_id,
        'REJECT_SUBSCRIPTION_PAYMENT',
        'subscription_payments',
        p_payment_id::text,
        jsonb_build_object('reason', p_reason, 'salon_id', v_payment.salon_id)
    );

    INSERT INTO public.notifications (recipient_user_id, type, title, body, link)
    VALUES (
        v_salon.owner_id,
        'subscription_rejected',
        'Subscription Verification Notice',
        format('Your bank transfer submission could not be verified: %s. You can submit updated proof in Plan & Billing.', p_reason),
        '/owner/billing'
    );

    RETURN jsonb_build_object('success', true, 'payment_id', p_payment_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
