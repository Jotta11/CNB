import { Video } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Lote } from '@/data/lotes';

interface LoteCardProps {
  lote: Lote;
  onClick: () => void;
  index: number;
}

const LoteCard = ({ lote, onClick, index }: LoteCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-lot cursor-pointer group"
      onClick={onClick}
    >
      {/* Video Placeholder */}
      <div className="relative h-48 bg-primary flex items-center justify-center">
        <div className="text-white/50 flex flex-col items-center gap-2">
          <Video size={40} />
          <span className="text-sm">Vídeo disponível</span>
        </div>
        <span className="badge-lot absolute top-4 left-4">{lote.numero}</span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-2xl text-primary mb-4">{lote.titulo}</h3>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex gap-1 flex-wrap">
            <span className="text-muted-foreground">Raça:</span>
            <span className="font-medium">{lote.raca}</span>
            <span className="text-muted-foreground/40 mx-1">•</span>
            <span className="text-muted-foreground">Idade:</span>
            <span className="font-medium">{lote.idade}</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            <span className="text-muted-foreground">Peso:</span>
            <span className="font-medium">{lote.peso}</span>
            <span className="text-muted-foreground/40 mx-1">•</span>
            <span className="text-muted-foreground">Qtd:</span>
            <span className="font-medium whitespace-nowrap">{lote.quantidade} cabeças</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            <span className="text-muted-foreground">Sexo:</span>
            <span className="font-medium">{lote.sexo}</span>
            <span className="text-muted-foreground/40 mx-1">•</span>
            <span className="text-muted-foreground">Estado:</span>
            <span className="font-medium text-primary">{lote.estado}</span>
          </div>
        </div>

        <div className="border-t border-border pt-4 mt-4">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs text-muted-foreground block">Preço por cabeça</span>
              <span className="font-display text-3xl text-primary">{formatPrice(lote.preco)}</span>
            </div>
          </div>
        </div>

        <button className="w-full mt-4 bg-accent text-accent-foreground py-3 rounded-lg font-semibold hover:bg-accent/90 transition-all duration-200 group-hover:shadow-lg group-hover:scale-[1.02]">
          Ver Detalhes Completos
        </button>
      </div>
    </motion.div>
  );
};

export default LoteCard;
