import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Clock, Send } from 'lucide-react';

interface FormData {
  nome: string;
  telefone: string;
  fazenda: string;
  localizacao: string;
  tipoCultura: string;
  numeroCabecas: string;
}

const SellerForm = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    telefone: '',
    fazenda: '',
    localizacao: '',
    tipoCultura: '',
    numeroCabecas: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'telefone') {
      setFormData(prev => ({ ...prev, [name]: formatPhone(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.telefone.trim() || formData.telefone.replace(/\D/g, '').length < 10) {
      newErrors.telefone = 'Telefone válido é obrigatório';
    }
    if (!formData.fazenda.trim()) newErrors.fazenda = 'Nome da fazenda é obrigatório';
    if (!formData.localizacao.trim()) newErrors.localizacao = 'Localização é obrigatória';
    if (!formData.tipoCultura) newErrors.tipoCultura = 'Selecione o tipo de cultura';
    if (!formData.numeroCabecas || parseInt(formData.numeroCabecas) < 1) {
      newErrors.numeroCabecas = 'Número de cabeças é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const message = `*Novo Cadastro de Lote - CNB*

*Nome:* ${formData.nome}
*Telefone:* ${formData.telefone}
*Fazenda:* ${formData.fazenda}
*Local:* ${formData.localizacao}
*Tipo de Cultura:* ${formData.tipoCultura}
*Número de Cabeças:* ${formData.numeroCabecas}

Gostaria de cadastrar meu lote na plataforma.`;

    const whatsappUrl = `https://wa.me/556399262816?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Clear form
    setFormData({
      nome: '',
      telefone: '',
      fazenda: '',
      localizacao: '',
      tipoCultura: '',
      numeroCabecas: '',
    });
  };

  return (
    <section id="vender" className="py-20 md:py-28 gradient-form">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto bg-card rounded-2xl shadow-xl p-8 md:p-12"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="text-primary" size={32} />
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-primary mb-3">
              O Próximo Passo para Modernizar Sua Pecuária
            </h2>
            <p className="text-muted-foreground mb-4">
              Cadastre seu lote, envie as informações básicas e deixe a curadoria 
              e a apresentação trabalharem por você. Menos deslocamento, menos custo e mais alcance.
            </p>
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full">
              <Clock size={18} />
              <span className="font-medium text-sm">Menos de 2 minutos para começar</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nome Completo <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.nome ? 'border-destructive' : 'border-input'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
                />
                {errors.nome && <span className="text-destructive text-xs mt-1">{errors.nome}</span>}
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Telefone/WhatsApp <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(63) 99999-9999"
                  maxLength={15}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.telefone ? 'border-destructive' : 'border-input'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
                />
                {errors.telefone && <span className="text-destructive text-xs mt-1">{errors.telefone}</span>}
              </div>

              {/* Fazenda */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nome da Fazenda <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="fazenda"
                  value={formData.fazenda}
                  onChange={handleChange}
                  placeholder="Nome da propriedade"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.fazenda ? 'border-destructive' : 'border-input'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
                />
                {errors.fazenda && <span className="text-destructive text-xs mt-1">{errors.fazenda}</span>}
              </div>

              {/* Localização */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Localização <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="localizacao"
                  value={formData.localizacao}
                  onChange={handleChange}
                  placeholder="Cidade - Estado"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.localizacao ? 'border-destructive' : 'border-input'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
                />
                {errors.localizacao && <span className="text-destructive text-xs mt-1">{errors.localizacao}</span>}
              </div>

              {/* Tipo de Cultura */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tipo de Cultura <span className="text-destructive">*</span>
                </label>
                <select
                  name="tipoCultura"
                  value={formData.tipoCultura}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.tipoCultura ? 'border-destructive' : 'border-input'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
                >
                  <option value="">Selecione...</option>
                  <option value="Cria">Cria</option>
                  <option value="Recria">Recria</option>
                  <option value="Engorda">Engorda</option>
                  <option value="Reprodução">Reprodução</option>
                  <option value="Leite">Leite</option>
                  <option value="Misto">Misto</option>
                </select>
                {errors.tipoCultura && <span className="text-destructive text-xs mt-1">{errors.tipoCultura}</span>}
              </div>

              {/* Número de Cabeças */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Número de Cabeças <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  name="numeroCabecas"
                  value={formData.numeroCabecas}
                  onChange={handleChange}
                  placeholder="Ex: 100"
                  min={1}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.numeroCabecas ? 'border-destructive' : 'border-input'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
                />
                {errors.numeroCabecas && <span className="text-destructive text-xs mt-1">{errors.numeroCabecas}</span>}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg hover:bg-primary-medium transition-colors duration-200 flex items-center justify-center gap-3"
            >
              <Send size={20} />
              Cadastrar Meu Lote
            </button>

            <p className="text-center text-muted-foreground text-sm">
              Ao enviar, você será direcionado ao WhatsApp para continuarmos o processo de curadoria.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default SellerForm;
