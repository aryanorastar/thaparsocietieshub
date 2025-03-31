/*
  # Fix storage configuration for society logos

  1. Changes
    - Simplify storage policies
    - Remove unnecessary triggers and constraints
    - Ensure proper bucket configuration
*/

-- Create storage bucket for society logos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'society_logos'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('society_logos', 'society_logos', true);
  END IF;
END $$;

-- Drop existing policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow authenticated users to upload society logos" ON storage.objects;
  DROP POLICY IF EXISTS "Allow public to view society logos" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to update society logos" ON storage.objects;
END $$;

-- Create simplified storage policies
CREATE POLICY "Allow authenticated users to manage society logos"
ON storage.objects FOR ALL TO authenticated
WITH CHECK (bucket_id = 'society_logos');

CREATE POLICY "Allow public to view society logos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'society_logos');

-- Ensure storage.objects has the correct column configuration
ALTER TABLE storage.objects
ALTER COLUMN created_at SET DEFAULT now(),
ALTER COLUMN updated_at DROP NOT NULL;