
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
      <footer className="bg-brand-blue mt-auto py-4 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 OrtoQBank. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
