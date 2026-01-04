import { MapPin, Phone } from 'lucide-react';
import logoVertical from '@/assets/logo-vertical.svg';

const navLinks = [
  { label: 'Início', href: '#inicio' },
  { label: 'Lotes', href: '#lotes' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Vender', href: '#vender' },
  { label: 'FAQ', href: '#faq' },
];

const Footer = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-primary py-12 md:py-16">
      <div className="container mx-auto px-4 text-center">
        {/* Logo */}
        <img
          src={logoVertical}
          alt="Conexão Norte Bovino"
          className="h-20 md:h-24 mx-auto mb-6"
        />

        {/* Info */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8 text-white/80">
          <div className="flex items-center gap-2">
            <MapPin size={18} />
            <span>Região MATOPIBA</span>
          </div>
          <a
            href="https://wa.me/556399262816"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Phone size={18} />
            <span>+55 63 99262-8916</span>
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Divider */}
        <div className="w-full max-w-md mx-auto h-px bg-white/10 mb-6" />

        {/* Copyright */}
        <p className="text-white/50 text-sm mb-2">
          © 2025 Conexão Norte Bovino - Todos os direitos reservados
        </p>
        <p className="text-white/40 text-xs">
          Curadoria especializada para negociações com confiança
        </p>
      </div>
    </footer>
  );
};

export default Footer;
