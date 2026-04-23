// src/components/admin/leads.types.ts
export type LeadStatus = 'novo' | 'em_contato' | 'convertido' | 'perdido';
export type LeadTipo = 'comprar' | 'vender' | 'tabela_precos' | 'ofertas_direcionadas';

export interface Lead {
  id: string;
  tipo: LeadTipo;
  nome: string;
  telefone: string;
  fazenda: string | null;
  localizacao: string | null;
  tipo_cultura: string | null;
  numero_cabecas: number | null;
  mensagem: string | null;
  status: LeadStatus;
  created_at: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  area_atuacao: string | null;
}

export const tipoLabels: Record<LeadTipo, string> = {
  comprar: 'Quer Comprar',
  vender: 'Quer Vender',
  tabela_precos: 'Tabela de Preços',
  ofertas_direcionadas: 'Ofertas Direcionadas',
};

export const tipoColors: Record<LeadTipo, { bg: string; text: string; border: string; icon: string; iconBg: string }> = {
  comprar:              { bg: 'bg-green-100',   text: 'text-green-600',   border: 'border-green-500',   icon: 'text-green-600',   iconBg: 'bg-green-100'   },
  vender:               { bg: 'bg-blue-100',    text: 'text-blue-600',    border: 'border-blue-500',    icon: 'text-blue-600',    iconBg: 'bg-blue-100'    },
  tabela_precos:        { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-500', icon: 'text-emerald-600', iconBg: 'bg-emerald-100' },
  ofertas_direcionadas: { bg: 'bg-purple-100',  text: 'text-purple-600',  border: 'border-purple-500',  icon: 'text-purple-600',  iconBg: 'bg-purple-100'  },
};

export const statusLabels: Record<LeadStatus, string> = {
  novo: 'Novo',
  em_contato: 'Em Contato',
  convertido: 'Convertido',
  perdido: 'Perdido',
};

export const statusColors: Record<LeadStatus, string> = {
  novo: 'bg-blue-500',
  em_contato: 'bg-yellow-500',
  convertido: 'bg-green-500',
  perdido: 'bg-red-500',
};
