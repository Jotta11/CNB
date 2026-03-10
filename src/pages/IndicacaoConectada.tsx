import { motion } from 'framer-motion';
import { Handshake, TrendingUp, Shield, Users, Phone, ArrowRight, CheckCircle2, DollarSign, ClipboardList, HeartHandshake } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import BackToTop from '@/components/BackToTop';
import { Button } from '@/components/ui/button';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' }
  })
};

const IndicacaoConectada = () => {
  const whatsappLink = "https://wa.me/5594991230099?text=Olá! Tenho interesse no programa Indicação Conectada da CNB.";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="gradient-hero pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={0}>
            <span className="inline-block bg-white/10 text-primary-light text-sm font-bold px-4 py-2 rounded-full mb-6 tracking-widest uppercase backdrop-blur-sm border border-white/10">
              Programa de Parceria
            </span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeIn} custom={1}
            className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-wider mb-6">
            INDICAÇÃO <span className="text-primary-light">CONECTADA</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeIn} custom={2}
            className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Conecte oportunidades à CNB e cresça junto conosco. Transforme suas indicações em vendas estruturadas e gere renda de forma organizada.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={3}>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-primary-light font-bold text-lg px-10 h-14 shadow-lg">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                <Handshake className="w-5 h-5" />
                QUERO SER PARCEIRO
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* O que é a CNB */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}>
              <h2 className="section-title mb-6">O QUE É A <span className="text-primary-light">CNB</span></h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                A CNB é uma empresa de comercialização de gado com estrutura completa: site e redes sociais para divulgação de lotes, time comercial ativo e de campo, atuação em propriedade com apartação, filmagem, processos documentados, logística integrada e uso de CRM.
              </p>
              <div className="bg-primary text-primary-foreground rounded-2xl p-6 inline-block">
                <p className="font-display text-2xl md:text-3xl tracking-wide">
                  TODA NEGOCIAÇÃO É CONDUZIDA DE FORMA PROFISSIONAL, SEGURA E ORGANIZADA.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mercado e Solução */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}
            className="section-title text-center mb-16">
            MERCADO E <span className="text-primary-light">SOLUÇÃO CNB</span>
          </motion.h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            O mercado ainda opera de forma informal, com pouca organização e riscos nas negociações.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={1}
              className="bg-destructive/5 border border-destructive/20 rounded-2xl p-8">
              <h3 className="font-display text-2xl text-destructive mb-6 tracking-wide">PRINCIPAIS DESAFIOS</h3>
              <ul className="space-y-4">
                {['Falta de processos estruturados', 'Dificuldade de conectar oferta e demanda', 'Insegurança no recebimento'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-destructive mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={2}
              className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
              <h3 className="font-display text-2xl text-primary mb-6 tracking-wide">A CNB RESOLVE COM</h3>
              <ul className="space-y-4">
                {['Operação profissional', 'Processos documentados', 'Tecnologia e equipe em campo', 'Logística integrada'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          <p className="text-center text-primary font-display text-2xl mt-12 tracking-wide">
            MAIS SEGURANÇA, EFICIÊNCIA E ESCALA.
          </p>
        </div>
      </section>

      {/* O Programa */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}
              className="section-title text-center mb-6">
              O PROGRAMA <span className="text-primary-light">INDICAÇÃO CONECTADA</span>
            </motion.h2>
            <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
              A Indicação Conectada une forças para gerar renda ao parceiro e ampliar a rede da CNB.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: ClipboardList, title: 'PAPEL DO PARCEIRO', desc: 'Indicar demandas ou ofertas imediatas e futuras (programadas a partir de 15 dias).' },
                { icon: Shield, title: 'CNB CUIDA DE TUDO', desc: 'A CNB cuida de toda a operação: apartação, filmagem, documentação, logística e fechamento.' },
                { icon: HeartHandshake, title: 'CRESÇA CONOSCO', desc: 'Conecte oportunidades à CNB e cresça junto conosco com segurança e profissionalismo.' },
              ].map((item, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={i + 1}
                  className="bg-card rounded-2xl p-8 border border-border text-center shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl text-primary mb-3 tracking-wide">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Suporte ao Parceiro */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}
              className="section-title mb-12">
              SUPORTE AO <span className="text-primary-light">PARCEIRO</span>
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Users, text: 'Demandas por categoria e região' },
                { icon: TrendingUp, text: 'Lotes disponíveis e em divulgação' },
                { icon: ClipboardList, text: 'Atualizações da operação' },
                { icon: Phone, text: 'Vídeo institucional e materiais digitais' },
                { icon: Shield, text: 'Site e Instagram oficiais' },
                { icon: Handshake, text: 'Segurança jurídica e financeira' },
              ].map((item, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={i}
                  className="flex items-center gap-4 bg-cream rounded-xl p-5 border border-border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium text-sm text-left">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Como Indicar */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}
              className="section-title text-center mb-12">
              COMO REALIZAR UMA <span className="text-primary-light">INDICAÇÃO</span>
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={1}
                className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                <h3 className="font-display text-xl text-primary mb-4 tracking-wide">DADOS BÁSICOS</h3>
                <ul className="space-y-3">
                  {['Nome e telefone do pecuarista', 'Perfil produtivo', 'Localização'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={2}
                className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                <h3 className="font-display text-xl text-primary mb-4 tracking-wide">INFORMAÇÕES DA OPORTUNIDADE</h3>
                <ul className="space-y-3">
                  {['Demanda ou oferta imediata ou futura', 'Características do lote ou operação'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
            <p className="text-center text-muted-foreground mt-8 italic">
              Apresentar a CNB ao indicado é recomendado, mas não obrigatório.
            </p>
          </div>
        </div>
      </section>

      {/* Remuneração */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}
            className="font-display text-4xl md:text-5xl text-white text-center mb-4 tracking-wide">
            REMUNERAÇÃO DO <span className="text-primary-light">PARCEIRO</span>
          </motion.h2>
          <p className="text-white/80 text-center mb-12 text-lg">Sempre calculada sobre a comissão da CNB.</p>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={1}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="font-display text-2xl text-primary-light mb-6 tracking-wide flex items-center gap-3">
                <DollarSign className="w-6 h-6" /> COMISSÃO CNB
              </h3>
              <ul className="space-y-4 text-white/90">
                <li className="flex items-start gap-3"><span className="text-primary-light font-bold">5%</span> — demandas ou ofertas imediatas</li>
                <li className="flex items-start gap-3"><span className="text-primary-light font-bold">4%</span> — demandas ou ofertas futuras</li>
                <li className="flex items-start gap-3"><span className="text-primary-light font-bold">Flexível</span> — para grandes volumes</li>
              </ul>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={2}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="font-display text-2xl text-primary-light mb-6 tracking-wide flex items-center gap-3">
                <TrendingUp className="w-6 h-6" /> PROGRESSÃO DO PARCEIRO
              </h3>
              <ul className="space-y-3 text-white/90">
                <li className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span>Até R$ 700 mil</span><span className="font-bold text-primary-light text-lg">4%</span>
                </li>
                <li className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span>A partir de R$ 700 mil</span><span className="font-bold text-primary-light text-lg">5%</span>
                </li>
                <li className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span>A partir de R$ 1,5 milhão</span><span className="font-bold text-primary-light text-lg">6%</span>
                </li>
                <li className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span>A partir de R$ 2,0 milhões</span><span className="font-bold text-primary-light text-lg">7%</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>A partir de R$ 2,5 milhões</span><span className="font-bold text-primary-light text-lg">8%</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Apuração e Pagamento */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}
              className="section-title mb-12">
              APURAÇÃO E <span className="text-primary-light">PAGAMENTO</span>
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={1}
                className="bg-card rounded-2xl p-8 border border-border shadow-sm text-left">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl text-primary mb-3 tracking-wide">POR INDICAÇÃO</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Por indicação convertida em venda, com pagamento imediato conforme a faixa de comissão em que o valor da indicação se enquadra.
                </p>
              </motion.div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={2}
                className="bg-card rounded-2xl p-8 border border-border shadow-sm text-left">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl text-primary mb-3 tracking-wide">POR VOLUME MENSAL</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Todas as conversões do período são somadas para definição da faixa de remuneração. Maior volume gera maior percentual.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Exemplo de Resultado */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}
              className="section-title text-center mb-12">
              EXEMPLO DE <span className="text-primary-light">RESULTADO</span>
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'DEMANDA IMEDIATA', qtd: '250 Garrotes', valor: 'R$ 3.500', total: 'R$ 875.000', ganho: 'R$ 2.187,50' },
                { label: 'OFERTA FUTURA', qtd: '150 Bezerros', valor: 'R$ 2.800', total: 'R$ 420.000', ganho: 'R$ 840,00' },
                { label: 'NÃO CONVERTIDA', qtd: '100 Bezerras', valor: 'R$ 2.500', total: '—', ganho: 'R$ 840,00' },
              ].map((item, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={i + 1}
                  className="bg-cream rounded-2xl p-6 border border-border text-center">
                  <span className="text-xs font-bold text-muted-foreground tracking-widest">{item.label}</span>
                  <p className="font-display text-2xl text-primary mt-2">{item.qtd}</p>
                  <p className="text-muted-foreground text-sm mt-1">× {item.valor}</p>
                  {item.total !== '—' && <p className="text-foreground font-bold mt-1">= {item.total}</p>}
                  <div className="mt-4 pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">Resultado do parceiro</span>
                    <p className="font-display text-xl text-primary">{item.ganho}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={4}
              className="bg-primary rounded-2xl p-8 text-center">
              <span className="text-primary-foreground/80 text-sm tracking-widest font-bold">TOTAL DO PERÍODO</span>
              <p className="font-display text-5xl md:text-6xl text-primary-foreground mt-2">R$ 3.027,50</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}>
            <h2 className="font-display text-4xl md:text-6xl text-white mb-6 tracking-wide">
              CONECTE OPORTUNIDADES À CNB<br />
              <span className="text-primary-light">E CRESÇA JUNTO CONOSCO</span>
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
              Se você possui bons contatos na pecuária, a Indicação Conectada é a oportunidade de transformar indicações em vendas estruturadas e gerar renda de forma organizada.
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-primary-light font-bold text-lg px-12 h-16 shadow-xl">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                <Handshake className="w-6 h-6" />
                QUERO SER PARCEIRO
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
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
