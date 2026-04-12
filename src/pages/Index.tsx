import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import LotesSection from '@/components/LotesSection';
import PartnersSection from '@/components/PartnersSection';
import AboutSection from '@/components/AboutSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import MissionVisionValuesSection from '@/components/MissionVisionValuesSection';
import DiferenciaisSection from '@/components/DiferenciaisSection';
import ReferralSection from '@/components/ReferralSection';
import TabelaPrecosSection from '@/components/TabelaPrecosSection';
import SellerForm from '@/components/SellerForm';
import FAQSection from '@/components/FAQSection';
import NewsSection from '@/components/NewsSection';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import BackToTop from '@/components/BackToTop';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroCarousel />
      <LotesSection />
      <PartnersSection />
      <AboutSection />
      <HowItWorksSection />
      <DiferenciaisSection />
      <ReferralSection />
      <MissionVisionValuesSection />
      <SellerForm />
      <NewsSection />
      <TabelaPrecosSection />
      <FAQSection />
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
    </div>
  );
};

export default Index;
