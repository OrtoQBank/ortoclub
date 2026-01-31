
import HeroSection from './components/hero-section';
import ProductsSection from './components/products-section';
import MethodologySection from './components/methodology-section';
import TeamSection from './components/team-section';
import FaqSection from './components/faq-section';


export default function Home() {
  return (
    <div className="min-h-screen bg-background">

      <main>
        <HeroSection />
        <ProductsSection />
        <MethodologySection />
        <TeamSection />
        <FaqSection />
      </main>

    </div>
  );
}
