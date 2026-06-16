-- Digital products access and payment workflow
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS digital_products_data (
  id INTEGER PRIMARY KEY DEFAULT 1,
  title VARCHAR(200),
  subtitle VARCHAR(200),
  access_settings JSONB DEFAULT '{}'::jsonb,
  products JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE digital_products_data
ADD COLUMN IF NOT EXISTS access_settings JSONB DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS digital_product_payment_requests (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT,
  product_title VARCHAR(200),
  full_name VARCHAR(160) NOT NULL,
  phone_number VARCHAR(30) NOT NULL,
  transaction_id VARCHAR(120),
  payment_method VARCHAR(60) DEFAULT 'bank_transfer',
  requested_slots INTEGER NOT NULL DEFAULT 1 CHECK (requested_slots > 0),
  amount NUMERIC(12, 2),
  iban_number VARCHAR(100),
  account_holder_name VARCHAR(200),
  remarks TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  whatsapp_message_sent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE digital_products_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_product_payment_requests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'digital_products_data'
      AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access" ON digital_products_data FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'digital_products_data'
      AND policyname = 'Allow public insert access'
  ) THEN
    CREATE POLICY "Allow public insert access" ON digital_products_data FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'digital_products_data'
      AND policyname = 'Allow public update access'
  ) THEN
    CREATE POLICY "Allow public update access" ON digital_products_data FOR UPDATE USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'digital_product_payment_requests'
      AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access" ON digital_product_payment_requests FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'digital_product_payment_requests'
      AND policyname = 'Allow public insert access'
  ) THEN
    CREATE POLICY "Allow public insert access" ON digital_product_payment_requests FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'digital_product_payment_requests'
      AND policyname = 'Allow public update access'
  ) THEN
    CREATE POLICY "Allow public update access" ON digital_product_payment_requests FOR UPDATE USING (true);
  END IF;
END $$;

-- Optional: leave SELECT/UPDATE locked down unless you intentionally want public access.
