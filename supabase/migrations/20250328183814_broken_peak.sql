/*
  # Add content management tables

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `quote` (text)
      - `author` (text)
      - `society` (text)
      - `rating` (integer)
      - `created_at` (timestamp)
    
    - `team_members`
      - `id` (uuid, primary key)
      - `name` (text)
      - `role` (text)
      - `bio` (text)
      - `image_url` (text)
      - `order` (integer)
      - `created_at` (timestamp)
    
    - `stats`
      - `id` (uuid, primary key)
      - `label` (text)
      - `value` (text)
      - `icon` (text)
      - `order` (integer)
      - `created_at` (timestamp)
    
    - `page_content`
      - `id` (uuid, primary key)
      - `section` (text)
      - `title` (text)
      - `content` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated users to manage content
*/

-- Create testimonials table
CREATE TABLE testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  author text NOT NULL,
  society text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  created_at timestamptz DEFAULT now()
);

-- Create team members table
CREATE TABLE team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text NOT NULL,
  image_url text,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create stats table
CREATE TABLE stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  icon text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create page content table
CREATE TABLE page_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Create policies for testimonials
CREATE POLICY "Allow public read access to testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage testimonials"
  ON testimonials
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for team members
CREATE POLICY "Allow public read access to team members"
  ON team_members
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage team members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for stats
CREATE POLICY "Allow public read access to stats"
  ON stats
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage stats"
  ON stats
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for page content
CREATE POLICY "Allow public read access to page content"
  ON page_content
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage page content"
  ON page_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial page content
INSERT INTO page_content (section, title, content) VALUES
  ('mission', 'Our Mission', 'To create a vibrant and inclusive community where every student can discover, join, and thrive in societies that match their interests and aspirations.'),
  ('hiring', 'We''re Hiring!', 'Join our team and make a difference today.');

-- Insert initial stats
INSERT INTO stats (label, value, icon, "order") VALUES
  ('Active Societies', '50+', 'Users', 1),
  ('Years of Excellence', '25+', 'Award', 2),
  ('Annual Events', '100+', 'Calendar', 3),
  ('Student Reach', '5000+', 'Mail', 4);