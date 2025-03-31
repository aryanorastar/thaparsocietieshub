/*
  # Add logo URL to societies table

  1. Changes
    - Add `logo_url` column to `societies` table for storing society logos
    - Update RLS policies to allow authenticated users to upload images
*/

ALTER TABLE societies
ADD COLUMN IF NOT EXISTS logo_url text;

-- Create storage bucket for society logos if it doesn't exist
INSERT INTO storage.buckets (id, name)
SELECT 'society_logos', 'society_logos'
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'society_logos'
);

-- Set up storage policy for authenticated users
CREATE POLICY "Allow authenticated users to upload society logos"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'society_logos'
);

CREATE POLICY "Allow public to view society logos"
ON storage.objects FOR SELECT TO public USING (
  bucket_id = 'society_logos'
);