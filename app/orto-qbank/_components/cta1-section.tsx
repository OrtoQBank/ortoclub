import Image from 'next/image';
import LeadCaptureButton from '@/app/components/lead-capture-button';

export default function Cta1Section() {
  return (
    <section className="py-12 md:py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="mx-auto max-w-6xl">
          {/* Headline */}
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
            Você escolhe como estudar. O OrtoClub cuida do resto.
          </h2>

          {/* Grid horizontal com os dois blocos lado a lado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
            {/* BLOCO 1 - Crie testes personalizados */}
            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col">
              {/* Imagem */}
              <div className="w-full h-48 md:h-56 relative mb-5">
                <Image
                  src="/B.png"
                  alt="Crie testes personalizados"
                  fill
                  className="object-contain"
                />
              </div>
              {/* Conteúdo */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Crie testes personalizados em segundos
                </h3>
                <p className="text-gray-600 mb-4">
                  Monte seus treinos escolhendo entre mais de 4000 questões:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-brand-blue rounded-full shrink-0"></span>
                    Temas, subtemas e grupos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-brand-blue rounded-full shrink-0"></span>
                    Quantidade de questões
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-brand-blue rounded-full shrink-0"></span>
                    Modo estudo ou simulado
                  </li>
                </ul>
              </div>
            </div>

            {/* BLOCO 2 - Simulados e trilhas */}
            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col">
              {/* Imagem */}
              <div className="w-full h-48 md:h-56 relative mb-5">
                <Image
                  src="/c.png"
                  alt="Simulados e trilhas inteligentes"
                  fill
                  className="object-contain"
                />
              </div>
              {/* Conteúdo */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Simulados e trilhas inteligentes de estudo
                </h3>
                <p className="text-gray-600 mb-1">
                  Não sabe por onde começar?
                </p>
                <p className="font-medium text-gray-800 mb-4">
                  O OrtoQBank organiza o caminho para você.
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">Simulados completos no formato TEOT</h4>
                    <p className="text-gray-500 text-sm">Treine tempo, estratégia e tomada de decisão.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Trilhas por subespecialidade e temas</h4>
                    <p className="text-gray-500 text-sm">Avance de forma lógica, progressiva e orientada.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <LeadCaptureButton
              produto="OrtoQbank"
              redirectUrl="https://ortoqbank.ortoclub.com/"
              className="inline-flex items-center justify-center rounded-lg bg-brand-blue px-8 py-4 text-white font-semibold text-lg shadow-md hover:opacity-95 transition"
            >
              Quero fazer parte
            </LeadCaptureButton>
          </div>

          {/* Linha divisória */}
          <div className="mt-12 h-px w-full bg-border" />
        </div>
      </div>
    </section>
  );
}
