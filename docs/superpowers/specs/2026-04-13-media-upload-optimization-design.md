# Design: Otimização de Upload de Mídia (WebP + Vídeo)

**Data:** 2026-04-13  
**Status:** Aprovado

---

## Contexto

O projeto CNB tem dois pontos de upload de imagens (hero slides e lotes) e um campo de URL do YouTube para vídeos de lotes. O problema:

- Imagens são salvas no formato original (JPEG/PNG), pesadas para o site
- Vídeos dependem exclusivamente de YouTube, sem suporte a upload direto
- O `LazyVideoPlayer` existente em `LoteDetails.tsx` só sabe lidar com URLs do YouTube

## Objetivo

1. Converter imagens para WebP automaticamente no browser antes do upload ao Supabase Storage
2. Permitir upload direto de vídeos MP4/MOV ao Supabase Storage com validações
3. Exibir vídeos do Storage com lazy loading para não impactar a performance do site

---

## Arquitetura

### Novo arquivo: `src/utils/mediaUpload.ts`

Centraliza toda a lógica de processamento de mídia. Dois exports principais:

#### `convertToWebP(file: File, maxWidth: number, quality?: number): Promise<File>`

1. Lê o arquivo original via `FileReader` → `HTMLImageElement`
2. Desenha num `<canvas>` redimensionando proporcionalmente se `naturalWidth > maxWidth`
3. Exporta com `canvas.toBlob(..., 'image/webp', quality)` — qualidade padrão `0.85`
4. Retorna `File` com nome substituído para `.webp`

Parâmetros de `maxWidth` por contexto:
- Hero slide mobile: **768px**
- Hero slide desktop: **1920px**
- Imagem de lote: **1200px**

#### `uploadVideo(file: File, storagePath: string): Promise<string>`

Validações antes do upload:
- Formato aceito: `video/mp4`, `video/quicktime` (MOV), `video/webm`
- Tamanho máximo: **200 MB**
- Duração máxima: **2 minutos** — lida via `HTMLVideoElement` com `URL.createObjectURL`

Se válido, faz upload para o bucket `lotes-videos` no Supabase Storage e retorna a URL pública.

---

## Modificações nos componentes admin

### `src/components/admin/AdminHeroSlides.tsx`

A função `uploadSlideImage` atual faz upload direto. Passa a chamar `convertToWebP` antes:

```
// antes
const { error } = await supabase.storage.from('site-assets').upload(path, file)

// depois
const webpFile = await convertToWebP(file, slot === 'mobile' ? 768 : 1920)
const { error } = await supabase.storage.from('site-assets').upload(path, webpFile)
```

O `path` já usa o `slideId` como base — apenas o nome do arquivo muda para `.webp`.

### `src/components/admin/LoteFormModal.tsx`

**Imagem do lote:** `handleImageUpload` passa o arquivo por `convertToWebP(file, 1200)` antes do upload. Sem outra mudança visível para o usuário.

**Campo de vídeo:** substituir o campo de texto ("URL do Vídeo (YouTube)") por um campo de upload de arquivo. O novo campo:
- Aceita `video/mp4,video/quicktime,video/webm`
- Chama `uploadVideo(file, path)` e salva a URL retornada em `form.video_url`
- Mostra progresso de upload (o arquivo pode ser grande)
- Mantém a possibilidade de limpar o vídeo atual

O campo `video_url` no banco continua o mesmo — agora armazena URL do Supabase Storage em vez de URL do YouTube. Não há migração de schema necessária; lotes existentes com URL do YouTube continuam funcionando.

---

## Modificações na exibição do site

### `src/pages/LoteDetails.tsx` — `LazyVideoPlayer`

Atualmente o componente só trata URLs do YouTube. Precisa detectar o tipo de URL:

```
// YouTube: getYouTubeVideoId(url) retorna ID de 11 chars
// Storage: URL do Supabase (contém 'supabase.co/storage')
```

Para URLs do **Supabase Storage**:
- Renderiza `<video>` nativo com `preload="none"` e `controls`
- `poster` usa a `imagem_url` do lote (já disponível na página)
- O `src` só é atribuído ao elemento após o clique no botão de play (mesmo padrão do YouTube atual)
- IntersectionObserver já existe — reutilizar

Para URLs do **YouTube**: comportamento atual mantido sem alteração.

Se `video_url` for nulo ou não reconhecido: exibe "Vídeo em breve" (comportamento atual mantido).

---

## Supabase Storage

Novo bucket necessário: **`lotes-videos`**
- Acesso público (leitura)
- Política de upload: apenas usuários autenticados com role `admin`

O bucket `site-assets` (hero slides) já existe e não muda.

---

## O que NÃO muda

- Schema do banco de dados — campo `video_url` permanece `text`
- Lotes com URL do YouTube existentes continuam exibindo normalmente
- `imagem_url` dos lotes continua sendo salva no bucket existente de lotes

---

## Fluxo completo de upload de vídeo (admin)

```
Usuário seleciona arquivo
        ↓
Validação: formato, tamanho (≤200MB), duração (≤2min)
        ↓ (se inválido: toast de erro, sem upload)
Upload para Supabase Storage (bucket: lotes-videos)
        ↓
URL pública salva em form.video_url
        ↓
Ao salvar o lote: video_url persistido no banco
```

---

## Arquivos a criar/modificar

| Arquivo | Ação |
|---|---|
| `src/utils/mediaUpload.ts` | Criar |
| `src/components/admin/AdminHeroSlides.tsx` | Modificar |
| `src/components/admin/LoteFormModal.tsx` | Modificar |
| `src/pages/LoteDetails.tsx` | Modificar |
| Supabase Dashboard | Criar bucket `lotes-videos` manualmente |
