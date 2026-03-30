import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import LoteCard from './LoteCard';
import { useLotes, type Lote } from '@/hooks/useLotes';
import { lotes as fallbackLotes } from '@/data/lotes';

const LotesSection = () => {
  const { lotes: dbLotes, loading } = useLotes();

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
  const displayLotes: Lote[] = dbLotes.length > 0 ? dbLotes : fallbackLotes.map(l => ({
    ...l,
    preco: l.preco,
    video_url: null,
    imagem_url: null,
    ativo: true,
    ordem: 0,
    localizacao: l.localizacao || 'Tocantins',
    capacidade_carga: l.capacidade_carga || 96,
    tipo_implemento: l.tipo_implemento || 'nove_eixos',
    qtd_carretas: l.qtd_carretas || 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  return (
    <section id="lotes" className="py-12 md:py-16 bg-cream">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Vitrine de Negócios CNB</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Curadoria exclusiva de lotes bovinos selecionados para sua fazenda.
            <br />
            Anuncie com a inteligência de mercado e a segurança da CNB.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Carousel wrapper com overlay Em Breve */}
            <div className="relative">
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
                      <LoteCard lote={lote} index={index} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Overlay Em Breve */}
              <div className="absolute inset-0 backdrop-blur-sm bg-primary/75 rounded-2xl flex flex-col items-center justify-center z-10 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center gap-4 text-center px-6"
                >
                  <span className="inline-block bg-accent text-white font-display text-sm tracking-[0.3em] px-4 py-1 rounded-full">
                    EM BREVE
                  </span>
                  <p className="font-display text-5xl md:text-7xl text-white tracking-wide leading-none">
                    NOVOS LOTES
                  </p>
                  <p className="text-white/80 text-sm md:text-base max-w-sm font-medium">
                    Nossa vitrine de negócios está sendo preparada com curadoria exclusiva.
                    Fique de olho!
                  </p>
                </motion.div>
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
    </section>
  );
};

export default LotesSection;
