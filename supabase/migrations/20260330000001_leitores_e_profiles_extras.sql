-- Adicionar colunas extras à tabela profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS telefone text,
  ADD COLUMN IF NOT EXISTS ciclo_produtivo text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS receber_tabela_precos boolean DEFAULT false;

-- Criar tabela de leitores do blog
CREATE TABLE IF NOT EXISTS leitores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text NOT NULL,
  telefone text NOT NULL,
  area_atuacao text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- RLS: leitores são inseríveis por qualquer um (anônimo), legíveis apenas por admin
ALTER TABLE leitores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer um pode inserir leitor"
  ON leitores FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin pode ler leitores"
  ON leitores FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
