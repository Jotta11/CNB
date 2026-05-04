-- Aumenta o limite de tamanho de arquivo do bucket lotes-videos para 200 MB.
-- O padrão do Supabase é 50 MB, o que rejeitava vídeos entre 50–200 MB.
UPDATE storage.buckets
SET file_size_limit = 209715200
WHERE id = 'lotes-videos';
