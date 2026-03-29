import { motion } from 'framer-motion';
import { ShoppingCart, ClipboardList } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const Hero = () => {
  const { settings } = useSiteSettings();
  const heroBackground = settings.hero_background;

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <section 
      id="inicio" 
      className="min-h-[85vh] flex items-center justify-center relative overflow-hidden pt-20"
      style={{
        background: heroBackground 
          ? `url(${heroBackground}) center/cover no-repeat`
          : 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-medium)) 100%)'
      }}
    >
      {/* Dark overlay for better text readability when using image */}
      {heroBackground && (
        <div className="absolute inset-0 bg-black/40" />
      )}
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        ease: "easeOut"
      }}>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-wider mb-6">
            Conectando os melhores
            <br />
            <span className="text-primary-light">lotes para a sua fazenda.</span>
          </h1>
        </motion.div>

        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.2,
        ease: "easeOut"
      }} className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed">
          Com a Conexão Norte Bovino, você compra e vende seu rebanho com inteligência
          de mercado e um processo comercial eficiente, seguro e profissional.
        </motion.p>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.4,
        ease: "easeOut"
      }} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button onClick={() => scrollToSection('#lotes')} className="btn-hero-buy px-8 py-4 rounded-lg flex items-center gap-3 text-lg">
            <ShoppingCart size={22} />
            Quero Comprar
          </button>
          <button onClick={() => scrollToSection('#vender')} className="btn-hero-sell px-8 py-4 rounded-lg flex items-center gap-3 text-lg">
            <ClipboardList size={22} />
            Quero Vender
          </button>
        </motion.div>
      </div>

    </section>
  );
};

export default Hero;
