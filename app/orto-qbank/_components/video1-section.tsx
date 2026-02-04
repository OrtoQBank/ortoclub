import { CheckCircle2 } from 'lucide-react';

export default function Video1Section() {
  return (
    <section className="py-12 md:py-20 px-4 bg-blue-50">
      <div className="container mx-auto">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            {/* BLOCO ESQUERDO - Nossa metodologia */}
            <div className="lg:col-span-3 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-3 text-brand-blue">Nossa metodologia</h2>
                <p className="text-muted-foreground leading-relaxed ">
                  Estudo direcionado com questões reais e simulados que replicam o formato da prova TEOT.
                </p>
              </div>
              <ul className="space-y-3 text-brand-blue">
                <li className="flex items-start gap-2 ">
                  <CheckCircle2 className=" w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm">Foco total em questões práticas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className=" w-5 h-5 text-primary mt-0.5 shrink-0" />
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
              <div className="aspect-video overflow-hidden rounded-xl shadow-xl drop-shadow-2xl bg-card">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://imagekit.io/player/embed/4hmtj9yu8/VID-20251008-WA0049-min.mp4?controls=true&autoplay=false&loop=false&background=%23000000"
                  title="Conheça o OrtoClub QBank TEOT"
                  sandbox="allow-scripts allow-same-origin"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  loading="lazy"
                  className="h-full w-full"
                />

              </div>
              <div className="mt-4 flex flex-col items-center">
                <p className="text-center text-sm text-brand-blue mb-4">
                  Assista e entenda como o QBank vai transformar sua preparação
                </p>

                <a
                  href="https://ortoqbank.ortoclub.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-blue text-white border-4 border-brand-blue px-6 py-2 rounded-lg font-semibold hover:bg-brand-blue/90"
                >
                  Garantir Acesso
                </a>
              </div>
            </div>



            {/* BLOCO DIREITO - O que você vai conquistar */}
            <div className="lg:col-span-3 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-3 text-brand-blue">O que você vai conquistar</h2>
                <p className="text-muted-foreground leading-relaxed ">
                  Mais do que estudar, você vai desenvolver confiança e consistência para o dia da prova.
                </p>
              </div>
              <ul className="space-y-3 text-brand-blue">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className=" w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm">Clareza sobre seus pontos fracos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className=" w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm">Velocidade na resolução</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-blue mt-0.5 shrink-0" />
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
