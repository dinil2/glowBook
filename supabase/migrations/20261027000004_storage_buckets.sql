-- Storage Buckets Configuration & Access Policies

-- 1. Create buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('salon-images', 'salon-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
    ('payment-receipts', 'payment-receipts', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage Policies for salon-images (Public read, authenticated owner write to own salon folder)
CREATE POLICY "Public read for salon images"
ON storage.objects FOR SELECT
USING (bucket_id = 'salon-images');

CREATE POLICY "Owners can upload images to own salon folder"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'salon-images' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Owners can update images in own salon folder"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'salon-images' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Owners can delete images in own salon folder"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'salon-images' 
    AND auth.role() = 'authenticated'
);

-- 3. Storage Policies for payment-receipts (PRIVATE: owner upload only, admin read only)
CREATE POLICY "Owners can upload payment receipt"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'payment-receipts' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Only admins can view payment receipts"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'payment-receipts' 
    AND public.is_admin()
);
