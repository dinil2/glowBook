-- Glowbook Automated Seed SQL
-- Generated for demo-ready inspection with realistic Sri Lankan salons, owners, admin, reviews and payments.

-- 1. Platform Settings
INSERT INTO public.platform_settings (key, value)
VALUES 
  ('bank_settings', '{"bankName":"Hatton National Bank (HNB)","accountName":"Glowbook LK Technologies (Pvt) Ltd","accountNumber":"SAMPLE-0089-XXXX-4812","branch":"Colombo 03 Corporate Branch","bankCode":"7083","branchCode":"089","instructions":"Transfer the exact subscription amount via HNB digital banking, online banking, or counter deposit. Enter your Salon Billing Code in the transfer reference/remarks field.","approvalSlaText":"We're checking your payment. Usually approved within 24 hours."}'::jsonb),
  ('plan_price_lkr', '2000'::jsonb),
  ('plan_discounts', '{"3": 0.10, "12": 0.20}'::jsonb),
  ('free_booking_cap', '30'::jsonb),
  ('trial_days', '30'::jsonb),
  ('approval_sla_text', '"We are checking your payment. Usually approved within 24 hours."'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

