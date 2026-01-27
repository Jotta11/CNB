import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import logoHorizontal from '@/assets/logo-horizontal.svg';

const navLinks = [
  { label: 'Início', href: '#inicio' },
  { label: 'Lotes', href: '#lotes' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Vender', href: '#vender' },
  { label: 'FAQ', href: '#faq' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (!isHomePage) {
      navigate('/' + href);
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-primary shadow-lg' : 'bg-primary'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a 
          href="#inicio" 
          onClick={(e) => handleNavClick(e, '#inicio')}
          className="flex items-center gap-3"
        >
          <img 
            src={logoHorizontal} 
            alt="Conexão Norte Bovino" 
            className="h-10 md:h-12 w-auto"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-white/90 hover:text-white font-medium transition-colors duration-200 text-sm tracking-wide"
            >
              {link.label}
            </a>
          ))}
          
          {user ? (
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-white/90 hover:text-white hover:bg-white/10 gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          ) : (
            <Link to="/auth">
              <Button
                variant="outline"
                className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white gap-2"
              >
                <User className="w-4 h-4" />
                Entrar
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-primary border-t border-white/10 py-4">
          <div className="container mx-auto px-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-white/90 hover:text-white font-medium transition-colors duration-200 py-2"
              >
                {link.label}
              </a>
            ))}
            
            {user ? (
              <button
                onClick={handleSignOut}
                className="text-white/90 hover:text-white font-medium transition-colors duration-200 py-2 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/90 hover:text-white font-medium transition-colors duration-200 py-2 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Entrar / Cadastrar
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
