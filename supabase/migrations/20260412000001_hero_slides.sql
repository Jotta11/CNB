-- Tabela de slides do carrossel hero
CREATE TABLE public.hero_slides (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo          TEXT NOT NULL,
  subtitulo       TEXT,
  botao_texto     TEXT NOT NULL,
  botao_url       TEXT NOT NULL,
  imagem_mobile   TEXT,
  imagem_desktop  TEXT,
  ordem           INTEGER NOT NULL DEFAULT 0,
  ativo           BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer um pode ver hero_slides"
  ON public.hero_slides FOR SELECT
  USING (true);

CREATE POLICY "Admins gerenciam hero_slides"
  ON public.hero_slides FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger updated_at (função já existe no banco)
CREATE TRIGGER update_hero_slides_updated_at
  BEFORE UPDATE ON public.hero_slides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Slide de exemplo desativado para facilitar o primeiro uso no CMS
INSERT INTO public.hero_slides (titulo, subtitulo, botao_texto, botao_url, ordem, ativo)
VALUES (
  'Conectando os melhores lotes para a sua fazenda',
  'Com a Conexão Norte Bovino, você compra e vende com inteligência de mercado.',
  'Ver Lotes',
  '/lotes',
  1,
  false
);
