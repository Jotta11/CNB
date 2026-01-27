import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Share2, Lock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getDistanceBetweenStates, formatDistance } from '@/utils/distance';
import type { Lote } from '@/data/lotes';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface LoteModalProps {
  lote: Lote | null;
  isOpen: boolean;
  onClose: () => void;
}

const LoteModal = ({ lote, isOpen, onClose }: LoteModalProps) => {
  const { user } = useAuth();
  const { profile } = useUserProfile();

  // Calculate distance
  const loteLocation = lote ? ((lote as any).localizacao || lote.estado) : null;
  const userRegion = profile?.regiao;
  const distance = userRegion && loteLocation ? getDistanceBetweenStates(userRegion, loteLocation) : null;

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
    const message = `Olá! Tenho interesse no *${lote.numero} - ${lote.titulo}*\n\n` +
      `• Raça: ${lote.raca}\n` +
      `• Quantidade: ${lote.quantidade} cabeças\n` +
      (user ? `• Preço: ${formatPrice(lote.preco)}/cabeça\n\n` : '\n') +
      `Gostaria de mais informações.`;
    window.open(`https://wa.me/5563992628916?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = async () => {
    if (!lote) return;
    
    const shareUrl = `${window.location.origin}/?lote=${lote.id}`;
    const shareData = {
      title: `${lote.numero} - ${lote.titulo}`,
      text: `Confira este lote: ${lote.titulo} - ${lote.quantidade} cabeças de ${lote.raca} por ${formatPrice(lote.preco)}/cabeça`,
      url: shareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copiado para a área de transferência!');
      }
    } catch (error) {
      // User cancelled share
    }
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
            {/* Header Buttons */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <button
                onClick={handleShare}
                className="bg-white/90 hover:bg-white text-primary p-2.5 rounded-full transition-all duration-200 hover:scale-110 shadow-md"
                aria-label="Compartilhar lote"
              >
                <Share2 size={20} />
              </button>
              <button
                onClick={onClose}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Video Section */}
            <div className="relative h-64 md:h-96 bg-primary flex items-center justify-center">
              <div className="text-white/50 flex flex-col items-center gap-3">
                <Video size={60} />
                <span className="text-lg">Vídeo do lote em breve</span>
              </div>
              <span className="badge-lot absolute top-4 left-4 text-lg">{lote.numero}</span>
              
              {/* Distance badge */}
              {user && distance && (
                <div className="absolute top-4 right-16 bg-white/95 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-md">
                  <MapPin className="w-4 h-4" />
                  <span>{formatDistance(distance)} de você</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <h2 className="font-display text-4xl md:text-5xl text-primary mb-2">{lote.titulo}</h2>
              <p className="text-muted-foreground mb-6">{lote.numero}</p>

              {/* Specs Grid - Simplified: Quantidade, Categoria, Localização, Peso */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-lg bg-muted">
                  <span className="text-xs block mb-1 text-muted-foreground">Quantidade</span>
                  <span className="font-semibold text-lg text-foreground">{lote.quantidade} cabeças</span>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <span className="text-xs block mb-1 text-muted-foreground">Categoria</span>
                  <span className="font-semibold text-lg text-foreground">{lote.raca}</span>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <span className="text-xs block mb-1 text-muted-foreground">Localização</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-lg text-foreground">{loteLocation}</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <span className="text-xs block mb-1 text-muted-foreground">Peso</span>
                  <span className="font-semibold text-lg text-foreground">{lote.peso}</span>
                </div>
              </div>

              {/* Price Card with Blur */}
              <div className="p-5 rounded-xl bg-primary text-primary-foreground mb-8">
                <span className="text-sm block mb-1 text-primary-foreground/70">Preço por cabeça</span>
                {user ? (
                  <span className="font-display text-3xl">{formatPrice(lote.preco)}</span>
                ) : (
                  <Link 
                    to="/auth" 
                    onClick={onClose}
                    className="flex items-center gap-3 group"
                  >
                    <span className="font-display text-3xl blur-md select-none">R$ XX.XXX</span>
                    <div className="flex items-center gap-1.5 text-sm bg-white/20 px-3 py-1 rounded-full group-hover:bg-white group-hover:text-primary transition-colors">
                      <Lock className="w-4 h-4" />
                      <span>Fazer login para ver preço</span>
                    </div>
                  </Link>
                )}
              </div>

              {/* Description */}
              {lote.descricao && (
                <div className="mb-8">
                  <h3 className="font-display text-2xl text-primary mb-3">Descrição</h3>
                  <p className="text-muted-foreground leading-relaxed">{lote.descricao}</p>
                </div>
              )}

              {/* WhatsApp CTA */}
              <button
                onClick={handleWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
              >
                <WhatsAppIcon className="w-6 h-6" />
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
