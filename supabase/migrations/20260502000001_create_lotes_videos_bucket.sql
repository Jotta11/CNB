-- Cria o bucket lotes-videos para armazenar vídeos dos lotes
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('lotes-videos', 'lotes-videos', true, 209715200)
ON CONFLICT (id) DO NOTHING;

-- 1. Qualquer pessoa pode visualizar vídeos dos lotes
DROP POLICY IF EXISTS "Anyone can view lotes videos" ON storage.objects;
CREATE POLICY "Anyone can view lotes videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'lotes-videos');

-- 2. Admins podem fazer upload de vídeos
DROP POLICY IF EXISTS "Admins can upload lotes videos" ON storage.objects;
CREATE POLICY "Admins can upload lotes videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'lotes-videos' AND
  public.has_role(auth.uid(), 'admin'::text)
);

-- 3. Admins podem atualizar vídeos
DROP POLICY IF EXISTS "Admins can update lotes videos" ON storage.objects;
CREATE POLICY "Admins can update lotes videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'lotes-videos' AND
  public.has_role(auth.uid(), 'admin'::text)
)
WITH CHECK (
  bucket_id = 'lotes-videos' AND
  public.has_role(auth.uid(), 'admin'::text)
);

-- 4. Admins podem deletar vídeos
DROP POLICY IF EXISTS "Admins can delete lotes videos" ON storage.objects;
CREATE POLICY "Admins can delete lotes videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'lotes-videos' AND
  public.has_role(auth.uid(), 'admin'::text)
);
