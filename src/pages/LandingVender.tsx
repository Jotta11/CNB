import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Loader2, CheckCircle2, ArrowRight, Shield, Users, Zap,
  ClipboardList, Handshake, Star, Send, MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useLeadSubmit } from '@/hooks/useLeadSubmit';
import { trackFormInicio } from '@/utils/analytics';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import logoHorizontal from '@/assets/logo-horizontal2.png';
import logoSymbol from '@/assets/logo-symbol.svg';

const schema = z.object({
  nome: z.string().min(3, 'Informe seu nome completo'),
  telefone: z.string().min(10, 'Informe um telefone válido'),
  localizacao: z.string().min(2, 'Informe seu estado/cidade'),
  categoria_gado: z.string().min(1, 'Selecione a categoria'),
  numero_cabecas: z.coerce.number().min(1, 'Informe o número de cabeças'),
  mensagem: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const categorias = [
  'Bezerro', 'Bezerra', 'Novilha', 'Garrote',
  'Boi Magro', 'Boi Gordo', 'Vaca Magra', 'Vaca Prenha', 'Vaca Parida', 'Vaca Gorda',
];

const LandingVender = () => {
  const { submitLead, isSubmitting, submitted } = useLeadSubmit();
  const formIniciadoRef = useRef(false);
  const { settings } = useSiteSettings();
  const whatsappNumber = settings.whatsapp_number || '5563992628916';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá! Quero vender meu gado e gostaria de mais informações.')}`;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleFormStart = () => {
    if (formIniciadoRef.current) return;
    formIniciadoRef.current = true;
    trackFormInicio('vender');
  };

  const onSubmit = async (data: FormData) => {
    try {
      await submitLead({ tipo: 'vender', ...data });
    } catch {
      toast.error('Erro ao enviar. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Minimal header */}
      <header className="absolute top-0 left-0 right-0 z-20 py-5 px-6 flex justify-center">
        <img src={logoHorizontal} alt="CNB" className="h-10 object-contain brightness-0 invert" />
      </header>

      {/* ── SEÇÃO 1: Hero ── */}
      <section className="min-h-[85vh] flex items-center relative overflow-hidden bg-secondary">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary/80 to-primary" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />
        <div className="absolute bottom-8 right-8 opacity-[0.04]">
          <img src={logoSymbol} alt="" className="w-[360px] h-[360px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-24 pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-flex items-center gap-2 bg-accent/20 text-accent border border-accent/30 text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-widest uppercase backdrop-blur-sm">
                <Star className="w-3.5 h-3.5" />
                Para Vendedores
              </span>

              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-wider mb-6 leading-[0.9]">
                VENDA SEU GADO
                <br />
                <span className="text-accent">DO JEITO CERTO</span>
              </h1>

              <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10">
                A CNB conecta seu lote a compradores qualificados em todo o Brasil com estrutura profissional, segurança e agilidade.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base px-8 h-14 shadow-lg shadow-accent/25 border-0">
                  <a href="#formulario" className="flex items-center gap-3">
                    Quero vender meu gado
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </Button>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                {[
                  { value: 'Rápido', label: 'Avaliação em 24h' },
                  { value: 'Total', label: 'Suporte da equipe' },
                ].map((item, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                    className="bg-white/[0.06] backdrop-blur-md rounded-2xl p-4 border border-white/[0.08]"
                  >
                    <p className="font-display text-2xl text-white tracking-wide">{item.value}</p>
                    <p className="text-white/50 text-xs mt-1">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 2: Por que vender pela CNB? ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="text-center mb-14">
              <span className="text-accent font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Vantagens</span>
              <h2 className="font-display text-4xl md:text-6xl text-foreground tracking-wide">
                POR QUE VENDER
                <br /><span className="text-primary">PELA CNB?</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Users,
                  title: 'REDE ATIVA DE COMPRADORES',
                  desc: 'Acesso direto a compradores qualificados em todo o Brasil, com demandas reais e capacidade de pagamento comprovada.',
                },
                {
                  icon: Shield,
                  title: 'SEGURANÇA E PROFISSIONALISMO',
                  desc: 'Operação documentada do início ao fim: apartação, filmagem, logística e fechamento com total transparência.',
                },
                {
                  icon: Zap,
                  title: 'AGILIDADE NA VENDA',
                  desc: 'Avaliação do seu lote em até 24h e divulgação imediata para nossa base de compradores ativos.',
                },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="group bg-card rounded-3xl p-8 border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden"
                >
                  <span className="absolute top-5 right-5 font-display text-6xl text-primary/[0.06] group-hover:text-primary/[0.12] transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-3 tracking-wide">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 3: Como funciona? ── */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="text-center mb-14">
              <span className="text-accent font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Processo</span>
              <h2 className="font-display text-4xl md:text-6xl text-white tracking-wide">
                COMO <span className="text-accent">FUNCIONA</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: ClipboardList, num: '01', title: 'VOCÊ PREENCHE', desc: 'Informe os dados do seu lote no formulário abaixo. Leva menos de 2 minutos.' },
                { icon: Handshake, num: '02', title: 'CNB VAI ATÉ VOCÊ', desc: 'Nossa equipe vai até a sua propriedade, realiza a curadoria completa do lote, faz a apartação e a gravação profissional do gado.' },
                { icon: CheckCircle2, num: '03', title: 'VENDA REALIZADA', desc: 'Você vende com segurança, documentação completa e suporte logístico da CNB.' },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="bg-white/[0.05] backdrop-blur-sm rounded-3xl p-8 border border-white/[0.07] relative overflow-hidden"
                >
                  <span className="absolute top-5 right-5 font-display text-6xl text-white/[0.05]">{item.num}</span>
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
                    <item.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-display text-2xl text-white mb-3 tracking-wide">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FORMULÁRIO ── */}
      <section id="formulario" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-12">
            <span className="text-accent font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Comece agora</span>
            <h2 className="font-display text-4xl md:text-6xl text-foreground tracking-wide leading-[0.95]">
              CADASTRE
              <br /><span className="text-primary">SEU LOTE</span>
            </h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-md mx-auto">
              Preencha os dados abaixo e nossa equipe entra em contato com uma proposta.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-xl mx-auto">

            {submitted ? (
              <div className="bg-card rounded-3xl p-12 border border-border text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-3xl text-foreground tracking-wide mb-3">PROPOSTA RECEBIDA!</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Nossa equipe analisará seu lote e entrará em contato em breve. Obrigado por confiar na CNB!
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                onFocusCapture={handleFormStart}
                className="bg-card rounded-3xl p-8 border border-border space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome completo *</Label>
                    <Input id="nome" placeholder="Seu nome" {...register('nome')} />
                    {errors.nome && <p className="text-destructive text-xs">{errors.nome.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">WhatsApp *</Label>
                    <Input id="telefone" placeholder="(00) 00000-0000" {...register('telefone')} />
                    {errors.telefone && <p className="text-destructive text-xs">{errors.telefone.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="localizacao" className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Cidade / Estado *
                  </Label>
                  <Input id="localizacao" placeholder="Ex: Araguaína – TO" {...register('localizacao')} />
                  {errors.localizacao && <p className="text-destructive text-xs">{errors.localizacao.message}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label>Categoria do gado *</Label>
                    <Select onValueChange={(v) => setValue('categoria_gado', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoria_gado && <p className="text-destructive text-xs">{errors.categoria_gado.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numero_cabecas">Nº de cabeças *</Label>
                    <Input id="numero_cabecas" type="number" min={1} placeholder="Ex: 150" {...register('numero_cabecas')} />
                    {errors.numero_cabecas && <p className="text-destructive text-xs">{errors.numero_cabecas.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mensagem">Informações adicionais <span className="text-muted-foreground font-normal">(opcional)</span></Label>
                  <Textarea
                    id="mensagem"
                    placeholder="Raça, peso médio, condição corporal, data disponível..."
                    rows={3}
                    className="resize-none"
                    {...register('mensagem')}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-base h-14"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Send className="w-5 h-5 mr-2" />
                  )}
                  {isSubmitting ? 'Enviando...' : 'QUERO VENDER MEU GADO'}
                </Button>

                <p className="text-center text-muted-foreground text-xs">
                  Seus dados estão seguros. Nossa equipe entrará em contato em breve.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── FALE CONOSCO ── */}
      <section className="py-16 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary/60 to-primary/80" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="font-display text-3xl md:text-5xl text-white tracking-wide mb-3">
              PREFERE FALAR <span className="text-accent">DIRETAMENTE?</span>
            </h2>
            <p className="text-white/60 mb-8 text-base max-w-md mx-auto">
              Nossa equipe está disponível para tirar dúvidas e receber sua oferta pelo WhatsApp.
            </p>
            <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-base px-8 h-14 border-0 shadow-lg">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Falar pelo WhatsApp
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <footer className="py-5 text-center text-xs text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} Conexão Norte Bovino — Todos os direitos reservados
      </footer>

      <FloatingWhatsApp />
    </div>
  );
};

export default LandingVender;
