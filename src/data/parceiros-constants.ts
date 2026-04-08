// src/data/parceiros-constants.ts

export const PROFISSOES = ['Corretor', 'Veterinário', 'Gerente de Banco', 'Zootecnista', 'Freelancer'] as const;

export const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
] as const;

export const UF_NAMES: Record<string, string> = {
  AC:'Acre', AL:'Alagoas', AP:'Amapá', AM:'Amazonas', BA:'Bahia', CE:'Ceará',
  DF:'Distrito Federal', ES:'Espírito Santo', GO:'Goiás', MA:'Maranhão',
  MT:'Mato Grosso', MS:'Mato Grosso do Sul', MG:'Minas Gerais', PA:'Pará',
  PB:'Paraíba', PR:'Paraná', PE:'Pernambuco', PI:'Piauí', RJ:'Rio de Janeiro',
  RN:'Rio Grande do Norte', RS:'Rio Grande do Sul', RO:'Rondônia', RR:'Roraima',
  SC:'Santa Catarina', SP:'São Paulo', SE:'Sergipe', TO:'Tocantins',
};

export const FLUXOS = ['Demanda', 'Oferta'] as const;
export const URGENCIAS = ['Imediata', 'Futura'] as const;
export const CATEGORIAS = ['Bezerro', 'Garrote', 'Boi Magro', 'Boi Gordo', 'Novilha', 'Vaca', 'Matriz'] as const;
export const RACAS = ['Nelore', 'Cruzamento Industrial', 'Angus', 'Brahman', 'Senepol', 'Outros'] as const;

export const FUNIL_STATUS = ['prospeccao', 'fechamento', 'ativo', 'com_indicacao'] as const;
export type FunilStatus = typeof FUNIL_STATUS[number];
export const FUNIL_LABELS: Record<FunilStatus, string> = {
  prospeccao:    'Em Prospecção',
  fechamento:    'Em Fechamento',
  ativo:         'Ativos',
  com_indicacao: 'C/ Indicação',
};

export const INDICACAO_STATUS = ['em_validacao', 'validada', 'em_negociacao', 'finalizada'] as const;
export type IndicacaoStatus = typeof INDICACAO_STATUS[number];
export const INDICACAO_STATUS_LABELS: Record<IndicacaoStatus, string> = {
  em_validacao:   'Em Validação',
  validada:       'Validada',
  em_negociacao:  'Em Negociação',
  finalizada:     'Finalizada',
};

export const CONTATO_TIPO_LABELS: Record<string, string> = {
  indicacao_criada:  'Indicação Criada',
  contrato_gerado:   'Contrato Gerado',
  contato_manual:    'Contato Manual',
  edicao_cadastro:   'Edição de Cadastro',
};

export const CONTATO_MANUAL_TIPOS = ['Ligação', 'WhatsApp', 'Visita', 'Outro'] as const;

export const TEMPLATE_VARS_PARCERIA = [
  { key: '{{nome_parceiro}}',    label: 'Nome do Parceiro' },
  { key: '{{cpf_cnpj}}',         label: 'CPF/CNPJ do Parceiro' },
  { key: '{{endereco_parceiro}}',label: 'Endereço do Parceiro' },
  { key: '{{pix}}',              label: 'Chave Pix' },
  { key: '{{profissao}}',        label: 'Profissão' },
  { key: '{{comissao}}',         label: 'Comissão (%)' },
  { key: '{{area_atuacao}}',     label: 'Área de Atuação' },
  { key: '{{vigencia}}',         label: 'Vigência' },
  { key: '{{data_assinatura}}',  label: 'Data de Assinatura' },
  { key: '{{data_atual}}',       label: 'Data Atual' },
] as const;

export const TEMPLATE_VARS_NEGOCIO = [
  ...TEMPLATE_VARS_PARCERIA,
  { key: '{{nome_cliente}}',        label: 'Nome do Cliente' },
  { key: '{{telefone_cliente}}',    label: 'Telefone do Cliente' },
  { key: '{{municipio_uf}}',        label: 'Município/UF do Cliente' },
  { key: '{{fluxo}}',               label: 'Fluxo' },
  { key: '{{categoria_gado}}',      label: 'Categoria' },
  { key: '{{raca}}',                label: 'Raça' },
  { key: '{{num_cabecas}}',         label: 'Nº de Cabeças' },
  { key: '{{peso_atual}}',          label: 'Peso Atual (kg)' },
  { key: '{{data_projetada}}',      label: 'Data Projetada' },
  { key: '{{valor_unidade}}',       label: 'Valor por Cabeça (R$)' },
  { key: '{{valor_total_lote}}',    label: 'Valor Total do Lote (R$)' },
  { key: '{{condicao_pagamento}}',  label: 'Condição de Pagamento' },
  { key: '{{data_entrega}}',        label: 'Data de Entrega' },
  { key: '{{observacoes}}',         label: 'Observações' },
] as const;
