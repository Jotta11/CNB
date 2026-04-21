import { motion } from 'framer-motion';
import { Lock, Cpu, Network, BarChart3, ShieldCheck, Satellite } from 'lucide-react';

const features = [
  { icon: BarChart3, label: 'Análise de Mercado' },
  { icon: Network, label: 'Rede de Conexões' },
  { icon: ShieldCheck, label: 'Garantia de Operação' },
  { icon: Cpu, label: 'Gestão Inteligente' },
  { icon: Satellite, label: 'Monitoramento' },
  { icon: Lock, label: 'Acesso Exclusivo' },
];

const HubSolucoesSection = () => {
  return (
    <section className="py-20 bg-secondary relative overflow-hidden">
      {/* Tech grid background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Crect x='0' y='0' width='40' height='40'/%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-5xl md:text-7xl text-white tracking-wider mb-4">
            HUB DE SOLUÇÕES <span className="text-accent">CNB</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Um hub de soluções estratégicas e funcionais para os pecuaristas.
          </p>
        </motion.div>

        {/* Cards + blur overlay */}
        <div className="relative max-w-3xl mx-auto">
          {/* Cards (blurred behind overlay) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 select-none pointer-events-none">
            {features.map((item, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center gap-3 text-center"
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-white/30" />
                </div>
                <p className="text-white/30 text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Blur overlay */}
          <div className="absolute inset-0 backdrop-blur-md bg-secondary/60 rounded-2xl flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4 text-center px-6"
            >
              <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center mb-2">
                <Lock className="w-6 h-6 text-accent" />
              </div>
              <span className="inline-flex items-center gap-2 bg-accent/20 text-accent text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase border border-accent/30">
                <Cpu className="w-3.5 h-3.5" />
                Em Desenvolvimento
              </span>
              <p className="font-display text-3xl md:text-4xl text-white tracking-wider">
                EM BREVE
              </p>
              <p className="text-white/50 text-sm max-w-xs">
                Ferramentas estratégicas e funcionais chegando para transformar a forma de operar no agronegócio.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HubSolucoesSection;
