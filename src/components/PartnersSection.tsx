import { motion } from 'framer-motion';
import { usePartners } from '@/hooks/usePartners';
import { ExternalLink } from 'lucide-react';

const PartnersSection = () => {
  const { partners, isLoading } = usePartners();

  if (isLoading) {
    return (
      <section className="gradient-hero py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-pulse flex gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-32 h-16 bg-white/10 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!partners || partners.length === 0) {
    return null;
  }

  return (
    <section className="gradient-hero relative py-12 md:py-16 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="inline-block px-4 py-1 bg-white/10 text-white font-semibold rounded-full text-sm mb-3">
            PARCEIROS
          </span>
          <h2 className="font-display text-2xl md:text-3xl text-white">
            Empresas Parceiras
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-6 md:gap-8"
        >
          {partners.map((partner, index) => (
            <motion.a
              key={partner.id}
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.08, y: -4 }}
              className="group relative bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center min-w-[140px] h-20"
            >
              <img
                src={partner.logo_url}
                alt={partner.nome}
                className="max-h-12 max-w-[120px] object-contain transition-all duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-primary/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                <span className="text-white text-sm font-medium flex items-center gap-1">
                  Visitar <ExternalLink size={14} />
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;
