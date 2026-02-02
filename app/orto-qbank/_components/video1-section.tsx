import { CheckCircle2 } from 'lucide-react';

export default function Video1Section() {
    return (
      <section className="py-12 md:py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-8 lg:grid-cols-12">
              {/* BLOCO ESQUERDO - Nossa metodologia */}
              <div className="lg:col-span-3 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Nossa metodologia</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Estudo direcionado com questões reais e simulados que replicam o formato da prova TEOT.
                  </p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">Foco total em questões práticas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">Revisão inteligente por tema</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">Padrão oficial da banca SBOT</span>
                  </li>
                </ul>
              </div>
  
              {/* VIDEO GRANDE - Central */}
              <div className="lg:col-span-6">
                <div className="aspect-video overflow-hidden rounded-xl shadow-xl border bg-card">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://imagekit.io/player/embed/4hmtj9yu8/VID-20251008-WA0049-min.mp4?controls=true&autoplay=false&loop=false&background=%23000000"
                    title="Conheça o OrtoClub QBank TEOT"
                    sandbox="allow-scripts allow-same-origin"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    loading="lazy"
                    className="h-full w-full"
                    style={{ border: 0 }}
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Assista e entenda como o QBank vai transformar sua preparação
                </p>
              </div>
  
              {/* BLOCO DIREITO - O que você vai conquistar */}
              <div className="lg:col-span-3 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">O que você vai conquistar</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Mais do que estudar, você vai desenvolver confiança e consistência para o dia da prova.
                  </p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">Clareza sobre seus pontos fracos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">Velocidade na resolução</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">Confiança no dia da prova</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
