import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
    return (
        <section className="pt-32 pb-20 px-4">
            <div className="container mx-auto">
                <div className="mx-auto max-w-7xl">
                    <div className="flex gap-8 items-center">
                        {/* Lado Esquerdo - Imagem */}
                        <div className="rounded-2xl overflow-hidden h-[400px] w-[700px] flex-shrink-0">
                            <Image
                                src="/turma-ortoclub.jpeg"
                                alt="OrtoClub TEOT"
                                width={700}
                                height={400}
                                className="w-full h-full object-cover"
                            />
                        </div>


                        {/* Lado Direito - texto e botão "EM BREVE TURMAS"*/}
                        <div className="relative h-[400px] flex flex-col justify-center max-w-sm">
                            <div className="space-y-4">
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Transformando a educação ortodôntica com métodos inovadores e uma equipe de especialistas dedicados ao seu crescimento profissional.
                                </p>

                                <div className="flex gap-3 items-center">
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
                            <div className="absolute bottom-0 pl-2">
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
