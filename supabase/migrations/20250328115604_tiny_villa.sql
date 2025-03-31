/*
  # Fix societies table phone number handling

  1. Changes
    - Modify phone_number column to use numeric type
    - Add proper constraints
*/

-- Update phone_number column type and constraints
ALTER TABLE societies
ALTER COLUMN phone_number TYPE numeric USING phone_number::numeric;

-- Add check constraint for valid phone numbers
ALTER TABLE societies
ADD CONSTRAINT phone_number_length_check 
CHECK (
  phone_number IS NULL OR 
  (phone_number::text ~ '^[0-9]+$' AND length(phone_number::text) >= 10)
);