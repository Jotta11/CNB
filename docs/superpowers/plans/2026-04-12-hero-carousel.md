# Hero Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar o hero estático do site CNB em um carrossel de banners com autoplay, com gestão completa de slides (imagem mobile + desktop, título, subtítulo, botão) no painel admin.

**Architecture:** Nova tabela `hero_slides` no Supabase armazena os slides. O componente `HeroCarousel.tsx` substitui `Hero.tsx`, usa Embla Carousel com autoplay e aplica imagens diferentes para mobile/desktop via CSS. O `AdminSettings.tsx` importa um novo sub-componente `AdminHeroSlides.tsx` que gerencia os slides.

**Tech Stack:** React 18 + TypeScript, Embla Carousel (`embla-carousel-react` já instalado + `embla-carousel-autoplay` a instalar), Tailwind CSS, Supabase (PostgreSQL + Storage), TanStack React Query, shadcn/ui Carousel (`src/components/ui/carousel.tsx`)

---

## Mapa de Arquivos

| Ação | Arquivo |
|------|---------|
| Criar | `supabase/migrations/20260412000001_hero_slides.sql` |
| Criar | `src/hooks/useHeroSlides.tsx` |
| Criar | `src/components/HeroCarousel.tsx` |
| Criar | `src/components/admin/AdminHeroSlides.tsx` |
| Modificar | `src/pages/Index.tsx` |
| Modificar | `src/components/admin/AdminSettings.tsx` |

---

## Task 1: Instalar embla-carousel-autoplay

**Files:**
- Modify: `package.json` (via npm)

- [ ] **Step 1: Instalar o pacote**

```bash
npm install embla-carousel-autoplay
```

Resultado esperado: linha `"embla-carousel-autoplay": "^8.x.x"` aparece em `package.json`.

- [ ] **Step 2: Verificar instalação**

```bash
node -e "require('embla-carousel-autoplay'); console.log('ok')"
```

Resultado esperado: `ok`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: instala embla-carousel-autoplay"
```

---

## Task 2: Migração SQL — tabela hero_slides

**Files:**
- Create: `supabase/migrations/20260412000001_hero_slides.sql`

- [ ] **Step 1: Criar o arquivo de migração**

Criar `supabase/migrations/20260412000001_hero_slides.sql` com o conteúdo:

```sql
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
```

- [ ] **Step 2: Aplicar a migração no Supabase**

Acesse o painel do Supabase → SQL Editor e execute o conteúdo do arquivo acima.

Verificação: a tabela `hero_slides` deve aparecer em Database → Tables.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260412000001_hero_slides.sql
git commit -m "feat: migração SQL tabela hero_slides"
```

---

## Task 3: Hook useHeroSlides

**Files:**
- Create: `src/hooks/useHeroSlides.tsx`

- [ ] **Step 1: Criar o hook**

Criar `src/hooks/useHeroSlides.tsx`:

```tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HeroSlide {
  id: string;
  titulo: string;
  subtitulo: string | null;
  botao_texto: string;
  botao_url: string;
  imagem_mobile: string | null;
  imagem_desktop: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const useHeroSlides = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['hero-slides-ativos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data as HeroSlide[];
    },
  });

  return { slides: data ?? [], loading: isLoading };
};

export const useHeroSlidesAdmin = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['hero-slides-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data as HeroSlide[];
    },
  });

  return { slides: data ?? [], loading: isLoading, refetch };
};
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Resultado esperado: sem erros relacionados ao novo arquivo.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useHeroSlides.tsx
git commit -m "feat: hook useHeroSlides e useHeroSlidesAdmin"
```

---

## Task 4: Componente HeroCarousel

**Files:**
- Create: `src/components/HeroCarousel.tsx`

- [ ] **Step 1: Criar o componente**

Criar `src/components/HeroCarousel.tsx`:

