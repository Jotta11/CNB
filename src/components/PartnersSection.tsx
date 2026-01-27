import { motion } from 'framer-motion';
import { usePartners } from '@/hooks/usePartners';
import { ExternalLink } from 'lucide-react';

const PartnersSection = () => {
  const { partners, isLoading } = usePartners();

  if (isLoading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-pulse flex gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-32 h-16 bg-muted rounded-lg" />
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
    <section className="py-12 md:py-16 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary font-semibold rounded-full text-sm mb-3">
            PARCEIROS
          </span>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">
            Empresas Parceiras
          </h2>
        </motion.div>

        <div className="relative">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-6 md:gap-10"
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
                whileHover={{ scale: 1.05 }}
                className="group relative bg-card rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center min-w-[140px] h-20"
              >
                <img
                  src={partner.logo_url}
                  alt={partner.nome}
                  className="max-h-12 max-w-[120px] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                  <span className="text-primary-foreground text-sm font-medium flex items-center gap-1">
                    Visitar <ExternalLink size={14} />
                  </span>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
