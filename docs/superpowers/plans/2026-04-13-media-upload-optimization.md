# Media Upload Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converter imagens para WebP automaticamente antes do upload e permitir upload direto de vídeos MP4/MOV ao Supabase Storage, com lazy loading otimizado na exibição.

**Architecture:** Uma função utilitária centralizada em `src/utils/mediaUpload.ts` expõe `convertToWebP` (Canvas API nativa) e `uploadVideo` (com validações de formato/tamanho/duração). Os dois componentes admin consomem essas funções. O `LazyVideoPlayer` em `LoteDetails.tsx` passa a detectar se a URL é YouTube ou Supabase Storage e renderiza `<video>` nativo para o segundo caso.

**Tech Stack:** React 18, TypeScript, Supabase Storage JS Client (`@supabase/supabase-js`), Canvas API nativa do browser, lucide-react.

> **Nota:** O projeto não tem framework de testes configurado. Verificação é feita via `npm run build` (TypeScript + Vite) após cada task.

---

## Arquivos

| Arquivo | Ação |
|---|---|
| `src/utils/mediaUpload.ts` | Criar |
| `src/components/admin/AdminHeroSlides.tsx` | Modificar |
| `src/components/admin/LoteFormModal.tsx` | Modificar |
| `src/pages/LoteDetails.tsx` | Modificar |

---

## Task 1: Criar `src/utils/mediaUpload.ts`

**Files:**
- Create: `src/utils/mediaUpload.ts`

- [ ] **Step 1: Criar o arquivo com `convertToWebP` e `uploadVideo`**

Criar `src/utils/mediaUpload.ts` com o conteúdo abaixo:

```typescript
import { supabase } from '@/integrations/supabase/client';

// ── convertToWebP ─────────────────────────────────────────────────────────────

/**
 * Converte um File de imagem para WebP via Canvas API do browser.
 * Redimensiona proporcionalmente se largura > maxWidth.
 * @param file    Arquivo de imagem original (qualquer formato suportado pelo browser)
 * @param maxWidth Largura máxima em pixels (ex: 768, 1200, 1920)
 * @param quality  Qualidade WebP de 0 a 1, padrão 0.85
 */
export const convertToWebP = (
  file: File,
  maxWidth: number,
  quality = 0.85,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (w > maxWidth) {
          h = Math.round((h * maxWidth) / w);
          w = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas não disponível'));
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Falha ao converter imagem para WebP'));
            const webpName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
            resolve(new File([blob], webpName, { type: 'image/webp' }));
          },
          'image/webp',
          quality,
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

// ── uploadVideo ───────────────────────────────────────────────────────────────

const MAX_VIDEO_SIZE_BYTES = 200 * 1024 * 1024; // 200 MB
const MAX_VIDEO_DURATION_SECONDS = 120; // 2 minutos
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

const getVideoDuration = (file: File): Promise<number> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Não foi possível ler o vídeo'));
    };
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };
    video.src = url;
  });

/**
 * Valida e faz upload de um arquivo de vídeo para o bucket `lotes-videos`.
 * Lança Error com mensagem em português se a validação falhar.
 * @param file        Arquivo de vídeo
 * @param storagePath Caminho dentro do bucket (ex: `lotes/1234567890-video.mp4`)
 * @returns           URL pública do vídeo no Supabase Storage
 */
export const uploadVideo = async (
  file: File,
  storagePath: string,
): Promise<string> => {
  if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
    throw new Error('Formato inválido. Use MP4, MOV ou WebM.');
  }
  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    throw new Error('Vídeo muito grande. Tamanho máximo: 200 MB.');
  }
  const duration = await getVideoDuration(file);
  if (duration > MAX_VIDEO_DURATION_SECONDS) {
    throw new Error('Vídeo muito longo. Duração máxima: 2 minutos.');
  }
  const { error } = await supabase.storage
    .from('lotes-videos')
    .upload(storagePath, file, { contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage
    .from('lotes-videos')
    .getPublicUrl(storagePath);
  return data.publicUrl;
};
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

Esperado: sem erros TypeScript. Warnings de bundle são aceitáveis.

- [ ] **Step 3: Commit**

```bash
git add src/utils/mediaUpload.ts
git commit -m "feat: utilitários convertToWebP e uploadVideo"
```

---

## Task 2: Integrar `convertToWebP` em `AdminHeroSlides.tsx`

**Files:**
- Modify: `src/components/admin/AdminHeroSlides.tsx:1-66`

- [ ] **Step 1: Adicionar import de `convertToWebP`**

No topo do arquivo, após o import de `supabase`, adicionar:

```typescript
import { convertToWebP } from '@/utils/mediaUpload';
```

Ficará assim (linha ~4):
```typescript
import { supabase } from '@/integrations/supabase/client';
import { convertToWebP } from '@/utils/mediaUpload';
```

- [ ] **Step 2: Substituir a função `uploadSlideImage`**

Substituir a função `uploadSlideImage` existente (linhas 57–66) inteira por:

```typescript
const uploadSlideImage = async (file: File, slot: 'mobile' | 'desktop', slideId: string): Promise<string> => {
  const maxWidth = slot === 'mobile' ? 768 : 1920;
  const webpFile = await convertToWebP(file, maxWidth);
  const path = `hero-slides/${slideId}-${slot}-${Date.now()}.webp`;
  const { error } = await supabase.storage
    .from('site-assets')
    .upload(path, webpFile, { contentType: 'image/webp' });
  if (error) throw error;
  const { data } = supabase.storage.from('site-assets').getPublicUrl(path);
  return data.publicUrl;
};
```

- [ ] **Step 3: Verificar build**

```bash
npm run build
```

Esperado: sem erros TypeScript.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/AdminHeroSlides.tsx
git commit -m "feat: converte imagens hero para WebP antes do upload"
```

