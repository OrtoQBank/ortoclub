'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Image from 'next/image';
import EmailCollectionForm from './email-collection-form';

export default function HeroSection() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
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

                    {/* Container principal - Desktop */}
                    <div className="hidden lg:grid lg:grid-cols-[1fr_auto_300px] gap-6">
                        {/* Primeira imagem - OrtoClub TEOT */}
                        <div className="w-full h-[450px]">
                            <Image
                                src="/hero-image.webp"
                                alt="OrtoClub TEOT"
                                width={900}
                                height={450}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>

                        {/* Sinal de + centralizado */}
                        <div className="flex items-center justify-center w-12">
                            <span className="text-5xl font-light text-brand-blue">
                                +
                            </span>
                        </div>

                        {/* Segunda imagem - OrtoQBank */}
                        <div className="w-full h-[450px]">
                            <Image
                                src="/ortoqbank.jpeg"
                                alt="OrtoQBank"
                                width={300}
                                height={450}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>

                        {/* Linha 2: Texto descritivo */}
                        <div className="space-y-4 pt-4">
                            <p className="text-lg text-gray-700 font-medium">
                                O Extensivo 2027 é o programa mais completo do OrtoClub.
                            </p>
                            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                                Ele une formação teórica sólida, treinamento intensivo por questões e um método de estudo validado por resultado, pensado para quem quer estudar com estratégia desde agora e chegar na prova com segurança, consistência e alto desempenho.
                            </p>
                        </div>

                        {/* Espaço vazio para alinhar com o + */}
                        <div></div>

                        {/* CTA (abaixo da imagem 2) */}
                        <div className="flex flex-col items-center justify-start text-center space-y-5 pt-8">
                            <Button
                                variant="default"
                                className="bg-brand-blue text-white hover:bg-brand-blue/90 text-base px-10 py-6 leading-tight"
                                onClick={() => setWaitlistOpen(true)}
                            >
                                QUERO ACESSO COMPLETO
                            </Button>
                        </div>
                    </div>

                    {/* Container principal - Mobile */}
                    <div className="lg:hidden flex flex-col gap-4">
                        {/* Imagens lado a lado com + no meio */}
                        <div className="flex items-center gap-2">
                            {/* Primeira imagem - OrtoClub TEOT */}
                            <div className="flex-1 h-[180px] sm:h-[220px]">
                                <Image
                                    src="/hero-image.webp"
                                    alt="OrtoClub TEOT"
                                    width={400}
                                    height={220}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>

                            {/* Sinal de + */}
                            <span className="text-3xl sm:text-4xl font-light text-brand-blue shrink-0 px-1">
                                +
                            </span>

                            {/* Segunda imagem - OrtoQBank */}
                            <div className="w-[100px] sm:w-[140px] h-[180px] sm:h-[220px] shrink-0">
                                <Image
                                    src="/ortoqbank.jpeg"
                                    alt="OrtoQBank"
                                    width={140}
                                    height={220}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Texto descritivo */}
                        <div className="space-y-3 pt-4">
                            <p className="text-base text-gray-700 font-medium">
                                O Extensivo 2027 é o programa mais completo do OrtoClub.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Ele une formação teórica sólida, treinamento intensivo por questões e um método de estudo validado por resultado, pensado para quem quer estudar com estratégia desde agora e chegar na prova com segurança, consistência e alto desempenho.
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="flex justify-center pt-4">
                            <Button
                                variant="default"
                                className="bg-brand-blue text-white hover:bg-brand-blue/90 text-base px-8 py-5"
                                onClick={() => setWaitlistOpen(true)}
                            >
                                QUERO ACESSO COMPLETO
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={waitlistOpen} onOpenChange={setWaitlistOpen}>
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="text-center">
                        <DialogTitle className="text-xl font-bold text-gray-900 text-center">
                            Preencha os campos para confirmar sua vaga!
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Seus dados estão seguros.
                        </DialogDescription>
                    </DialogHeader>
                    <EmailCollectionForm
                        productName="Extensivo"
                        onSuccess={() => {
                            setTimeout(() => setWaitlistOpen(false), 2000);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </section>
    );
}
