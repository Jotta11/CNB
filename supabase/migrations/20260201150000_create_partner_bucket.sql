-- Create partner-logos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('partner-logos', 'partner-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Ensure RLS is enabled on objects (standard Supabase practice, usually already on)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. Policy: Anyone can view partner logos
DROP POLICY IF EXISTS "Anyone can view partner logos" ON storage.objects;
CREATE POLICY "Anyone can view partner logos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'partner-logos');

-- 2. Policy: Admins can upload partner logos
DROP POLICY IF EXISTS "Admins can upload partner logos" ON storage.objects;
CREATE POLICY "Admins can upload partner logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'partner-logos' AND 
  public.has_role(auth.uid(), 'admin')
);

-- 3. Policy: Admins can update partner logos
DROP POLICY IF EXISTS "Admins can update partner logos" ON storage.objects;
CREATE POLICY "Admins can update partner logos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'partner-logos' AND 
  public.has_role(auth.uid(), 'admin')
);

-- 4. Policy: Admins can delete partner logos
DROP POLICY IF EXISTS "Admins can delete partner logos" ON storage.objects;
CREATE POLICY "Admins can delete partner logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'partner-logos' AND 
  public.has_role(auth.uid(), 'admin')
);
