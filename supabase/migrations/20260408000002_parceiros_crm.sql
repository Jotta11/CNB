-- supabase/migrations/20260408000002_parceiros_crm.sql

-- ─── parceiros ────────────────────────────────────────────────────────────────
CREATE TABLE public.parceiros (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo TEXT       NOT NULL,
  cpf          TEXT        NOT NULL UNIQUE,
  telefone     TEXT,
  email        TEXT,
  endereco     TEXT,
  chave_pix    TEXT,
  profissao    TEXT        NOT NULL CHECK (profissao IN ('Corretor','Veterinário','Gerente de Banco','Zootecnista','Freelancer')),
  uf           TEXT        NOT NULL CHECK (uf IN ('AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO')),
  cidade       TEXT        NOT NULL,
  status_funil TEXT        NOT NULL DEFAULT 'prospeccao' CHECK (status_funil IN ('prospeccao','fechamento','ativo','com_indicacao')),
  origem       TEXT        NOT NULL DEFAULT 'manual' CHECK (origem IN ('manual','landing_page')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.parceiros ENABLE ROW LEVEL SECURITY;

-- Admins: acesso total
CREATE POLICY "Admins can manage parceiros"
  ON public.parceiros FOR ALL TO authenticated
  USING  (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Público: apenas INSERT (formulário da landing page)
CREATE POLICY "Public can insert parceiros"
  ON public.parceiros FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE TRIGGER update_parceiros_updated_at
  BEFORE UPDATE ON public.parceiros
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ─── indicacoes ───────────────────────────────────────────────────────────────
CREATE TABLE public.indicacoes (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  parceiro_id       UUID        NOT NULL REFERENCES public.parceiros(id) ON DELETE CASCADE,
  cliente_nome      TEXT        NOT NULL,
  cliente_telefone  TEXT,
  cliente_municipio TEXT,
  cliente_uf        TEXT CHECK (cliente_uf IN ('AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO')),
  fluxo             TEXT        NOT NULL CHECK (fluxo IN ('Demanda','Oferta')),
  urgencia          TEXT        NOT NULL CHECK (urgencia IN ('Imediata','Futura')),
  categoria         TEXT        NOT NULL CHECK (categoria IN ('Bezerro','Garrote','Boi Magro','Boi Gordo','Novilha','Vaca','Matriz')),
  raca              TEXT        NOT NULL CHECK (raca IN ('Nelore','Cruzamento Industrial','Angus','Brahman','Senepol','Outros')),
  num_cabecas       INTEGER     NOT NULL CHECK (num_cabecas > 0),
  idade             TEXT,
  peso_atual        NUMERIC,
  data_projetada    DATE,
  observacoes_ia    TEXT,
  status            TEXT        NOT NULL DEFAULT 'em_validacao' CHECK (status IN ('em_validacao','validada','em_negociacao','finalizada')),
  origem            TEXT        NOT NULL DEFAULT 'manual',
  cupom_utilizado   TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.indicacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage indicacoes"
  ON public.indicacoes FOR ALL TO authenticated
  USING  (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_indicacoes_updated_at
  BEFORE UPDATE ON public.indicacoes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ─── parceiro_contatos ────────────────────────────────────────────────────────
CREATE TABLE public.parceiro_contatos (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  parceiro_id UUID        NOT NULL REFERENCES public.parceiros(id) ON DELETE CASCADE,
  tipo        TEXT        NOT NULL CHECK (tipo IN ('indicacao_criada','contrato_gerado','contato_manual','edicao_cadastro')),
  descricao   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.parceiro_contatos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage parceiro_contatos"
  ON public.parceiro_contatos FOR ALL TO authenticated
  USING  (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- ─── contratos ────────────────────────────────────────────────────────────────
CREATE TABLE public.contratos (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo         TEXT        NOT NULL CHECK (tipo IN ('parceria','negocio')),
  parceiro_id  UUID        NOT NULL REFERENCES public.parceiros(id) ON DELETE CASCADE,
  indicacao_id UUID        REFERENCES public.indicacoes(id) ON DELETE SET NULL,
  gerado_em    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contratos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage contratos"
  ON public.contratos FOR ALL TO authenticated
  USING  (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- ─── modelos_contrato ─────────────────────────────────────────────────────────
CREATE TABLE public.modelos_contrato (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo       TEXT        NOT NULL UNIQUE,
  conteudo   TEXT        NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.modelos_contrato ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage modelos_contrato"
  ON public.modelos_contrato FOR ALL TO authenticated
  USING  (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- ─── Índices de performance ───────────────────────────────────────────────────
CREATE INDEX idx_indicacoes_parceiro_id       ON public.indicacoes(parceiro_id);
CREATE INDEX idx_contratos_parceiro_id        ON public.contratos(parceiro_id);
CREATE INDEX idx_contratos_indicacao_id       ON public.contratos(indicacao_id);
CREATE INDEX idx_parceiro_contatos_parceiro   ON public.parceiro_contatos(parceiro_id);
CREATE INDEX idx_parceiro_contatos_created_at ON public.parceiro_contatos(created_at DESC);
