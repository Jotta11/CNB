import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const AboutSection = () => {
  const { settings } = useSiteSettings();
  const aboutImage = settings.about_image;

  return (
    <section id="sobre" className="py-12 md:py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Hero Card - Quem Somos */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl">
            {/* Left - Image/Art Area */}
            <div className="relative bg-primary min-h-[400px] lg:min-h-[500px] flex items-center justify-center overflow-hidden">
              {aboutImage ? (
                <>
                  <img 
                    src={aboutImage} 
                    alt="Quem Somos" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Overlay with text */}
                  <div className="absolute inset-0 bg-primary/60" />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative z-10 text-center p-8"
                  >
                    <span className="text-primary-foreground/80 text-sm font-medium tracking-widest uppercase mb-4 block">
                      Conexão Norte Bovino
                    </span>
                    <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-primary-foreground leading-tight drop-shadow-lg">
                      Quem<br />Somos
                    </h2>
                    <div className="mt-6 w-16 h-1 bg-primary-foreground/60 mx-auto rounded-full" />
                  </motion.div>
                </>
              ) : (
                <>
                  {/* Decorative elements - fallback when no image */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 border-2 border-primary-foreground rounded-full" />
                    <div className="absolute bottom-20 right-20 w-48 h-48 border-2 border-primary-foreground rounded-full" />
                    <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-primary-foreground rounded-full" />
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative z-10 text-center p-8"
                  >
                    <span className="text-primary-foreground/60 text-sm font-medium tracking-widest uppercase mb-4 block">
                      Conexão Norte Bovino
                    </span>
                    <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-primary-foreground leading-tight">
                      Quem<br />Somos
                    </h2>
                    <div className="mt-6 w-16 h-1 bg-primary-foreground/40 mx-auto rounded-full" />
                  </motion.div>
                </>
              )}
            </div>

            {/* Right - Content */}
            <div className="bg-card p-8 lg:p-12 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-6"
              >
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Uma plataforma do <span className="text-foreground font-medium">MATOPIBA</span> criada 
                  para aproximar compradores e vendedores de gado com mais confiança, agilidade e critério.
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  Unimos curadoria de lotes, padronização de informações e atendimento direto 
                  para transformar negociação em fechamento.
                </p>

                <div className="pt-4 border-t border-border">
                  <p className="text-foreground font-medium italic">
                    "Facilitar negociações transparentes e eficientes, maximizando 
                    oportunidades para todos no mercado pecuário."
                  </p>
                </div>

                <a 
                  href="#lotes" 
                  className="inline-flex items-center gap-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group mt-4"
                >
                  Ver lotes disponíveis
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
