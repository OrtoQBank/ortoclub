import LeadFormDialog from '@/app/components/lead-form-dialog';

export default function Video2Section() {
    return (
        <section className="py-12 md:py-20 px-4 bg-white">
            <div className="container mx-auto">
                <div className="mx-auto max-w-4xl">
                    {/* Headline */}
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
                            Método. Prática. Aprovação.
                        </h2>
                        <p className="text-lg md:text-xl text-gray-900/90">
                            Esse é o DNA do OrtoClub TEOT.
                        </p>
                    </div>

                    {/* Video */}
                    <div className="aspect-video overflow-hidden rounded-xl shadow-xl bg-card">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/placeholder"
                            title="Conheça o OrtoClub TEOT"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="h-full w-full"
                        />
                    </div>

                    {/* CTA abaixo do vídeo */}
                    <div className="mt-6 flex flex-col items-center">
                        <p className="text-center text-sm text-gray-900/80 mb-4">
                            Conheça a plataforma que vai transformar sua preparação
                        </p>
                        <LeadFormDialog
                            productSlug="teot-video"
                            productDisplayName="TEOT Aulas"
                            buttonText="Começar minha formação para o TEOT"
                            buttonClassName="bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-blue/90 transition"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}