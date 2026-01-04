import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqItems = [
  {
    question: 'O que é o Conexão Norte Bovino?',
    answer: 'O Conexão Norte Bovino é uma plataforma de comercialização de gado no MATOPIBA. Aqui você encontra lotes divulgados com padrão de informação, curadoria e atendimento direto para facilitar a negociação com mais segurança.',
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
    <section id="faq" className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Dúvidas Frequentes</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Tudo que você precisa saber sobre o Conexão Norte Bovino
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="faq-item"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-primary text-lg pr-4">{item.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="text-primary" size={24} />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
