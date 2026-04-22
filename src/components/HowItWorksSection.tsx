import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageCircle, Truck, CheckCircle, ArrowRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Entrada da Demanda ou do Lote',
    description: 'O cliente informa sua necessidade de compra ou disponibiliza os dados do lote para venda, com as informações essenciais da operação.',
  },
  {
    number: '02',
    icon: MessageCircle,
    title: 'Validação em Campo e Padronização',
    description: 'A CNB realiza a visita para avaliação e captação de imagens do lote, padroniza as informações e alinha as condições comerciais.',
  },
  {
    number: '03',
    icon: Truck,
    title: 'Condução da Negociação',
    description: 'A operação é conduzida entre as partes, com suporte na organização documental e definição logística.',
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'Fechamento e Embarque',
    description: 'A CNB acompanha o embarque dos animais, garantindo que a operação seja concluída conforme o que foi negociado.',
  },
];

const HowItWorksSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: false,
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-12 md:py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="text-center mb-8 md:mb-16">
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
              Você entra com a demanda ou o lote. A CNB estrutura, conduz e acompanha
              a operação até o embarque.
            </motion.p>
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <div className="overflow-hidden -mx-4" ref={emblaRef}>
              <div className="flex">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.number}
                      className="flex-none w-[85%] pl-4 first:pl-4 last:pr-4"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-card rounded-2xl p-6 shadow-md border border-border h-full relative"
                      >
                        {/* Step number — top right */}
                        <div className="absolute top-4 right-4 w-9 h-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-display text-base shadow">
                          {step.number}
                        </div>

                        {/* Icon */}
                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                          <Icon className="w-7 h-7 text-primary" />
                        </div>

                        <h3 className="font-display text-xl text-foreground mb-2 pr-8">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center mt-5 gap-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === selectedIndex
                      ? 'w-6 h-2 bg-primary'
                      : 'w-2 h-2 bg-primary/25'
                  }`}
                />
              ))}
            </div>
          </div>

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

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-10 md:mt-12"
          >
            <a
              href="#vender"
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
