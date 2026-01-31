import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
    return (
        <section className="pt-32 pb-20 px-4">
            <div className="container mx-auto">
                <div className="mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Lado Esquerdo - Texto */}
                        <div className="rounded-2xl overflow-hidden">
                            <Image
                                src="/turma-ortoclub.jpeg"
                                alt="OrtoClub TEOT"
                                width={800}
                                height={800}
                                className="w-full h-auto"
                            />
                        </div>


                        {/* Lado Direito - Imagem com Box "EM BREVE TIM" */}
                        <div className="relative">
                            <div className="space-y-6">
                                <div className="space-y-2 mb-12">


                                </div>

                                <p className="text-xl text-muted-foreground leading-relaxed mb-12">
                                    Transformando a educação ortodôntica com métodos inovadores e uma equipe de especialistas dedicados ao seu crescimento profissional.
                                </p>

                                <div className="flex gap-3 items-center mb-12">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4, 5, 6, 7].map((person) => (
                                            <div
                                                key={person}
                                                className="w-10 h-10 rounded-full border-2 border-white bg-brand-blue flex items-center justify-center"

                                            >
                                                <Users className="w-5 h-5 text-white" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">+200 alunos</span>
                                </div>
                            </div>

                            {/* Box "EM BREVE TURMAS" */}
                            <div className="absolute bottom-14 right-14">
                                <Button variant="default" className="bg-brand-blue text-white hover:bg-brand-blue/90">
                                    EM BREVE TURMAS
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
