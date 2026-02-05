import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import bgFaq from '@/assets/bg-faq.png';

const faqItems = [
  {
    question: 'O que é o Conexão Norte Bovino?',
    answer: 'O Conexão Norte Bovino é uma plataforma de comercialização de gado. Aqui você encontra lotes divulgados com padrão de informação, curadoria e atendimento direto para facilitar a negociação com mais segurança.',
  },
  {
    question: 'O Conexão é um leilão?',
    answer: 'Não. O Conexão Norte Bovino não é um leilão tradicional. É uma plataforma digital onde os lotes são apresentados de forma organizada e o contato para negociação acontece diretamente pelo WhatsApp, com rapidez e contexto do lote.',
  },
  {
    question: 'Como faço para divulgar meu gado?',
    answer: 'Basta preencher o formulário de cadastro do lote acima. Com as informações iniciais, seguimos com a avaliação/curadoria e orientamos os próximos passos para publicar seu gado com a apresentação adequada.',
  },
  {
    question: 'Como funciona a curadoria?',
    answer: 'A curadoria é uma etapa de validação e organização das informações do lote para garantir padrão, clareza e alinhamento com o perfil de compra na região. Isso reduz ruído, evita perda de tempo e melhora a qualidade das oportunidades.',
  },
  {
    question: 'Como a "segurança garantida" funciona na prática?',
    answer: 'Nosso processo prioriza transparência e critérios de publicação, além de condução do contato com o contexto correto do lote. Assim, comprador e vendedor avançam com mais confiança desde o primeiro contato.',
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgFaq})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top left decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-primary/5"
        />
        {/* Bottom right decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/5"
        />
        {/* Floating dots */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute top-1/4 right-10 w-3 h-3 rounded-full bg-primary/20"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute top-1/3 right-20 w-2 h-2 rounded-full bg-accent/30"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-1/4 left-16 w-4 h-4 rounded-full bg-primary/15"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
          >
            <HelpCircle className="text-primary" size={32} />
          </motion.div>
          <h2 className="section-title">Dúvidas Frequentes</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Tudo que você precisa saber sobre o Conexão Norte Bovino
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-xl overflow-hidden transition-all duration-300 ${
                openIndex === index 
                  ? 'bg-primary/5 border-2 border-primary shadow-lg' 
                  : 'bg-background border-2 border-transparent hover:border-primary/30'
              }`}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-5 text-left group"
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                    openIndex === index 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="font-semibold text-foreground text-base md:text-lg pr-4">
                    {item.question}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    openIndex === index ? 'bg-primary' : 'bg-primary/10'
                  }`}
                >
                  <ChevronDown 
                    className={openIndex === index ? 'text-primary-foreground' : 'text-primary'} 
                    size={18} 
                  />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pl-[4.5rem] text-muted-foreground leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-primary/5 rounded-2xl p-6 sm:p-8">
            <div className="w-12 h-12 rounded-full bg-whatsapp/10 flex items-center justify-center">
              <MessageCircle className="text-whatsapp" size={24} />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-foreground font-medium mb-1">
                Ainda tem dúvidas?
              </p>
              <p className="text-muted-foreground text-sm">
                Fale diretamente conosco pelo WhatsApp
              </p>
            </div>
            <a 
              href="https://wa.me/5563992628916"
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-whatsapp px-6 py-3 rounded-lg flex items-center gap-2"
            >
              <MessageCircle size={18} />
              Chamar no WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
