/*
  # Add faculty head to societies table

  1. Changes
    - Add faculty_head column to societies table
    - Make it nullable to support existing records
*/

ALTER TABLE societies
ADD COLUMN IF NOT EXISTS faculty_head text;