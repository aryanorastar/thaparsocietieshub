/*
  # Fix timeline events table

  1. Changes
    - Add IF NOT EXISTS checks
    - Drop existing policies if they exist
    - Safely insert initial events
*/

-- Create table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'timeline_events') THEN
    CREATE TABLE timeline_events (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      month text NOT NULL,
      title text NOT NULL,
      description text NOT NULL,
      icon text NOT NULL,
      color text NOT NULL,
      "order" integer NOT NULL DEFAULT 0,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public read access to timeline events" ON timeline_events;
  DROP POLICY IF EXISTS "Allow authenticated users to manage timeline events" ON timeline_events;
END $$;

-- Create policies
CREATE POLICY "Allow public read access to timeline events"
  ON timeline_events
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage timeline events"
  ON timeline_events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial events if table is empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM timeline_events LIMIT 1) THEN
    INSERT INTO timeline_events (month, title, description, icon, color, "order") VALUES
      ('August', 'Orientation Week', 'Welcome events and society introductions for new students', 'GraduationCap', 'from-purple-500 to-indigo-500', 1),
      ('September', 'TIET Tech Fest', 'Annual technical festival featuring competitions and workshops', 'Sparkles', 'from-blue-500 to-cyan-500', 2),
      ('October', 'Cultural Extravaganza', 'Showcase of art, music, and dance performances', 'Star', 'from-pink-500 to-rose-500', 3),
      ('January', 'Sports Meet', 'Inter-department sports competitions and athletic events', 'Trophy', 'from-amber-500 to-orange-500', 4),
      ('March', 'Research Symposium', 'Student research presentations and academic conferences', 'Calendar', 'from-emerald-500 to-teal-500', 5);
  END IF;
END $$;