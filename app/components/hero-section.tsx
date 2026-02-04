import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function HeroSection() {
    return (
        <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-4 bg-blue-50">
            <div className="container mx-auto">
                <div className="mx-auto max-w-7xl">
                    <div className="inline-block bg-brand-blue text-white px-4 max-w-[400px] py-1 text-center rounded-full text-sm font-medium mb-6">
                        Extensivo 2027
                    </div>
                    {/* Título */}
                    <h2 className=" md:text-xl font-bold text-brand-blue mb-8">
                        PREPARAÇÃO COMPLETA PARA QUEM QUER CHEGAR PRONTO NO TEOT/TEPOT!
                    </h2>

                    {/* Container principal */}
                    <div className="grid grid-cols-1 lg:grid-cols-[900px_auto_300px] gap-4 lg:gap-6">
                        {/* Linha 1: Imagens */}
                        {/* Primeira imagem - OrtoClub TEOT */}
                        <div className="w-full h-[400px] lg:h-[450px]">
                            <Image
                                src="/hero-image.webp"
                                alt="OrtoClub TEOT"
                                width={600}
                                height={400}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>

                        {/* Sinal de + centralizado */}
                        <div className="hidden lg:flex items-center justify-center w-12">
                            <span className="text-5xl font-light text-brand-blue">
                                +
                            </span>
                        </div>

                        {/* Segunda imagem - OrtoQBank */}
                        <div className="w-full h-[400px] lg:h-[450px]">
                            <Image
                                src="/ortoqbank.jpeg"
                                alt="OrtoQBank"
                                width={250}
                                height={400}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>

                        {/* Linha 2: Texto descritivo (abaixo da imagem 1) */}
                        <div className="space-y-4 pt-4">
                            <p className="text-lg text-gray-700 font-medium">
                                O Extensivo 2027 é o programa mais completo do OrtoClub.
                            </p>
                            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                                Ele une formação teórica sólida, treinamento intensivo por questões e um método de estudo validado por resultado, pensado para quem quer estudar com estratégia desde agora e chegar na prova com segurança, consistência e alto desempenho.
                            </p>
                        </div>

                        {/* Espaço vazio para alinhar com o + */}
                        <div className="hidden lg:block"></div>

                        {/* CTA (abaixo da imagem 2) */}
                        <div className="flex flex-col items-center justify-start text-center space-y-5 pt-12">

                            <Button
                                variant="default"
                                className="bg-brand-blue text-white hover:bg-brand-blue/90 text-base px-10 py-6 leading-tight"
                            >
                                QUERO ACESSO COMPLETO
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