```tsx
import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ClipboardList } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useHeroSlides } from '@/hooks/useHeroSlides';

// ── Fallback (nenhum slide ativo cadastrado) ─────────────────────────────────
const HeroFallback = () => {
  const scrollToSection = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <section
      id="inicio"
      className="min-h-[85vh] flex items-center justify-center relative overflow-hidden pt-20"
      style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-medium)) 100%)' }}
    >
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white tracking-wider mb-6">
          Conectando os melhores<br />
          <span className="text-primary-light">lotes para a sua fazenda.</span>
        </h1>
        <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed">
          Com a Conexão Norte Bovino, você compra e vende seu rebanho com inteligência
          de mercado e um processo comercial eficiente, seguro e profissional.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button onClick={() => scrollToSection('#lotes')} className="btn-hero-buy px-8 py-4 rounded-lg flex items-center gap-3 text-lg">
            <ShoppingCart size={22} />Quero Comprar
          </button>
          <button onClick={() => scrollToSection('#vender')} className="btn-hero-sell px-8 py-4 rounded-lg flex items-center gap-3 text-lg">
            <ClipboardList size={22} />Quero Vender
          </button>
        </div>
      </div>
    </section>
  );
};

// ── Dots de navegação ────────────────────────────────────────────────────────
const SlideDots = ({ count, current }: { count: number; current: number }) => (
  <div className="flex gap-1.5 items-center justify-center">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`h-[3px] rounded-full transition-all duration-300 ${
          i === current ? 'w-6 bg-white' : 'w-2 bg-white/40'
        }`}
      />
    ))}
  </div>
);

// ── Carrossel principal ──────────────────────────────────────────────────────
const HeroCarousel = () => {
  const { slides, loading } = useHeroSlides();
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  if (loading) return null;
  if (!slides.length) return <HeroFallback />;

  return (
    <section id="inicio" className="min-h-[85vh] relative overflow-hidden pt-20">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{ loop: true }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="h-full"
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0">
              <div className="relative min-h-[85vh] flex items-end md:items-center overflow-hidden">

                {/* Arte mobile (< md) */}
                {slide.imagem_mobile && (
                  <div
                    className="md:hidden absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.imagem_mobile})` }}
                  />
                )}

                {/* Arte desktop (≥ md) */}
                {slide.imagem_desktop && (
                  <div
                    className="hidden md:block absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.imagem_desktop})` }}
                  />
                )}

                {/* Fallback de cor se não houver imagem */}
                {!slide.imagem_mobile && !slide.imagem_desktop && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70" />
                )}

                {/* Overlay mobile: gradiente rodapé */}
                <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/82 via-black/20 to-transparent" />

                {/* Overlay desktop: gradiente lateral */}
                <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

                {/* Conteúdo mobile: rodapé */}
                <div className="md:hidden relative z-10 w-full px-5 pb-8">
                  <h2 className="font-display text-3xl text-white tracking-wide leading-tight mb-2">
                    {slide.titulo}
                  </h2>
                  {slide.subtitulo && (
                    <p className="text-white/75 text-sm leading-snug mb-4">
                      {slide.subtitulo}
                    </p>
                  )}
                  <a
                    href={slide.botao_url}
                    className="block w-full text-center bg-accent text-white font-bold py-3 rounded-lg text-sm tracking-wide mb-4"
                  >
                    {slide.botao_texto}
                  </a>
                  <SlideDots count={slides.length} current={current} />
                </div>

                {/* Conteúdo desktop: lado esquerdo, verticalmente centrado */}
                <div className="hidden md:flex relative z-10 flex-col items-start justify-center h-full min-h-[85vh] px-20 max-w-xl">
                  <h2 className="font-display text-6xl lg:text-7xl text-white tracking-wider leading-tight mb-4">
                    {slide.titulo}
                  </h2>
                  {slide.subtitulo && (
                    <p className="text-white/80 text-lg leading-relaxed mb-8">
                      {slide.subtitulo}
                    </p>
                  )}
                  <a
                    href={slide.botao_url}
                    className="inline-block bg-accent text-white font-bold px-8 py-4 rounded-lg text-base tracking-wide"
                  >
                    {slide.botao_texto}
                  </a>
                  <div className="mt-8">
                    <SlideDots count={slides.length} current={current} />
                  </div>
                </div>

              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Setas visíveis apenas em desktop */}
        <CarouselPrevious className="hidden md:flex left-4 bg-white/15 border-0 text-white hover:bg-white/25 hover:text-white" />
        <CarouselNext className="hidden md:flex right-4 bg-white/15 border-0 text-white hover:bg-white/25 hover:text-white" />
      </Carousel>
    </section>
  );
};

