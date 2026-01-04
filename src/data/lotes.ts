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
  preco: number;
  descricao: string;
  caracteristicas: string[];
}

export const lotes: Lote[] = [
  {
    id: '001',
    numero: 'LOTE #001',
    titulo: 'Nelore Premium',
    raca: 'Nelore',
    idade: '24 meses',
    peso: '420kg',
    quantidade: 50,
    sexo: 'Macho',
    estado: 'Vacinado',
    preco: 3200,
    descricao: 'Lote premium de gado Nelore, com excelente padrão genético e conformação para engorda. Animais criados em sistema semi-intensivo, com manejo nutricional diferenciado e acompanhamento veterinário constante. Os animais apresentam uniformidade de lote, ótima conversão alimentar e estrutura óssea robusta, características essenciais para alto ganho de peso. Ideal para confinamento ou terminação em pasto.',
    caracteristicas: [
      'Certificado sanitário completo',
      'GTA (Guia de Trânsito Animal)',
      'Vacinação em dia',
      'Vermifugação recente',
      'Rastreabilidade completa',
      'Garantia de procedência',
    ],
  },
  {
    id: '002',
    numero: 'LOTE #002',
    titulo: 'Angus Selecionado',
    raca: 'Angus',
    idade: '18 meses',
    peso: '380kg',
    quantidade: 30,
    sexo: 'Macho',
    estado: 'Vacinado',
    preco: 4500,
    descricao: 'Lote excepcional de gado Angus, reconhecido mundialmente pela qualidade superior da carne. Animais com excelente marmoreio, características ideais para mercados premium e programas de carne certificada. Criados com manejo específico para a raça, estes animais apresentam precocidade de acabamento e qualidade de carcaça diferenciada.',
    caracteristicas: [
      'Certificado sanitário completo',
      'GTA (Guia de Trânsito Animal)',
      'Vacinação em dia',
      'Vermifugação recente',
      'Rastreabilidade completa',
      'Garantia de procedência',
    ],
  },
  {
    id: '003',
    numero: 'LOTE #003',
    titulo: 'Brahman Reprodutor',
    raca: 'Brahman',
    idade: '36 meses',
    peso: '550kg',
    quantidade: 20,
    sexo: 'Macho',
    estado: 'Vacinado',
    preco: 8900,
    descricao: 'Lote exclusivo de reprodutores Brahman, raça conhecida pela rusticidade, adaptabilidade e resistência a climas tropicais. Animais com excelente conformação racial, ideal para melhoramento genético de rebanhos. Touros com comprovada fertilidade e temperamento dócil.',
    caracteristicas: [
      'Certificado sanitário completo',
      'GTA (Guia de Trânsito Animal)',
      'Vacinação em dia',
      'Vermifugação recente',
      'Rastreabilidade completa',
      'Garantia de procedência',
    ],
  },
  {
    id: '004',
    numero: 'LOTE #004',
    titulo: 'Senepol Elite',
    raca: 'Senepol',
    idade: '22 meses',
    peso: '400kg',
    quantidade: 40,
    sexo: 'Macho',
    estado: 'Vacinado',
    preco: 3800,
    descricao: 'Lote selecionado de gado Senepol, raça tropical adaptada ao clima brasileiro. Excelente ganho de peso, conformação de carcaça e precocidade. Ideal para sistemas de produção intensivos e adaptação a climas quentes.',
    caracteristicas: [
      'Certificado sanitário completo',
      'GTA (Guia de Trânsito Animal)',
      'Vacinação em dia',
      'Vermifugação recente',
      'Rastreabilidade completa',
      'Garantia de procedência',
    ],
  },
];
