import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import LotesSection from '@/components/LotesSection';
import PartnersSection from '@/components/PartnersSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import HubSolucoesSection from '@/components/HubSolucoesSection';
import DiferenciaisSection from '@/components/DiferenciaisSection';
import ReferralSection from '@/components/ReferralSection';
import SellerForm from '@/components/SellerForm';
import AboutSection from '@/components/AboutSection';
import MissionVisionValuesSection from '@/components/MissionVisionValuesSection';
import TabelaPrecosSection from '@/components/TabelaPrecosSection';
import NewsSection from '@/components/NewsSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import EmBreve from '@/components/EmBreve';
import { SHOW_EM_BREVE } from '@/config/emBreve';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import BackToTop from '@/components/BackToTop';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroCarousel />
      <LotesSection />
      <PartnersSection />
      <HowItWorksSection />
      <HubSolucoesSection />
      <DiferenciaisSection />
      <ReferralSection />
      <SellerForm />
      <AboutSection />
      <MissionVisionValuesSection />
      <TabelaPrecosSection />
      <NewsSection />
      <FAQSection />
      <Footer />
      {SHOW_EM_BREVE && <EmBreve />}
      <FloatingWhatsApp />
      <BackToTop />
    </div>
  );
};

export default Index;
