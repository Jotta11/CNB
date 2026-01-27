import Header from '@/components/Header';
import Hero from '@/components/Hero';
import LotesSection from '@/components/LotesSection';
import PartnersSection from '@/components/PartnersSection';
import AboutSection from '@/components/AboutSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import MissionVisionValuesSection from '@/components/MissionVisionValuesSection';
import SellerForm from '@/components/SellerForm';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import BackToTop from '@/components/BackToTop';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <LotesSection />
      <PartnersSection />
      <AboutSection />
      <HowItWorksSection />
      <MissionVisionValuesSection />
      <SellerForm />
      <FAQSection />
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
    </div>
  );
};

export default Index;
