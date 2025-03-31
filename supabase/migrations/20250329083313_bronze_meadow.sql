/*
  # Add full date to timeline events

  1. Changes
    - Add event_date column to timeline_events table
    - Update existing events with full dates
    - Make month column nullable (since we'll derive it from event_date)
*/

-- Add event_date column
ALTER TABLE timeline_events
ADD COLUMN IF NOT EXISTS event_date date;

-- Update existing events with dates
UPDATE timeline_events
SET event_date = CASE
  WHEN title = 'Orientation Week' THEN '2024-08-01'
  WHEN title = 'TIET Tech Fest' THEN '2024-09-15'
  WHEN title = 'Cultural Extravaganza' THEN '2024-10-20'
  WHEN title = 'Sports Meet' THEN '2025-01-10'
  WHEN title = 'Research Symposium' THEN '2025-03-15'
  ELSE event_date
END
WHERE event_date IS NULL;