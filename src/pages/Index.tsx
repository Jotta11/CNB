import Header from '@/components/Header';
import Hero from '@/components/Hero';
import LotesSection from '@/components/LotesSection';
import StatsSection from '@/components/StatsSection';
import AboutSection from '@/components/AboutSection';
import SellerForm from '@/components/SellerForm';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <LotesSection />
      <StatsSection />
      <AboutSection />
      <SellerForm />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