---

## Task 3: Integrar `convertToWebP` + upload de vídeo em `LoteFormModal.tsx`

**Files:**
- Modify: `src/components/admin/LoteFormModal.tsx`

- [ ] **Step 1: Atualizar imports**

Substituir a linha de import do lucide-react e adicionar o import de mediaUpload:

```typescript
import { Loader2, Upload, X, Video } from 'lucide-react';
import { convertToWebP, uploadVideo } from '@/utils/mediaUpload';
```

- [ ] **Step 2: Adicionar estado `uploadingVideo`**

Logo após a linha `const [uploading, setUploading] = useState(false);` (linha ~39), adicionar:

```typescript
const [uploadingVideo, setUploadingVideo] = useState(false);
```

- [ ] **Step 3: Atualizar `handleImageUpload` para usar `convertToWebP`**

Substituir a função `handleImageUpload` existente (linhas 111–138) inteira por:

```typescript
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    setUploading(true);
    const webpFile = await convertToWebP(file, 1200);
    const fileName = `lotes/${Date.now()}.webp`;
    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(fileName, webpFile, { contentType: 'image/webp' });
    if (uploadError) throw uploadError;
    const { data: urlData } = supabase.storage
      .from('site-assets')
      .getPublicUrl(fileName);
    setForm((prev) => ({ ...prev, imagem_url: urlData.publicUrl }));
    toast.success('Imagem enviada com sucesso');
  } catch (err) {
    console.error('Error uploading image:', err);
    toast.error('Erro ao enviar imagem');
  } finally {
    setUploading(false);
  }
};
```

- [ ] **Step 4: Adicionar `handleVideoUpload` logo após `handleImageUpload`**

```typescript
const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    setUploadingVideo(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `lotes/${Date.now()}-${safeName}`;
    const url = await uploadVideo(file, path);
    setForm((prev) => ({ ...prev, video_url: url }));
    toast.success('Vídeo enviado com sucesso');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao enviar vídeo';
    toast.error(message);
  } finally {
    setUploadingVideo(false);
  }
};
```

- [ ] **Step 5: Substituir o campo de vídeo no JSX**

Localizar e substituir o bloco JSX do campo de vídeo (contém `<Label htmlFor="video_url">URL do Vídeo (YouTube)</Label>`):

**Remover:**
```tsx
<div className="space-y-2">
  <Label htmlFor="video_url">URL do Vídeo (YouTube)</Label>
  <Input
    id="video_url"
    value={form.video_url}
    onChange={(e) => setForm((prev) => ({ ...prev, video_url: e.target.value }))}
    placeholder="https://youtube.com/watch?v=..."
  />
  <p className="text-xs text-muted-foreground">Cole o link completo do vídeo do YouTube.</p>
</div>
```

**Adicionar:**
```tsx
<div className="space-y-2">
  <Label>Vídeo do Lote</Label>
  <div className="flex items-center gap-4">
    {form.video_url ? (
      <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30 flex-1">
        <Video className="w-5 h-5 text-primary shrink-0" />
        <span className="text-sm text-muted-foreground truncate flex-1">Vídeo enviado</span>
        <button
          type="button"
          onClick={() => setForm((prev) => ({ ...prev, video_url: '' }))}
          className="text-destructive hover:text-destructive/80"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ) : (
      <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary transition-colors">
        <input
          type="file"
          accept="video/mp4,video/quicktime,video/webm"
          onChange={handleVideoUpload}
          className="hidden"
          disabled={uploadingVideo}
        />
        {uploadingVideo ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-1">Enviando vídeo...</span>
          </>
        ) : (
          <>
            <Upload className="w-6 h-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-1">MP4 / MOV / WebM — máx. 200 MB, 2 min</span>
          </>
        )}
      </label>
    )}
  </div>
</div>
```

- [ ] **Step 6: Verificar build**

```bash
npm run build
```

Esperado: sem erros TypeScript.

- [ ] **Step 7: Commit**

```bash
git add src/components/admin/LoteFormModal.tsx
git commit -m "feat: upload direto de vídeo e conversão WebP para imagens de lotes"
```

---

## Task 4: Atualizar `LazyVideoPlayer` em `LoteDetails.tsx` para suportar vídeos do Storage

**Files:**
- Modify: `src/pages/LoteDetails.tsx:25-111`

- [ ] **Step 1: Adicionar helper `isStorageVideo` e atualizar assinatura do componente**

