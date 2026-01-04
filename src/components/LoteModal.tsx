import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Check, MessageCircle } from 'lucide-react';
import type { Lote } from '@/data/lotes';

interface LoteModalProps {
  lote: Lote | null;
  isOpen: boolean;
  onClose: () => void;
}

const LoteModal = ({ lote, isOpen, onClose }: LoteModalProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const handleWhatsApp = () => {
    if (!lote) return;
    const message = encodeURIComponent(
      `Olá! Tenho interesse no ${lote.numero} - ${lote.titulo}`
    );
    window.open(`https://wa.me/556399262816?text=${message}`, '_blank');
  };

  if (!lote) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/90" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            {/* Video Section */}
            <div className="relative h-64 md:h-96 bg-primary flex items-center justify-center">
              <div className="text-white/50 flex flex-col items-center gap-3">
                <Video size={60} />
                <span className="text-lg">Vídeo do lote em breve</span>
              </div>
              <span className="badge-lot absolute top-4 left-4 text-lg">{lote.numero}</span>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <h2 className="font-display text-4xl md:text-5xl text-primary mb-2">{lote.titulo}</h2>
              <p className="text-muted-foreground mb-6">Raça {lote.raca}</p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Idade', value: lote.idade },
                  { label: 'Peso Médio', value: lote.peso },
                  { label: 'Quantidade', value: `${lote.quantidade} cabeças` },
                  { label: 'Sexo', value: lote.sexo },
                  { label: 'Estado', value: lote.estado },
                  { label: 'Preço/Cabeça', value: formatPrice(lote.preco), highlight: true },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`p-4 rounded-lg ${item.highlight ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                  >
                    <span className={`text-xs block mb-1 ${item.highlight ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {item.label}
                    </span>
                    <span className={`font-semibold text-lg ${item.highlight ? '' : 'text-foreground'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="font-display text-2xl text-primary mb-3">Descrição</h3>
                <p className="text-muted-foreground leading-relaxed">{lote.descricao}</p>
              </div>

              {/* Characteristics */}
              <div className="mb-8">
                <h3 className="font-display text-2xl text-primary mb-4">Características</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {lote.caracteristicas.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check size={14} className="text-primary" />
                      </div>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <button
                onClick={handleWhatsApp}
                className="btn-whatsapp w-full py-4 rounded-lg flex items-center justify-center gap-3 text-lg"
              >
                <MessageCircle size={24} />
                Consultar no WhatsApp
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoteModal;
