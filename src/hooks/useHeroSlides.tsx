import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HeroSlide {
  id: string;
  titulo: string;
  subtitulo: string | null;
  botao_texto: string;
  botao_url: string;
  imagem_mobile: string | null;
  imagem_desktop: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const useHeroSlides = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['hero-slides-ativos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data as HeroSlide[];
    },
  });

  return { slides: data ?? [], loading: isLoading };
};

export const useHeroSlidesAdmin = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['hero-slides-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data as HeroSlide[];
    },
  });

  return { slides: data ?? [], loading: isLoading, refetch };
};
