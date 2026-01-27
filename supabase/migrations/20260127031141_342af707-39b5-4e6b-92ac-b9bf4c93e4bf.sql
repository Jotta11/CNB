-- Add freight-related columns to lotes table
ALTER TABLE public.lotes 
ADD COLUMN IF NOT EXISTS capacidade_carga integer DEFAULT 96,
ADD COLUMN IF NOT EXISTS tipo_implemento text DEFAULT 'nove_eixos',
ADD COLUMN IF NOT EXISTS qtd_carretas integer DEFAULT 1;

-- Create freight rates table for km values by region and implement type
CREATE TABLE IF NOT EXISTS public.freight_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  regiao text NOT NULL,
  tipo_implemento text NOT NULL,
  valor_km numeric NOT NULL DEFAULT 8.50,
  descricao text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(regiao, tipo_implemento)
);

-- Enable RLS
ALTER TABLE public.freight_rates ENABLE ROW LEVEL SECURITY;

-- Anyone can view freight rates
CREATE POLICY "Anyone can view freight rates"
ON public.freight_rates
FOR SELECT
USING (true);

-- Admins can manage freight rates
CREATE POLICY "Admins can manage freight rates"
ON public.freight_rates
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default freight rates for each region and implement type
INSERT INTO public.freight_rates (regiao, tipo_implemento, valor_km, descricao) VALUES
-- Norte
('Acre', 'nove_eixos', 9.50, 'Carreta 9 eixos - Região Norte'),
('Amazonas', 'nove_eixos', 9.50, 'Carreta 9 eixos - Região Norte'),
('Amapá', 'nove_eixos', 9.50, 'Carreta 9 eixos - Região Norte'),
('Pará', 'nove_eixos', 9.00, 'Carreta 9 eixos - Região Norte'),
('Rondônia', 'nove_eixos', 9.00, 'Carreta 9 eixos - Região Norte'),
('Roraima', 'nove_eixos', 9.50, 'Carreta 9 eixos - Região Norte'),
('Tocantins', 'nove_eixos', 8.50, 'Carreta 9 eixos - Região Norte'),
-- Nordeste
('Alagoas', 'nove_eixos', 8.50, 'Carreta 9 eixos - Região Nordeste'),
('Bahia', 'nove_eixos', 8.50, 'Carreta 9 eixos - Região Nordeste'),
('Ceará', 'nove_eixos', 8.50, 'Carreta 9 eixos - Região Nordeste'),
('Maranhão', 'nove_eixos', 8.50, 'Carreta 9 eixos - Região Nordeste'),
('Paraíba', 'nove_eixos', 8.50, 'Carreta 9 eixos - Região Nordeste'),
('Pernambuco', 'nove_eixos', 8.50, 'Carreta 9 eixos - Região Nordeste'),
('Piauí', 'nove_eixos', 8.50, 'Carreta 9 eixos - Região Nordeste'),
('Rio Grande do Norte', 'nove_eixos', 8.50, 'Carreta 9 eixos - Região Nordeste'),
('Sergipe', 'nove_eixos', 8.50, 'Carreta 9 eixos - Região Nordeste'),
-- Centro-Oeste
('Distrito Federal', 'nove_eixos', 8.00, 'Carreta 9 eixos - Região Centro-Oeste'),
('Goiás', 'nove_eixos', 8.00, 'Carreta 9 eixos - Região Centro-Oeste'),
('Mato Grosso', 'nove_eixos', 8.00, 'Carreta 9 eixos - Região Centro-Oeste'),
('Mato Grosso do Sul', 'nove_eixos', 8.00, 'Carreta 9 eixos - Região Centro-Oeste'),
-- Sudeste
('Espírito Santo', 'nove_eixos', 8.00, 'Carreta 9 eixos - Região Sudeste'),
('Minas Gerais', 'nove_eixos', 8.00, 'Carreta 9 eixos - Região Sudeste'),
('Rio de Janeiro', 'nove_eixos', 8.50, 'Carreta 9 eixos - Região Sudeste'),
('São Paulo', 'nove_eixos', 8.00, 'Carreta 9 eixos - Região Sudeste'),
-- Sul
('Paraná', 'nove_eixos', 7.50, 'Carreta 9 eixos - Região Sul'),
('Rio Grande do Sul', 'nove_eixos', 7.50, 'Carreta 9 eixos - Região Sul'),
('Santa Catarina', 'nove_eixos', 7.50, 'Carreta 9 eixos - Região Sul')
ON CONFLICT (regiao, tipo_implemento) DO NOTHING;

-- Add trigger for updated_at
CREATE TRIGGER update_freight_rates_updated_at
BEFORE UPDATE ON public.freight_rates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();