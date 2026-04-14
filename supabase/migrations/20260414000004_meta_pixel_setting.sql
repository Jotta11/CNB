-- Adiciona chave do Meta Pixel ao site_settings
INSERT INTO site_settings (key, value, description)
VALUES ('meta_pixel_id', NULL, 'ID do Pixel da Meta (Facebook Ads)')
ON CONFLICT (key) DO NOTHING;
