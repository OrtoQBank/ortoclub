import Image from 'next/image';
import Link from "next/link";

export default function Cta1Section() {
    return (
      <section className="py-12 md:py-20 px-4 bg-[#f8fafc]">
        <div className="container mx-auto">
          <div className="mx-auto max-w-6xl">
            {/* Headline */}
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
              Você escolhe como estudar. O OrtoClub cuida do resto.
            </h2>

            {/* BLOCO 1 - Crie testes personalizados */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center mb-16">
              {/* Imagem */}
              <div className="w-full md:w-2/5 shrink-0">
                <div className="aspect-[3/4] relative">
                  <Image
                    src="/B.png"
                    alt="Crie testes personalizados"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              {/* Conteúdo */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Crie testes personalizados em segundos
                </h3>
                <p className="text-gray-600 mb-5 text-lg">
                  Monte seus treinos escolhendo entre mais de 4000 questões:
                </p>
                <ul className="space-y-3 text-gray-700 text-lg">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-brand-blue rounded-full shrink-0"></span>
                    Temas, subtemas e grupos
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-brand-blue rounded-full shrink-0"></span>
                    Quantidade de questões
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-brand-blue rounded-full shrink-0"></span>
                    Modo estudo ou simulado
                  </li>
                </ul>
              </div>
            </div>

            {/* BLOCO 2 - Simulados e trilhas */}
            <div className="flex flex-col md:flex-row-reverse gap-8 md:gap-12 items-center mb-12">
              {/* Imagem */}
              <div className="w-full md:w-2/5 shrink-0">
                <div className="aspect-[3/4] relative">
                  <Image
                    src="/c.png"
                    alt="Simulados e trilhas inteligentes"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              {/* Conteúdo */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Simulados e trilhas inteligentes de estudo
                </h3>
                <p className="text-gray-600 mb-2 text-lg">
                  Não sabe por onde começar?
                </p>
                <p className="font-medium text-gray-800 mb-6 text-lg">
                  O OrtoQBank organiza o caminho para você.
                </p>
                <div className="space-y-5">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">Simulados completos no formato TEOT</h4>
                    <p className="text-gray-500">Treine tempo, estratégia e tomada de decisão.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">Trilhas por subespecialidade e temas</h4>
                    <p className="text-gray-500">Avance de forma lógica, progressiva e orientada.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Link
                href="https://ortoqbank.ortoclub.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-brand-blue px-8 py-4 text-white font-semibold text-lg shadow-md hover:opacity-95 transition"
              >
                Quero fazer parte
              </Link>
            </div>

            {/* Linha divisória */}
            <div className="mt-12 h-px w-full bg-border" />
          </div>
        </div>
      </section>
    );
  }
