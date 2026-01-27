-- Add localizacao field to lotes table for the state/region
ALTER TABLE public.lotes ADD COLUMN IF NOT EXISTS localizacao text DEFAULT 'Tocantins';

-- Update existing lotes to have a default location
UPDATE public.lotes SET localizacao = 'Tocantins' WHERE localizacao IS NULL;