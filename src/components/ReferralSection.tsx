import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const ReferralSection = () => {
  return (
    <section className="min-h-[480px] gradient-hero relative overflow-hidden flex items-center">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* Suspense overlay */}
      <div className="absolute inset-0 backdrop-blur-lg bg-primary/75 z-20 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4 text-center px-6"
        >
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-2">
            <Lock className="w-7 h-7 text-white/70" />
          </div>
          <span className="inline-block bg-accent text-white font-display text-sm tracking-[0.3em] px-6 py-2 rounded-full shadow-lg">
            EM BREVE
          </span>
          <p className="font-display text-5xl md:text-7xl text-white tracking-wide leading-none">
            INDICAÇÃO<br />CONECTADA
          </p>
          <p className="text-white/60 text-sm md:text-base max-w-sm">
            O programa de indicação CNB está sendo estruturado. Fique de olho!
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ReferralSection;
