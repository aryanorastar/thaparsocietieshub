/*
  # Fix storage uploads and policies

  1. Changes
    - Remove updated_at dependency
    - Simplify storage bucket setup
    - Update storage policies
*/

-- Create storage bucket for society logos if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'society_logos'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('society_logos', 'society_logos', true);
  END IF;
END $$;

-- Drop existing policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow authenticated users to upload society logos" ON storage.objects;
  DROP POLICY IF EXISTS "Allow public to view society logos" ON storage.objects;
  DROP TRIGGER IF EXISTS handle_storage_uploads_trigger ON storage.objects;
  DROP FUNCTION IF EXISTS storage.handle_storage_uploads();
END $$;

-- Create storage policies
CREATE POLICY "Allow authenticated users to upload society logos"
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'society_logos');

CREATE POLICY "Allow authenticated users to update society logos"
ON storage.objects
FOR UPDATE TO authenticated
WITH CHECK (bucket_id = 'society_logos');

CREATE POLICY "Allow public to view society logos"
ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'society_logos');

-- Set up default timestamps
ALTER TABLE storage.objects
ALTER COLUMN created_at SET DEFAULT now(),
ALTER COLUMN updated_at DROP NOT NULL;