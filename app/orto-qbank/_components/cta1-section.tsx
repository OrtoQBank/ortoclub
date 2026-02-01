import { Button } from '@/components/ui/button';

export default function Cta1Section() {
    return (
        <section className="py-12 md:py-20 px-4">
            <div className="container mx-auto">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
                        {/* Imagem A */}
                        <div className="rounded-2xl overflow-hidden w-full aspect-square bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                            <span className="text-5xl md:text-6xl font-bold text-gray-600">A</span>
                        </div>

                        {/* Botão Central */}
                        <div className="flex justify-center items-center">
                            <Button
                                size="lg"
                                className="bg-brand-blue text-white hover:bg-brand-blue/90 text-base md:text-lg px-6 md:px-8 py-6 md:py-8 h-auto w-full md:w-auto rounded-full"
                            >
                                QUERO ESTUDAR COM O PRODUTO 1!
                            </Button>
                        </div>

                        {/* Imagem B */}
                        <div className="rounded-2xl overflow-hidden w-full aspect-square bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                            <span className="text-5xl md:text-6xl font-bold text-gray-600">B</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}