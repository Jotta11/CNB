import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Clock, Send, ShoppingCart, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cidadesPorEstado, estados } from '@/data/cidadesPorEstado';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import bgForm from '@/assets/bg-form.png';

const DEFAULT_WHATSAPP = '5563992628916';

interface FormData {
  tipo: 'comprar' | 'vender';
  nome: string;
  telefone: string;
  fazenda: string;
  estado: string;
  cidade: string;
  tipoCultura: string;
  numeroCabecas: string;
  mensagem: string;
}

const SellerForm = () => {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState<FormData>({
    tipo: 'vender',
    nome: '',
    telefone: '',
    fazenda: '',
    estado: '',
    cidade: '',
    tipoCultura: '',
    numeroCabecas: '',
    mensagem: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'telefone') {
      setFormData(prev => ({
        ...prev,
        [name]: formatPhone(value)
      }));
    } else if (name === 'estado') {
      // Quando muda o estado, limpa a cidade selecionada
      setFormData(prev => ({
        ...prev,
        estado: value,
        cidade: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.telefone.trim() || formData.telefone.replace(/\D/g, '').length < 10) {
      newErrors.telefone = 'Telefone válido é obrigatório';
    }
    
    if (formData.tipo === 'vender') {
      if (!formData.fazenda.trim()) newErrors.fazenda = 'Nome da fazenda é obrigatório';
      if (!formData.estado) newErrors.estado = 'Selecione o estado';
      if (!formData.cidade) newErrors.cidade = 'Selecione a cidade';
      if (!formData.tipoCultura) newErrors.tipoCultura = 'Selecione o tipo de cultura';
      if (!formData.numeroCabecas || parseInt(formData.numeroCabecas) < 1) {
        newErrors.numeroCabecas = 'Número de cabeças é obrigatório';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      // Save lead to database
      const localizacaoCompleta = formData.tipo === 'vender' ? `${formData.cidade} - ${formData.estado}` : null;
      const { error } = await supabase.from('leads').insert({
        tipo: formData.tipo,
        nome: formData.nome.trim(),
        telefone: formData.telefone.trim(),
        fazenda: formData.tipo === 'vender' ? formData.fazenda.trim() : null,
        localizacao: localizacaoCompleta,
        tipo_cultura: formData.tipo === 'vender' ? formData.tipoCultura : null,
        numero_cabecas: formData.tipo === 'vender' && formData.numeroCabecas ? parseInt(formData.numeroCabecas) : null,
        mensagem: formData.mensagem.trim() || null
      });

      if (error) throw error;

      // Build WhatsApp message
      const tipoLabel = formData.tipo === 'comprar' ? 'COMPRAR' : 'VENDER';
      let message = `*Novo Lead - ${tipoLabel} - CNB*\n\n`;
      message += `*Nome:* ${formData.nome}\n`;
      message += `*Telefone:* ${formData.telefone}\n`;
      
      if (formData.tipo === 'vender') {
        message += `*Fazenda:* ${formData.fazenda}\n`;
        message += `*Local:* ${formData.cidade} - ${formData.estado}\n`;
        message += `*Tipo de Cultura:* ${formData.tipoCultura}\n`;
        message += `*Número de Cabeças:* ${formData.numeroCabecas}\n`;
      }
      
      if (formData.mensagem) {
        message += `\n*Mensagem:* ${formData.mensagem}\n`;
      }

      const whatsappNumber = settings.whatsapp_number || DEFAULT_WHATSAPP;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      toast.success('Mensagem enviada com sucesso!');

      // Clear form
      setFormData({
        tipo: 'vender',
        nome: '',
        telefone: '',
        fazenda: '',
        estado: '',
        cidade: '',
        tipoCultura: '',
        numeroCabecas: '',
        mensagem: ''
      });
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast.error('Erro ao enviar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cidades disponíveis baseadas no estado selecionado
  const cidadesDisponiveis = formData.estado ? cidadesPorEstado[formData.estado] || [] : [];

  return (
    <section
      id="vender"
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgForm})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header - Outside white box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-white mb-3">
            O Próximo Passo para Modernizar Sua Pecuária
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Cadastre seu lote e envie as informações básicas. A CNB estrutura,
            valida e conduz a negociação com mais eficiência, menos deslocamento
            e maior alcance.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto bg-card rounded-2xl shadow-xl p-5 sm:p-8 md:p-12"
        >
          {/* Header inside form */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="text-primary" size={32} />
            </div>
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full">
              <Clock size={18} />
              <span className="font-medium text-sm">Menos de 2 minutos para começar</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">
                O que você deseja? <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tipo: 'comprar' }))}
                  className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.tipo === 'comprar'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-input bg-background hover:border-primary/50'
                  }`}
                >
                  <ShoppingCart size={24} />
                  <span className="font-semibold">Quero Comprar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tipo: 'vender' }))}
                  className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.tipo === 'vender'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-input bg-background hover:border-primary/50'
                  }`}
                >
                  <Tag size={24} />
                  <span className="font-semibold">Quero Vender</span>
                </button>
              </div>
            </div>

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

              {/* Campos condicionais para Vender */}
              {formData.tipo === 'vender' && (
                <>
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

                  {/* Estado */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Estado <span className="text-destructive">*</span>
                    </label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.estado ? 'border-destructive' : 'border-input'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
                    >
                      <option value="">Selecione o estado...</option>
                      {estados.map((estado) => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                    {errors.estado && <span className="text-destructive text-xs mt-1">{errors.estado}</span>}
                  </div>

                  {/* Cidade */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Cidade <span className="text-destructive">*</span>
                    </label>
                    <select
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      disabled={!formData.estado}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.cidade ? 'border-destructive' : 'border-input'} bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <option value="">{formData.estado ? 'Selecione a cidade...' : 'Selecione o estado primeiro'}</option>
                      {cidadesDisponiveis.map((cidade) => (
                        <option key={cidade} value={cidade}>{cidade}</option>
                      ))}
                    </select>
                    {errors.cidade && <span className="text-destructive text-xs mt-1">{errors.cidade}</span>}
                  </div>

                  {/* Categoria */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Categoria <span className="text-destructive">*</span>
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
                </>
              )}
            </div>

            {/* Mensagem */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Mensagem {formData.tipo === 'comprar' && <span className="text-muted-foreground">(descreva o que procura)</span>}
              </label>
              <textarea
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                placeholder={formData.tipo === 'comprar' ? 'Ex: Procuro 50 novilhas nelore, entre 12-18 meses...' : 'Informações adicionais sobre seu lote...'}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg hover:bg-primary-medium transition-colors duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
              {isSubmitting ? 'Enviando...' : formData.tipo === 'comprar' ? 'Enviar Interesse' : 'Cadastrar Meu Lote'}
            </button>

            <p className="text-center text-muted-foreground text-sm">
              Ao enviar, você será direcionado ao WhatsApp para continuarmos o processo.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default SellerForm;
