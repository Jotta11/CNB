import { motion } from 'framer-motion';
import { Award, Users, MapPin, TrendingUp, Shield, Truck, CheckCircle, Star } from 'lucide-react';

// Logo symbol component with dynamic color
const LogoSymbol = ({ className = '' }: { className?: string }) => (
  <svg 
    viewBox="0 0 357.65 553.18" 
    className={className}
    fill="currentColor"
  >
    <path d="M333.39,97.03c-2.03-14.83-6.6-25.98-7.12-27.2l-14-33.28L296.9.03l-7.86,38.1c-44.26-11.87-84.37-13.63-101.53-13.78-2.67-.03-4.78-.01-6.27.01-1.66.03-2.53.06-2.53.06,0,0-1.09-.03-3.14-.06-1.56-.03-3.66-.04-6.26,0-17.44.17-57.03,2.02-100.7,13.7L60.77,0l-15.38,36.54-14,33.29c-.52,1.23-5.09,12.38-7.12,27.21-2.75,20.1.39,38.28,9.07,52.54,5.7,9.36,13.43,16.88,23.12,22.5,4.54,37.73,26.22,108.61,122.24,143.25,95.91-34.6,117.65-105.35,122.22-143.12,9.82-5.64,17.63-13.19,23.38-22.63,8.68-14.27,11.82-32.43,9.07-52.55ZM302.05,156.58c-8.74,7.04-20.16,11.7-34.17,13.98l-34.99,57.79,9.17,22.76-41.47,22.57-2.25,1.24-.38.2-.11-.2h-38.03l-.12.22-.4-.22-3.54-1.93-40.17-21.86,9.17-22.77-35.01-57.78h0c-14.13-2.3-25.64-7.04-34.4-14.17-4.6-3.74-8.44-8.15-11.52-13.2-17.53-28.79-1.8-66.98-1.12-68.59l12.86-30.55,1.08-2.56s.07-.01.1-.03l7.25,35.23c1.05,5.08,5.72,22.43,22.08,32.84,4.88,3.1,9.8,4.99,14.34,6.12,4.64,1.13,8.88,1.48,12.28,1.48h6.76l1.29,2.38,4.46,8.2,11.47,21.09-30.7-9.58c-9.1-.83-20.56-3.56-31.93-10.81-6.56-4.18-11.82-9.04-16.04-14.07.36,5.98,1.78,12.02,4.99,17.28,6.13,10.01,18.45,15.92,36.62,17.63l2.49-1.5,47.61,78.59-5.9,14.66,21.2,11.52h27.6l21.2-11.54-5.9-14.65,47.6-78.61,2.49,1.5c18.17-1.71,30.5-7.62,36.63-17.63,3.22-5.25,4.63-11.28,4.99-17.28-4.21,5.03-9.47,9.9-16.04,14.09-11.37,7.25-22.84,9.98-31.94,10.81l-30.69,9.58,11.46-21.08,4.46-8.21,1.3-2.39h5.14s1.61.01,1.61.01c3.39,0,7.64-.34,12.27-1.48,4.55-1.12,9.48-3.01,14.36-6.13,16.35-10.4,21.03-27.77,22.08-32.84l7.25-35.14.14.04.79,1.88,13.1,31.15c.68,1.61,16.4,39.8-1.12,68.58-3.13,5.15-7.06,9.62-11.76,13.4ZM178.49,41.46l13,62.97,32.97,12.19-.63,1.15-32.34,11.97-12.66,62.92-12.66-62.92-32.34-11.97-.63-1.15,32.97-12.19,12.32-62.97Z"/>
  </svg>
);

const stats = [{
  number: '5+',
  label: 'Anos de Experiência',
  icon: Award
}, {
  number: '2000+',
  label: 'Animais Comercializados',
  icon: TrendingUp
}, {
  number: '300+',
  label: 'Clientes Satisfeitos',
  icon: Users
}, {
  number: '100%',
  label: 'Satisfação',
  icon: MapPin
}];

