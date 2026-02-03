import { BookOpen, Target, BarChart3, Clock } from 'lucide-react';
import Image from 'next/image';

export default function Hero1Section() {
    return (
      <section className="mt-24 py-12 md:py-20 px-4 bg-white">
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
                    OrtoClub QBank
                  </h1>
                </div>
  
                <p className="text-lg leading-relaxed text-muted-foreground max-w-2xl">
                  Banco de questões comentadas com foco total na prova TEOT. Treine com questões no padrão da banca, revisão inteligente e análise de desempenho para aumentar suas chances de aprovação.
                </p>

                {/* Benefícios em bullets */}
                <div className="grid gap-4 sm:grid-cols-2 mb-16">
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
  
                <div className="flex flex-col items-center"></div>
                <a
                    href="https://ortoqbank.ortoclub.com/"
                    target="_blank" 
                    className="font-semibold bg-brand-blue text-white border-4 border-brand-blue py-2 px-6 rounded-lg hover:bg-brand-blue/90"
                  >
                 Garantir Acesso
                      </a>
                      <div className="mt-4 flex flex-col items-center"></div>
                
              </div>
  
              {/* DIREITA: card com imagem do produto */}
              <div className="md:col-span-2">
              <div className="flex justify-center lg:col-span-8">
                            <div className="w-full max-w-[800px]">
                                <Image
                                    src="/hero.png"
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
