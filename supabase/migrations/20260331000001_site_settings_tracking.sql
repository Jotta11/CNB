-- Adiciona chaves de rastreamento ao site_settings (sem valores padrão)
INSERT INTO site_settings (key, value, description)
VALUES
  ('gtm_id',  NULL, 'ID do contêiner do Google Tag Manager'),
  ('ga4_id',  NULL, 'ID da propriedade do Google Analytics 4')
ON CONFLICT (key) DO NOTHING;
