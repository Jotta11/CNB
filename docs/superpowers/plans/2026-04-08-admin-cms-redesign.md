# Admin CMS Redesign — Módulo de Parceiros Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir as abas horizontais do painel admin por uma sidebar lateral com dois módulos (Site e Parceiros), portando o sistema de gestão de parceiros de indicação do repositório `sistema-de-indica-o-cnb` para dentro do CNB.

**Architecture:** A página `Admin.tsx` é redesenhada com um novo componente `AdminSidebar` que gerencia a navegação entre seções. Cinco novos componentes do módulo Parceiros são criados em `src/components/admin/parceiros/`. Quatro tabelas novas são adicionadas ao Supabase via migration. O formulário de `IndicacaoConectada.tsx` é atualizado para inserir diretamente em `parceiros`.

**Tech Stack:** React 18 + TypeScript + Vite, Tailwind CSS + shadcn/ui, Supabase (PostgreSQL + RLS), TanStack React Query, date-fns, recharts, lucide-react.

---

## Mapa de Arquivos

**Criar:**
- `supabase/migrations/20260408000002_parceiros_crm.sql` — 5 novas tabelas + RLS
- `src/data/parceiros-constants.ts` — constantes (funil, status, raças, etc.)
- `src/types/parceiros.ts` — interfaces TypeScript para as novas tabelas
- `src/components/admin/AdminSidebar.tsx` — sidebar lateral com grupos Site/Parceiros
- `src/components/admin/parceiros/ParceiroDashboard.tsx`
- `src/components/admin/parceiros/ParceiroCRM.tsx`
- `src/components/admin/parceiros/ParceiroIndicacoes.tsx`
- `src/components/admin/parceiros/ParceiroMetricas.tsx`
- `src/components/admin/parceiros/ParceiroContratos.tsx`
- `src/components/admin/parceiros/ModeloEditorModal.tsx`

**Modificar:**
- `src/pages/Admin.tsx` — substituir Tabs por sidebar + novos componentes
- `src/pages/IndicacaoConectada.tsx` — form insere em `parceiros` ao invés de `partner_applications`

---

## Task 1: Migration — Tabelas do Módulo Parceiros

**Files:**
- Create: `supabase/migrations/20260408000002_parceiros_crm.sql`

- [ ] **Step 1: Criar o arquivo de migration**

```sql
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
```

- [ ] **Step 2: Aplicar a migration**

```bash
npx supabase db push
```

Expected: migration aplicada sem erros. Se o ambiente local não estiver configurado, aplicar pelo dashboard do Supabase (SQL Editor).

- [ ] **Step 3: Verificar tabelas no Supabase dashboard**

Confirmar que as tabelas `parceiros`, `indicacoes`, `parceiro_contatos`, `contratos` e `modelos_contrato` existem em Table Editor.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260408000002_parceiros_crm.sql
git commit -m "feat: migration para tabelas do módulo CRM de parceiros"
```

---

## Task 2: Constantes e Tipos TypeScript

**Files:**
- Create: `src/data/parceiros-constants.ts`
- Create: `src/types/parceiros.ts`

- [ ] **Step 1: Criar arquivo de constantes**

```typescript
// src/data/parceiros-constants.ts

export const PROFISSOES = ['Corretor', 'Veterinário', 'Gerente de Banco', 'Zootecnista', 'Freelancer'] as const;

export const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
] as const;

export const UF_NAMES: Record<string, string> = {
  AC:'Acre', AL:'Alagoas', AP:'Amapá', AM:'Amazonas', BA:'Bahia', CE:'Ceará',
  DF:'Distrito Federal', ES:'Espírito Santo', GO:'Goiás', MA:'Maranhão',
  MT:'Mato Grosso', MS:'Mato Grosso do Sul', MG:'Minas Gerais', PA:'Pará',
  PB:'Paraíba', PR:'Paraná', PE:'Pernambuco', PI:'Piauí', RJ:'Rio de Janeiro',
  RN:'Rio Grande do Norte', RS:'Rio Grande do Sul', RO:'Rondônia', RR:'Roraima',
  SC:'Santa Catarina', SP:'São Paulo', SE:'Sergipe', TO:'Tocantins',
};

export const FLUXOS = ['Demanda', 'Oferta'] as const;
export const URGENCIAS = ['Imediata', 'Futura'] as const;
export const CATEGORIAS = ['Bezerro', 'Garrote', 'Boi Magro', 'Boi Gordo', 'Novilha', 'Vaca', 'Matriz'] as const;
export const RACAS = ['Nelore', 'Cruzamento Industrial', 'Angus', 'Brahman', 'Senepol', 'Outros'] as const;

export const FUNIL_STATUS = ['prospeccao', 'fechamento', 'ativo', 'com_indicacao'] as const;
export type FunilStatus = typeof FUNIL_STATUS[number];
export const FUNIL_LABELS: Record<FunilStatus, string> = {
  prospeccao:    'Em Prospecção',
  fechamento:    'Em Fechamento',
  ativo:         'Ativos',
  com_indicacao: 'C/ Indicação',
};

export const INDICACAO_STATUS = ['em_validacao', 'validada', 'em_negociacao', 'finalizada'] as const;
export type IndicacaoStatus = typeof INDICACAO_STATUS[number];
export const INDICACAO_STATUS_LABELS: Record<IndicacaoStatus, string> = {
  em_validacao:   'Em Validação',
  validada:       'Validada',
  em_negociacao:  'Em Negociação',
  finalizada:     'Finalizada',
};

export const CONTATO_TIPO_LABELS: Record<string, string> = {
  indicacao_criada:  'Indicação Criada',
  contrato_gerado:   'Contrato Gerado',
  contato_manual:    'Contato Manual',
  edicao_cadastro:   'Edição de Cadastro',
};

export const CONTATO_MANUAL_TIPOS = ['Ligação', 'WhatsApp', 'Visita', 'Outro'] as const;

export const TEMPLATE_VARS_PARCERIA = [
  { key: '{{nome_parceiro}}',    label: 'Nome do Parceiro' },
  { key: '{{cpf_cnpj}}',         label: 'CPF/CNPJ do Parceiro' },
  { key: '{{endereco_parceiro}}',label: 'Endereço do Parceiro' },
  { key: '{{pix}}',              label: 'Chave Pix' },
  { key: '{{profissao}}',        label: 'Profissão' },
  { key: '{{comissao}}',         label: 'Comissão (%)' },
  { key: '{{area_atuacao}}',     label: 'Área de Atuação' },
  { key: '{{vigencia}}',         label: 'Vigência' },
  { key: '{{data_assinatura}}',  label: 'Data de Assinatura' },
  { key: '{{data_atual}}',       label: 'Data Atual' },
] as const;

export const TEMPLATE_VARS_NEGOCIO = [
  ...TEMPLATE_VARS_PARCERIA,
  { key: '{{nome_cliente}}',        label: 'Nome do Cliente' },
  { key: '{{telefone_cliente}}',    label: 'Telefone do Cliente' },
  { key: '{{municipio_uf}}',        label: 'Município/UF do Cliente' },
  { key: '{{fluxo}}',               label: 'Fluxo' },
  { key: '{{categoria_gado}}',      label: 'Categoria' },
  { key: '{{raca}}',                label: 'Raça' },
  { key: '{{num_cabecas}}',         label: 'Nº de Cabeças' },
  { key: '{{peso_atual}}',          label: 'Peso Atual (kg)' },
  { key: '{{data_projetada}}',      label: 'Data Projetada' },
  { key: '{{valor_unidade}}',       label: 'Valor por Cabeça (R$)' },
  { key: '{{valor_total_lote}}',    label: 'Valor Total do Lote (R$)' },
  { key: '{{condicao_pagamento}}',  label: 'Condição de Pagamento' },
  { key: '{{data_entrega}}',        label: 'Data de Entrega' },
  { key: '{{observacoes}}',         label: 'Observações' },
] as const;
```

- [ ] **Step 2: Criar arquivo de tipos**

```typescript
// src/types/parceiros.ts

export interface Parceiro {
  id: string;
  nome_completo: string;
  cpf: string;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  chave_pix: string | null;
  profissao: string;
  uf: string;
  cidade: string;
  status_funil: string;
  origem: string;
  created_at: string;
  updated_at: string;
}

