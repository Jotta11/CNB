import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import LoteCard from './LoteCard';
import LoteModal from './LoteModal';
import { useLotes, type Lote } from '@/hooks/useLotes';
import { lotes as fallbackLotes } from '@/data/lotes';

const LotesSection = () => {
  const { lotes: dbLotes, loading } = useLotes();
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

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
          className="text-center mb-12"
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
            {/* Carousel Navigation */}
            <div className="flex justify-end gap-2 mb-4">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6">
                {displayLotes.slice(0, 6).map((lote, index) => (
                  <div 
                    key={lote.id} 
                    className="flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                  >
                    <LoteCard
                      lote={lote as any}
                      onClick={() => handleLoteClick(lote)}
                      index={index}
                    />
                  </div>
                ))}
              </div>
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
