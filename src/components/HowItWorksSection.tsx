import { motion } from 'framer-motion';
import { Search, MessageCircle, Truck, CheckCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Escolha seu Lote',
    description: 'Navegue pelos lotes disponíveis com informações completas sobre raça, peso, idade e localização.',
  },
  {
    number: '02',
    icon: MessageCircle,
    title: 'Entre em Contato',
    description: 'Fale diretamente com nossa equipe via WhatsApp para tirar dúvidas e negociar condições.',
  },
  {
    number: '03',
    icon: Truck,
    title: 'Logística Facilitada',
    description: 'Organizamos todo o transporte com parceiros confiáveis e acompanhamento em tempo real.',
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'Receba seus Animais',
    description: 'Animais entregues com toda documentação sanitária e garantia de qualidade.',
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 bg-primary/10 text-primary font-semibold rounded-full text-sm mb-4"
            >
              PROCESSO SIMPLIFICADO
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title mb-4"
            >
              Como Funciona
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="section-subtitle max-w-2xl mx-auto"
            >
              Em apenas 4 passos você fecha o melhor negócio para sua fazenda
            </motion.p>
          </div>

          {/* Steps - Horizontal Scroll on Mobile, Grid on Desktop */}
          <div className="relative">
            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-4 gap-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="relative group"
                  >
                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div className="absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent z-0 hidden lg:block" />
                    )}
                    
                    <div className="relative z-10 bg-card rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/30 h-full">
                      {/* Number Badge */}
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-display text-lg shadow-lg">
                        {step.number}
                      </div>
                      
                      {/* Icon */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4"
                      >
                        <Icon className="w-8 h-8 text-primary" />
                      </motion.div>
                      
                      <h3 className="font-display text-xl text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile Horizontal Scroll */}
            <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-4" style={{ width: 'max-content' }}>
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.number}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative w-72 flex-shrink-0"
                    >
                      <div className="bg-card rounded-2xl p-6 shadow-md border border-border h-full">
                        {/* Number Badge */}
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-display text-lg shadow-lg">
                          {step.number}
                        </div>
                        
                        {/* Icon */}
                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                          <Icon className="w-7 h-7 text-primary" />
                        </div>
                        
                        <h3 className="font-display text-lg text-foreground mb-2">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                      
                      {/* Arrow between cards */}
                      {index < steps.length - 1 && (
                        <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                          <ArrowRight className="w-4 h-4 text-primary/50" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Scroll Indicator */}
            <div className="md:hidden flex justify-center mt-4 gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-primary/30"
                />
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <a
              href="#lotes"
              className="inline-flex items-center gap-3 bg-primary hover:bg-primary-medium text-primary-foreground font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Comece agora
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
