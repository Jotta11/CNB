// src/types/parceiros.ts

export interface Parceiro {
  id: string;
  nome_completo: string;
  cpf: string;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  chave_pix: string | null;
  profissao: string;
  uf: string;
  cidade: string;
  status_funil: string;
  origem: string;
  created_at: string;
  updated_at: string;
}

export interface Indicacao {
  id: string;
  parceiro_id: string;
  cliente_nome: string;
  cliente_telefone: string | null;
  cliente_municipio: string | null;
  cliente_uf: string | null;
  fluxo: string;
  urgencia: string;
  categoria: string;
  raca: string;
  num_cabecas: number;
  idade: string | null;
  peso_atual: number | null;
  data_projetada: string | null;
  observacoes_ia: string | null;
  status: string;
  origem: string;
  cupom_utilizado: string | null;
  created_at: string;
  updated_at: string;
  parceiros?: { nome_completo: string } | null;
}

export interface ParceiroContato {
  id: string;
  parceiro_id: string;
  tipo: string;
  descricao: string | null;
  created_at: string;
}

export interface Contrato {
  id: string;
  tipo: string;
  parceiro_id: string;
  indicacao_id: string | null;
  gerado_em: string;
  parceiros?: Parceiro | null;
  indicacoes?: Indicacao | null;
}

export interface ModeloContrato {
  id: string;
  tipo: string;
  conteudo: string;
  created_at: string;
  updated_at: string;
}

export type ParceiroInsert = Omit<Parceiro, 'id' | 'created_at' | 'updated_at'>;
export type IndicacaoInsert = Omit<Indicacao, 'id' | 'created_at' | 'updated_at' | 'parceiros'>;
