import { motion } from 'framer-motion';
import { Handshake, ArrowRight, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const ReferralSection = () => {
  return (
    <section className="py-20 gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left"
          >
            <span className="inline-block bg-white/10 text-primary-light text-xs font-bold px-3 py-1.5 rounded-full mb-4 tracking-widest uppercase backdrop-blur-sm border border-white/10">
              Geração de Oportunidades
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wider mb-4">
              INDICAÇÃO <span className="text-primary-light">CONECTADA</span>
            </h2>
            <p className="text-white/80 text-lg max-w-xl leading-relaxed mb-8">
              Indique oportunidades reais de negócio na pecuária e receba 1% de
              comissão sobre operações convertidas. A CNB conduz a operação com
              critério, padrão e acompanhamento comercial.
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-primary-light font-bold text-lg group">
              <Link to="/indicacao-conectada" className="flex items-center gap-3">
                <Handshake className="w-5 h-5" />
                SAIBA MAIS
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 grid grid-cols-2 gap-4 w-full max-w-md"
          >
            {[
              { icon: Handshake, value: '1%', label: 'de comissão por venda convertida' },
              { icon: TrendingUp, value: 'Demanda', label: 'ou oferta imediata e futura' },
              { icon: Users, value: 'Categoria', label: 'e número de cabeças informados' },
              { icon: ArrowRight, value: 'Zero', label: 'custo para participar' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 text-center">
                <item.icon className="w-6 h-6 text-primary-light mx-auto mb-2" />
                <p className="font-display text-xl text-white">{item.value}</p>
                <p className="text-white/60 text-xs mt-1">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReferralSection;
