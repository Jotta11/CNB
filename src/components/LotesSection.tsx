import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoteCard from './LoteCard';
import LoteModal from './LoteModal';
import { useLotes, type Lote } from '@/hooks/useLotes';
import { lotes as fallbackLotes } from '@/data/lotes';

const LotesSection = () => {
  const { lotes: dbLotes, loading } = useLotes();
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Use DB lotes if available, otherwise use fallback data
  const displayLotes = dbLotes.length > 0 ? dbLotes : fallbackLotes.map(l => ({
    ...l,
    preco: l.preco,
    video_url: null,
    imagem_url: null,
    ativo: true,
    ordem: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  // Check URL for lote parameter on load
  useEffect(() => {
    const loteId = searchParams.get('lote');
    if (loteId && displayLotes.length > 0 && !loading) {
      const foundLote = displayLotes.find(l => l.id === loteId);
      if (foundLote) {
        setSelectedLote(foundLote);
        setIsModalOpen(true);
        // Scroll to lotes section
        setTimeout(() => {
          document.getElementById('lotes')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [searchParams, displayLotes, loading]);

  const handleLoteClick = (lote: Lote) => {
    setSelectedLote(lote);
    setIsModalOpen(true);
    // Update URL with lote ID
    setSearchParams({ lote: lote.id });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Remove lote from URL
    setSearchParams({});
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayLotes.slice(0, 8).map((lote, index) => (
                <LoteCard
                  key={lote.id}
                  lote={lote as any}
                  onClick={() => handleLoteClick(lote)}
                  index={index}
                />
              ))}
            </div>

            {/* Ver Todos button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-12"
            >
              <Link to="/lotes">
                <Button size="lg" className="gap-2">
                  Ver Todos os Lotes
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </>
        )}
      </div>

      <LoteModal
        lote={selectedLote as any}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default LotesSection;
