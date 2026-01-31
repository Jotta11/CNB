import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Video, Share2, MapPin, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useLotes, type Lote } from '@/hooks/useLotes';
import { getDistanceBetweenStates, formatDistance } from '@/utils/distance';
import FreightCalculator from '@/components/FreightCalculator';
import RelatedLotes from '@/components/RelatedLotes';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const LoteDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { lotes, loading } = useLotes();
  const [lote, setLote] = useState<Lote | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loading && lotes.length > 0 && id) {
      const foundLote = lotes.find(l => l.id === id);
      if (foundLote) {
        setLote(foundLote);
      } else {
        navigate('/lotes', { replace: true });
        toast.error('Lote não encontrado');
      }
    }
  }, [id, lotes, loading, navigate]);

  const loteLocation = lote?.localizacao || lote?.estado || 'Tocantins';
  const userRegion = profile?.regiao;
  const distance = userRegion && loteLocation ? getDistanceBetweenStates(userRegion, loteLocation) : null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

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
    
    const shareUrl = window.location.href;
    const shareData = {
      title: `${lote.numero} - ${lote.titulo}`,
      text: `Confira este lote: ${lote.titulo} - ${lote.quantidade} cabeças de ${lote.raca}`,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="pt-24 pb-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!lote) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="pt-24 pb-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Lote não encontrado</p>
            <Link to="/lotes">
              <Button>Ver todos os lotes</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Link to="/lotes">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar aos lotes
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Video/Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative aspect-video bg-primary rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
                <div className="text-white/50 flex flex-col items-center gap-3">
                  <Video size={60} />
                  <span className="text-lg">Vídeo do lote em breve</span>
                </div>
                
                {/* Lot number badge */}
                <span className="badge-lot absolute top-4 left-4 text-lg">{lote.numero}</span>
                
                {/* Distance badge */}
                {user && distance && (
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-md">
                    <MapPin className="w-4 h-4" />
                    <span>{formatDistance(distance)} de você</span>
                  </div>
                )}
              </div>

              </motion.div>

            {/* Right Column - Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-card border border-border">
                  <span className="text-xs block mb-1 text-muted-foreground">Quantidade</span>
                  <span className="font-semibold text-lg text-foreground">{lote.quantidade} cabeças</span>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <span className="text-xs block mb-1 text-muted-foreground">Categoria</span>
                  <span className="font-semibold text-lg text-foreground">{lote.raca}</span>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <span className="text-xs block mb-1 text-muted-foreground">Localização</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-lg text-foreground">{loteLocation}</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <span className="text-xs block mb-1 text-muted-foreground">Peso</span>
                  <span className="font-semibold text-lg text-foreground">{lote.peso}</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <span className="text-xs block mb-1 text-muted-foreground">Preço por cabeça</span>
                {user ? (
                  <span className="font-display text-3xl text-primary">{formatPrice(lote.preco)}</span>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="font-display text-3xl text-primary blur-md select-none">R$ X.XXX</span>
                    <Link 
                      to="/auth" 
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Lock className="w-4 h-4" />
                      Cadastre-se para ver
                    </Link>
                  </div>
                )}
              </div>

              {/* WhatsApp CTA + Share */}
              <div className="flex gap-3">
                <button
                  onClick={handleWhatsApp}
                  className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
                >
                  <WhatsAppIcon className="w-6 h-6" />
                  Consultar no WhatsApp
                </button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="px-4 py-4 h-auto"
                  title="Compartilhar"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Freight Calculator - Full width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <FreightCalculator lote={lote} />
          </motion.div>

          {/* Description */}
          {lote.descricao && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 bg-card rounded-xl p-6 border border-border"
            >
              <h2 className="font-display text-2xl text-primary mb-4">Descrição</h2>
              <p className="text-muted-foreground leading-relaxed">{lote.descricao}</p>
            </motion.div>
          )}

          {/* Related Lots Section */}
          <RelatedLotes currentLote={lote} allLotes={lotes} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoteDetails;
