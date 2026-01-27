import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Partner {
  id: string;
  nome: string;
  logo_url: string;
  link: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const usePartners = () => {
  const queryClient = useQueryClient();

  const { data: partners = [], isLoading, error } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('ordem', { ascending: true });
      
      if (error) throw error;
      return data as Partner[];
    },
  });

  const createPartner = useMutation({
    mutationFn: async (partner: Omit<Partner, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('partners')
        .insert(partner)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Parceiro adicionado com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating partner:', error);
      toast.error('Erro ao adicionar parceiro');
    },
  });

  const updatePartner = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Partner> & { id: string }) => {
      const { data, error } = await supabase
        .from('partners')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Parceiro atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating partner:', error);
      toast.error('Erro ao atualizar parceiro');
    },
  });

  const deletePartner = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Parceiro removido com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting partner:', error);
      toast.error('Erro ao remover parceiro');
    },
  });

  return {
    partners,
    isLoading,
    error,
    createPartner,
    updatePartner,
    deletePartner,
  };
};
