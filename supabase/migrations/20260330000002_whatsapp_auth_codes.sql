-- Tabela para OTP via WhatsApp (infraestrutura para autenticação futura)
CREATE TABLE IF NOT EXISTS whatsapp_auth_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telefone text NOT NULL,
  codigo text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '10 minutes'),
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- RLS: nenhum acesso direto — manipulado apenas via Edge Functions futuras
ALTER TABLE whatsapp_auth_codes ENABLE ROW LEVEL SECURITY;

-- Apenas service role (Edge Functions) pode manipular
CREATE POLICY "Sem acesso público"
  ON whatsapp_auth_codes FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);