export interface Indicacao {
  id: string;
  parceiro_id: string;
  cliente_nome: string;
  cliente_telefone: string | null;
  cliente_municipio: string | null;
  cliente_uf: string | null;
  fluxo: string;
  urgencia: string;
  categoria: string;
  raca: string;
  num_cabecas: number;
  idade: string | null;
  peso_atual: number | null;
  data_projetada: string | null;
  observacoes_ia: string | null;
  status: string;
  origem: string;
  cupom_utilizado: string | null;
  created_at: string;
  updated_at: string;
  parceiros?: { nome_completo: string } | null;
}

export interface ParceiroContato {
  id: string;
  parceiro_id: string;
  tipo: string;
  descricao: string | null;
  created_at: string;
}

export interface Contrato {
  id: string;
  tipo: string;
  parceiro_id: string;
  indicacao_id: string | null;
  gerado_em: string;
  parceiros?: Parceiro | null;
  indicacoes?: Indicacao | null;
}

export interface ModeloContrato {
  id: string;
  tipo: string;
  conteudo: string;
  updated_at: string;
}

export type ParceiroInsert = Omit<Parceiro, 'id' | 'created_at' | 'updated_at'>;
export type IndicacaoInsert = Omit<Indicacao, 'id' | 'created_at' | 'updated_at' | 'parceiros'>;
```

- [ ] **Step 3: Commit**

```bash
git add src/data/parceiros-constants.ts src/types/parceiros.ts
git commit -m "feat: constantes e tipos TypeScript para módulo de parceiros"
```

---

## Task 3: AdminSidebar Component

**Files:**
- Create: `src/components/admin/AdminSidebar.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
// src/components/admin/AdminSidebar.tsx
import {
  Users, UserCheck, Package, Building2, Newspaper,
  CalendarDays, Settings, LayoutDashboard, Handshake,
  Target, BarChart3, FileText,
} from 'lucide-react';

export type SectionKey =
  | 'leads' | 'usuarios' | 'lotes' | 'parceiros' | 'noticias' | 'calendario' | 'settings'
  | 'parceiro-dashboard' | 'parceiro-crm' | 'parceiro-indicacoes' | 'parceiro-metricas' | 'parceiro-contratos';

interface SectionDef {
  key: SectionKey;
  label: string;
  icon: React.ElementType;
  group: 'site' | 'parceiros';
}

export const ALL_SECTIONS: SectionDef[] = [
  { key: 'leads',                label: 'Leads',       icon: Users,          group: 'site' },
  { key: 'usuarios',             label: 'Usuários',    icon: UserCheck,      group: 'site' },
  { key: 'lotes',                label: 'Lotes',       icon: Package,        group: 'site' },
  { key: 'parceiros',            label: 'Empresas',    icon: Building2,      group: 'site' },
  { key: 'noticias',             label: 'Notícias',    icon: Newspaper,      group: 'site' },
  { key: 'calendario',           label: 'Calendário',  icon: CalendarDays,   group: 'site' },
  { key: 'settings',             label: 'Configurações', icon: Settings,     group: 'site' },
  { key: 'parceiro-dashboard',   label: 'Dashboard',   icon: LayoutDashboard, group: 'parceiros' },
  { key: 'parceiro-crm',         label: 'CRM Parceiros', icon: Handshake,   group: 'parceiros' },
  { key: 'parceiro-indicacoes',  label: 'Indicações',  icon: Target,         group: 'parceiros' },
  { key: 'parceiro-metricas',    label: 'Métricas',    icon: BarChart3,      group: 'parceiros' },
  { key: 'parceiro-contratos',   label: 'Contratos',   icon: FileText,       group: 'parceiros' },
];

interface AdminSidebarProps {
  allowedKeys: string[] | null; // null = acesso total
  activeSection: SectionKey;
  onSelect: (key: SectionKey) => void;
}

