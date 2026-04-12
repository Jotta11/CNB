# Hero Carousel — Design Spec
Data: 2026-04-12

## Visão Geral

Transformar o hero estático do site CNB em um carrossel de banners com autoplay. Cada slide é independente: duas artes (mobile/desktop) fornecidas pelo designer, mais título, subtítulo e botão editáveis no CMS. A gestão dos slides acontece no painel admin existente.

---

## Modelo de Dados

### Nova tabela: `hero_slides`

```sql
CREATE TABLE public.hero_slides (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo        TEXT NOT NULL,
  subtitulo     TEXT,
  botao_texto   TEXT NOT NULL,
  botao_url     TEXT NOT NULL,
  imagem_mobile   TEXT,   -- URL pública no Supabase Storage
  imagem_desktop  TEXT,   -- URL pública no Supabase Storage
  ordem         INTEGER NOT NULL DEFAULT 0,
  ativo         BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**RLS:**
- Leitura pública (igual a `lotes` e `site_settings`)
- Escrita apenas admin (`has_role(auth.uid(), 'admin')`)

**Storage:** imagens enviadas para o bucket `site-assets` existente, dentro da pasta `hero-slides/`.

---

## Frontend

### `src/components/HeroCarousel.tsx` (substitui `Hero.tsx`)

- Usa o componente `Carousel` do shadcn/ui (Embla Carousel) com o pacote npm `embla-carousel-autoplay` para autoplay
- Busca slides via hook `useHeroSlides` — retorna apenas slides com `ativo = true`, ordenados por `ordem`
- Fallback: se não houver slides ativos cadastrados, exibe o hero original com gradient verde e título/botões hardcoded — garante que o site não quebra durante a migração

**Layout mobile (< 768px):**
- Arte (`imagem_mobile`) como `background-image` fullscreen, `object-fit: cover`
- Overlay gradiente no terço inferior: `linear-gradient(to top, rgba(0,0,0,0.82) 30%, transparent)`
- No rodapé do slide: título (Bebas Neue), subtítulo, botão laranja (`--accent`)
- Dots de navegação centralizados abaixo do botão
- Sem setas visíveis (swipe nativo via Embla)

**Layout desktop (≥ 768px):**
- Arte (`imagem_desktop`) como `background-image` fullscreen
- Overlay gradiente lateral: escuro à esquerda, transparente ao centro
- Texto (título, subtítulo, botão) alinhado à esquerda, verticalmente centrado
- Setas de navegação nas laterais (semi-transparentes)
- Dots no canto inferior esquerdo

**Autoplay:**
- Intervalo: 5 segundos
- Pausa ao hover (desktop) e ao tocar/arrastar (mobile)
- Loop infinito

**Dimensões:** mantém `min-h-[85vh]` do hero atual.

### `src/hooks/useHeroSlides.tsx` (novo)

```ts
// Busca slides ativos ordenados por `ordem`
// Retorna: { slides: HeroSlide[], loading: boolean }
// Mesmo padrão dos outros hooks do projeto (React Query + Supabase)
```

### `src/pages/Index.tsx`

Troca `<Hero />` por `<HeroCarousel />`.

---

## CMS (AdminSettings)

O `AdminSettings` ganha uma nova seção **"Carrossel Hero"** acima das configurações de imagem existentes.

### Interface por slide:

Cada slide é exibido como um card expansível com:
- Campo: **Título** (text input)
- Campo: **Subtítulo** (text input, opcional)
- Campo: **Texto do botão** (text input)
- Campo: **URL do botão** (text input)
- Upload: **Imagem Mobile** (retrato, recomendado 750×1200px)
- Upload: **Imagem Desktop** (paisagem, recomendado 1920×800px)
- Campo: **Ordem** (número)
- Toggle: **Ativo/Inativo**
- Botão: **Excluir slide**

### Ações globais:

- Botão **"+ Adicionar Slide"** — adiciona um formulário em branco na UI; o registro só é criado no banco ao clicar em "Salvar" no card
- Slides listados em ordem crescente por `ordem`
- Saving individual por slide (botão "Salvar" em cada card)

### Upload de imagem:

Segue o padrão já existente no `AdminSettings`:
- `supabase.storage.from('site-assets').upload('hero-slides/...')`
- Exibe preview após upload
- Botão X para remover

---

## Migração SQL

Um arquivo novo em `supabase/migrations/` com:
1. `CREATE TABLE hero_slides` com todos os campos
2. RLS policies (leitura pública, escrita admin)
3. Trigger `update_updated_at_column` (função já existe)
4. `INSERT` de 1 slide de exemplo (ativo = false) para facilitar o primeiro uso no CMS

---

## O que NÃO está no escopo

- Edição de ordem via drag-and-drop (ordem é um número digitado)
- Preview do carrossel dentro do CMS
- Agendamento de slides por data
- Vídeo como background de slide
