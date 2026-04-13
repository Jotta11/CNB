// src/types/parceiros.ts
import type {
  FunilStatus, IndicacaoStatus, ContatoTipo,
  Profissao, Uf, Fluxo, Urgencia, Categoria, Raca,
} from '@/data/parceiros-constants';

export interface Parceiro {
  id: string;
  nome_completo: string;
  cpf: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  chave_pix: string | null;
  profissao: Profissao | null;
  uf: Uf;
  cidade: string;
  status_funil: FunilStatus;
  origem: 'manual' | 'landing_page';
  notas?: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  created_at: string;
  updated_at: string;
}

export interface Indicacao {
  id: string;
  parceiro_id: string;
  cliente_nome: string;
  cliente_telefone: string | null;
  cliente_municipio: string | null;
  cliente_uf: Uf | null;
  fluxo: Fluxo;
  urgencia: Urgencia;
  categoria: Categoria;
  raca: Raca;
  num_cabecas: number;
  idade: string | null;
  peso_atual: number | null;
  data_projetada: string | null;
  observacoes_ia: string | null;
  status: IndicacaoStatus;
  origem: string;
  cupom_utilizado: string | null;
  created_at: string;
  updated_at: string;
  parceiros?: { nome_completo: string } | null;
}

export interface ParceiroContato {
  id: string;
  parceiro_id: string;
  tipo: ContatoTipo;
  descricao: string | null;
  created_at: string;
}

export interface Contrato {
  id: string;
  tipo: 'parceria' | 'negocio';
  parceiro_id: string;
  indicacao_id: string | null;
  gerado_em: string;
  parceiros?: Parceiro | null;
  indicacoes?: Indicacao | null;
}

export interface ModeloContrato {
  id: string;
  tipo: 'parceria' | 'negocio';
  conteudo: string;
  created_at: string;
  updated_at: string;
}

export type ParceiroInsert = Omit<Parceiro, 'id' | 'created_at' | 'updated_at'>;
export type IndicacaoInsert = Omit<Indicacao, 'id' | 'created_at' | 'updated_at' | 'parceiros'>;
export type ParceiroContatoInsert = Omit<ParceiroContato, 'id' | 'created_at'>;
export type ContratoInsert = Omit<Contrato, 'id' | 'gerado_em' | 'parceiros' | 'indicacoes'>;
export type ModeloContratoInsert = Omit<ModeloContrato, 'id' | 'created_at' | 'updated_at'>;
