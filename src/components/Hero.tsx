import { motion } from 'framer-motion';
import { ShoppingCart, ClipboardList } from 'lucide-react';
const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section id="inicio" className="min-h-screen flex items-center justify-center gradient-hero relative overflow-hidden pt-20">
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
            Conectando compra e venda     
            <br />
            <span className="text-primary-light">com confiança </span>
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
          Venda sem depender do leilão físico e sem desperdiçar recursos com deslocamento. Apresente seu gado com padrão e alcance regional.

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

      {/* Scroll indicator */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 1.5
    }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <motion.div animate={{
          y: [0, 12, 0]
        }} transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }} className="w-1.5 h-1.5 rounded-full bg-white/60" />
        </div>
      </motion.div>
    </section>;
};
export default Hero;