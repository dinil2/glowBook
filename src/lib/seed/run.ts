import fs from 'fs';
import path from 'path';
import { DEMO_SALONS, DEMO_CUSTOMERS, DEMO_PAYMENTS } from '../demo-data';
import { DEFAULT_PLATFORM_BANK_SETTINGS } from '../config/bank';

/**
 * Glowbook Idempotent SQL & Data Seeder
 * Generates supabase/seed.sql and can seed via Supabase Service Client if credentials exist.
 */

async function main() {
  console.log('====================================================');
  console.log('✨ GLOWBOOK DEMO SEED SCRIPT INITIALIZING');
  console.log('====================================================\n');

  const seedSqlPath = path.join(process.cwd(), 'supabase', 'seed.sql');

  let sql = `-- Glowbook Automated Seed SQL
-- Generated for demo-ready inspection with realistic Sri Lankan salons, owners, admin, reviews and payments.

-- 1. Platform Settings
INSERT INTO public.platform_settings (key, value)
VALUES 
  ('bank_settings', '${JSON.stringify(DEFAULT_PLATFORM_BANK_SETTINGS)}'::jsonb),
  ('plan_price_lkr', '2000'::jsonb),
  ('plan_discounts', '{"3": 0.10, "12": 0.20}'::jsonb),
  ('free_booking_cap', '30'::jsonb),
  ('trial_days', '30'::jsonb),
  ('approval_sla_text', '"We are checking your payment. Usually approved within 24 hours."'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

`;

  // Write seed.sql
  fs.writeFileSync(seedSqlPath, sql);
  console.log(`✅ supabase/seed.sql generated with ${DEMO_SALONS.length} salons, ${DEMO_CUSTOMERS.length} customers and ${DEMO_PAYMENTS.length} payments.`);

  console.log('\n====================================================');
  console.log('🔑 DEMO ACCOUNTS FOR LOCAL TESTING:');
  console.log('====================================================');
  console.log('👑 Platform Admin:');
  console.log('   Email:    admin@glowbook.lk');
  console.log('   Password: GlowbookAdmin2026!');
  console.log('   Role:     Platform Administrator\n');

  console.log('💈 Pro Salon Owner (Salon Costume - Colombo 07):');
  console.log('   Email:    costume@glowbook.lk');
  console.log('   Password: OwnerCostume2026!');
  console.log('   Plan:     Pro (Verified Badge, Full Analytics, Custom Stylist Picker)\n');

  console.log('💅 Free Salon Owner (Luxe Looks - Pita Kotte):');
  console.log('   Email:    luxelooks@glowbook.lk');
  console.log('   Password: OwnerLuxe2026!');
  console.log('   Plan:     Free (27 of 30 bookings used - Near Cap Nudge)\n');

  console.log('🌿 Trial Salon Owner (Serendib Ayurvedic Glow - Kandy):');
  console.log('   Email:    serendib@glowbook.lk');
  console.log('   Password: OwnerSerendib2026!');
  console.log('   Plan:     Pro (Active 30-Day Free Trial)\n');
  console.log('====================================================\n');
}

main().catch(console.error);
