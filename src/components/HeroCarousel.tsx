import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { ShoppingCart, ClipboardList } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useHeroSlides } from '@/hooks/useHeroSlides';

// ── Utilitário de navegação ──────────────────────────────────────────────────
const navigateTo = (url: string) => {
  if (url.startsWith('#')) {
    document.querySelector(url)?.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.location.href = url;
  }
};

// ── Fallback (nenhum slide ativo cadastrado) ─────────────────────────────────
const HeroFallback = () => {
  const scrollToSection = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <section
      id="inicio"
      className="min-h-[85vh] flex items-center justify-center relative overflow-hidden pt-20"
      style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-medium)) 100%)' }}
    >
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white tracking-wider mb-6">
          Conectando os melhores<br />
          <span className="text-primary-light">lotes para a sua fazenda.</span>
        </h1>
        <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed">
          Com a Conexão Norte Bovino, você compra e vende seu rebanho com inteligência
          de mercado e um processo comercial eficiente, seguro e profissional.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button onClick={() => scrollToSection('#lotes')} className="btn-hero-buy px-8 py-4 rounded-lg flex items-center gap-3 text-lg">
            <ShoppingCart size={22} />Quero Comprar
          </button>
          <button onClick={() => scrollToSection('#vender')} className="btn-hero-sell px-8 py-4 rounded-lg flex items-center gap-3 text-lg">
            <ClipboardList size={22} />Quero Vender
          </button>
        </div>
      </div>
    </section>
  );
};

// ── Dots de navegação ────────────────────────────────────────────────────────
const SlideDots = ({ count, current }: { count: number; current: number }) => (
  <div className="flex gap-1.5 items-center justify-center">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`h-[3px] rounded-full transition-all duration-300 ${
          i === current ? 'w-6 bg-white' : 'w-2 bg-white/40'
        }`}
      />
    ))}
  </div>
);

// ── Carrossel principal ──────────────────────────────────────────────────────
const HeroCarousel = () => {
  const { slides, loading } = useHeroSlides();
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => { api.off('select', onSelect); };
  }, [api]);

  if (loading) return null;
  if (!slides.length) return <HeroFallback />;

  return (
    <section id="inicio" className="min-h-[85vh] relative overflow-hidden pt-20">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{ loop: true }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="h-full"
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0">
              <div className="relative min-h-[85vh] flex items-end md:items-center overflow-hidden">

                {/* Arte mobile (< md) */}
                {slide.imagem_mobile && (
                  <div
                    className="md:hidden absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url("${slide.imagem_mobile}")` }}
                  />
                )}

                {/* Arte desktop (≥ md) */}
                {slide.imagem_desktop && (
                  <div
                    className="hidden md:block absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url("${slide.imagem_desktop}")` }}
                  />
                )}

                {/* Fallback de cor se não houver imagem */}
                {!slide.imagem_mobile && !slide.imagem_desktop && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70" />
                )}

                {/* Overlay mobile: gradiente rodapé */}
                <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Overlay desktop: gradiente lateral */}
                <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

                {/* Conteúdo mobile: rodapé */}
                <div className="md:hidden relative z-10 w-full px-5 pb-8">
                  <h2 className="font-display text-3xl text-white tracking-wide leading-tight mb-2 whitespace-pre-line">
                    {slide.titulo}
                  </h2>
                  {slide.subtitulo && (
                    <p className="text-white/75 text-sm leading-snug mb-4">
                      {slide.subtitulo}
                    </p>
                  )}
                  {slide.botao_url && (
                    <button
                      onClick={() => navigateTo(slide.botao_url!)}
                      className="block w-full text-center bg-accent text-white font-bold py-3 rounded-lg text-sm tracking-wide mb-4"
                    >
                      {slide.botao_texto}
                    </button>
                  )}
                  <SlideDots count={slides.length} current={current} />
                </div>

                {/* Conteúdo desktop: lado esquerdo, verticalmente centrado */}
                <div className="hidden md:flex relative z-10 flex-col items-start justify-center h-full min-h-[85vh] px-20 max-w-xl">
                  <h2 className="font-display text-4xl lg:text-5xl text-white tracking-wider leading-tight mb-4 whitespace-pre-line">
                    {slide.titulo}
                  </h2>
                  {slide.subtitulo && (
                    <p className="text-white/80 text-lg leading-relaxed mb-8">
                      {slide.subtitulo}
                    </p>
                  )}
                  {slide.botao_url && (
                    <button
                      onClick={() => navigateTo(slide.botao_url!)}
                      className="inline-block bg-accent text-white font-bold px-8 py-4 rounded-lg text-base tracking-wide"
                    >
                      {slide.botao_texto}
                    </button>
                  )}
                  <div className="mt-8">
                    <SlideDots count={slides.length} current={current} />
                  </div>
                </div>

              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Setas visíveis apenas em desktop */}
        <CarouselPrevious className="hidden md:flex left-4 bg-white/15 border-0 text-white hover:bg-white/25 hover:text-white" />
        <CarouselNext className="hidden md:flex right-4 bg-white/15 border-0 text-white hover:bg-white/25 hover:text-white" />
      </Carousel>
    </section>
  );
};

export default HeroCarousel;
