import { BookOpen, Target, BarChart3, Clock } from 'lucide-react';
import Image from 'next/image';
import LeadFormDialog from '@/app/components/lead-form-dialog';

export default function Hero1Section() {
  return (
    <section className="mt-24 py-12 md:py-20 px-4 bg-blue-50">
      <div className="container mx-auto">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-10 md:grid-cols-5">
            {/* ESQUERDA: título + descrição */}
            <div className="md:col-span-3 space-y-6">
              <div className="space-y-2">
                <span className="text-sm font-medium text-brand-blue uppercase tracking-wider">
                  Preparação TEOT
                </span>
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                  OrtoQBank - Preparação que aprova
                </h1>
              </div>

              <p className="text-lg leading-relaxed text-muted-foreground max-w-2xl">
                Banco de questões 100% focado na prova do TEOT/TEPOT, desenvolvido por especialistas da USP que já se diferenciaram na prova!

                Treine em uma plataforma própria e interativa, com comentários aprofundados, análise de desempenho e testes personalizados.

              </p>

              {/* Benefícios em bullets */}
              <div className="grid gap-4 sm:grid-cols-2 mb-16">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">+4.000 questões comentadas</h3>
                    <p className="text-sm text-muted-foreground">Comentários didáticos, completos e ilustrados, elaborados por especialistas da USP</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Plataforma própria interativa</h3>
                    <p className="text-sm text-muted-foreground">Experiência fluida no computador, tablet ou celular, com métricas reais de desempenho</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Análise de desempenho avançada</h3>
                    <p className="text-sm text-muted-foreground">Identifique pontos fracos!</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Resultado comprovado</h3>
                    <p className="text-sm text-muted-foreground">Método validado por aprovação em 1º lugar no TEOT 2025</p>
                  </div>
                </div>
              </div>

              <LeadFormDialog
                productSlug="orto-qbank"
                productDisplayName="OrtoQBank"
                buttonText="Quero assinar o OrtoQBank"
                buttonClassName="inline-flex items-center justify-center font-semibold bg-brand-blue text-white py-3 px-8 rounded-lg hover:bg-brand-blue/90 transition"
              />

            </div>

            {/* DIREITA: card com imagem do produto */}
            <div className="md:col-span-2">
              <div className="flex justify-center lg:col-span-8">
                <div className="w-full max-w-[800px]">
                  <Image
                    src="/produto_1.webp"
                    alt="OrtoQBank plataforma em múltiplos dispositivos mostrando questões e estatísticas"
                    width={800}
                    height={600}
                    priority
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
