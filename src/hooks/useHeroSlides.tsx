import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HeroSlide {
  id: string;
  titulo: string;
  subtitulo: string | null;
  botao_texto: string | null;
  botao_url: string | null;
  imagem_mobile: string | null;
  imagem_desktop: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

const fetchActiveSlides = async (): Promise<HeroSlide[]> => {
  const { data, error } = await supabase
    .from('hero_slides' as never)
    .select('*')
    .eq('ativo', true)
    .order('ordem', { ascending: true });
  if (error) {
    console.error('[useHeroSlides] Erro ao buscar slides:', error);
    throw error;
  }
  return (data ?? []) as HeroSlide[];
};

const fetchAllSlides = async (): Promise<HeroSlide[]> => {
  const { data, error } = await supabase
    .from('hero_slides' as never)
    .select('*')
    .order('ordem', { ascending: true });
  if (error) {
    console.error('[useHeroSlidesAdmin] Erro ao buscar slides:', error);
    throw error;
  }
  return (data ?? []) as HeroSlide[];
};

export const useHeroSlides = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['hero-slides-ativos'],
    queryFn: fetchActiveSlides,
    staleTime: 1000 * 60 * 5, // 5 min cache
    retry: 2,
  });

  return {
    slides: data ?? [],
    loading: isLoading,
    isError,
    error,
  };
};

export const useHeroSlidesAdmin = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['hero-slides-admin'],
    queryFn: fetchAllSlides,
  });

  return { slides: data ?? [], loading: isLoading, isError, refetch };
};