export default HeroCarousel;
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Resultado esperado: sem erros no novo arquivo.

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroCarousel.tsx
git commit -m "feat: componente HeroCarousel com autoplay e layout mobile/desktop"
```

---

## Task 5: Substituir Hero por HeroCarousel em Index.tsx

**Files:**
- Modify: `src/pages/Index.tsx`

- [ ] **Step 1: Atualizar o import e uso**

Em `src/pages/Index.tsx`, substituir:

```tsx
import Hero from '@/components/Hero';
```

por:

```tsx
import HeroCarousel from '@/components/HeroCarousel';
```

E substituir `<Hero />` por `<HeroCarousel />`.

O arquivo final deve ficar:

```tsx
import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import LotesSection from '@/components/LotesSection';
import PartnersSection from '@/components/PartnersSection';
import AboutSection from '@/components/AboutSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import MissionVisionValuesSection from '@/components/MissionVisionValuesSection';
import DiferenciaisSection from '@/components/DiferenciaisSection';
import ReferralSection from '@/components/ReferralSection';
import TabelaPrecosSection from '@/components/TabelaPrecosSection';
import SellerForm from '@/components/SellerForm';
import FAQSection from '@/components/FAQSection';
import NewsSection from '@/components/NewsSection';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import BackToTop from '@/components/BackToTop';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroCarousel />
      <LotesSection />
      <PartnersSection />
      <AboutSection />
      <HowItWorksSection />
      <DiferenciaisSection />
      <ReferralSection />
      <MissionVisionValuesSection />
      <SellerForm />
      <NewsSection />
      <TabelaPrecosSection />
      <FAQSection />
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
    </div>
  );
};

export default Index;
```

- [ ] **Step 2: Verificar no browser**

```bash
npm run dev
```

Abrir `http://localhost:8080`. Resultado esperado:
- Com 0 slides ativos no banco: hero fallback aparece (gradient verde + título "Conectando os melhores lotes")
- Sem erros no console

- [ ] **Step 3: Commit**

```bash
git add src/pages/Index.tsx
git commit -m "feat: usa HeroCarousel na homepage"
```

---

## Task 6: Componente AdminHeroSlides

**Files:**
- Create: `src/components/admin/AdminHeroSlides.tsx`

- [ ] **Step 1: Criar o componente**

Criar `src/components/admin/AdminHeroSlides.tsx`:

```tsx
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useHeroSlidesAdmin, type HeroSlide } from '@/hooks/useHeroSlides';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Upload, X, Plus, Trash2, Image, Layers } from 'lucide-react';

// ── Tipos locais ──────────────────────────────────────────────────────────────

interface SlideForm {
  id: string | null; // null = novo, ainda não salvo no banco
  titulo: string;
  subtitulo: string;
  botao_texto: string;
  botao_url: string;
  imagem_mobile: string | null;
  imagem_desktop: string | null;
  ordem: number;
  ativo: boolean;
  isNew: boolean;
}

const emptySlide = (): SlideForm => ({
  id: null,
  titulo: '',
  subtitulo: '',
  botao_texto: 'Ver Lotes',
  botao_url: '/lotes',
  imagem_mobile: null,
  imagem_desktop: null,
  ordem: 0,
  ativo: true,
  isNew: true,
});

const slideToForm = (s: HeroSlide): SlideForm => ({
  id: s.id,
  titulo: s.titulo,
  subtitulo: s.subtitulo ?? '',
  botao_texto: s.botao_texto,
  botao_url: s.botao_url,
  imagem_mobile: s.imagem_mobile,
  imagem_desktop: s.imagem_desktop,
  ordem: s.ordem,
  ativo: s.ativo,
  isNew: false,
});

// ── Upload helper ─────────────────────────────────────────────────────────────

const uploadSlideImage = async (file: File, slot: 'mobile' | 'desktop', slideId: string): Promise<string> => {
  const ext = file.name.split('.').pop();
  const path = `hero-slides/${slideId}-${slot}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('site-assets').upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from('site-assets').getPublicUrl(path);
  return data.publicUrl;
};

// ── Card de um slide ──────────────────────────────────────────────────────────

