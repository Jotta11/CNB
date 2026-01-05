-- Insert the about section image setting
INSERT INTO public.site_settings (key, value, description)
VALUES ('about_image', NULL, 'Imagem/Arte da seção Quem Somos')
ON CONFLICT (key) DO NOTHING;