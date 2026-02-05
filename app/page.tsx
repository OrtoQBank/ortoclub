import { Suspense } from 'react';
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
        <Suspense fallback={<ProductsSectionSkeleton />}>
          <ProductsSection />
        </Suspense>
        <MethodologySection />
        <TeamSection />
        <FaqSection />
      </main>
      <footer className="bg-brand-blue mt-auto py-4 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 OrtoClub. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function ProductsSectionSkeleton() {
  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto">
        <div className="mx-auto max-w-7xl">
          <div className="h-10 w-64 bg-gray-200 rounded mx-auto mb-8 md:mb-12 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="aspect-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
