import { CheckCircle2 } from 'lucide-react';
import LeadCaptureButton from '@/app/components/lead-capture-button';

export default function Cta2Section() {
  return (
    <section className="py-12 md:py-20 px-4 bg-blue-50">
      <div className="container mx-auto">
        <div className="mx-auto max-w-4xl">
          {/* Headline */}
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            Por que o OrtoClub TEOT é diferente?
          </h2>

          {/* Diferenciais */}
          <div className="space-y-6">
            {/* Diferencial 1 */}
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-brand-blue w-6 h-6 mt-1 shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Time com mais de 10 especialistas da USP
                </h3>
                <p className="text-gray-600">
                  Professores que atuam na assistência, na pesquisa e no ensino médico — e sabem como ensinar Ortopedia.
                </p>
              </div>
            </div>

            {/* Diferencial 2 */}
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-brand-blue w-6 h-6 mt-1 shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Cobertura completa de todos os temas do TEOT
                </h3>
                <p className="text-gray-600">
                  Do básico ao avançado, sem lacunas e sem excesso irrelevante.
                </p>
              </div>
            </div>

            {/* Diferencial 3 */}
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-brand-blue w-6 h-6 mt-1 shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Método orientado à prática e à prova
                </h3>
                <p className="text-gray-600">
                  Aulas objetivas, com foco no que realmente cai e como a banca pensa.
                </p>
              </div>
            </div>

            {/* Diferencial 4 */}
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-brand-blue w-6 h-6 mt-1 shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Formação + treinamento para aprovação
                </h3>
                <p className="text-gray-600">
                  Conteúdo que prepara você para ser um ortopedista melhor e, ao mesmo tempo, passar no TEOT.
                </p>
              </div>
            </div>

            {/* Diferencial 5 */}
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-brand-blue w-6 h-6 mt-1 shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Resultado comprovado
                </h3>
                <p className="text-gray-600">
                  Método validado com 1º, 4º e 7º lugares no TEOT.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-12 text-center">
            <LeadCaptureButton
              produto="TEOT Aulas"
              redirectUrl="" // Intentional: no product/checkout page yet; user stays on page with success state
              className="inline-flex items-center justify-center rounded-lg bg-brand-blue px-8 py-4 text-white font-semibold text-lg shadow-md hover:opacity-95 transition"
            >
              Garantir minha aprovação
            </LeadCaptureButton>
          </div>

          {/* Linha divisória */}
          <div className="mt-12 h-px w-full bg-border" />
        </div>
      </div>
    </section>
  );
}
