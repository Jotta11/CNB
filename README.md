# CNB — Conexão Norte Bovino

Plataforma digital de compra e venda de gado com curadoria profissional, desenvolvida para o mercado pecuário brasileiro.

## Visão Geral

A CNB conecta compradores e vendedores de gado com segurança e transparência, oferecendo um marketplace de lotes, calculadora de frete, programa de indicação e painel administrativo completo.

**Stack principal:**
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui (Radix UI)
- Supabase (PostgreSQL + Auth)
- TanStack React Query
- Framer Motion
- React Router DOM v6

---

## Estrutura do Projeto

```
src/
├── components/
│   ├── admin/          # Componentes do painel admin
│   └── ui/             # Componentes shadcn/ui (51 arquivos)
├── pages/              # Páginas da aplicação (10 páginas)
├── hooks/              # Custom hooks (dados e auth)
├── integrations/
│   └── supabase/       # Cliente e tipos gerados do Supabase
├── data/               # Dados estáticos (cidades, lotes fallback)
└── utils/              # Utilitários (cálculo de distância, etc.)
```

---

## Páginas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | Index | Homepage com todas as seções de marketing |
| `/lotes` | Lotes | Marketplace com filtros por raça, sexo, preço e quantidade |
| `/lotes/:id` | LoteDetails | Detalhes do lote com vídeo, calculadora de frete e lotes relacionados |
| `/noticias` | News | Listagem de artigos/notícias |
| `/noticias/:slug` | NewsDetail | Artigo individual |
| `/indicacao-conectada` | IndicacaoConectada | Programa de indicação e parceria |
| `/auth` | Auth | Login e cadastro de usuários |
| `/admin` | Admin | Painel administrativo (requer role admin) |
| `/admin/login` | AdminLogin | Login dedicado para admin |

---

## Funcionalidades

### Marketplace de Lotes
- Listagem e filtragem de lotes de gado por raça, sexo, faixa de preço e quantidade
- Página de detalhes com especificações completas, vídeo (YouTube) e galeria
- Calculadora de frete entre estados brasileiros
- Sugestões de lotes relacionados

### Formulário de Contato / Leads
- Formulário para vendedores submeterem informações sobre gado à venda
- Formulário para compradores registrarem interesse
- Seleção de estado/cidade com cascata (dados de todos os municípios brasileiros)
- Submissão salva como lead no Supabase

### Programa de Indicação (Indicação Conectada)
- Página dedicada ao programa de parceria
- Estrutura de comissões progressiva (até 8%)
- Seções de benefícios e como funciona

### Autenticação de Usuários
- Cadastro e login via email/senha (Supabase Auth)
- Perfil do usuário com região/estado
- Role-based access control (tabela `user_roles`)

### Painel Administrativo
- Gestão de lotes (criar, editar, excluir)
- Gestão de notícias/artigos
- Visualização e gerenciamento de leads
- Gestão de usuários
- Gestão de parceiros/depoimentos
- Configurações do site (imagem do hero, contato, etc.)

---

## Design System

**Paleta de cores (variáveis HSL):**

| Token | Valor | Uso |
|-------|-------|-----|
| `primary` | Verde escuro (145° 49% 17%) | Botões principais, headers |
| `secondary` | Marrom escuro (28° 42% 16%) | Elementos secundários |
| `accent` | Laranja (32° 89% 44%) | Destaques, CTAs |
| `background` | Creme (45° 27% 94%) | Fundo geral |
| `whatsapp` | Verde (142° 70% 49%) | Widget WhatsApp |

**Tipografia:**
- Display: **Bebas Neue** (títulos, marketing)
- Corpo: **Helvetica Neue** / Arial

---

## Banco de Dados (Supabase)

Tabelas principais:
- `lotes` — Lotes de gado disponíveis
- `leads` — Contatos de compradores e vendedores
- `news` — Artigos e notícias
- `partners` — Parceiros e depoimentos
- `user_roles` — Controle de acesso (role admin)
- `site_settings` — Configurações globais do site
- `freight_rates` — Tabela de frete por estado

---

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento (porta 8080)
npm run dev

# Build de produção
npm run build

# Lint
npm run lint
```

**Variáveis de ambiente necessárias:**
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

---

## Deploy

O build de produção é gerado pelo Vite e pode ser publicado em qualquer hosting estático (Netlify, Vercel, etc.).
