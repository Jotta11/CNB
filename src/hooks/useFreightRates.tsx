import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FreightRate {
  id: string;
  regiao: string;
  tipo_implemento: string;
  valor_km: number;
  descricao: string | null;
  created_at: string;
  updated_at: string;
}

export const useFreightRates = () => {
  const [rates, setRates] = useState<FreightRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('freight_rates')
        .select('*')
        .order('regiao', { ascending: true });

      if (error) throw error;

      setRates(data as FreightRate[]);
      setError(null);
    } catch (err) {
      console.error('Error fetching freight rates:', err);
      setError('Erro ao carregar taxas de frete');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const getRateForRegion = (regiao: string, tipoImplemento: string = 'nove_eixos'): number => {
    const rate = rates.find(r => r.regiao === regiao && r.tipo_implemento === tipoImplemento);
    return rate?.valor_km ?? 8.50; // Default value
  };

  return { rates, loading, error, fetchRates, getRateForRegion };
};
