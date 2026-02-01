import Image from 'next/image';

export default function Hero2Section() {
    return (
        <section className="pt-20 md:pt-32 pb-12 md:pb-20 px-4">
            <div className="container mx-auto">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                        {/* Lado Esquerdo - Descrição */}
                        <div className="flex-1 space-y-4">
                            <h1 className="text-3xl md:text-4xl font-bold text-brand-blue">
                                PRODUTO 2
                            </h1>
                            <div className="space-y-2">
                                <p className="text-base md:text-lg text-muted-foreground">
                                    Descrição do produto 2
                                </p>
                                <p className="text-base md:text-lg text-muted-foreground">
                                    _______________________
                                </p>
                                <p className="text-base md:text-lg text-muted-foreground">
                                    _______________________
                                </p>
                                <p className="text-base md:text-lg text-muted-foreground">
                                    _______________________
                                </p>
                            </div>
                        </div>

                        {/* Lado Direito - Imagem do Produto */}
                        <div className="rounded-2xl overflow-hidden w-full md:w-[400px] h-[300px] md:h-[400px] flex-shrink-0 bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                            <span className="text-4xl md:text-6xl font-bold text-gray-400">Y</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}