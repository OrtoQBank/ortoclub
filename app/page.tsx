import Header from './components/header';
import HeroSection from './components/hero-section';
import ProductsSection from './components/products-section';
import MethodologySection from './components/methodology-section';
import TeamSection from './components/team-section';
import FaqSection from './components/faq-section';
import Footer from './components/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProductsSection />
        <MethodologySection />
        <TeamSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
