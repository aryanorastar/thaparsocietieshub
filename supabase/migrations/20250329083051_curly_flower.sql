/*
  # Add venue to timeline events

  1. Changes
    - Add venue column to timeline_events table
    - Update existing events with venue information
*/

-- Add venue column
ALTER TABLE timeline_events
ADD COLUMN IF NOT EXISTS venue text;

-- Update existing events with venue information
UPDATE timeline_events
SET venue = CASE
  WHEN title = 'Orientation Week' THEN 'Main Auditorium'
  WHEN title = 'TIET Tech Fest' THEN 'Various Department Buildings'
  WHEN title = 'Cultural Extravaganza' THEN 'Open Air Theatre'
  WHEN title = 'Sports Meet' THEN 'Sports Complex'
  WHEN title = 'Research Symposium' THEN 'Lecture Hall Complex'
  ELSE venue
END
WHERE venue IS NULL;