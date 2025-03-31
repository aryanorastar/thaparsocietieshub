/*
  # Add new society categories

  1. Changes
    - Add 'travel' and 'internship' to society_category enum
*/

ALTER TYPE society_category ADD VALUE IF NOT EXISTS 'travel';
ALTER TYPE society_category ADD VALUE IF NOT EXISTS 'internship';