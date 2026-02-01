export default function Video2Section() {
    return (
        <section className="py-12 md:py-20 px-4">
            <div className="container mx-auto">
                <div className="mx-auto max-w-5xl">
                    <div className="relative w-full aspect-video bg-gray-200 rounded-2xl overflow-hidden border-4 border-gray-300 flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <p className="text-2xl md:text-4xl font-bold text-gray-600">
                                VÍDEO
                            </p>
                            <p className="text-xl md:text-3xl font-bold text-gray-600">
                                PRODUTO 2
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}