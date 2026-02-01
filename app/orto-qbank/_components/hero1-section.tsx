import { CircleCheckIcon } from 'lucide-react';
import Image from 'next/image';

export default function Hero1Section() {
    return (
        <section className="pt-20 md:pt-32 pb-12 md:pb-20 px-4">
            <div className="container mx-auto">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                        {/* Lado Esquerdo - Descrição */}
                        <div className="flex-1 space-y-4">
                            <h1 className="text-brand-blue text-center text-2xl font-bold sm:text-3xl md:text-start md:text-4xl lg:text-5xl">
                                OrtoQbank
                            </h1>
                            <ul className="space-y-3 md:space-y-4 text-sm text-gray-700 sm:text-base md:text-lg md:text-start">
                                {[
                                    'Provas antigas corrigidas e comentadas',
                                    'Questões inéditas reforçando os principais temas das provas',
                                    'Comentários completos e ilustrados',
                                    'Feedback detalhado de acordo com cada matéria',
                                ].map(text => (
                                    <li key={text} className="flex items-center gap-2 md:gap-3">
                                        <CircleCheckIcon className="text-brand-blue h-5 w-5 md:h-6 md:w-6 shrink-0" />
                                        <span className="flex-1">{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Lado Direito - Imagem do Produto */}
                        <div className="rounded-2xl overflow-hidden w-full md:w-[600px] md:h-[400px] flex-shrink-0 flex items-center justify-center ">
                            <Image src="/hero.png" alt="OrtoQbank" width={600} height={400} className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}