import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Video, MapPin } from 'lucide-react';
import type { Lote } from '@/hooks/useLotes';

interface RelatedLotesProps {
  currentLote: Lote;
  allLotes: Lote[];
}

const RelatedLotes = ({ currentLote, allLotes }: RelatedLotesProps) => {
  // Filter related lots: same breed or same location, excluding current lot
  const relatedLotes = allLotes
    .filter(lote => 
      lote.id !== currentLote.id && 
      (lote.raca === currentLote.raca || 
       lote.localizacao === currentLote.localizacao ||
       lote.estado === currentLote.estado)
    )
    .slice(0, 3);

  // If no related lots by breed/location, show random other lots
  const displayLotes = relatedLotes.length > 0 
    ? relatedLotes 
    : allLotes.filter(lote => lote.id !== currentLote.id).slice(0, 3);

  if (displayLotes.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-12"
    >
      <h2 className="font-display text-2xl md:text-3xl text-primary mb-6">
        Lotes Relacionados
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayLotes.map((lote, index) => (
          <Link
            key={lote.id}
            to={`/lotes/${lote.id}`}
            onClick={() => window.scrollTo(0, 0)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
            >
              {/* Video placeholder */}
              <div className="relative h-40 bg-primary flex items-center justify-center">
                <div className="text-white/50 flex flex-col items-center gap-2">
                  <Video size={32} />
                  <span className="text-xs">Vídeo disponível</span>
                </div>
                <span className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                  {lote.numero}
                </span>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className="font-display text-lg text-primary mb-2 group-hover:text-primary/80 transition-colors">
                  {lote.raca}
                </h3>
                
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span>{lote.quantidade} cabeças</span>
                  <span>•</span>
                  <span>{lote.peso}</span>
                </div>
                
                <div className="flex items-center gap-1 mt-2 text-sm text-primary">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{lote.localizacao || lote.estado}</span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
      
      {/* View all button */}
      <div className="text-center mt-8">
        <Link
          to="/lotes"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Ver todos os lotes
          <span className="text-lg">→</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default RelatedLotes;
