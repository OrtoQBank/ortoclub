import Image from 'next/image';
import Link from "next/link";
export default function Cta1Section() {
    return (
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-6 md:gap-8 md:grid-cols-3">
              {/* CARD IMAGEM ESQUERDA */}
              <div className="md:col-span-1">
                <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                  <div className="aspect-3/4 relative">
                  
                    <Image
                      src="/produto_a.webp"
                      alt="Método de estudo OrtoClub"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <p className="text-base text-center pb-2">
                      + de 4000 questões comentadas por especialistas da USP
                    </p>
              </div> 
              
  
              {/* CTA CENTRAL */}
              <div className="md:col-span-1 flex flex-col items-center justify-center text-center py-8">
                
                <div className="mt-8">
                  <Link
                href="/orto-qbank"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-primary-foreground font-semibold text-lg shadow-md hover:opacity-95 transition"
            >
              Comprar Produto Ortoqbank
          </Link>
                </div>

              
              </div>
  
              {/* CARD IMAGEM DIREITA */}
              <div className="md:col-span-1">
                <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                  <div className="aspect-3/4 relative">
                    <Image
                      src="/produto_b.webp"
                      alt="Plataforma OrtoClub QBank"
                      fill
                      className="object-contain"  
                    />
                  </div>
                </div>
                <p className="text-base text-center pb-2">
                Simulados e trilhas personalizadas!
                    </p>
              </div>
            </div>
  
            {/* espacinho final como no wireframe */}
            <div className="mt-10 h-px w-full bg-border" />
          </div>
        </div>
      </section>
    );
  }
  