const SlideCard = ({
  form,
  onChange,
  onSave,
  onDelete,
  saving,
  deleting,
}: {
  form: SlideForm;
  onChange: (updated: SlideForm) => void;
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
  saving: boolean;
  deleting: boolean;
}) => {
  const [uploading, setUploading] = useState<'mobile' | 'desktop' | null>(null);

  const handleImageUpload = async (slot: 'mobile' | 'desktop', file: File) => {
    try {
      setUploading(slot);
      // Para slides novos, usa um ID temporário para o path do storage
      const refId = form.id ?? `temp-${Date.now()}`;
      const url = await uploadSlideImage(file, slot, refId);
      onChange({
        ...form,
        imagem_mobile: slot === 'mobile' ? url : form.imagem_mobile,
        imagem_desktop: slot === 'desktop' ? url : form.imagem_desktop,
      });
      toast.success(`Imagem ${slot} enviada`);
    } catch {
      toast.error(`Erro ao enviar imagem ${slot}`);
    } finally {
      setUploading(null);
    }
  };

  const ImageUploadField = ({ slot, label, hint }: { slot: 'mobile' | 'desktop'; label: string; hint: string }) => {
    const url = slot === 'mobile' ? form.imagem_mobile : form.imagem_desktop;
    return (
      <div className="space-y-1">
        <Label className="flex items-center gap-1">
          <Image className="w-3.5 h-3.5" /> {label}
          <span className="text-xs text-muted-foreground ml-1">({hint})</span>
        </Label>
        {url ? (
          <div className="relative inline-block">
            <img src={url} alt={label} className="h-20 object-cover rounded border" />
            <button
              onClick={() => onChange({ ...form, imagem_mobile: slot === 'mobile' ? null : form.imagem_mobile, imagem_desktop: slot === 'desktop' ? null : form.imagem_desktop })}
              className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading === slot}
              onChange={(e) => e.target.files?.[0] && handleImageUpload(slot, e.target.files[0])}
            />
            {uploading === slot
              ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              : <><Upload className="w-5 h-5 text-muted-foreground" /><span className="text-xs text-muted-foreground mt-1">Clique para enviar</span></>
            }
          </label>
        )}
      </div>
    );
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            {form.isNew ? 'Novo slide' : (form.titulo || 'Slide sem título')}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.ativo}
                onCheckedChange={(v) => onChange({ ...form, ativo: v })}
              />
              <span className="text-xs text-muted-foreground">{form.ativo ? 'Ativo' : 'Inativo'}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              disabled={deleting}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>Título *</Label>
            <Input value={form.titulo} onChange={(e) => onChange({ ...form, titulo: e.target.value })} placeholder="Ex: Nelore PO — Tocantins" />
          </div>
          <div className="space-y-1">
            <Label>Subtítulo</Label>
            <Input value={form.subtitulo} onChange={(e) => onChange({ ...form, subtitulo: e.target.value })} placeholder="Texto opcional abaixo do título" />
          </div>
          <div className="space-y-1">
            <Label>Texto do botão *</Label>
            <Input value={form.botao_texto} onChange={(e) => onChange({ ...form, botao_texto: e.target.value })} placeholder="Ex: Ver Lotes" />
          </div>
          <div className="space-y-1">
            <Label>URL do botão *</Label>
            <Input value={form.botao_url} onChange={(e) => onChange({ ...form, botao_url: e.target.value })} placeholder="Ex: /lotes ou https://..." />
          </div>
          <div className="space-y-1">
            <Label>Ordem</Label>
            <Input
              type="number"
              value={form.ordem}
              onChange={(e) => onChange({ ...form, ordem: Number(e.target.value) })}
              min={0}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ImageUploadField slot="mobile" label="Imagem Mobile" hint="retrato, ex: 750×1200px" />
          <ImageUploadField slot="desktop" label="Imagem Desktop" hint="paisagem, ex: 1920×800px" />
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave} disabled={saving} className="bg-primary hover:bg-primary-medium">
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvando...</> : 'Salvar Slide'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// ── Componente principal ──────────────────────────────────────────────────────

