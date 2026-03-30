import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type LeadTipo = 'comprar' | 'vender' | 'tabela_precos' | 'ofertas_direcionadas';

interface LeadPayload {
  tipo: LeadTipo;
  nome: string;
  telefone: string;
  email?: string;
  localizacao?: string;
  area_atuacao?: string;
  ciclo_produtivo?: string;
  volume_rebanho?: string;
  categoria_gado?: string;
  numero_cabecas?: number;
  mensagem?: string;
}

function getUTMs() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || null,
    utm_medium: params.get('utm_medium') || null,
    utm_campaign: params.get('utm_campaign') || null,
    utm_content: params.get('utm_content') || null,
  };
}

export function useLeadSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function submitLead(payload: LeadPayload) {
    setIsSubmitting(true);
    const utms = getUTMs();
    const { error } = await supabase.from('leads').insert({
      ...payload,
      ...utms,
      status: 'novo',
    });
    setIsSubmitting(false);
    if (error) throw error;
    setSubmitted(true);
  }

  return { submitLead, isSubmitting, submitted };
}
