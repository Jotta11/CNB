-- Add region/state field to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS regiao text;

-- Update the handle_new_user function to include region from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, regiao)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'regiao'
  );
  RETURN NEW;
END;
$function$;