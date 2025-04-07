/*
  # Add news section

  1. New Tables
    - `news`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `image_url` (text)
      - `category` (text)
      - `published_at` (timestamp)
      - `created_at` (timestamp)
      - `featured` (boolean)

  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for authenticated users to manage news
*/

CREATE TABLE news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  category text NOT NULL,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  featured boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to news"
  ON news
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage news"
  ON news
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample news
INSERT INTO news (title, content, category, featured) VALUES
  ('New Technical Society Launched', 'Exciting new technical society focused on AI and machine learning has been launched at TIET...', 'Technical', true),
  ('Cultural Festival Announced', 'Annual cultural festival dates announced. Get ready for an amazing celebration of art and culture...', 'Cultural', true),
  ('Sports Tournament Results', 'Inter-department cricket tournament concludes with exciting finale...', 'Sports', false),
  ('Research Achievement', 'TIET students win national level research competition...', 'Academic', false);