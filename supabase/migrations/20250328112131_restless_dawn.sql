/*
  # Setup storage for society logos

  1. Changes
    - Create storage bucket for society logos
    - Set up public access policies
    - Enable authenticated uploads
    - Remove updated_at requirement
    
  Note: Using IF NOT EXISTS and DROP IF EXISTS to handle idempotency
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
END $$;

-- Create new policies
CREATE POLICY "Allow authenticated users to upload society logos"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'society_logos'
);

CREATE POLICY "Allow public to view society logos"
ON storage.objects FOR SELECT TO public USING (
  bucket_id = 'society_logos'
);

-- Update storage.objects trigger to handle missing updated_at
CREATE OR REPLACE FUNCTION storage.handle_storage_uploads()
RETURNS trigger AS $$
BEGIN
  NEW.created_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS handle_storage_uploads_trigger ON storage.objects;

-- Create new trigger
CREATE TRIGGER handle_storage_uploads_trigger
  BEFORE INSERT ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION storage.handle_storage_uploads();