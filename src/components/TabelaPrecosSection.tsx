import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight, Lock, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const tableImg = '/WhatsApp Image 2026-03-31 at 15.21.17.jpeg';

const TabelaPrecosSection = () => {
  return (
    <section className="py-20 bg-secondary relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Imagem esmaecida */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full max-w-sm mx-auto lg:mx-0"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
              <img
                src={tableImg}
                alt="Tabela de Preços CNB"
                className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
              />
              <div className="absolute inset-0 bg-black/55" />
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 space-y-3">
                <Lock className="w-10 h-10 text-accent" />
                <p className="font-display text-2xl text-white tracking-wider">
                  Tabela desta semana
                </p>
                <p className="text-white/60 text-sm">Cadastre-se para desbloquear</p>
              </div>
            </div>
          </motion.div>

          {/* Texto + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 text-center lg:text-left"
          >
            <span className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 text-accent text-xs font-bold px-3 py-1.5 rounded-full mb-4 tracking-widest uppercase">
              <TrendingUp className="w-4 h-4" />
              Gratuito · Toda semana
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wider mb-4">
              TABELA DE <span className="text-accent">PREÇOS</span>
            </h2>
            <p className="text-white/80 text-lg max-w-xl leading-relaxed mb-8">
              Receba toda semana os preços atualizados do mercado bovino diretamente
              no seu e-mail. Machos, fêmeas, peso e valor por cabeça — sem custo,
              sem compromisso.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold text-lg group">
              <Link to="/precos" className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                QUERO RECEBER
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default TabelaPrecosSection;
