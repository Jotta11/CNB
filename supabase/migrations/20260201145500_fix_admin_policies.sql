-- RESTORE MISSING ADMIN POLICIES
-- The previous state showed tables with RLS enabled but no write policies for admins.

-- 1. Ensure the has_role function exists (idempotent check)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role text)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role::text = _role
  )
$$;

-- 2. Policies for 'lotes'
-- Drop existing implementation if it differs/exists to ensure clean slate for this policy
DROP POLICY IF EXISTS "Admins can manage lotes" ON public.lotes;

CREATE POLICY "Admins can manage lotes"
ON public.lotes
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- 3. Policies for 'site_settings'
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;

CREATE POLICY "Admins can manage site settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- 4. Policies for 'partners' (assuming table name is 'partners' based on screenshot)
-- Note: Check if table 'partners' exists first to avoid error if it was named differently in earlier migrations
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'partners') THEN
        DROP POLICY IF EXISTS "Admins can manage partners" ON public.partners;
        
        EXECUTE 'CREATE POLICY "Admins can manage partners" ON public.partners FOR ALL TO authenticated USING (public.has_role(auth.uid(), ''admin'')) WITH CHECK (public.has_role(auth.uid(), ''admin''))';
    END IF;
END $$;

-- 5. Policies for 'freight_rates' (Screenshot showed "No policies created yet")
DROP POLICY IF EXISTS "Admins can manage freight rates" ON public.freight_rates;

CREATE POLICY "Admins can manage freight rates"
ON public.freight_rates
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- 6. Ensure public read access exists for freight_rates if missing
DROP POLICY IF EXISTS "Anyone can view freight rates" ON public.freight_rates;
CREATE POLICY "Anyone can view freight rates" ON public.freight_rates FOR SELECT USING (true);