const diferenciais = [{
  icon: Shield,
  title: 'Garantia de Qualidade',
  description: 'Todos os animais passam por rigorosa avaliação sanitária e zootécnica.',
  color: 'accent'
}, {
  icon: Truck,
  title: 'Logística Integrada',
  description: 'Entrega em todo o Brasil com acompanhamento em tempo real.',
  color: 'primary'
}, {
  icon: CheckCircle,
  title: 'Transparência Total',
  description: 'Informações completas sobre origem, peso e histórico de cada animal.',
  color: 'secondary'
}, {
  icon: Star,
  title: 'Atendimento Especializado',
  description: 'Equipe técnica disponível para orientar sua melhor escolha.',
  color: 'primary-light'
}];

const colorClasses = {
  accent: {
    bg: 'bg-accent',
    text: 'text-accent',
    border: 'border-accent',
    light: 'bg-accent/10'
  },
  primary: {
    bg: 'bg-primary',
    text: 'text-primary',
    border: 'border-primary',
    light: 'bg-primary/10'
  },
  secondary: {
    bg: 'bg-secondary',
    text: 'text-secondary',
    border: 'border-secondary',
    light: 'bg-secondary/10'
  },
  'primary-light': {
    bg: 'bg-primary-medium',
    text: 'text-primary-medium',
    border: 'border-primary-medium',
    light: 'bg-primary-light/30'
  }
};

const StatsSection = () => {
  return <section className="py-16 md:py-24 overflow-hidden">
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
            return <motion.div key={stat.label} initial={{
              opacity: 0,
              scale: 0.8
            }} whileInView={{
              opacity: 1,
              scale: 1
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay: index * 0.1,
              type: 'spring'
            }} className="text-center group">
                  <motion.div whileHover={{
                scale: 1.1,
                rotate: 5
              }} className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </motion.div>
                  <div className="stat-number group-hover:scale-105 transition-transform">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>;
          })}
          </div>
        </div>
      </div>

      {/* Diferenciais Section */}
      <div className="bg-background relative">
        {/* Decorative zigzag */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-primary to-transparent opacity-10" />
        
        <div className="container mx-auto px-4 py-16 md:py-20">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-accent/10 text-accent font-semibold rounded-full text-sm mb-4">
              NOSSOS DIFERENCIAIS
            </span>
            <h2 className="section-title mb-2">Por que escolher a Conexão Norte Bovino?</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Mais que uma plataforma de comercialização, somos parceiros do seu negócio
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {diferenciais.map((item, index) => {
            const Icon = item.icon;
            const colors = colorClasses[item.color as keyof typeof colorClasses];
            return <motion.div key={item.title} initial={{
              opacity: 0,
              y: 30
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.5,
              delay: index * 0.1
            }} whileHover={{
              y: -8
            }} className="group">
                  <div className={`relative h-full bg-card rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:${colors.border} overflow-hidden`}>
                    {/* Colored accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${colors.bg}`} />
                    
                    {/* Icon container */}
                    <motion.div whileHover={{
                  rotate: 360
                }} transition={{
                  duration: 0.5
                }} className={`w-14 h-14 ${colors.light} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className={`w-7 h-7 ${colors.text}`} />
                    </motion.div>
                    
                    <h3 className="font-display text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                    
                    {/* Logo symbol on hover */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <LogoSymbol className={`w-10 h-10 ${colors.text} opacity-30`} />
                    </div>
                  </div>
                </motion.div>;
          })}
          </div>

          {/* Bottom CTA */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.4
        }} className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/5 rounded-full">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-medium border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{['A', 'B', 'C', 'D'][i]}</span>
                  </div>)}
              </div>
              <span className="text-sm text-muted-foreground ml-2">
                Junte-se a <span className="font-semibold text-primary">300+ produtores</span> que já confiam em nós
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default StatsSection;