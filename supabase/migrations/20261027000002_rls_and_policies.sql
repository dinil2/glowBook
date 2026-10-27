-- Row Level Security (RLS) and Access Policies

-- Helper function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if current user owns a salon
CREATE OR REPLACE FUNCTION public.is_salon_owner(target_salon_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.salons
        WHERE id = target_salon_id AND owner_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on every table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_closures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. User Roles (Strictly Admin managed, read-only for owner)
CREATE POLICY "Users can read own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can manage user roles" ON public.user_roles
    FOR ALL USING (public.is_admin());

-- 3. Salons
CREATE POLICY "Public can view approved salons" ON public.salons
    FOR SELECT USING (status = 'approved' OR owner_id = auth.uid() OR public.is_admin());

CREATE POLICY "Owners can update their own salon" ON public.salons
    FOR UPDATE USING (owner_id = auth.uid() OR public.is_admin());

CREATE POLICY "Authenticated users can create salon" ON public.salons
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Admins have full access to salons" ON public.salons
    FOR ALL USING (public.is_admin());

-- 4. Salon Hours & Closures
CREATE POLICY "Public can view hours of approved salons" ON public.salon_hours
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.salons s WHERE s.id = salon_id AND (s.status = 'approved' OR s.owner_id = auth.uid()))
        OR public.is_admin()
    );

CREATE POLICY "Owners can manage own salon hours" ON public.salon_hours
    FOR ALL USING (public.is_salon_owner(salon_id) OR public.is_admin());

CREATE POLICY "Public can view closures of approved salons" ON public.salon_closures
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.salons s WHERE s.id = salon_id AND (s.status = 'approved' OR s.owner_id = auth.uid()))
        OR public.is_admin()
    );

CREATE POLICY "Owners can manage own salon closures" ON public.salon_closures
    FOR ALL USING (public.is_salon_owner(salon_id) OR public.is_admin());

-- 5. Salon Images
CREATE POLICY "Public can view images of approved salons" ON public.salon_images
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.salons s WHERE s.id = salon_id AND (s.status = 'approved' OR s.owner_id = auth.uid()))
        OR public.is_admin()
    );

CREATE POLICY "Owners can manage own salon images" ON public.salon_images
    FOR ALL USING (public.is_salon_owner(salon_id) OR public.is_admin());

-- 6. Services
CREATE POLICY "Public can view active services of approved salons" ON public.services
    FOR SELECT USING (
        (is_active = TRUE AND EXISTS (SELECT 1 FROM public.salons s WHERE s.id = salon_id AND s.status = 'approved'))
        OR public.is_salon_owner(salon_id)
        OR public.is_admin()
    );

CREATE POLICY "Owners can manage own salon services" ON public.services
    FOR ALL USING (public.is_salon_owner(salon_id) OR public.is_admin());

-- 7. Staff
CREATE POLICY "Public can view active staff of approved salons" ON public.staff
    FOR SELECT USING (
        (is_active = TRUE AND EXISTS (SELECT 1 FROM public.salons s WHERE s.id = salon_id AND s.status = 'approved'))
        OR public.is_salon_owner(salon_id)
        OR public.is_admin()
    );

CREATE POLICY "Owners can manage own salon staff" ON public.staff
    FOR ALL USING (public.is_salon_owner(salon_id) OR public.is_admin());

-- 8. Bookings & Items
CREATE POLICY "Owners can read own salon bookings" ON public.bookings
    FOR SELECT USING (public.is_salon_owner(salon_id) OR public.is_admin());

CREATE POLICY "Owners can update own salon bookings" ON public.bookings
    FOR UPDATE USING (public.is_salon_owner(salon_id) OR public.is_admin());

CREATE POLICY "Booking items viewable by owner or admin" ON public.booking_items
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND (public.is_salon_owner(b.salon_id) OR public.is_admin()))
    );

-- 9. Subscription Payments
CREATE POLICY "Owners can view own salon subscription payments" ON public.subscription_payments
    FOR SELECT USING (public.is_salon_owner(salon_id) OR public.is_admin());

CREATE POLICY "Owners can insert pending_review payment for own salon" ON public.subscription_payments
    FOR INSERT WITH CHECK (
        public.is_salon_owner(salon_id) 
        AND status = 'pending_review'
    );

CREATE POLICY "Admins have full access to subscription payments" ON public.subscription_payments
    FOR ALL USING (public.is_admin());

-- 10. Notifications
CREATE POLICY "Users can read own notifications" ON public.notifications
    FOR SELECT USING (
        recipient_user_id = auth.uid() 
        OR (recipient_role = 'admin' AND public.is_admin())
    );

CREATE POLICY "Users can mark own notifications read" ON public.notifications
    FOR UPDATE USING (
        recipient_user_id = auth.uid() 
        OR (recipient_role = 'admin' AND public.is_admin())
    );

-- 11. Reviews
CREATE POLICY "Public can view published reviews" ON public.reviews
    FOR SELECT USING (status = 'published' OR public.is_salon_owner(salon_id) OR public.is_admin());

CREATE POLICY "Owners can reply to reviews" ON public.reviews
    FOR UPDATE USING (public.is_salon_owner(salon_id) OR public.is_admin());

CREATE POLICY "Admins can moderate reviews" ON public.reviews
    FOR ALL USING (public.is_admin());

-- 12. Audit Logs
CREATE POLICY "Only admins can view audit logs" ON public.audit_logs
    FOR SELECT USING (public.is_admin());

-- 13. Platform Settings
CREATE POLICY "Public can read platform settings" ON public.platform_settings
    FOR SELECT TO PUBLIC USING (TRUE);

CREATE POLICY "Only admins can modify platform settings" ON public.platform_settings
    FOR ALL USING (public.is_admin());
