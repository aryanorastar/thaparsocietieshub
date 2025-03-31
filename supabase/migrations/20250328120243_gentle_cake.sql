/*
  # Fix phone number validation and updated_at field

  1. Changes
    - Remove updated_at trigger and column
    - Update phone number validation
    - Ensure proper data type handling
*/

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS update_societies_updated_at ON societies;
DROP FUNCTION IF EXISTS update_updated_at();

-- Drop the updated_at column if it exists
ALTER TABLE societies 
DROP COLUMN IF EXISTS updated_at;

-- Drop the existing phone number constraint
ALTER TABLE societies 
DROP CONSTRAINT IF EXISTS phone_number_length_check;

-- Add new phone number constraint
ALTER TABLE societies 
ADD CONSTRAINT phone_number_length_check 
CHECK (
  phone_number IS NULL OR 
  (phone_number::text ~ '^[0-9]+$' AND length(phone_number::text) >= 10)
);