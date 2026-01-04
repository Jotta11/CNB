import { useState } from 'react';
import { motion } from 'framer-motion';
import LoteCard from './LoteCard';
import LoteModal from './LoteModal';
import { lotes, type Lote } from '@/data/lotes';

const LotesSection = () => {
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoteClick = (lote: Lote) => {
    setSelectedLote(lote);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedLote(null), 300);
  };

  return (
    <section id="lotes" className="py-20 md:py-28 bg-cream">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Lotes em Destaque</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Seleção curada com informações claras para sua decisão
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {lotes.map((lote, index) => (
            <LoteCard
              key={lote.id}
              lote={lote}
              onClick={() => handleLoteClick(lote)}
              index={index}
            />
          ))}
        </div>
      </div>

      <LoteModal
        lote={selectedLote}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default LotesSection;
