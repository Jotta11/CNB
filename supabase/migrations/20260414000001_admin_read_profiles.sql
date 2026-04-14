-- Remove policies antigas antes de recriar
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Permite que admins leiam todos os perfis; usuários leem apenas o próprio
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR auth.uid() = user_id
);
