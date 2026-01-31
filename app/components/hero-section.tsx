import { Users } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
    return (
        <section className="pt-32 pb-20 px-4">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Lado Esquerdo - Texto */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                                OrtoClub
                            </h1>
                            <h2 className="text-5xl md:text-6xl font-bold" style={{ color: 'var(--blue-brand)' }}>
                                TEOT
                            </h2>
                        </div>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Transformando a educação ortodôntica com métodos inovadores e uma equipe de especialistas dedicados ao seu crescimento profissional.
                        </p>

                        <div className="flex gap-3 items-center">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4, 5, 6, 7].map((person) => (
                                    <div
                                        key={person}
                                        className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center"
                                        style={{ backgroundColor: 'var(--blue-brand)' }}
                                    >
                                        <Users className="w-5 h-5 text-white" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-sm text-gray-600">+1000 alunos</span>
                        </div>
                    </div>

                    {/* Lado Direito - Imagem com Box "EM BREVE TIM" */}
                    <div className="relative">
                        <div className="rounded-2xl overflow-hidden">
                            <Image
                                src="/hero.png"
                                alt="OrtoClub TEOT"
                                width={700}
                                height={700}
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Box "EM BREVE TIM" */}
                        <div className="absolute bottom-8 right-8 bg-white border-2 border-gray-200 rounded-lg px-6 py-4 shadow-lg">
                            <p className="text-lg font-semibold" style={{ color: 'var(--blue-brand)' }}>
                                EM BREVE TIM
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