const AdminSidebar = ({ allowedKeys, activeSection, onSelect }: AdminSidebarProps) => {
  const visible = allowedKeys
    ? ALL_SECTIONS.filter((s) => allowedKeys.includes(s.key))
    : ALL_SECTIONS;

  const siteItems = visible.filter((s) => s.group === 'site');
  const parceirosItems = visible.filter((s) => s.group === 'parceiros');

  const NavItem = ({ section }: { section: SectionDef }) => {
    const isActive = activeSection === section.key;
    const Icon = section.icon;
    return (
      <button
        onClick={() => onSelect(section.key)}
        className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors text-left rounded-none border-l-2 ${
          isActive
            ? 'bg-white/10 border-accent text-white'
            : 'border-transparent text-white/65 hover:text-white hover:bg-white/5'
        }`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        {section.label}
      </button>
    );
  };

  return (
    <aside className="w-52 bg-primary flex-shrink-0 flex flex-col py-4 overflow-y-auto">
      {siteItems.length > 0 && (
        <div className="mb-2">
          <p className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/35">
            🌐 Site
          </p>
          {siteItems.map((s) => <NavItem key={s.key} section={s} />)}
        </div>
      )}

      {parceirosItems.length > 0 && (
        <div className="mt-2">
          <div className="mx-4 mb-2 border-t border-white/10" />
          <p className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/35">
            🤝 Parceiros
          </p>
          {parceirosItems.map((s) => <NavItem key={s.key} section={s} />)}
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/AdminSidebar.tsx
git commit -m "feat: componente AdminSidebar com grupos Site e Parceiros"
```

---

## Task 4: Redesign Admin.tsx

**Files:**
- Modify: `src/pages/Admin.tsx`

- [ ] **Step 1: Ler o arquivo atual**

Ler `src/pages/Admin.tsx` para confirmar estado antes de editar.

- [ ] **Step 2: Substituir o conteúdo completo**

```tsx
// src/pages/Admin.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LogOut, Lock, Mail, Loader2 } from 'lucide-react';

import AdminSidebar, { type SectionKey, ALL_SECTIONS } from '@/components/admin/AdminSidebar';
import AdminLeads from '@/components/admin/AdminLeads';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminLotes from '@/components/admin/AdminLotes';
import AdminPartners from '@/components/admin/AdminPartners';
import AdminNews from '@/components/admin/AdminNews';
import AdminCalendario from '@/components/admin/AdminCalendario';
import AdminSettings from '@/components/admin/AdminSettings';
import ParceiroDashboard from '@/components/admin/parceiros/ParceiroDashboard';
import ParceiroCRM from '@/components/admin/parceiros/ParceiroCRM';
import ParceiroIndicacoes from '@/components/admin/parceiros/ParceiroIndicacoes';
import ParceiroMetricas from '@/components/admin/parceiros/ParceiroMetricas';
import ParceiroContratos from '@/components/admin/parceiros/ParceiroContratos';

const SECTION_COMPONENTS: Record<SectionKey, React.ComponentType> = {
  'leads':               AdminLeads,
  'usuarios':            AdminUsers,
  'lotes':               AdminLotes,
  'parceiros':           AdminPartners,
  'noticias':            AdminNews,
  'calendario':          AdminCalendario,
  'settings':            AdminSettings,
  'parceiro-dashboard':  ParceiroDashboard,
  'parceiro-crm':        ParceiroCRM,
  'parceiro-indicacoes': ParceiroIndicacoes,
  'parceiro-metricas':   ParceiroMetricas,
  'parceiro-contratos':  ParceiroContratos,
};

// ─── Formulário de login ──────────────────────────────────────────────────────

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) toast.error('Credenciais inválidas');
    } catch {
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bebas text-primary">Área Administrativa</h1>
            <p className="text-muted-foreground mt-2">Faça login para acessar o CMS</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@exemplo.com" className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" className="pl-10" required />
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary-medium" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Entrando...</> : 'Entrar'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Página Admin ─────────────────────────────────────────────────────────────

const Admin = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionKey>('leads');

  const { data: permissionsData, isLoading: permissionsLoading } = useQuery({
    queryKey: ['minha-permissao', user?.id],
    enabled: !!user && isAdmin,
    queryFn: async () => {
      const { data } = await supabase
        .from('admin_permissions')
        .select('tabs')
        .eq('user_id', user!.id)
        .maybeSingle();
      return data?.tabs as string[] | null;
    },
  });

  const handleSignOut = async () => {
    await signOut();
    toast.success('Logout realizado com sucesso');
  };

  if (loading || (isAdmin && permissionsLoading)) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return <AdminLoginForm />;

  // Se activeSection não está nas seções visíveis, resetar para a primeira disponível
  const visibleKeys = permissionsData
    ? ALL_SECTIONS.filter((s) => permissionsData.includes(s.key)).map((s) => s.key)
    : ALL_SECTIONS.map((s) => s.key);

  const currentSection = visibleKeys.includes(activeSection) ? activeSection : (visibleKeys[0] as SectionKey ?? 'leads');
  const ActiveComponent = SECTION_COMPONENTS[currentSection];

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="bg-primary text-white py-3 px-6 sticky top-0 z-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bebas">CNB — Painel Administrativo</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/80">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-white hover:text-white hover:bg-white/10">
              <LogOut className="w-4 h-4 mr-2" />Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar
          allowedKeys={permissionsData ?? null}
          activeSection={currentSection}
          onSelect={setActiveSection}
        />
        <main className="flex-1 overflow-y-auto p-8">
          <motion.div key={currentSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
            <ActiveComponent />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
```

- [ ] **Step 3: Rodar o dev server e verificar**

```bash
npm run dev
```

Acessar `http://localhost:8080/admin` e verificar:
- Login ainda funciona
- Sidebar aparece com grupos Site e Parceiros
- Clicar em cada item de Site carrega o componente correto
- Itens do grupo Parceiros aparecem (vão dar erro até os componentes serem criados — normal)

- [ ] **Step 4: Commit**

```bash
git add src/pages/Admin.tsx
git commit -m "feat: redesign do admin com sidebar lateral em dois módulos"
```

---

## Task 5: ParceiroDashboard

**Files:**
- Create: `src/components/admin/parceiros/ParceiroDashboard.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
// src/components/admin/parceiros/ParceiroDashboard.tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, TrendingUp, TrendingDown, Clock, UserX } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Parceiro, Indicacao, ParceiroContato } from '@/types/parceiros';

const db = supabase as any;

// ─── Geração de tarefas ───────────────────────────────────────────────────────

interface Tarefa {
  title: string;
  description: string;
  urgency: 'alta' | 'média' | 'baixa';
}

function gerarTarefas(
  indicacoes: Indicacao[],
  parceiros: Parceiro[],
  contatos: ParceiroContato[],
): Tarefa[] {
  const tarefas: Tarefa[] = [];
  const now = new Date();

  // Indicações em validação há mais de 24h
  indicacoes.forEach((ind) => {
    if (ind.status === 'em_validacao') {
      const horasAgo = (now.getTime() - new Date(ind.created_at).getTime()) / (1000 * 60 * 60);
      if (horasAgo > 24) {
        tarefas.push({
          title: 'Indicação aguardando validação',
          description: `"${ind.cliente_nome}" aguarda há ${formatDistanceToNow(new Date(ind.created_at), { locale: ptBR })}`,
          urgency: 'alta',
        });
      }
    }
  });

  // Oportunidades futuras paradas há mais de 7 dias
  indicacoes.forEach((ind) => {
    if (ind.urgencia === 'Futura' && ind.status === 'em_validacao') {
      const diasAgo = (now.getTime() - new Date(ind.created_at).getTime()) / (1000 * 60 * 60 * 24);
      if (diasAgo > 7) {
        tarefas.push({
          title: 'Oportunidade Futura — reativar contato',
          description: `Cliente "${ind.cliente_nome}" — ${ind.categoria} ${ind.raca}`,
          urgency: 'média',
        });
      }
    }
  });

  // Parceiros inativos há mais de 15 dias
  const ultimoContato = new Map<string, Date>();
  contatos.forEach((c) => {
    const d = new Date(c.created_at);
    const ex = ultimoContato.get(c.parceiro_id);
    if (!ex || d > ex) ultimoContato.set(c.parceiro_id, d);
  });

  parceiros.forEach((p) => {
    const last = ultimoContato.get(p.id) ?? new Date(p.created_at);
    const diasAgo = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
    if (diasAgo > 15) {
      tarefas.push({
        title: `Parceiro inativo há ${Math.floor(diasAgo)} dias`,
        description: `"${p.nome_completo}" — última interação: ${formatDistanceToNow(last, { locale: ptBR, addSuffix: true })}`,
        urgency: 'média',
      });
    }
  });

  return tarefas;
}

// ─── Componente ───────────────────────────────────────────────────────────────

const ParceiroDashboard = () => {
  const { data: parceiros = [] } = useQuery<Parceiro[]>({
    queryKey: ['crm-parceiros'],
    queryFn: async () => {
      const { data } = await db.from('parceiros').select('*');
      return data ?? [];
    },
  });

  const { data: indicacoes = [] } = useQuery<Indicacao[]>({
    queryKey: ['crm-indicacoes'],
    queryFn: async () => {
      const { data } = await db.from('indicacoes').select('*, parceiros(nome_completo)');
      return data ?? [];
    },
  });

  const { data: contatos = [] } = useQuery<ParceiroContato[]>({
    queryKey: ['crm-contatos-recentes'],
    queryFn: async () => {
      const { data } = await db.from('parceiro_contatos').select('*').order('created_at', { ascending: false }).limit(100);
      return data ?? [];
    },
  });

  const demandasCabecas = indicacoes.filter((i) => i.fluxo === 'Demanda').reduce((s, i) => s + i.num_cabecas, 0);
  const ofertasCabecas  = indicacoes.filter((i) => i.fluxo === 'Oferta').reduce((s, i) => s + i.num_cabecas, 0);
  const tarefas = gerarTarefas(indicacoes, parceiros, contatos);

  const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
    <div className="bg-white rounded-lg p-4 border border-border flex items-center gap-4">
      <div className="p-2 bg-primary/10 rounded-lg text-primary">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-primary">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bebas text-primary">Dashboard de Parceiros</h1>
        <p className="text-muted-foreground text-sm">Resumo geral do programa de indicações</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Parceiros"      value={parceiros.length}                      icon={<Users className="w-5 h-5" />} />
        <StatCard title="Total Indicações"     value={indicacoes.length}                     icon={<Target className="w-5 h-5" />} />
        <StatCard title="Demandas (cabeças)"   value={demandasCabecas.toLocaleString('pt-BR')} icon={<TrendingUp className="w-5 h-5" />} />
        <StatCard title="Ofertas (cabeças)"    value={ofertasCabecas.toLocaleString('pt-BR')}  icon={<TrendingDown className="w-5 h-5" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Feed de Tarefas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tarefas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma tarefa pendente. Sistema atualizado!</p>
          ) : (
            tarefas.slice(0, 8).map((t, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                <UserX className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                </div>
                <Badge variant={t.urgency === 'alta' ? 'destructive' : 'secondary'} className="text-[10px] shrink-0">
                  {t.urgency}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ParceiroDashboard;
```

- [ ] **Step 2: Verificar no browser**

Acessar `/admin` → clicar em "Dashboard" no grupo Parceiros → cards de métricas e feed de tarefas devem aparecer (zerados pois não há dados ainda).

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/parceiros/ParceiroDashboard.tsx
git commit -m "feat: ParceiroDashboard com métricas e feed de tarefas"
```

---

## Task 6: ParceiroCRM

**Files:**
- Create: `src/components/admin/parceiros/ParceiroCRM.tsx`

- [ ] **Step 1: Criar o componente** (kanban + modo lista + carteira + registrar contato)

```tsx
// src/components/admin/parceiros/ParceiroCRM.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Briefcase, Phone, Copy, Ticket, Users, UserPlus, UserCheck, Star } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  PROFISSOES, UFS, UF_NAMES, FUNIL_STATUS, FUNIL_LABELS,
  INDICACAO_STATUS_LABELS, CONTATO_TIPO_LABELS, CONTATO_MANUAL_TIPOS,
} from '@/data/parceiros-constants';
import type { Parceiro, Indicacao, ParceiroContato, ParceiroInsert } from '@/types/parceiros';

const db = supabase as any;

const emptyForm: Omit<ParceiroInsert, 'status_funil' | 'origem'> = {
  nome_completo: '', cpf: '', telefone: '', email: '',
  endereco: '', chave_pix: '', profissao: '', uf: '', cidade: '',
};

const getCupom = (nome: string) => {
  const partes = nome.trim().split(/\s+/);
  return partes.length > 1 ? partes[1].toUpperCase() : '';
};

const ParceiroCRM = () => {
  const qc = useQueryClient();
  const [viewMode, setViewMode]           = useState<'kanban' | 'list'>('kanban');
  const [formOpen, setFormOpen]           = useState(false);
  const [carteiraOpen, setCarteiraOpen]   = useState(false);
  const [contatoOpen, setContatoOpen]     = useState(false);
  const [editingId, setEditingId]         = useState<string | null>(null);
  const [selected, setSelected]           = useState<Parceiro | null>(null);
  const [form, setForm]                   = useState(emptyForm);
  const [contatoTipo, setContatoTipo]     = useState('');
  const [contatoDesc, setContatoDesc]     = useState('');

  const { data: parceiros = [], isLoading } = useQuery<Parceiro[]>({
    queryKey: ['crm-parceiros'],
    queryFn: async () => {
      const { data } = await db.from('parceiros').select('*').order('nome_completo');
      return data ?? [];
    },
  });

  const { data: lastContacts } = useQuery<Map<string, string>>({
    queryKey: ['crm-last-contacts'],
    queryFn: async () => {
      const { data } = await db.from('parceiro_contatos').select('parceiro_id, created_at').order('created_at', { ascending: false });
      const map = new Map<string, string>();
      data?.forEach((c: any) => { if (!map.has(c.parceiro_id)) map.set(c.parceiro_id, c.created_at); });
      return map;
    },
  });

  const { data: carteiraIndicacoes = [] } = useQuery<Indicacao[]>({
    queryKey: ['crm-carteira', selected?.id],
    enabled: !!selected,
    queryFn: async () => {
      const { data } = await db.from('indicacoes').select('*').eq('parceiro_id', selected!.id).order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const { data: timeline = [] } = useQuery<ParceiroContato[]>({
    queryKey: ['crm-timeline', selected?.id],
    enabled: !!selected,
    queryFn: async () => {
      const { data } = await db.from('parceiro_contatos').select('*').eq('parceiro_id', selected!.id).order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      if (editingId) {
        const { error } = await db.from('parceiros').update(data).eq('id', editingId);
        if (error) throw error;
        await db.from('parceiro_contatos').insert({ parceiro_id: editingId, tipo: 'edicao_cadastro', descricao: 'Cadastro atualizado' });
      } else {
        const { error } = await db.from('parceiros').insert({ ...data, status_funil: 'prospeccao', origem: 'manual' });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crm-parceiros'] });
      qc.invalidateQueries({ queryKey: ['crm-last-contacts'] });
      setFormOpen(false); setEditingId(null); setForm(emptyForm);
      toast.success(editingId ? 'Parceiro atualizado!' : 'Parceiro cadastrado!');
    },
    onError: (err: any) => toast.error(err.message ?? 'Erro ao salvar'),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await db.from('parceiros').update({ status_funil: status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['crm-parceiros'] }); toast.success('Status atualizado!'); },
    onError: (err: any) => toast.error(err.message),
  });

  const contatoMutation = useMutation({
    mutationFn: async () => {
      if (!selected) return;
      const { error } = await db.from('parceiro_contatos').insert({
        parceiro_id: selected.id, tipo: 'contato_manual', descricao: `${contatoTipo}: ${contatoDesc}`,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crm-timeline', selected?.id] });
      qc.invalidateQueries({ queryKey: ['crm-last-contacts'] });
      setContatoOpen(false); setContatoTipo(''); setContatoDesc('');
      toast.success('Contato registrado!');
    },
  });

  const openEdit = (p: Parceiro) => {
    setEditingId(p.id);
    setForm({ nome_completo: p.nome_completo, cpf: p.cpf, telefone: p.telefone ?? '', email: p.email ?? '',
      endereco: p.endereco ?? '', chave_pix: p.chave_pix ?? '', profissao: p.profissao, uf: p.uf, cidade: p.cidade });
    setFormOpen(true);
  };

  const getLastContact = (parceiroId: string) => {
    const last = lastContacts?.get(parceiroId);
    return last ? formatDistanceToNow(new Date(last), { locale: ptBR, addSuffix: true }) : 'Sem registro';
  };

  const getInactiveDays = (parceiroId: string, createdAt: string) => {
    const last = lastContacts?.get(parceiroId);
    const d = last ? new Date(last) : new Date(createdAt);
    return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleDragStart = (e: React.DragEvent, id: string) => e.dataTransfer.setData('parceiroId', id);
  const handleDragOver  = (e: React.DragEvent) => e.preventDefault();
  const handleDrop      = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('parceiroId');
    if (id) statusMutation.mutate({ id, status });
  };

  const countByStatus = (s: string) => parceiros.filter((p) => p.status_funil === s).length;

  const StatusIcons: Record<string, React.ElementType> = { prospeccao: UserPlus, fechamento: Users, ativo: UserCheck, com_indicacao: Star };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bebas text-primary">CRM Parceiros</h1>
          <p className="text-muted-foreground text-sm">Gestão da carteira e funil de indicação</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'kanban' ? 'list' : 'kanban')}>
            {viewMode === 'kanban' ? 'Modo Lista' : 'Modo Kanban'}
          </Button>
          <Button onClick={() => { setEditingId(null); setForm(emptyForm); setFormOpen(true); }}>
            <Plus className="w-4 h-4 mr-1" /> Novo Parceiro
          </Button>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {FUNIL_STATUS.map((s) => {
          const Icon = StatusIcons[s] ?? Users;
          return (
            <div key={s} className="bg-white rounded-lg p-3 border border-border flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded text-primary"><Icon className="w-4 h-4" /></div>
              <div>
                <p className="text-xs text-muted-foreground">{FUNIL_LABELS[s]}</p>
                <p className="text-xl font-bold text-primary">{countByStatus(s)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kanban */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FUNIL_STATUS.map((status) => {
            const col = parceiros.filter((p) => p.status_funil === status);
            return (
              <div key={status} className="bg-secondary/30 rounded-lg p-3 min-h-[200px]"
                onDrop={(e) => handleDrop(e, status)} onDragOver={handleDragOver}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-primary">{FUNIL_LABELS[status]}</h3>
                  <Badge variant="secondary" className="text-xs">{col.length}</Badge>
                </div>
                <div className="space-y-2">
                  {col.map((p) => {
                    const inativo = getInactiveDays(p.id, p.created_at) > 15;
                    const cupom = getCupom(p.nome_completo);
                    return (
                      <Card key={p.id} draggable onDragStart={(e) => handleDragStart(e, p.id)}
                        className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <p className="font-semibold text-sm">{p.nome_completo}</p>
                          {p.origem === 'landing_page' && (
                            <Badge className="text-[10px] bg-accent text-accent-foreground mt-1">Landing Page</Badge>
                          )}
                          <p className="text-xs text-muted-foreground">{p.profissao}</p>
                          <p className="text-xs text-muted-foreground">{p.cidade}/{p.uf}</p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-[10px] text-muted-foreground">{getLastContact(p.id)}</span>
                            {inativo && <Badge variant="destructive" className="text-[10px]">Inativo</Badge>}
                          </div>
                          {cupom && (
                            <div className="flex items-center gap-1 mt-1">
                              <Ticket className="w-3 h-3 text-accent" />
                              <span className="text-[10px] font-mono font-bold text-accent">{cupom}</span>
                              <Button variant="ghost" size="icon" className="h-4 w-4"
                                onClick={() => { navigator.clipboard.writeText(cupom); toast.success(`Cupom "${cupom}" copiado!`); }}>
                                <Copy className="w-2.5 h-2.5" />
                              </Button>
                            </div>
                          )}
                          <div className="flex gap-1 mt-2">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(p)}>
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setSelected(p); setCarteiraOpen(true); }}>
                              <Briefcase className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead><TableHead>Profissão</TableHead><TableHead>UF</TableHead>
                  <TableHead>Status</TableHead><TableHead>Último Contato</TableHead><TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Carregando...</TableCell></TableRow>
                ) : parceiros.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      {p.nome_completo}
                      {p.origem === 'landing_page' && <Badge className="ml-2 text-[10px] bg-accent text-accent-foreground">LP</Badge>}
                    </TableCell>
                    <TableCell>{p.profissao}</TableCell>
                    <TableCell>{p.uf}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{FUNIL_LABELS[p.status_funil as keyof typeof FUNIL_LABELS] ?? p.status_funil}</Badge></TableCell>
                    <TableCell className="text-sm">
                      {getLastContact(p.id)}
                      {getInactiveDays(p.id, p.created_at) > 15 && <Badge variant="destructive" className="ml-2 text-[10px]">Inativo</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelected(p); setCarteiraOpen(true); }}><Briefcase className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dialog — Form */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? 'Editar Parceiro' : 'Novo Parceiro'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nome Completo *</Label><Input value={form.nome_completo} onChange={(e) => setForm({ ...form, nome_completo: e.target.value })} /></div>
            <div><Label>CPF *</Label><Input value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} /></div>
            <div><Label>Telefone</Label><Input value={form.telefone ?? ''} onChange={(e) => setForm({ ...form, telefone: e.target.value })} /></div>
            <div><Label>E-mail</Label><Input type="email" value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Endereço</Label><Input value={form.endereco ?? ''} onChange={(e) => setForm({ ...form, endereco: e.target.value })} /></div>
            <div><Label>Chave Pix</Label><Input value={form.chave_pix ?? ''} onChange={(e) => setForm({ ...form, chave_pix: e.target.value })} /></div>
            <div>
              <Label>Profissão *</Label>
              <Select value={form.profissao} onValueChange={(v) => setForm({ ...form, profissao: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{PROFISSOES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>UF *</Label>
                <Select value={form.uf} onValueChange={(v) => setForm({ ...form, uf: v, cidade: '' })}>
                  <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                  <SelectContent>{UFS.map((u) => <SelectItem key={u} value={u}>{u} — {UF_NAMES[u]}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Cidade *</Label><Input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
            <Button onClick={() => saveMutation.mutate(form)}
              disabled={!form.nome_completo || !form.cpf || !form.profissao || !form.uf || !form.cidade || saveMutation.isPending}>
              {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog — Carteira */}
      <Dialog open={carteiraOpen} onOpenChange={setCarteiraOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Carteira — {selected?.nome_completo}</DialogTitle></DialogHeader>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{selected?.profissao} — {selected?.cidade}/{selected?.uf}</p>
            <Button size="sm" variant="outline" onClick={() => setContatoOpen(true)}>
              <Phone className="w-4 h-4 mr-1" /> Registrar Contato
            </Button>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Indicações ({carteiraIndicacoes.length})</h3>
            {carteiraIndicacoes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma indicação vinculada</p>
            ) : carteiraIndicacoes.map((ind) => (
              <div key={ind.id} className="p-3 mb-2 rounded-lg bg-secondary/30 border border-border text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{ind.cliente_nome}</span>
                  <div className="flex gap-1">
                    <Badge variant={ind.fluxo === 'Demanda' ? 'default' : 'secondary'} className="text-[10px]">{ind.fluxo}</Badge>
                    <Badge variant={ind.urgencia === 'Imediata' ? 'destructive' : 'outline'} className="text-[10px]">{ind.urgencia}</Badge>
                    <Badge variant="outline" className="text-[10px]">{INDICACAO_STATUS_LABELS[ind.status as keyof typeof INDICACAO_STATUS_LABELS] ?? ind.status}</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{ind.categoria} • {ind.raca} • {ind.num_cabecas} cabeças</p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Timeline de Relacionamento</h3>
            {timeline.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum registro de contato</p>
            ) : timeline.map((c) => (
              <div key={c.id} className="flex items-start gap-3 p-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs">{CONTATO_TIPO_LABELS[c.tipo] ?? c.tipo}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(c.created_at), { locale: ptBR, addSuffix: true })}
                    </span>
                  </div>
                  {c.descricao && <p className="text-xs text-muted-foreground">{c.descricao}</p>}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog — Registrar Contato */}
      <Dialog open={contatoOpen} onOpenChange={setContatoOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Registrar Contato</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tipo de Contato</Label>
              <Select value={contatoTipo} onValueChange={setContatoTipo}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{CONTATO_MANUAL_TIPOS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea value={contatoDesc} onChange={(e) => setContatoDesc(e.target.value)} placeholder="Detalhes do contato..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContatoOpen(false)}>Cancelar</Button>
            <Button onClick={() => contatoMutation.mutate()} disabled={!contatoTipo || contatoMutation.isPending}>
              {contatoMutation.isPending ? 'Salvando...' : 'Registrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParceiroCRM;
```

- [ ] **Step 2: Verificar no browser**

Acessar CRM Parceiros → criar um parceiro manualmente → verificar que aparece no kanban em "Em Prospecção".

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/parceiros/ParceiroCRM.tsx
git commit -m "feat: ParceiroCRM com kanban, modo lista, carteira e timeline"
```

---

## Task 7: ParceiroIndicacoes

**Files:**
- Create: `src/components/admin/parceiros/ParceiroIndicacoes.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
// src/components/admin/parceiros/ParceiroIndicacoes.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Target, Zap, Clock, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  FLUXOS, URGENCIAS, CATEGORIAS, RACAS, UFS,
  INDICACAO_STATUS, INDICACAO_STATUS_LABELS,
} from '@/data/parceiros-constants';
import type { Indicacao, IndicacaoInsert, Parceiro } from '@/types/parceiros';

const db = supabase as any;

const emptyForm: Omit<IndicacaoInsert, 'status' | 'origem'> = {
  parceiro_id: '', cliente_nome: '', cliente_telefone: '', cliente_municipio: '',
  cliente_uf: '', fluxo: '', urgencia: '', categoria: '', raca: '',
  num_cabecas: 0, idade: '', peso_atual: null, data_projetada: null, observacoes_ia: '', cupom_utilizado: '',
};

const ParceiroIndicacoes = () => {
  const qc = useQueryClient();
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [formOpen, setFormOpen] = useState(false);
  const [filterFluxo, setFilterFluxo] = useState<string>('all');
  const [form, setForm] = useState(emptyForm);

  const { data: parceirosAtivos = [] } = useQuery<Parceiro[]>({
    queryKey: ['crm-parceiros-ativos'],
    queryFn: async () => {
      const { data } = await db.from('parceiros').select('id, nome_completo, status_funil')
        .in('status_funil', ['ativo', 'com_indicacao', 'fechamento', 'prospeccao']).order('nome_completo');
      return data ?? [];
    },
  });

  const { data: indicacoes = [], isLoading } = useQuery<Indicacao[]>({
    queryKey: ['crm-indicacoes'],
    queryFn: async () => {
      const { data } = await db.from('indicacoes').select('*, parceiros(nome_completo)').order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const filtered = filterFluxo === 'all' ? indicacoes : indicacoes.filter((i) => i.fluxo === filterFluxo);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await db.from('indicacoes').insert({
        ...form, num_cabecas: Number(form.num_cabecas),
        status: 'em_validacao', origem: 'manual',
        peso_atual: form.peso_atual ? Number(form.peso_atual) : null,
      });
      if (error) throw error;
      // Registrar contato na timeline do parceiro
      await db.from('parceiro_contatos').insert({
        parceiro_id: form.parceiro_id, tipo: 'indicacao_criada',
        descricao: `Nova indicação: ${form.cliente_nome}`,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crm-indicacoes'] });
      qc.invalidateQueries({ queryKey: ['crm-timeline'] });
      setFormOpen(false); setForm(emptyForm);
      toast.success('Indicação cadastrada!');
    },
    onError: (err: any) => toast.error(err.message ?? 'Erro ao salvar'),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await db.from('indicacoes').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['crm-indicacoes'] }); toast.success('Status atualizado!'); },
  });

  const handleDragStart = (e: React.DragEvent, id: string) => e.dataTransfer.setData('indicacaoId', id);
  const handleDragOver  = (e: React.DragEvent) => e.preventDefault();
  const handleDrop      = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('indicacaoId');
    if (id) statusMutation.mutate({ id, status });
  };

  const totalDemanda = indicacoes.filter((i) => i.fluxo === 'Demanda').reduce((s, i) => s + i.num_cabecas, 0);
  const totalOferta  = indicacoes.filter((i) => i.fluxo === 'Oferta').reduce((s, i) => s + i.num_cabecas, 0);
  const imediatas    = indicacoes.filter((i) => i.urgencia === 'Imediata').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bebas text-primary">Indicações</h1>
          <p className="text-muted-foreground text-sm">Oportunidades indicadas pelos parceiros</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'list' ? 'kanban' : 'list')}>
            {viewMode === 'list' ? 'Modo Kanban' : 'Modo Lista'}
          </Button>
          <Button onClick={() => setFormOpen(true)}><Plus className="w-4 h-4 mr-1" /> Nova Indicação</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg p-3 border border-border flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded text-primary"><Target className="w-4 h-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total</p><p className="text-xl font-bold">{indicacoes.length}</p></div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-border flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded text-accent"><Zap className="w-4 h-4" /></div>
          <div><p className="text-xs text-muted-foreground">Imediatas</p><p className="text-xl font-bold">{imediatas}</p></div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-border flex items-center gap-3">
          <div className="p-2 bg-secondary/50 rounded"><BarChart3 className="w-4 h-4" /></div>
          <div><p className="text-xs text-muted-foreground">Demanda / Oferta</p><p className="text-xl font-bold">{totalDemanda} / {totalOferta}</p></div>
        </div>
      </div>

      {/* Filtro de fluxo */}
      <div className="flex gap-2">
        {['all', 'Demanda', 'Oferta'].map((f) => (
          <Button key={f} size="sm" variant={filterFluxo === f ? 'default' : 'outline'} onClick={() => setFilterFluxo(f)}>
            {f === 'all' ? 'Todos' : f}
          </Button>
        ))}
      </div>

      {viewMode === 'list' ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead><TableHead>Parceiro</TableHead><TableHead>Fluxo</TableHead>
                  <TableHead>Categoria / Raça</TableHead><TableHead>Cabeças</TableHead>
                  <TableHead>Urgência</TableHead><TableHead>Status</TableHead><TableHead>Criado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Carregando...</TableCell></TableRow>
                ) : filtered.map((ind) => (
                  <TableRow key={ind.id}>
                    <TableCell className="font-medium">{ind.cliente_nome}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{ind.parceiros?.nome_completo ?? '—'}</TableCell>
                    <TableCell><Badge variant={ind.fluxo === 'Demanda' ? 'default' : 'secondary'} className="text-[10px]">{ind.fluxo}</Badge></TableCell>
                    <TableCell className="text-sm">{ind.categoria} • {ind.raca}</TableCell>
                    <TableCell className="text-sm font-mono">{ind.num_cabecas}</TableCell>
                    <TableCell><Badge variant={ind.urgencia === 'Imediata' ? 'destructive' : 'outline'} className="text-[10px]">{ind.urgencia}</Badge></TableCell>
                    <TableCell>
                      <Select value={ind.status} onValueChange={(s) => statusMutation.mutate({ id: ind.id, status: s })}>
                        <SelectTrigger className="h-7 text-[11px] w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {INDICACAO_STATUS.map((s) => <SelectItem key={s} value={s} className="text-[11px]">{INDICACAO_STATUS_LABELS[s]}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(ind.created_at), { locale: ptBR, addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {INDICACAO_STATUS.map((status) => {
            const col = filtered.filter((i) => i.status === status);
            return (
              <div key={status} className="bg-secondary/30 rounded-lg p-3 min-h-[180px]"
                onDrop={(e) => handleDrop(e, status)} onDragOver={handleDragOver}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-primary">{INDICACAO_STATUS_LABELS[status]}</h3>
                  <Badge variant="secondary" className="text-xs">{col.length}</Badge>
                </div>
                <div className="space-y-2">
                  {col.map((ind) => (
                    <Card key={ind.id} draggable onDragStart={(e) => handleDragStart(e, ind.id)}
                      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <p className="font-semibold text-sm">{ind.cliente_nome}</p>
                        <p className="text-xs text-muted-foreground">{ind.categoria} • {ind.raca}</p>
                        <p className="text-xs text-muted-foreground">{ind.num_cabecas} cabeças</p>
                        <div className="flex gap-1 mt-1.5">
                          <Badge variant={ind.fluxo === 'Demanda' ? 'default' : 'secondary'} className="text-[10px]">{ind.fluxo}</Badge>
                          <Badge variant={ind.urgencia === 'Imediata' ? 'destructive' : 'outline'} className="text-[10px]">{ind.urgencia}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog — Nova Indicação */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Nova Indicação</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Parceiro *</Label>
              <Select value={form.parceiro_id} onValueChange={(v) => setForm({ ...form, parceiro_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione o parceiro" /></SelectTrigger>
                <SelectContent>{parceirosAtivos.map((p) => <SelectItem key={p.id} value={p.id}>{p.nome_completo}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Nome do Cliente *</Label><Input value={form.cliente_nome} onChange={(e) => setForm({ ...form, cliente_nome: e.target.value })} /></div>
            <div><Label>Telefone do Cliente</Label><Input value={form.cliente_telefone ?? ''} onChange={(e) => setForm({ ...form, cliente_telefone: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Município</Label><Input value={form.cliente_municipio ?? ''} onChange={(e) => setForm({ ...form, cliente_municipio: e.target.value })} /></div>
              <div>
                <Label>UF</Label>
                <Select value={form.cliente_uf ?? ''} onValueChange={(v) => setForm({ ...form, cliente_uf: v })}>
                  <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                  <SelectContent>{UFS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Fluxo *</Label>
                <Select value={form.fluxo} onValueChange={(v) => setForm({ ...form, fluxo: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{FLUXOS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Urgência *</Label>
                <Select value={form.urgencia} onValueChange={(v) => setForm({ ...form, urgencia: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{URGENCIAS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Categoria *</Label>
                <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{CATEGORIAS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Raça *</Label>
                <Select value={form.raca} onValueChange={(v) => setForm({ ...form, raca: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{RACAS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Nº de Cabeças *</Label><Input type="number" min={1} value={form.num_cabecas || ''} onChange={(e) => setForm({ ...form, num_cabecas: Number(e.target.value) })} /></div>
              <div><Label>Peso Atual (kg)</Label><Input type="number" value={form.peso_atual ?? ''} onChange={(e) => setForm({ ...form, peso_atual: Number(e.target.value) })} /></div>
            </div>
            <div><Label>Observações</Label><Textarea value={form.observacoes_ia ?? ''} onChange={(e) => setForm({ ...form, observacoes_ia: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
            <Button onClick={() => saveMutation.mutate()}
              disabled={!form.parceiro_id || !form.cliente_nome || !form.fluxo || !form.urgencia || !form.categoria || !form.raca || !form.num_cabecas || saveMutation.isPending}>
              {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParceiroIndicacoes;
```

- [ ] **Step 2: Verificar no browser**

Criar uma indicação vinculada ao parceiro criado na Task 6 → verificar que aparece na lista/kanban em "Em Validação".

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/parceiros/ParceiroIndicacoes.tsx
git commit -m "feat: ParceiroIndicacoes com lista, kanban e formulário"
```

---

## Task 8: ParceiroMetricas

**Files:**
- Create: `src/components/admin/parceiros/ParceiroMetricas.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
// src/components/admin/parceiros/ParceiroMetricas.tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Target, TrendingUp, BarChart3, Percent } from 'lucide-react';
import type { Indicacao, Contrato, Parceiro } from '@/types/parceiros';

const db = supabase as any;
const COLORS = ['hsl(152, 42%, 18%)', 'hsl(38, 92%, 50%)', 'hsl(152, 55%, 35%)', 'hsl(0, 72%, 51%)'];

const ParceiroMetricas = () => {
  const { data: indicacoes = [] } = useQuery<Indicacao[]>({
    queryKey: ['crm-indicacoes'],
    queryFn: async () => { const { data } = await db.from('indicacoes').select('*'); return data ?? []; },
  });
  const { data: contratos = [] } = useQuery<Contrato[]>({
    queryKey: ['crm-contratos'],
    queryFn: async () => { const { data } = await db.from('contratos').select('*'); return data ?? []; },
  });
  const { data: parceiros = [] } = useQuery<Parceiro[]>({
    queryKey: ['crm-parceiros'],
    queryFn: async () => { const { data } = await db.from('parceiros').select('*'); return data ?? []; },
  });

  const totalIndicacoes = indicacoes.length;
  const totalNegocios   = contratos.filter((c) => c.tipo === 'negocio').length;
  const taxaConversao   = totalIndicacoes > 0 ? ((totalNegocios / totalIndicacoes) * 100).toFixed(1) : '0';
  const totalParceiros  = parceiros.length;

  const ufData = indicacoes.reduce<Record<string, number>>((acc, ind) => {
    const uf = ind.cliente_uf ?? 'N/D';
    acc[uf] = (acc[uf] ?? 0) + ind.num_cabecas;
    return acc;
  }, {});
  const ufChartData = Object.entries(ufData)
    .map(([uf, cabecas]) => ({ uf, cabecas }))
    .sort((a, b) => b.cabecas - a.cabecas)
    .slice(0, 10);

  const pieData = [
    { name: 'Convertidas', value: totalNegocios },
    { name: 'Pendentes',   value: Math.max(0, totalIndicacoes - totalNegocios) },
  ];

  const StatCard = ({ title, value, icon, suffix = '' }: { title: string; value: string | number; icon: React.ReactNode; suffix?: string }) => (
    <div className="bg-white rounded-lg p-4 border border-border flex items-center gap-4">
      <div className="p-2 bg-primary/10 rounded-lg text-primary">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-primary">{value}{suffix}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bebas text-primary">Métricas e KPIs</h1>
        <p className="text-muted-foreground text-sm">Análise de performance do programa de indicações</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Indicações"    value={totalIndicacoes} icon={<Target className="w-5 h-5" />} />
        <StatCard title="Negócios Fechados"   value={totalNegocios}   icon={<TrendingUp className="w-5 h-5" />} />
        <StatCard title="Taxa de Conversão"   value={taxaConversao}   icon={<Percent className="w-5 h-5" />} suffix="%" />
        <StatCard title="Parceiros Ativos"    value={totalParceiros}  icon={<BarChart3 className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Cabeças por UF (top 10)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ufChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="uf" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="cabecas" fill={COLORS[0]} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Indicações: Convertidas vs Pendentes</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParceiroMetricas;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/parceiros/ParceiroMetricas.tsx
git commit -m "feat: ParceiroMetricas com gráficos recharts"
```

---

## Task 9: ModeloEditorModal + ParceiroContratos

**Files:**
- Create: `src/components/admin/parceiros/ModeloEditorModal.tsx`
- Create: `src/components/admin/parceiros/ParceiroContratos.tsx`

- [ ] **Step 1: Criar ModeloEditorModal**

```tsx
// src/components/admin/parceiros/ModeloEditorModal.tsx
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Copy, Save } from 'lucide-react';
import { TEMPLATE_VARS_PARCERIA, TEMPLATE_VARS_NEGOCIO } from '@/data/parceiros-constants';
import type { ModeloContrato } from '@/types/parceiros';

const db = supabase as any;

interface ModeloEditorModalProps {
  tipo: 'parceria' | 'negocio';
  open: boolean;
  onClose: () => void;
}

const ModeloEditorModal = ({ tipo, open, onClose }: ModeloEditorModalProps) => {
  const qc = useQueryClient();
  const [conteudo, setConteudo] = useState('');

  const { data: modelo } = useQuery<ModeloContrato | null>({
    queryKey: ['modelo_contrato', tipo],
    enabled: open,
    queryFn: async () => {
      const { data } = await db.from('modelos_contrato').select('*').eq('tipo', tipo).maybeSingle();
      return data ?? null;
    },
  });

  useEffect(() => {
    if (modelo) setConteudo(modelo.conteudo);
    else setConteudo('');
  }, [modelo]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (modelo) {
        const { error } = await db.from('modelos_contrato').update({ conteudo, updated_at: new Date().toISOString() }).eq('id', modelo.id);
        if (error) throw error;
      } else {
        const { error } = await db.from('modelos_contrato').insert({ tipo, conteudo });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['modelo_contrato', tipo] });
      toast.success('Modelo salvo!');
      onClose();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const vars = tipo === 'parceria' ? TEMPLATE_VARS_PARCERIA : TEMPLATE_VARS_NEGOCIO;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Editar Modelo — {tipo === 'parceria' ? 'Contrato de Parceria' : 'Contrato de Negócio'}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-[1fr_260px] gap-4 min-h-[400px]">
          <Textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            className="min-h-[400px] font-mono text-sm resize-none"
            placeholder="Digite o modelo de contrato. Use as variáveis da direita para campos dinâmicos..."
          />
          <div className="space-y-2 overflow-y-auto">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Variáveis disponíveis</p>
            {vars.map((v) => (
              <div key={v.key} className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">{v.label}</span>
                <Badge
                  variant="outline" className="text-[10px] font-mono cursor-pointer hover:bg-secondary"
                  onClick={() => { navigator.clipboard.writeText(v.key); toast.success(`"${v.key}" copiado!`); }}
                >
                  <Copy className="w-2.5 h-2.5 mr-1" />{v.key}
                </Badge>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => saveMutation.mutate()} disabled={!conteudo || saveMutation.isPending}>
            <Save className="w-4 h-4 mr-1" />{saveMutation.isPending ? 'Salvando...' : 'Salvar Modelo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModeloEditorModal;
```

- [ ] **Step 2: Criar ParceiroContratos**

```tsx
// src/components/admin/parceiros/ParceiroContratos.tsx
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ModeloEditorModal from './ModeloEditorModal';
import type { Contrato, Parceiro, Indicacao } from '@/types/parceiros';

const db = supabase as any;

const ParceiroContratos = () => {
  const qc = useQueryClient();
  const [parceriaOpen, setParceriaOpen] = useState(false);
  const [negocioOpen, setNegocioOpen]   = useState(false);
  const [editingTipo, setEditingTipo]   = useState<'parceria' | 'negocio' | null>(null);

  const [parceriaParceiroId, setParceriaParceiroId] = useState('');
  const [parceriaComissao, setParceriaComissao]     = useState('1');
  const [parceriaArea, setParceriaArea]             = useState('');
  const [parceriaVigencia, setParceriaVigencia]     = useState('');

  const [negocioIndicacaoId, setNegocioIndicacaoId]   = useState('');
  const [negocioValorUnidade, setNegocioValorUnidade] = useState('');
  const [negocioCondicao, setNegocioCondicao]         = useState('');

  const { data: parceiros = [] } = useQuery<Parceiro[]>({
    queryKey: ['crm-parceiros'],
    queryFn: async () => { const { data } = await db.from('parceiros').select('*').order('nome_completo'); return data ?? []; },
  });

  const { data: indicacoes = [] } = useQuery<Indicacao[]>({
    queryKey: ['crm-indicacoes'],
    queryFn: async () => {
      const { data } = await db.from('indicacoes').select('*, parceiros(nome_completo, cpf, endereco, chave_pix, profissao)').order('created_at', { ascending: false });
      return data ?? [];
    },
  });

  const { data: contratos = [] } = useQuery<Contrato[]>({
    queryKey: ['crm-contratos'],
    queryFn: async () => {
      const { data } = await db.from('contratos').select('*, parceiros(nome_completo), indicacoes(cliente_nome)').order('gerado_em', { ascending: false });
      return data ?? [];
    },
  });

  const parceriaCount = contratos.filter((c) => c.tipo === 'parceria').length;
  const negocioCount  = contratos.filter((c) => c.tipo === 'negocio').length;

  const selectedIndicacaoData = useMemo(() => indicacoes.find((i) => i.id === negocioIndicacaoId), [indicacoes, negocioIndicacaoId]);
  const valorTotal = useMemo(() => {
    const val = parseFloat(negocioValorUnidade);
    const cab = selectedIndicacaoData?.num_cabecas ?? 0;
    return val && cab ? val * cab : 0;
  }, [negocioValorUnidade, selectedIndicacaoData]);

  const gerarParceriaMutation = useMutation({
    mutationFn: async () => {
      const { error } = await db.from('contratos').insert({ tipo: 'parceria', parceiro_id: parceriaParceiroId });
      if (error) throw error;
      await db.from('parceiro_contatos').insert({ parceiro_id: parceriaParceiroId, tipo: 'contrato_gerado', descricao: 'Contrato de parceria gerado' });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crm-contratos'] });
      setParceriaOpen(false); setParceriaParceiroId(''); setParceriaComissao('1'); setParceriaArea(''); setParceriaVigencia('');
      toast.success('Contrato de parceria gerado!');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const gerarNegocioMutation = useMutation({
    mutationFn: async () => {
      const ind = selectedIndicacaoData;
      if (!ind) throw new Error('Indicação não encontrada');
      const { error } = await db.from('contratos').insert({ tipo: 'negocio', parceiro_id: ind.parceiro_id, indicacao_id: negocioIndicacaoId });
      if (error) throw error;
      await db.from('parceiro_contatos').insert({ parceiro_id: ind.parceiro_id, tipo: 'contrato_gerado', descricao: `Contrato de negócio gerado — ${ind.cliente_nome}` });
      await db.from('indicacoes').update({ status: 'finalizada' }).eq('id', negocioIndicacaoId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crm-contratos'] });
      qc.invalidateQueries({ queryKey: ['crm-indicacoes'] });
      setNegocioOpen(false); setNegocioIndicacaoId(''); setNegocioValorUnidade(''); setNegocioCondicao('');
      toast.success('Contrato de negócio gerado!');
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bebas text-primary">Contratos</h1>
          <p className="text-muted-foreground text-sm">Contratos de parceria e negócios</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditingTipo('parceria')}>
            <Pencil className="w-4 h-4 mr-1" /> Editar Modelo Parceria
          </Button>
          <Button variant="outline" size="sm" onClick={() => setEditingTipo('negocio')}>
            <Pencil className="w-4 h-4 mr-1" /> Editar Modelo Negócio
          </Button>
          <Button variant="outline" onClick={() => setParceriaOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Parceria
          </Button>
          <Button onClick={() => setNegocioOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Negócio
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg p-3 border border-border flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded text-primary"><FileText className="w-4 h-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total</p><p className="text-xl font-bold">{contratos.length}</p></div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-border flex items-center gap-3">
          <div className="p-2 bg-secondary/50 rounded"><FileText className="w-4 h-4" /></div>
          <div><p className="text-xs text-muted-foreground">Parcerias</p><p className="text-xl font-bold">{parceriaCount}</p></div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-border flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded text-accent"><FileText className="w-4 h-4" /></div>
          <div><p className="text-xs text-muted-foreground">Negócios</p><p className="text-xl font-bold">{negocioCount}</p></div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead><TableHead>Parceiro</TableHead>
                <TableHead>Cliente / Indicação</TableHead><TableHead>Gerado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contratos.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Nenhum contrato ainda</TableCell></TableRow>
              ) : contratos.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Badge variant={c.tipo === 'parceria' ? 'default' : 'secondary'} className="text-[10px]">
                      {c.tipo === 'parceria' ? 'Parceria' : 'Negócio'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-sm">{(c.parceiros as any)?.nome_completo ?? '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{(c.indicacoes as any)?.cliente_nome ?? '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(c.gerado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog — Contrato Parceria */}
      <Dialog open={parceriaOpen} onOpenChange={setParceriaOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Gerar Contrato de Parceria</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Parceiro *</Label>
              <Select value={parceriaParceiroId} onValueChange={setParceriaParceiroId}>
                <SelectTrigger><SelectValue placeholder="Selecione o parceiro" /></SelectTrigger>
                <SelectContent>{parceiros.map((p) => <SelectItem key={p.id} value={p.id}>{p.nome_completo}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Comissão (%)</Label><Input type="number" value={parceriaComissao} onChange={(e) => setParceriaComissao(e.target.value)} /></div>
            <div><Label>Área de Atuação</Label><Input value={parceriaArea} onChange={(e) => setParceriaArea(e.target.value)} /></div>
            <div><Label>Vigência</Label><Input value={parceriaVigencia} onChange={(e) => setParceriaVigencia(e.target.value)} placeholder="Ex: 12 meses" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setParceriaOpen(false)}>Cancelar</Button>
            <Button onClick={() => gerarParceriaMutation.mutate()} disabled={!parceriaParceiroId || gerarParceriaMutation.isPending}>
              {gerarParceriaMutation.isPending ? 'Gerando...' : 'Gerar Contrato'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog — Contrato Negócio */}
      <Dialog open={negocioOpen} onOpenChange={setNegocioOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Gerar Contrato de Negócio</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Indicação *</Label>
              <Select value={negocioIndicacaoId} onValueChange={setNegocioIndicacaoId}>
                <SelectTrigger><SelectValue placeholder="Selecione a indicação" /></SelectTrigger>
                <SelectContent>
                  {indicacoes.filter((i) => i.status !== 'finalizada').map((i) => (
                    <SelectItem key={i.id} value={i.id}>{i.cliente_nome} — {i.raca} {i.num_cabecas} cab.</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedIndicacaoData && (
              <div className="text-sm text-muted-foreground bg-secondary/30 rounded p-2">
                Parceiro: <strong>{(selectedIndicacaoData.parceiros as any)?.nome_completo ?? '—'}</strong>
              </div>
            )}
            <div><Label>Valor por Cabeça (R$)</Label><Input type="number" value={negocioValorUnidade} onChange={(e) => setNegocioValorUnidade(e.target.value)} /></div>
            {valorTotal > 0 && (
              <p className="text-sm font-semibold text-primary">Total do lote: R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            )}
            <div><Label>Condição de Pagamento</Label><Input value={negocioCondicao} onChange={(e) => setNegocioCondicao(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNegocioOpen(false)}>Cancelar</Button>
            <Button onClick={() => gerarNegocioMutation.mutate()} disabled={!negocioIndicacaoId || gerarNegocioMutation.isPending}>
              {gerarNegocioMutation.isPending ? 'Gerando...' : 'Gerar Contrato'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de edição de modelo */}
      {editingTipo && (
        <ModeloEditorModal tipo={editingTipo} open={!!editingTipo} onClose={() => setEditingTipo(null)} />
      )}
    </div>
  );
};

export default ParceiroContratos;
```

- [ ] **Step 3: Verificar no browser**

Acessar Contratos → gerar um contrato de parceria → verificar que aparece na lista.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/parceiros/ModeloEditorModal.tsx src/components/admin/parceiros/ParceiroContratos.tsx
git commit -m "feat: ParceiroContratos com geração de contratos e editor de modelos"
```

---

## Task 10: Atualizar Formulário IndicacaoConectada

**Files:**
- Modify: `src/pages/IndicacaoConectada.tsx`

- [ ] **Step 1: Localizar o handleSubmit**

Ler `src/pages/IndicacaoConectada.tsx` e localizar a função `handleSubmit` (linha ~25).

O estado atual do form tem os campos: `nome`, `telefone`, `email`, `cidade`, `estado`, `mensagem`.

O campo `profissao` não existe no formulário público — o parceiro vai se cadastrar sem profissão por enquanto (o admin preenche depois no CRM).

A tabela `parceiros` exige: `nome_completo`, `cpf` (NOT NULL), `profissao` (NOT NULL), `uf` (NOT NULL), `cidade` (NOT NULL).

Como o formulário público não coleta CPF, profissão e UF, precisamos de uma abordagem pragmática: inserir com valores placeholder que o admin vai completar no CRM.

- [ ] **Step 2: Atualizar o handleSubmit**

Substituir apenas a função `handleSubmit` em `src/pages/IndicacaoConectada.tsx`:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  try {
    const { error } = await (supabase as any).from('parceiros').insert([{
      nome_completo: formData.nome,
      cpf: `landing-${Date.now()}`,   // placeholder — admin atualiza no CRM
      telefone: formData.telefone || null,
      email: formData.email || null,
      cidade: formData.cidade || 'A definir',
      uf: formData.estado || 'GO',
      profissao: 'Freelancer',         // placeholder — admin atualiza no CRM
      status_funil: 'prospeccao',
      origem: 'landing_page',
    }]);
    if (error) throw error;
    setSubmitted(true);
    toast.success('Cadastro enviado com sucesso! Entraremos em contato em breve.');
  } catch (err) {
    console.error(err);
    toast.error('Erro ao enviar cadastro. Tente novamente.');
  } finally {
    setSubmitting(false);
  }
};
```

> **Nota:** O `cpf` usa um placeholder único com timestamp para não violar o UNIQUE constraint. O admin deverá editar o registro no CRM para preencher o CPF real. Se futuramente o formulário coletar CPF, remover o placeholder.

- [ ] **Step 3: Verificar no browser**

Acessar `/indicacao-conectada` → preencher e submeter o formulário → verificar no CRM Parceiros que o parceiro aparece em "Em Prospecção" com `origem = landing_page`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/IndicacaoConectada.tsx
git commit -m "feat: formulário de parceiro insere direto no CRM em prospecção"
```

---

## Task 11: Limpeza Final

**Files:**
- Modify: nenhum arquivo novo — verificação de consistência

- [ ] **Step 1: Verificar que AdminCandidatosParceiros não está mais importado**

O arquivo `src/pages/Admin.tsx` (Task 4) já não importa `AdminCandidatosParceiros`. Verificar com:

```bash
grep -r "AdminCandidatosParceiros" src/pages/Admin.tsx
```

Expected: sem resultado.

- [ ] **Step 2: Verificar que o sistema de permissões funciona**

No Supabase, acessar a tabela `admin_permissions` e verificar o valor padrão do campo `tabs`. Se houver registros com a chave `candidatos`, eles continuarão existindo mas não afetarão a navegação (a seção foi removida do `ALL_SECTIONS`).

- [ ] **Step 3: Smoke test completo**

Acessar `/admin` e verificar:
- [ ] Login funciona
- [ ] Sidebar aparece com grupos Site (7 itens) e Parceiros (5 itens)
- [ ] Todos os 7 itens do Site carregam sem erros
- [ ] Dashboard de Parceiros mostra cards e feed de tarefas
- [ ] CRM mostra kanban e permite criar/editar parceiro
- [ ] Indicações permite criar nova indicação vinculada ao parceiro
- [ ] Métricas exibe gráficos
- [ ] Contratos permite gerar contrato de parceria
- [ ] Formulário em `/indicacao-conectada` cria parceiro em Prospecção

- [ ] **Step 4: Commit final**

```bash
git add .
git commit -m "feat: módulo de parceiros completo no admin CMS"
```
