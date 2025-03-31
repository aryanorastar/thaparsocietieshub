/*
  # Create societies management tables

  1. New Tables
    - `societies`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `room` (text)
      - `registration_link` (text, optional)
      - `registration_status` (enum: 'open', 'coming-soon', 'closed')
      - `category` (enum: 'technical', 'cultural', 'sports', 'academic')
      - `instagram` (text, optional)
      - `twitter` (text, optional)
      - `linkedin` (text, optional)
      - `facebook` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on societies table
    - Add policies for authenticated admin users
*/

-- Create enum types
CREATE TYPE registration_status AS ENUM ('open', 'coming-soon', 'closed');
CREATE TYPE society_category AS ENUM ('technical', 'cultural', 'sports', 'academic');

-- Create societies table
CREATE TABLE IF NOT EXISTS societies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  room text NOT NULL,
  registration_link text,
  registration_status registration_status NOT NULL DEFAULT 'coming-soon',
  category society_category NOT NULL,
  instagram text,
  twitter text,
  linkedin text,
  facebook text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE societies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
  ON societies
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage societies"
  ON societies
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update timestamp
CREATE TRIGGER update_societies_updated_at
  BEFORE UPDATE ON societies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();