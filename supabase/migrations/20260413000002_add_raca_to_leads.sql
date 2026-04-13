-- Add raca column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS raca text;
