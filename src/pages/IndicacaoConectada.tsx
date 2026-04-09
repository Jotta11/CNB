import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Handshake, TrendingUp, Shield, Users, Phone, ArrowRight, CheckCircle2, ClipboardList, HeartHandshake, Star, Zap, Target, Send, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import BackToTop from '@/components/BackToTop';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import logoSymbol from '@/assets/logo-symbol.svg';

const IndicacaoConectada = () => {
  const [formData, setFormData] = useState({ nome: '', telefone: '', email: '', cidade: '', estado: '', mensagem: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getUTMs = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source:   params.get('utm_source')   || null,
      utm_medium:   params.get('utm_medium')   || null,
      utm_campaign: params.get('utm_campaign') || null,
      utm_content:  params.get('utm_content')  || null,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const db = supabase as any;
      const { error } = await db.from('parceiros').insert([{
        nome_completo: formData.nome,
        telefone: formData.telefone,
        email: formData.email,
        cidade: formData.cidade,
        uf: formData.estado,
        notas: formData.mensagem || null,
        cpf: null,
        status_funil: 'prospeccao',
        origem: 'landing_page',
        ...getUTMs(),
      }]);
      if (error) throw error;
      setSubmitted(true);
      toast.success('Cadastro realizado com sucesso! Entraremos em contato em breve.');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao enviar cadastro. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero — full visual impact */}
      <section className="min-h-[90vh] flex items-center relative overflow-hidden bg-secondary">
        {/* Decorative bg elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary/80 to-primary" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-light/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />
        <div className="absolute bottom-10 right-10 opacity-[0.03]">
          <img src={logoSymbol} alt="" className="w-[400px] h-[400px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                <span className="inline-flex items-center gap-2 bg-accent/20 text-accent border border-accent/30 text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-widest uppercase backdrop-blur-sm">
                  <Star className="w-3.5 h-3.5" />
                  Programa de Parceria
                </span>
                <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white tracking-wider mb-6 leading-[0.9]">
                  INDICAÇÃO
                  <br />
                  <span className="text-accent">CONECTADA</span>
                </h1>
                <p className="text-white/70 text-lg md:text-xl max-w-lg leading-relaxed mb-10">
                  Transforme seus contatos na pecuária em renda real. Indique, a CNB opera — você ganha.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base px-8 h-14 shadow-lg shadow-accent/25 border-0">
                    <a href="#quero-ser-parceiro" className="flex items-center gap-3">
                      <Handshake className="w-5 h-5" />
                      QUERO SER PARCEIRO
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 hover:text-white font-bold text-base h-14 bg-transparent">
                    <a href="#como-funciona" className="flex items-center gap-2">
                      Como funciona
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Stats grid */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              className="grid grid-cols-2 gap-4">
              {[
                { value: 'Até 8%', label: 'Comissão progressiva', icon: TrendingUp },
                { value: 'Imediato', label: 'Pagamento por venda', icon: Zap },
                { value: 'Total', label: 'Suporte ao parceiro', icon: Shield },
                { value: 'Zero', label: 'Custo de participação', icon: Target },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  className="bg-white/[0.06] backdrop-blur-md rounded-2xl p-6 border border-white/[0.08] hover:bg-white/[0.1] transition-colors group"
                >
                  <item.icon className="w-5 h-5 text-accent mb-3 group-hover:scale-110 transition-transform" />
                  <p className="font-display text-3xl text-white tracking-wide">{item.value}</p>
                  <p className="text-white/50 text-xs mt-1 font-medium">{item.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* O que é a CNB — editorial layout */}
      <section className="py-12 md:py-24 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-16 items-center max-w-6xl mx-auto">
            <motion.div className="lg:col-span-3"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="text-accent font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Sobre a CNB</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-foreground tracking-wide mb-8 leading-[0.95]">
                OPERAÇÃO<br /><span className="text-primary">PROFISSIONAL</span><br />DO INÍCIO AO FIM
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                A CNB é uma empresa de comercialização de gado com estrutura completa: site e redes sociais para divulgação de lotes, time comercial ativo e de campo, atuação em propriedade com apartação, filmagem, processos documentados, logística integrada e uso de CRM.
              </p>
            </motion.div>
            <motion.div className="lg:col-span-2"
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="bg-primary rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light/20 rounded-full blur-[60px]" />
                <p className="font-display text-2xl md:text-3xl text-primary-foreground tracking-wide leading-tight relative z-10">
                  TODA NEGOCIAÇÃO É CONDUZIDA DE FORMA PROFISSIONAL, SEGURA E ORGANIZADA.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mercado e Solução — contrasting cards */}
      <section className="py-12 md:py-24 bg-secondary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-16">
            <span className="text-accent font-bold text-xs tracking-[0.3em] uppercase mb-4 block">O Problema & A Solução</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-white tracking-wide">
              POR QUE A <span className="text-accent">CNB</span>?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="bg-white/[0.04] backdrop-blur-sm rounded-3xl p-10 border border-white/[0.06]">
              <div className="w-12 h-12 rounded-2xl bg-destructive/20 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-display text-2xl text-white mb-6 tracking-wide">DESAFIOS DO MERCADO</h3>
              <ul className="space-y-5">
                {['Falta de processos estruturados', 'Dificuldade de conectar oferta e demanda', 'Insegurança no recebimento'].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-white/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive/60 mt-2.5 shrink-0" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-primary/30 backdrop-blur-sm rounded-3xl p-10 border border-primary-light/20">
              <div className="w-12 h-12 rounded-2xl bg-primary-light/20 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-primary-light" />
              </div>
              <h3 className="font-display text-2xl text-white mb-6 tracking-wide">A CNB RESOLVE COM</h3>
              <ul className="space-y-5">
                {['Operação profissional e padronizada', 'Processos documentados de ponta a ponta', 'Tecnologia e equipe ativa em campo', 'Logística totalmente integrada'].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-primary-light shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* O Programa — 3 pillars */}
      <section id="como-funciona" className="py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="text-center mb-16">
              <span className="text-accent font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Como Funciona</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-foreground tracking-wide">
                O PROGRAMA <span className="text-primary">INDICAÇÃO CONECTADA</span>
              </h2>
              <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
                Une forças para gerar renda ao parceiro e ampliar a rede da CNB.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: ClipboardList, title: 'VOCÊ INDICA', desc: 'Indique demandas ou ofertas imediatas e futuras (programadas a partir de 15 dias).', num: '01' },
                { icon: Shield, title: 'CNB OPERA', desc: 'A CNB cuida de toda a operação: apartação, filmagem, documentação, logística e fechamento.', num: '02' },
                { icon: HeartHandshake, title: 'VOCÊ GANHA', desc: 'Receba comissão progressiva sobre cada venda convertida. Maior volume, maior ganho.', num: '03' },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="group relative bg-card rounded-3xl p-8 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                >
                  <span className="absolute top-6 right-6 font-display text-6xl text-primary/[0.06] group-hover:text-primary/[0.12] transition-colors">{item.num}</span>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground mb-3 tracking-wide">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Suporte ao Parceiro — horizontal scroll feel */}
      <section className="py-12 md:py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="text-accent font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Suporte Completo</span>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground tracking-wide">
                  O QUE VOCÊ <span className="text-primary">RECEBE</span>
                </h2>
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Users, text: 'Demandas por categoria e região', accent: false },
                { icon: TrendingUp, text: 'Lotes disponíveis e em divulgação', accent: false },
                { icon: ClipboardList, text: 'Atualizações em tempo real da operação', accent: false },
                { icon: Phone, text: 'Vídeo institucional e materiais digitais', accent: false },
                { icon: Shield, text: 'Site e Instagram oficiais como vitrine', accent: false },
                { icon: Handshake, text: 'Segurança jurídica e financeira total', accent: true },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className={`flex items-center gap-4 rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-0.5 ${
                    item.accent
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10'
                      : 'bg-card border-border hover:border-primary/20'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    item.accent ? 'bg-white/20' : 'bg-primary/10'
                  }`}>
                    <item.icon className={`w-5 h-5 ${item.accent ? 'text-white' : 'text-primary'}`} />
                  </div>
                  <span className={`font-medium text-sm ${item.accent ? 'text-white' : 'text-foreground'}`}>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Como Indicar */}
      <section className="py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="text-center mb-16">
              <span className="text-accent font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Passo a Passo</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-foreground tracking-wide">
                COMO <span className="text-primary">INDICAR</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="bg-card rounded-3xl p-10 border border-border relative overflow-hidden">
                <div className="absolute top-4 right-6 font-display text-7xl text-primary/[0.05]">01</div>
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-display text-2xl text-foreground mb-5 tracking-wide">DADOS BÁSICOS</h3>
                <ul className="space-y-4">
                  {['Nome e telefone do pecuarista', 'Perfil produtivo', 'Localização da propriedade'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}
                className="bg-card rounded-3xl p-10 border border-border relative overflow-hidden">
                <div className="absolute top-4 right-6 font-display text-7xl text-primary/[0.05]">02</div>
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <ClipboardList className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-display text-2xl text-foreground mb-5 tracking-wide">OPORTUNIDADE</h3>
                <ul className="space-y-4">
                  {['Demanda ou oferta imediata ou futura', 'Características do lote ou operação', 'Volume e categoria dos animais'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-center text-muted-foreground mt-8 text-sm bg-cream rounded-full py-3 px-6 inline-block mx-auto w-full md:w-auto md:mx-auto flex justify-center">
              💡 Apresentar a CNB ao indicado é recomendado, mas não obrigatório.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Formulário — Quero ser Parceiro */}
      <section id="quero-ser-parceiro" className="py-12 md:py-24 bg-secondary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 opacity-[0.03]">
          <img src={logoSymbol} alt="" className="w-[300px] h-[300px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-12">
            <span className="text-accent font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Candidate-se agora</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-white tracking-wide leading-[0.95]">
              QUERO SER
              <br /><span className="text-accent">PARCEIRO CNB</span>
            </h2>
            <p className="text-white/60 text-lg mt-4 max-w-xl mx-auto">
              Preencha o formulário abaixo e nossa equipe entrará em contato para finalizar seu cadastro e gerar seu código de parceiro.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-2xl mx-auto"
          >
            {submitted ? (
              <div className="bg-white/[0.06] backdrop-blur-sm rounded-3xl p-12 border border-white/[0.08] text-center">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-display text-3xl text-white tracking-wide mb-3">CANDIDATURA ENVIADA!</h3>
                <p className="text-white/60 leading-relaxed">
                  Recebemos seus dados. Em breve nossa equipe entrará em contato para confirmar seu cadastro e gerar seu código de parceiro exclusivo.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/[0.06] backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/[0.08] space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-white/80 text-sm font-medium">Nome completo *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Seu nome"
                      required
                      className="bg-white/[0.08] border-white/[0.12] text-white placeholder:text-white/30 focus:border-accent/50 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-white/80 text-sm font-medium">WhatsApp / Telefone *</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      placeholder="(00) 00000-0000"
                      required
                      className="bg-white/[0.08] border-white/[0.12] text-white placeholder:text-white/30 focus:border-accent/50 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80 text-sm font-medium">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    required
                    className="bg-white/[0.08] border-white/[0.12] text-white placeholder:text-white/30 focus:border-accent/50 h-11"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="cidade" className="text-white/80 text-sm font-medium">Cidade *</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                      placeholder="Sua cidade"
                      required
                      className="bg-white/[0.08] border-white/[0.12] text-white placeholder:text-white/30 focus:border-accent/50 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado" className="text-white/80 text-sm font-medium">Estado *</Label>
                    <Input
                      id="estado"
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      placeholder="UF"
                      maxLength={2}
                      required
                      className="bg-white/[0.08] border-white/[0.12] text-white placeholder:text-white/30 focus:border-accent/50 h-11 uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mensagem" className="text-white/80 text-sm font-medium">Sobre sua atuação na pecuária (opcional)</Label>
                  <Textarea
                    id="mensagem"
                    value={formData.mensagem}
                    onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                    placeholder="Conte um pouco sobre sua experiência e rede de contatos..."
                    rows={4}
                    className="bg-white/[0.08] border-white/[0.12] text-white placeholder:text-white/30 focus:border-accent/50 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base h-14 shadow-lg shadow-accent/20 border-0"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Send className="w-5 h-5 mr-2" />
                  )}
                  {submitting ? 'ENVIANDO...' : 'ENVIAR CANDIDATURA'}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
    </div>
  );
};

export default IndicacaoConectada;
