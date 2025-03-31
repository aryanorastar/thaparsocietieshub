/*
  # Add duration fields to timeline events

  1. Changes
    - Add end_date column for multi-day events
    - Add duration_hours column for single-day events
    - Both fields are optional to support different event types
*/

-- Add duration-related columns
ALTER TABLE timeline_events
ADD COLUMN IF NOT EXISTS end_date date,
ADD COLUMN IF NOT EXISTS duration_hours numeric;

-- Add constraint to ensure end_date is after event_date
ALTER TABLE timeline_events
ADD CONSTRAINT end_date_check 
CHECK (end_date IS NULL OR end_date >= event_date);

-- Update existing events with duration information
UPDATE timeline_events
SET end_date = CASE
  WHEN title = 'Orientation Week' THEN event_date + interval '3 days'
  WHEN title = 'TIET Tech Fest' THEN event_date + interval '2 days'
  ELSE NULL
END,
duration_hours = CASE
  WHEN title = 'Research Symposium' THEN 4
  WHEN title = 'Cultural Extravaganza' THEN 6
  ELSE NULL
END;