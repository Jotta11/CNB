import { supabase } from '@/integrations/supabase/client';

// ── convertToWebP ─────────────────────────────────────────────────────────────

/**
 * Converte um File de imagem para WebP via Canvas API do browser.
 * Redimensiona proporcionalmente se largura > maxWidth.
 * @param file    Arquivo de imagem original (qualquer formato suportado pelo browser)
 * @param maxWidth Largura máxima em pixels (ex: 768, 1200, 1920). Se a imagem for menor, não é redimensionada.
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
      const result = e.target?.result;
      if (typeof result !== 'string') {
        return reject(new Error('Falha ao ler o arquivo de imagem'));
      }
      img.src = result;
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
  if (!isFinite(duration) || duration > MAX_VIDEO_DURATION_SECONDS) {
    throw new Error('Vídeo muito longo. Duração máxima: 2 minutos.');
  }
  const { error } = await supabase.storage
    .from('lotes-videos')
    .upload(storagePath, file, { contentType: file.type });
  if (error) throw new Error(`Erro ao enviar vídeo: ${error.message}`);
  const { data } = supabase.storage
    .from('lotes-videos')
    .getPublicUrl(storagePath);
  return data.publicUrl;
};
