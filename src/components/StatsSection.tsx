import { motion } from 'framer-motion';

const stats = [
  { number: '5+', label: 'Anos de Experiência' },
  { number: '2000+', label: 'Animais Comercializados' },
  { number: '300+', label: 'Clientes Satisfeitos' },
  { number: '100%', label: 'MATOPIBA' },
];

const StatsSection = () => {
  return (
    <section className="py-16 md:py-20 gradient-hero">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
