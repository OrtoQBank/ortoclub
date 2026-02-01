import Image from 'next/image';

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
                      src="/mao-qbank.jpeg"
                      alt="Método de estudo OrtoClub"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
  
              {/* CTA CENTRAL */}
              <div className="md:col-span-1 flex flex-col items-center justify-center text-center py-8">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Pronto para começar?
                </h2>

                <p className="mt-3 text-muted-foreground text-lg max-w-md">
                  Entre na lista de espera e receba em primeira mão as datas, condições e vagas disponíveis.
                </p>
  
                <div className="mt-8">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-primary-foreground font-semibold text-lg shadow-md hover:opacity-95 transition"
                  >
                    Entrar na lista de espera
                  </a>
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  Sem compromisso. Você será avisado quando abrirmos novas vagas.
                </p>
              </div>
  
              {/* CARD IMAGEM DIREITA */}
              <div className="md:col-span-1">
                <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                  <div className="aspect-3/4 relative">
                    <Image
                      src="/ortoqbank.jpeg"
                      alt="Plataforma OrtoClub QBank"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
  
            {/* espacinho final como no wireframe */}
            <div className="mt-10 h-px w-full bg-border" />
          </div>
        </div>
      </section>
    );
  }
  