Após a função `getYouTubeVideoId` (linha ~22) e antes da declaração de `LazyVideoPlayer`, adicionar:

```typescript
const isStorageVideo = (url: string): boolean =>
  url.includes('supabase.co/storage');
```

Substituir a assinatura do componente `LazyVideoPlayer` (linha ~25):

**De:**
```typescript
const LazyVideoPlayer = ({ videoUrl, loteNumero }: { videoUrl: string | null; loteNumero: string }) => {
```

**Para:**
```typescript
const LazyVideoPlayer = ({
  videoUrl,
  loteNumero,
  posterUrl,
}: {
  videoUrl: string | null;
  loteNumero: string;
  posterUrl?: string | null;
}) => {
```

- [ ] **Step 2: Atualizar a condição de "sem vídeo"**

Substituir (linha ~56):

**De:**
```typescript
  if (!videoUrl || !videoId) {
```

**Para:**
```typescript
  if (!videoUrl || (!videoId && !isStorageVideo(videoUrl))) {
```

- [ ] **Step 3: Adicionar branch de renderização para Storage antes do return do iframe YouTube**

Substituir o bloco completo do componente `LazyVideoPlayer` (do `useEffect` até o `return` do iframe) por:

```typescript
const LazyVideoPlayer = ({
  videoUrl,
  loteNumero,
  posterUrl,
}: {
  videoUrl: string | null;
  loteNumero: string;
  posterUrl?: string | null;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' },
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const videoId = videoUrl ? getYouTubeVideoId(videoUrl) : null;
  const isStorage = videoUrl ? isStorageVideo(videoUrl) : false;
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : null;

  const handlePlayClick = () => setShouldLoad(true);

  // Nenhuma URL válida reconhecida
  if (!videoUrl || (!videoId && !isStorage)) {
    return (
      <div className="text-white/50 flex flex-col items-center gap-3">
        <Video size={60} />
        <span className="text-lg">Vídeo em breve</span>
      </div>
    );
  }

  // Vídeo do Supabase Storage — já carregado após clique
  if (isStorage && shouldLoad) {
    return (
      <video
        src={videoUrl}
        controls
        autoPlay
        preload="none"
        poster={posterUrl ?? undefined}
        className="w-full h-full"
      />
    );
  }

  // Thumbnail + botão play (YouTube ou Storage antes do clique)
  if (!shouldLoad) {
    const poster = isStorage ? posterUrl : thumbnailUrl;
    return (
      <div ref={containerRef} className="w-full h-full relative">
        {isVisible && (
          <>
            {poster && (
              <img
                src={poster}
                alt={`Vídeo do ${loteNumero}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={
                  !isStorage
                    ? (e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                      }
                    : undefined
                }
              />
            )}
            <button
              onClick={handlePlayClick}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
              aria-label="Reproduzir vídeo"
            >
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-10 h-10 text-white fill-white ml-1" />
              </div>
            </button>
          </>
        )}
        {!isVisible && (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-white/50" />
          </div>
        )}
      </div>
    );
  }

  // YouTube iframe após clique
  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
      title={`Vídeo do ${loteNumero}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
    />
  );
};
```

- [ ] **Step 4: Atualizar a chamada do `LazyVideoPlayer` para passar `posterUrl`**

Localizar a linha com `<LazyVideoPlayer videoUrl={lote.video_url}` e adicionar o prop `posterUrl`:

**De:**
```tsx
<LazyVideoPlayer videoUrl={lote.video_url} loteNumero={lote.numero} />
```

**Para:**
```tsx
<LazyVideoPlayer videoUrl={lote.video_url} loteNumero={lote.numero} posterUrl={lote.imagem_url} />
```

- [ ] **Step 5: Verificar build**

```bash
npm run build
```

Esperado: sem erros TypeScript.

- [ ] **Step 6: Commit**

```bash
git add src/pages/LoteDetails.tsx
git commit -m "feat: LazyVideoPlayer suporta vídeos do Supabase Storage com lazy loading"
```

---

## Task 5: Criar bucket `lotes-videos` no Supabase (passo manual)

**Files:** nenhum — ação no Supabase Dashboard

- [ ] **Step 1: Acessar o Supabase Dashboard**

Acessar o projeto CNB no Supabase Dashboard → Storage → Buckets → "New bucket".

- [ ] **Step 2: Configurar o bucket**

| Campo | Valor |
|---|---|
| Name | `lotes-videos` |
| Public bucket | **ligado** (leitura pública) |
| File size limit | `209715200` (200 MB em bytes) |
| Allowed MIME types | `video/mp4, video/quicktime, video/webm` |

- [ ] **Step 3: Configurar política de upload (RLS)**

No bucket `lotes-videos` → Policies → "New policy" → "For full customization":

```sql
-- Permitir INSERT apenas para admins autenticados
CREATE POLICY "Admin upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'lotes-videos'
  AND EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

- [ ] **Step 4: Verificar funcionando**

Abrir o painel admin → editar um lote → tentar upload de um vídeo MP4 curto → confirmar que aparece "Vídeo enviado com sucesso" e a URL salva começa com `https://...supabase.co/storage/v1/object/public/lotes-videos/`.
