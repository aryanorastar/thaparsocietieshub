/*
  # Add contact fields to societies table

  1. Changes
    - Add email and phone_number fields to societies table
    - Make room field nullable
*/

ALTER TABLE societies
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS phone_number text,
ALTER COLUMN room DROP NOT NULL;