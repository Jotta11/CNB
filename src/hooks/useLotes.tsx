import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Lote {
  id: string;
  numero: string;
  titulo: string;
  raca: string;
  idade: string;
  peso: string;
  quantidade: number;
  sexo: string;
  estado: string;
  localizacao: string | null;
  cidade: string | null;
  preco: number;
  descricao: string | null;
  caracteristicas: string[];
  video_url: string | null;
  imagem_url: string | null;
  ativo: boolean;
  ordem: number;
  capacidade_carga: number;
  tipo_implemento: string;
  qtd_carretas: number;
  created_at: string;
  updated_at: string;
}

export const useLotes = (includeInactive = false) => {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLotes = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('lotes')
        .select('*')
        .order('ordem', { ascending: true });

      if (!includeInactive) {
        query = query.eq('ativo', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      setLotes(data as Lote[]);
      setError(null);
    } catch (err) {
      console.error('Error fetching lotes:', err);
      setError('Erro ao carregar lotes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLotes();
  }, [includeInactive]);

  const createLote = async (lote: Omit<Lote, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('lotes')
      .insert(lote)
      .select()
      .single();

    if (error) throw error;
    await fetchLotes();
    return data;
  };

  const updateLote = async (id: string, updates: Partial<Lote>) => {
    // Try direct update first
    const { data, error } = await supabase
      .from('lotes')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      console.warn('Update succeeded but no rows were returned. Potential RLS issue or ID mismatch.');
    }

    await fetchLotes();
    return data?.[0] || null;
  };

  const deleteLote = async (id: string) => {
    const { error } = await supabase
      .from('lotes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchLotes();
  };

  return { lotes, loading, error, fetchLotes, createLote, updateLote, deleteLote };
};
