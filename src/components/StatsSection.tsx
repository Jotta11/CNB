import { motion } from 'framer-motion';
import { Award, Users, MapPin, TrendingUp, Shield, Truck, CheckCircle, Star } from 'lucide-react';

const stats = [
  { number: '5+', label: 'Anos de Experiência', icon: Award },
  { number: '2000+', label: 'Animais Comercializados', icon: TrendingUp },
  { number: '300+', label: 'Clientes Satisfeitos', icon: Users },
  { number: '100%', label: 'MATOPIBA', icon: MapPin },
];

const diferenciais = [
  {
    icon: Shield,
    title: 'Garantia de Qualidade',
    description: 'Todos os animais passam por rigorosa avaliação sanitária e zootécnica.',
    color: 'accent',
  },
  {
    icon: Truck,
    title: 'Logística Integrada',
    description: 'Entrega em todo o MATOPIBA com acompanhamento em tempo real.',
    color: 'primary',
  },
  {
    icon: CheckCircle,
    title: 'Transparência Total',
    description: 'Informações completas sobre origem, peso e histórico de cada animal.',
    color: 'secondary',
  },
  {
    icon: Star,
    title: 'Atendimento Especializado',
    description: 'Equipe técnica disponível para orientar sua melhor escolha.',
    color: 'primary-light',
  },
];

const colorClasses = {
  accent: {
    bg: 'bg-accent',
    text: 'text-accent',
    border: 'border-accent',
    light: 'bg-accent/10',
  },
  primary: {
    bg: 'bg-primary',
    text: 'text-primary',
    border: 'border-primary',
    light: 'bg-primary/10',
  },
  secondary: {
    bg: 'bg-secondary',
    text: 'text-secondary',
    border: 'border-secondary',
    light: 'bg-secondary/10',
  },
  'primary-light': {
    bg: 'bg-primary-medium',
    text: 'text-primary-medium',
    border: 'border-primary-medium',
    light: 'bg-primary-light/30',
  },
};

const StatsSection = () => {
  return (
    <section className="py-16 md:py-24 overflow-hidden">
      {/* Stats with gradient background */}
      <div className="gradient-hero relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1, type: 'spring' }}
                  className="text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm"
                  >
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </motion.div>
                  <div className="stat-number group-hover:scale-105 transition-transform">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Diferenciais Section */}
      <div className="bg-background relative">
        {/* Decorative zigzag */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-primary to-transparent opacity-10" />
        
        <div className="container mx-auto px-4 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1 bg-accent/10 text-accent font-semibold rounded-full text-sm mb-4">
              NOSSOS DIFERENCIAIS
            </span>
            <h2 className="section-title mb-2">Por que escolher a Agro Leilões?</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Mais que uma plataforma de comercialização, somos parceiros do seu negócio
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {diferenciais.map((item, index) => {
              const Icon = item.icon;
              const colors = colorClasses[item.color as keyof typeof colorClasses];
              
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className={`relative h-full bg-card rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:${colors.border} overflow-hidden`}>
                    {/* Colored accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${colors.bg}`} />
                    
                    {/* Icon container */}
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`w-14 h-14 ${colors.light} rounded-xl flex items-center justify-center mb-4`}
                    >
                      <Icon className={`w-7 h-7 ${colors.text}`} />
                    </motion.div>
                    
                    <h3 className="font-display text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                    
                    {/* Decorative corner */}
                    <div className={`absolute -bottom-8 -right-8 w-24 h-24 ${colors.light} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/5 rounded-full">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-medium border-2 border-white flex items-center justify-center"
                  >
                    <span className="text-white text-xs font-bold">{['A', 'B', 'C', 'D'][i]}</span>
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground ml-2">
                Junte-se a <span className="font-semibold text-primary">300+ produtores</span> que já confiam em nós
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
