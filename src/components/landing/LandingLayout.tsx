import { ReactNode } from 'react';
import logoHorizontal from '@/assets/logo-horizontal2.png';

interface LandingLayoutProps {
  children: ReactNode;
  bgClass?: string;
}

const LandingLayout = ({ children, bgClass = 'bg-background' }: LandingLayoutProps) => {
  return (
    <div className={`min-h-screen ${bgClass} flex flex-col`}>
      <header className="py-6 px-4 flex justify-center">
        <img
          src={logoHorizontal}
          alt="CNB - Conexão Norte Bovino"
          className="h-12 object-contain"
        />
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {children}
        </div>
      </main>
      <footer className="py-4 text-center text-xs opacity-50 px-4">
        © {new Date().getFullYear()} Conexão Norte Bovino — Todos os direitos reservados
      </footer>
    </div>
  );
};

export default LandingLayout;