const AdminHeroSlides = () => {
  const { slides, loading, refetch } = useHeroSlidesAdmin();
  const queryClient = useQueryClient();
  const [forms, setForms] = useState<SlideForm[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Sincroniza forms com dados do banco (apenas na primeira carga)
  if (!loading && !initialized) {
    setForms(slides.map(slideToForm));
    setInitialized(true);
  }

  const updateForm = (index: number, updated: SlideForm) => {
    setForms((prev) => prev.map((f, i) => (i === index ? updated : f)));
  };

  const handleAddSlide = () => {
    setForms((prev) => [...prev, emptySlide()]);
  };

  const handleSave = async (index: number) => {
    const form = forms[index];
    const key = form.id ?? `new-${index}`;
    try {
      setSaving(key);
      const payload = {
        titulo: form.titulo,
        subtitulo: form.subtitulo || null,
        botao_texto: form.botao_texto,
        botao_url: form.botao_url,
        imagem_mobile: form.imagem_mobile,
        imagem_desktop: form.imagem_desktop,
        ordem: form.ordem,
        ativo: form.ativo,
      };

      if (form.isNew) {
        const { data, error } = await supabase.from('hero_slides').insert(payload).select().single();
        if (error) throw error;
        // Atualiza o form local com o ID retornado e marca como não-novo
        setForms((prev) => prev.map((f, i) => i === index ? { ...f, id: data.id, isNew: false } : f));
      } else {
        const { error } = await supabase.from('hero_slides').update(payload).eq('id', form.id!);
        if (error) throw error;
      }

      toast.success('Slide salvo com sucesso');
      queryClient.invalidateQueries({ queryKey: ['hero-slides-ativos'] });
    } catch {
      toast.error('Erro ao salvar slide');
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (index: number) => {
    const form = forms[index];
    if (form.isNew) {
      setForms((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    const key = form.id!;
    try {
      setDeleting(key);
      const { error } = await supabase.from('hero_slides').delete().eq('id', key);
      if (error) throw error;
      setForms((prev) => prev.filter((_, i) => i !== index));
      toast.success('Slide removido');
      queryClient.invalidateQueries({ queryKey: ['hero-slides-ativos'] });
    } catch {
      toast.error('Erro ao remover slide');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-primary">Slides do Carrossel</h3>
          <p className="text-sm text-muted-foreground">Gerencie os banners do hero. Slides inativos não aparecem no site.</p>
        </div>
        <Button onClick={handleAddSlide} size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/5">
          <Plus className="w-4 h-4 mr-1" />Adicionar Slide
        </Button>
      </div>

      {forms.length === 0 && (
        <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
          <Layers className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Nenhum slide cadastrado. Clique em "Adicionar Slide" para começar.</p>
        </div>
      )}

      {forms.map((form, i) => (
        <SlideCard
          key={form.id ?? `new-${i}`}
          form={form}
          onChange={(updated) => updateForm(i, updated)}
          onSave={() => handleSave(i)}
          onDelete={() => handleDelete(i)}
          saving={saving === (form.id ?? `new-${i}`)}
          deleting={deleting === form.id}
        />
      ))}
    </div>
  );
};

export default AdminHeroSlides;
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Resultado esperado: sem erros no novo arquivo.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/AdminHeroSlides.tsx
git commit -m "feat: componente AdminHeroSlides para gestão dos slides no CMS"
```

---

## Task 7: Integrar AdminHeroSlides no AdminSettings

**Files:**
- Modify: `src/components/admin/AdminSettings.tsx`

- [ ] **Step 1: Adicionar o import**

No topo de `src/components/admin/AdminSettings.tsx`, adicionar após os imports existentes:

```tsx
import AdminHeroSlides from '@/components/admin/AdminHeroSlides';
```

- [ ] **Step 2: Adicionar a seção no JSX**

No `return` do componente, adicionar a seção de carrossel **acima** do `<div className="grid gap-6 md:grid-cols-2">` existente:

```tsx
return (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bebas text-primary">Configurações do Site</h2>
      <p className="text-muted-foreground">Altere logos, imagens e configurações gerais</p>
    </div>

    {/* ── Carrossel Hero ── */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          Carrossel Hero
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AdminHeroSlides />
      </CardContent>
    </Card>

    {/* ── Grid de configurações existentes ── */}
    <div className="grid gap-6 md:grid-cols-2">
      {/* ... todo o conteúdo existente permanece aqui sem alteração ... */}
    </div>
  </div>
);
```

> **Atenção:** Apenas adicione o bloco `<Card>` de Carrossel Hero antes do `<div className="grid gap-6 md:grid-cols-2">`. Não altere nenhum outro código existente no componente.

- [ ] **Step 3: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Resultado esperado: sem erros.

- [ ] **Step 4: Testar no browser — CMS**

```bash
npm run dev
```

1. Acessar `http://localhost:8080/admin`
2. Fazer login como admin
3. Navegar para "Configurações"
4. Verificar que a seção "Carrossel Hero" aparece no topo
5. Clicar em "Adicionar Slide", preencher os campos e clicar "Salvar Slide"
6. Verificar toast "Slide salvo com sucesso"
7. Recarregar a página e confirmar que o slide persiste

- [ ] **Step 5: Testar no browser — Carrossel na homepage**

1. Ativar o slide criado (toggle "Ativo")
2. Acessar `http://localhost:8080`
3. Verificar que o carrossel aparece com o slide
4. Em desktop: verificar que a imagem desktop e o texto ficam lado a lado
5. Em mobile (DevTools → responsive): verificar que a imagem mobile aparece fullscreen com overlay no rodapé
6. Aguardar 5 segundos e confirmar autoplay (se houver ≥ 2 slides ativos)

- [ ] **Step 6: Commit final**

```bash
git add src/components/admin/AdminSettings.tsx
git commit -m "feat: integra AdminHeroSlides em Configurações do admin"
```
