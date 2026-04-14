-- Permite que admins vejam todos os registros de user_roles (necessário para a aba Equipe Admin)
-- A migração 20260105011139 removeu a política "Admins can view all roles" e deixou apenas
-- "Users can view their own roles", impedindo admins de listar outros admins.

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin')
);
