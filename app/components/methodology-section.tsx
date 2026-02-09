'use client';

import { CircleCheckIcon } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

const scrollToPricing = () => {
    const pricingSection = document.querySelector('#pricing');
    if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

export default function HeroSection() {
    return (
        <section id="metodologia" className="w-full py-8 md:py-12 bg-blue-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="grid items-center justify-center gap-6 md:gap-8 lg:grid-cols-12">
                        <div className="flex flex-col justify-center space-y-4 md:space-y-6 lg:col-span-5 px-4 md:px-0">
                            <h1 className="text-brand-blue text-center text-2xl font-bold sm:text-3xl md:text-start md:text-4xl lg:text-5xl">
                                O que está incluso no Extensivo 2027

                            </h1>
                            <ul className="space-y-4 md:space-y-5 text-sm text-gray-700 sm:text-base md:text-lg md:text-start">
                                {[
                                    {
                                        title: 'OrtoClub TEOT – Plataforma completa de aulas',
                                        description: 'Aulas cobrindo todos os temas do TEOT, com mais de 10 especialistas da USP, professores experientes em educação médica e formação de residentes.'
                                    },
                                    {
                                        title: 'OrtoQBank – Banco de questões comentadas',
                                        description: 'Mais de 4.000 questões no padrão SBOT, com comentários aprofundados, personalização e feedback.'
                                    },
                                    {
                                        title: 'Integração total entre aulas e questões',
                                        description: 'Assista à aula, treine no QBank e revise exatamente onde você erra.'
                                    },
                                    {
                                        title: 'Método orientado a desempenho',
                                        description: 'Estude para garantir um desempenho de 80% na prova!'
                                    },
                                    {
                                        title: 'Resultado comprovado',
                                        description: 'Método validado por 1º lugar no TEOT.'
                                    },
                                ].map((item) => (
                                    <li key={item.title} className="flex items-start gap-2 md:gap-3">
                                        <CircleCheckIcon className="text-brand-blue h-5 w-5 md:h-6 md:w-6 shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <span className="font-semibold text-brand-blue">{item.title}</span>
                                            <p className="text-gray-600 text-sm md:text-base mt-1">{item.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                <Button
                                    size="lg"
                                    onClick={scrollToPricing}
                                    className="cursor-pointer"
                                >
                                    Comprar Acesso
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-end lg:col-span-7">
                            <div className="w-full max-w-[800px]">
                                <Image
                                    src="/produto_1.webp"
                                    alt="OrtoQBank plataforma em múltiplos dispositivos mostrando questões e estatísticas"
                                    width={700}
                                    height={500}
                                    priority
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}