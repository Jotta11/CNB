-- Create a secure function to update lotes that bypasses RLS issues
-- This functions as a "sudo" command for authenticated admins

CREATE OR REPLACE FUNCTION public.update_lote_safe(
  p_lote_id UUID,
  p_updates JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Run as owner to bypass RLS
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- Double check that the calling user is an admin (redundant but safe)
  -- We trust the has_role function, but since RLS is failing, we manually check user_roles
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access Denied: User is not an admin';
  END IF;

  -- Perform the update
  UPDATE public.lotes
  SET 
    numero = COALESCE((p_updates->>'numero')::text, numero),
    titulo = COALESCE((p_updates->>'titulo')::text, titulo),
    raca = COALESCE((p_updates->>'raca')::text, raca),
    idade = COALESCE((p_updates->>'idade')::text, idade),
    peso = COALESCE((p_updates->>'peso')::text, peso),
    quantidade = COALESCE((p_updates->>'quantidade')::integer, quantidade),
    sexo = COALESCE((p_updates->>'sexo')::text, sexo),
    estado = COALESCE((p_updates->>'estado')::text, estado),
    localizacao = COALESCE((p_updates->>'localizacao')::text, localizacao),
    preco = COALESCE((p_updates->>'preco')::numeric, preco),
    descricao = COALESCE((p_updates->>'descricao')::text, descricao),
    -- Handle array specially if needed, but simple cast works for JSONB -> text[] often. 
    -- For safety in this hotfix, we skip complex array logic if not critical, 
    -- but let's try to handle video_url specifically as it's the bug.
    video_url = COALESCE((p_updates->>'video_url')::text, video_url),
    imagem_url = COALESCE((p_updates->>'imagem_url')::text, imagem_url),
    ativo = COALESCE((p_updates->>'ativo')::boolean, ativo),
    ordem = COALESCE((p_updates->>'ordem')::integer, ordem),
    capacidade_carga = COALESCE((p_updates->>'capacidade_carga')::integer, capacidade_carga),
    tipo_implemento = COALESCE((p_updates->>'tipo_implemento')::text, tipo_implemento),
    qtd_carretas = COALESCE((p_updates->>'qtd_carretas')::integer, qtd_carretas),
    updated_at = now()
  WHERE id = p_lote_id
  RETURNING to_jsonb(lotes.*) INTO v_result;

  RETURN v_result;
END;
$$;
