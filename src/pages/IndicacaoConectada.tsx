import { motion } from 'framer-motion';
import { Handshake, TrendingUp, Shield, Users, Phone, ArrowRight, CheckCircle2, DollarSign, ClipboardList, HeartHandshake, Star, Zap, Target, Award } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import BackToTop from '@/components/BackToTop';
import { Button } from '@/components/ui/button';
import logoSymbol from '@/assets/logo-symbol.svg';

const IndicacaoConectada = () => {
  const whatsappLink = "https://wa.me/5594991230099?text=Olá! Tenho interesse no programa Indicação Conectada da CNB.";

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

        <div className="container mx-auto px-4 relative z-10 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                <span className="inline-flex items-center gap-2 bg-accent/20 text-accent border border-accent/30 text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-widest uppercase backdrop-blur-sm">
                  <Star className="w-3.5 h-3.5" />
                  Programa de Parceria
                </span>
                <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-wider mb-6 leading-[0.9]">
                  INDICAÇÃO
                  <br />
                  <span className="text-accent">CONECTADA</span>
                </h1>
                <p className="text-white/70 text-lg md:text-xl max-w-lg leading-relaxed mb-10">
                  Transforme seus contatos na pecuária em renda real. Indique, a CNB opera — você ganha.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base px-8 h-14 shadow-lg shadow-accent/25 border-0">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
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
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-16 items-center max-w-6xl mx-auto">
            <motion.div className="lg:col-span-3"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="text-accent font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Sobre a CNB</span>
              <h2 className="font-display text-4xl md:text-6xl text-foreground tracking-wide mb-8 leading-[0.95]">
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
      <section className="py-24 bg-secondary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-16">
            <span className="text-accent font-bold text-xs tracking-[0.3em] uppercase mb-4 block">O Problema & A Solução</span>
            <h2 className="font-display text-4xl md:text-6xl text-white tracking-wide">
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
      <section id="como-funciona" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="text-center mb-16">
              <span className="text-accent font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Como Funciona</span>
              <h2 className="font-display text-4xl md:text-6xl text-foreground tracking-wide">
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
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="text-accent font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Suporte Completo</span>
                <h2 className="font-display text-4xl md:text-5xl text-foreground tracking-wide">
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
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="text-center mb-16">
              <span className="text-accent font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Passo a Passo</span>
              <h2 className="font-display text-4xl md:text-6xl text-foreground tracking-wide">
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

      {/* Remuneração — dark section with accent highlights */}
      <section className="py-24 bg-secondary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-16">
            <span className="text-accent font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Ganhos Reais</span>
            <h2 className="font-display text-4xl md:text-6xl text-white tracking-wide">
              REMUNERAÇÃO DO <span className="text-accent">PARCEIRO</span>
            </h2>
            <p className="text-white/50 text-lg mt-4">Sempre calculada sobre a comissão da CNB</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="bg-white/[0.04] backdrop-blur-sm rounded-3xl p-10 border border-white/[0.06]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display text-2xl text-white tracking-wide">COMISSÃO CNB</h3>
              </div>
              <div className="space-y-5">
                {[
                  { pct: '5%', desc: 'Demandas ou ofertas imediatas' },
                  { pct: '4%', desc: 'Demandas ou ofertas futuras' },
                  { pct: 'Flex', desc: 'Grandes volumes negociáveis' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="font-display text-2xl text-accent w-14">{item.pct}</span>
                    <span className="text-white/60 text-sm">{item.desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-white/[0.04] backdrop-blur-sm rounded-3xl p-10 border border-white/[0.06]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display text-2xl text-white tracking-wide">PROGRESSÃO</h3>
              </div>
              <div className="space-y-3">
                {[
                  { range: 'Até R$ 700 mil', pct: '4%' },
                  { range: 'R$ 700 mil +', pct: '5%' },
                  { range: 'R$ 1,5 milhão +', pct: '6%' },
                  { range: 'R$ 2,0 milhões +', pct: '7%' },
                  { range: 'R$ 2,5 milhões +', pct: '8%', highlight: true },
                ].map((item, i) => (
                  <div key={i} className={`flex justify-between items-center py-3 px-4 rounded-xl transition-colors ${
                    item.highlight ? 'bg-accent/10 border border-accent/20' : 'border-b border-white/[0.06]'
                  }`}>
                    <span className="text-white/70 text-sm">{item.range}</span>
                    <span className={`font-display text-xl ${item.highlight ? 'text-accent' : 'text-white'}`}>{item.pct}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Apuração e Pagamento */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="text-center mb-16">
              <span className="text-accent font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Transparência Total</span>
              <h2 className="font-display text-4xl md:text-6xl text-foreground tracking-wide">
                APURAÇÃO E <span className="text-primary">PAGAMENTO</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: DollarSign, title: 'POR INDICAÇÃO', desc: 'Pagamento imediato por indicação convertida em venda, conforme a faixa de comissão em que o valor se enquadra.', color: 'accent' },
                { icon: TrendingUp, title: 'POR VOLUME MENSAL', desc: 'Todas as conversões do período são somadas para definição da faixa. Maior volume, maior percentual de ganho.', color: 'primary' },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="bg-card rounded-3xl p-10 border border-border hover:shadow-lg transition-shadow"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                    item.color === 'accent' ? 'bg-accent/10' : 'bg-primary/10'
                  }`}>
                    <item.icon className={`w-7 h-7 ${item.color === 'accent' ? 'text-accent' : 'text-primary'}`} />
                  </div>
                  <h3 className="font-display text-2xl text-foreground mb-3 tracking-wide">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Exemplo de Resultado */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="text-center mb-16">
              <span className="text-accent font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Simulação Real</span>
              <h2 className="font-display text-4xl md:text-6xl text-foreground tracking-wide">
                EXEMPLO DE <span className="text-primary">RESULTADO</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'DEMANDA IMEDIATA', qtd: '250 Garrotes', valor: '× R$ 3.500', total: '= R$ 875.000', ganho: 'R$ 2.187,50', badge: 'bg-primary' },
                { label: 'OFERTA FUTURA', qtd: '150 Bezerros', valor: '× R$ 2.800', total: '= R$ 420.000', ganho: 'R$ 840,00', badge: 'bg-accent' },
                { label: 'NÃO CONVERTIDA', qtd: '100 Bezerras', valor: '× R$ 2.500', total: null, ganho: 'R$ 840,00', badge: 'bg-muted-foreground' },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-card rounded-3xl p-8 border border-border text-center relative overflow-hidden"
                >
                  <span className={`inline-block ${item.badge} text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest mb-4`}>
                    {item.label}
                  </span>
                  <p className="font-display text-3xl text-foreground">{item.qtd}</p>
                  <p className="text-muted-foreground text-sm mt-2">{item.valor}</p>
                  {item.total && <p className="text-foreground font-bold text-sm mt-1">{item.total}</p>}
                  <div className="mt-6 pt-6 border-t border-border">
                    <span className="text-muted-foreground text-xs tracking-wider uppercase">Seu ganho</span>
                    <p className="font-display text-2xl text-primary mt-1">{item.ganho}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-secondary rounded-3xl p-10 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-[80px]" />
              <span className="text-white/40 text-xs tracking-[0.3em] font-bold uppercase">Total do Período</span>
              <p className="font-display text-5xl md:text-7xl text-white mt-3 relative z-10">
                R$ <span className="text-accent">3.027,50</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary/60 to-primary/80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-10 right-10 opacity-[0.03]">
          <img src={logoSymbol} alt="" className="w-[300px] h-[300px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <Award className="w-12 h-12 text-accent mx-auto mb-8" />
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-white mb-6 tracking-wide leading-[0.95]">
              CONECTE OPORTUNIDADES
              <br />
              <span className="text-accent">E CRESÇA JUNTO CONOSCO</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
              Se você possui bons contatos na pecuária, a Indicação Conectada é a oportunidade de transformar indicações em vendas estruturadas e gerar renda de forma organizada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-12 h-16 shadow-xl shadow-accent/20 border-0">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                  <Handshake className="w-6 h-6" />
                  QUERO SER PARCEIRO
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
            </div>
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
