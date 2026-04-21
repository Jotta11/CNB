-- Torna botao_texto e botao_url opcionais (o botão pode não existir)
ALTER TABLE public.hero_slides
  ALTER COLUMN botao_texto DROP NOT NULL,
  ALTER COLUMN botao_url   DROP NOT NULL;
