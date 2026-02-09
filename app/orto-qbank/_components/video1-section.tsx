import { CheckCircle2, FileText, Smartphone, Lightbulb, BarChart3, BookOpen } from 'lucide-react';

export default function Video1Section() {
  return (
    <>
      <section className="py-8 md:py-12 px-4 bg-white">
        <div className="container mx-auto">
          <div className="mx-auto max-w-5xl">
            {/* Título e introdução */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-brand-blue mb-4">
                Estudo estratégico baseado em questões reais do TEOT
              </h2>
              <div className="max-w-3xl mx-auto space-y-4">
                <p className="text-gray-900/90 leading-relaxed">
                  Esqueça os livros e noites de estudo desorganizadas! No OrtoQBank, você não estuda por volume aleatório.
                </p>
                <p className="text-gray-900/90 leading-relaxed">
                  Você treina com questões no padrão oficial da banca SBOT, organizadas por tema e subespecialidade, em uma plataforma própria interativa, criada para acelerar aprendizado e evitar desperdício de tempo.
                </p>
                <p className="text-gray-900/90 leading-relaxed">
                  Cada etapa do estudo foi desenhada por quem viveu a prova e ficou em <span className="text-brand-blue font-semibold">1º lugar no TEOT 2025</span>.
                </p>
              </div>
            </div>

            {/* VIDEO */}
            <div className="max-w-3xl mx-auto mb-8">
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
                <p className="text-center text-sm text-gray-900 mb-4">
                  Assista e entenda como o QBank vai transformar sua preparação
                </p>
                <a
                  href="https://ortoqbank.ortoclub.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-blue/90 transition"
                >
                  Quero começar minha preparação para o TEOT
                </a>
              </div>
            </div>

            {/* Pilares da metodologia */}
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl md:text-2xl font-bold text-brand-blue text-center mb-6">
                Pilares da metodologia OrtoClub
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Pilar 1 */}
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-brand-blue w-6 h-6 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-gray-900 font-semibold mb-1">Questões práticas e comentadas em profundidade</h4>
                    <p className="text-gray-900/80 text-sm leading-relaxed">
                      Mais de 4.000 questões, com comentários aprofundados, elaborados por especialistas da USP. Aprenda por questões e vença na prova!
                    </p>
                  </div>
                </div>

                {/* Pilar 2 */}
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-brand-blue w-6 h-6 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-gray-900 font-semibold mb-1">Simulados no formato real do TEOT</h4>
                    <p className="text-gray-900/80 text-sm leading-relaxed">
                      Treine ritmo, tomada de decisão e resistência mental com simulados que reproduzem fielmente a prova.
                    </p>
                  </div>
                </div>

                {/* Pilar 3 */}
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-brand-blue w-6 h-6 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-gray-900 font-semibold mb-1">Provas antigas</h4>
                    <p className="text-gray-900/80 text-sm leading-relaxed">
                      Mais de 20 edições das provas do TARO e TEOT prévias. Conheça o padrão da banca e não seja surpreendido no dia final.
                    </p>
                  </div>
                </div>

                {/* Pilar 4 */}
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-brand-blue w-6 h-6 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-gray-900 font-semibold mb-1">Área de feedback e acompanhamento contínuo</h4>
                    <p className="text-gray-900/80 text-sm leading-relaxed">
                      Entenda por que errou, evite repetir padrões de erro e evolua de forma mensurável ao longo da preparação.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE CARDS */}
      <section className="py-8 md:py-12 px-4 bg-blue-50">
        <div className="container mx-auto">
          <div className="mx-auto max-w-6xl">
            {/* Primeira linha - 3 cards */}
            <div className="grid gap-6 md:grid-cols-3 mb-6">
              {/* Card 1 - Banco de Questões Completo */}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-7 h-7 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-blue mb-3">Banco de Questões Completo</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Um banco de questões completo com gabaritos direcionados por especialistas da USP, baseados na bibliografia da SBOT mas com os insights diferenciais dos professores.
                  </p>
                </div>
              </div>

              {/* Card 2 - Plataforma Responsiva */}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <Smartphone className="w-7 h-7 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-blue mb-3">Plataforma Responsiva</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Plataforma responsiva para computador, tablet e celular, permitindo que você estude em qualquer lugar e a qualquer momento.
                  </p>
                </div>
              </div>

              {/* Card 3 - Desempenho Garantido */}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Lightbulb className="w-7 h-7 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-blue mb-3">Desempenho Garantido</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Aprenda enquanto faz questões e alcance o desempenho de 80% na prova do TEOT e TEPOT!
                  </p>
                </div>
              </div>
            </div>

            {/* Segunda linha - 2 cards centralizados */}
            <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
              {/* Card 4 - Análise de Desempenho */}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="w-7 h-7 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-blue mb-3">Análise de Desempenho</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Acompanhe seu progresso com estatísticas detalhadas e identifique áreas que precisam de mais atenção para maximizar seu aprendizado.
                  </p>
                </div>
              </div>

              {/* Card 5 - Conteúdo Atualizado */}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-7 h-7 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-blue mb-3">Conteúdo Atualizado</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Material constantemente atualizado de acordo com as referências bibliográficas da SBOT e com as novas provas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
