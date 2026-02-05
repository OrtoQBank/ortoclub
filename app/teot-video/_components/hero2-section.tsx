import { Users, BookOpen, Target, Trophy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero2Section() {
    return (
        <section className="pt-20 md:pt-32 pb-12 md:pb-20 px-4">
            <div className="container mx-auto">
                <div className="mx-auto max-w-7xl">
                    <div className="grid items-start gap-10 md:grid-cols-5">
                        {/* Lado Esquerdo - Descrição */}
                        <div className="md:col-span-3 space-y-6">
                            {/* Título principal */}
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-brand-blue uppercase tracking-wider">
                                    Plataforma de Aulas
                                </span>
                                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                                    OrtoClub TEOT - Formação que aprova
                                </h1>
                            </div>

                            {/* Descrição introdutória */}
                            <p className="text-lg leading-relaxed text-muted-foreground max-w-2xl">
                                A plataforma de aulas que forma ortopedistas de excelência e aprova no TEOT. Estruturada por quem vive a prática, ensina e conquistou 1º, 4º e 7º lugares no TEOT — unindo método, prática e aprovação.
                            </p>

                            {/* Benefícios em bullets */}
                            <div className="grid gap-4 sm:grid-cols-2 mb-16">
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">+10 especialistas da USP</h3>
                                        <p className="text-sm text-muted-foreground">Professores que atuam na assistência, pesquisa e ensino médico</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Cobertura completa do TEOT</h3>
                                        <p className="text-sm text-muted-foreground">Do básico ao avançado, sem lacunas e sem excesso irrelevante</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Target className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Método orientado à prova</h3>
                                        <p className="text-sm text-muted-foreground">Aulas objetivas, com foco no que realmente cai e como a banca pensa</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Trophy className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Resultado comprovado</h3>
                                        <p className="text-sm text-muted-foreground">Método validado com 1º, 4º e 7º lugares no TEOT</p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <Link
                                href="https://pay.hotmart.com/W98444880C?checkoutMode=10"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-lg bg-brand-blue px-8 py-3 text-white font-semibold shadow-md hover:opacity-95 transition"
                            >
                                Quero estudar com o OrtoClub TEOT
                            </Link>
                        </div>

                        {/* Lado Direito - Imagem do Produto */}
                        <div className="md:col-span-2">
                            <div className="flex justify-center">
                                <div className="w-full max-w-[375px]">
                                    <Image
                                        src="/teot-aulas.jpeg"
                                        alt="OrtoClub TEOT - Plataforma de Aulas"
                                        width={500}
                                        height={300}
                                        priority
                                        className="w-full h-auto rounded-2xl shadow-xl"
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