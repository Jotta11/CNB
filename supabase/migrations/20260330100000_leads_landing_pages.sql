-- Migração: adiciona colunas para landing pages de captação de leads
-- e expande o CHECK constraint do campo tipo para aceitar novos valores

-- 1. Remover o CHECK constraint antigo do campo tipo (nome gerado automaticamente)
ALTER TABLE public.leads
  DROP CONSTRAINT IF EXISTS leads_tipo_check;

-- 2. Adicionar novo CHECK constraint com os valores expandidos
ALTER TABLE public.leads
  ADD CONSTRAINT leads_tipo_check
  CHECK (tipo IN ('comprar', 'vender', 'tabela_precos', 'ofertas_direcionadas'));

-- 3. Adicionar novas colunas para as landing pages
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS area_atuacao TEXT,
  ADD COLUMN IF NOT EXISTS ciclo_produtivo TEXT,
  ADD COLUMN IF NOT EXISTS volume_rebanho TEXT,
  ADD COLUMN IF NOT EXISTS categoria_gado TEXT,
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS utm_content TEXT;
