
CREATE TABLE public.noticias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  resumo TEXT,
  conteudo TEXT NOT NULL,
  imagem_url TEXT,
  autor TEXT,
  data_publicacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published noticias"
ON public.noticias
FOR SELECT
TO anon, authenticated
USING (ativo = true);

CREATE POLICY "Admins can manage noticias"
ON public.noticias
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
