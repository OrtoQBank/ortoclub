import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
    return (
        <section className=" pt-20 md:pt-32 pb-12 md:pb-20 px-4">
            <div className="container mx-auto">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                        {/* Lado Esquerdo - Imagem */}
                        <div className="rounded-2xl overflow-hidden w-full md:h-[400px] md:w-[700px] h-[250px] flex-shrink-0">
                            <Image
                                src="/turma-ortoclub.jpeg"
                                alt="OrtoClub TEOT"
                                width={700}
                                height={400}
                                className="w-full h-full object-cover"
                            />
                        </div>


                        {/* Lado Direito - texto e botão "EM BREVE TURMAS"*/}
                        <div className="relative md:h-[400px] flex flex-col justify-center w-full md:max-w-sm space-y-6 md:space-y-0">
                            <div className="space-y-4">
                                <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-center md:text-left">
                                    Transformando a educação ortodôntica com métodos inovadores e uma equipe de especialistas dedicados ao seu crescimento profissional.
                                </p>

                                <div className="flex gap-3 items-center justify-center md:justify-start">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4, 5, 6, 7].map((person) => (
                                            <div
                                                key={person}
                                                className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-brand-blue flex items-center justify-center"
                                            >
                                                <Users className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">+200 alunos</span>
                                </div>
                            </div>

                            {/* Box "EM BREVE TURMAS" */}
                            <div className="md:absolute md:bottom-0 md:pl-2 flex justify-center md:justify-start w-full mt-4 md:mt-0">
                                <Button variant="default" className="bg-brand-blue text-white hover:bg-brand-blue/90 w-full md:w-auto">
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
