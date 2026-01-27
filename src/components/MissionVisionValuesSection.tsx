import { motion } from 'framer-motion';
import { Target, Eye, Heart, Handshake, Shield, Lightbulb } from 'lucide-react';

const values = [
  {
    icon: Handshake,
    title: 'Transparência',
    description: 'Negociações claras e honestas em cada etapa do processo.',
  },
  {
    icon: Shield,
    title: 'Confiança',
    description: 'Construímos relacionamentos duradouros baseados em credibilidade.',
  },
  {
    icon: Lightbulb,
    title: 'Inovação',
    description: 'Tecnologia a serviço do agronegócio tradicional.',
  },
  {
    icon: Heart,
    title: 'Compromisso',
    description: 'Dedicação total ao sucesso dos nossos parceiros.',
  },
];

const MissionVisionValuesSection = () => {
  return (
    <section className="py-20 md:py-32 bg-card overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Mission & Vision - Side by Side Cards */}
        <div className="grid lg:grid-cols-2 gap-6 mb-16">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-medium rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300" />
            <div className="relative bg-gradient-to-br from-primary to-primary-medium rounded-3xl p-8 md:p-10 text-primary-foreground overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6"
                >
                  <Target className="w-8 h-8" />
                </motion.div>
                
                <h3 className="font-display text-3xl md:text-4xl mb-4">Missão</h3>
                <p className="text-primary-foreground/90 text-lg leading-relaxed">
                  Conectar produtores rurais do MATOPIBA de forma eficiente e transparente, 
                  facilitando negociações de gado com tecnologia, agilidade e confiança, 
                  maximizando oportunidades para compradores e vendedores.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent/80 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300" />
            <div className="relative bg-gradient-to-br from-accent to-accent/80 rounded-3xl p-8 md:p-10 text-accent-foreground overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/2" />
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -10 }}
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6"
                >
                  <Eye className="w-8 h-8" />
                </motion.div>
                
                <h3 className="font-display text-3xl md:text-4xl mb-4">Visão</h3>
                <p className="text-accent-foreground/90 text-lg leading-relaxed">
                  Ser a principal plataforma de comercialização de gado do MATOPIBA, 
                  reconhecida pela excelência no atendimento, inovação tecnológica e 
                  impacto positivo na cadeia produtiva pecuária da região.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-secondary/10 text-secondary font-semibold rounded-full text-sm mb-4">
              O QUE NOS GUIA
            </span>
            <h2 className="section-title">Nossos Valores</h2>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="bg-background rounded-2xl p-6 h-full border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-14 h-14 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
                    >
                      <Icon className="w-7 h-7 text-primary" />
                    </motion.div>
                    
                    <h4 className="font-display text-lg md:text-xl text-foreground mb-2">
                      {value.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVisionValuesSection;
