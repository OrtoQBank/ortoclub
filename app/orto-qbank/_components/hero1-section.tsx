import { BookOpen, Target, BarChart3, Clock } from 'lucide-react';
import Image from 'next/image';

export default function Hero1Section() {
    return (
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-start gap-10 md:grid-cols-5">
              {/* ESQUERDA: título + descrição */}
              <div className="md:col-span-3 space-y-6">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">
                    Preparação TEOT
                  </span>
                  <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                    OrtoClub QBank TEOT
                  </h1>
                </div>
  
                <p className="text-lg leading-relaxed text-muted-foreground max-w-2xl">
                  Banco de questões comentadas com foco total na prova TEOT. Treine com questões no padrão da banca, revisão inteligente e análise de desempenho para aumentar suas chances de aprovação.
                </p>

                {/* Benefícios em bullets */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">+2.000 questões</h3>
                      <p className="text-sm text-muted-foreground">Comentadas por especialistas</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Padrão da banca</h3>
                      <p className="text-sm text-muted-foreground">Questões no formato TEOT</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Análise de desempenho</h3>
                      <p className="text-sm text-muted-foreground">Acompanhe sua evolução</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Revisão inteligente</h3>
                      <p className="text-sm text-muted-foreground">Foco nos pontos fracos</p>
                    </div>
                  </div>
                </div>
  
                {/* linhas/"detalhes" como no rabisco */}
                <div className="space-y-2 pt-2">
                  <div className="h-px w-full bg-border" />
                  <div className="h-px w-10/12 bg-border" />
                  <div className="h-px w-8/12 bg-border" />
                </div>
              </div>
  
              {/* DIREITA: card com imagem do produto */}
              <div className="md:col-span-2">
                <div className="w-full max-w-sm md:ml-auto rounded-xl border bg-card p-6 shadow-sm">
                  <div className="aspect-4/5 rounded-lg border overflow-hidden relative">
                    <Image
                      src="/produto_1.webp"
                      alt="OrtoClub QBank TEOT - Banco de questões para preparação TEOT"
                      fill
                      className="object-cover"
                      priority
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
