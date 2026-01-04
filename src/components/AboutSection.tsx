import { motion } from 'framer-motion';
import { Trophy, BarChart3, CheckCircle, Shield, Wallet } from 'lucide-react';

const differentials = [
  {
    icon: CheckCircle,
    title: 'Curadoria Especializada dos Lotes',
    description: 'Cada lote passa por validação criteriosa de informações, garantindo qualidade e transparência para compradores e vendedores.',
  },
  {
    icon: Shield,
    title: 'Segurança Garantida',
    description: 'Processo transparente com documentação completa e condução profissional do início ao fim da negociação.',
  },
  {
    icon: Wallet,
    title: 'Economia de Recursos',
    description: 'Menos deslocamento, menos tempo perdido e mais eficiência. Conectamos você diretamente com oportunidades reais.',
  },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Por Que Escolher o CNB?</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Conectamos pessoas, simplificamos processos e garantimos resultados
          </p>
        </motion.div>

        {/* Two columns */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="text-primary" size={24} />
              </div>
              <h3 className="font-display text-2xl text-primary">Quem Somos?</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              O Conexão Norte Bovino é uma plataforma do MATOPIBA criada para aproximar 
              compradores e vendedores de gado com mais confiança, agilidade e critério.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Unimos curadoria de lotes, padronização de informações e atendimento direto 
              para transformar negociação em fechamento — sem ruído e sem perda de tempo.
            </p>
            <p className="text-foreground font-medium">
              Nossa missão: Facilitar negociações transparentes e eficientes, reduzindo 
              custos e maximizando oportunidades para todos os envolvidos no mercado 
              pecuário da região MATOPIBA.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="text-primary" size={24} />
              </div>
              <h3 className="font-display text-2xl text-primary">O Que Fazemos?</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Selecionamos e organizamos lotes com informações claras, para que o comprador 
              decida com mais segurança e o vendedor reduza custo e esforço na comercialização.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Aqui, você encontra oportunidades reais, com apresentação profissional do gado 
              e um processo simples para avançar na negociação.
            </p>
            <p className="text-foreground font-medium">
              Nosso diferencial: Curadoria especializada que valida cada lote, garantindo que 
              apenas oportunidades reais e bem documentadas cheguem até você. Economize tempo, 
              recursos e tome decisões com mais segurança.
            </p>
          </motion.div>
        </div>

        {/* Differentials */}
        <div className="grid md:grid-cols-3 gap-6">
          {differentials.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="differential-card"
            >
              <item.icon className="text-primary mb-3" size={28} />
              <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
