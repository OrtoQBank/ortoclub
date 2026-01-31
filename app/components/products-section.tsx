import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductsSection() {
    const products = [
        {
            title: 'OrtoQbank',
            description: 'Técnica exclusiva de ortodontia com resultados comprovados',
            image: '/ortoqbank.jpeg',
            href: '/orto-qbank'
        },
        {
            title: 'TEOT Aulas',
            description: 'Construa sua marca pessoal no mercado ortodôntico',
            image: '/teot-aulas.jpeg',
            href: '/teot-aulas'
        },
        {
            title: 'Mentoria Aulas',
            description: 'Acompanhamento personalizado com especialistas',
            image: '/mentoria-aulas.jpeg',
            href: '/mentoria-video'
        },
        {
            title: 'Gestão Aulas',
            description: 'Base sólida em ortodontia convencional',
            image: '/gestao-aulas.jpeg',
            href: '/orto-qbank'
        },
        {
            title: 'SBCJ Qbank',
            description: 'Base sólida em ortodontia convencional',
            image: '/ortoclub-teot.png',
            href: '/sbcj-qbank'
        },
        {
            title: 'Mão Qbank',
            description: 'Base sólida em ortodontia convencional',
            image: '/maoqbank.jpeg',
            href: '/mao-qbank'
        }
    ];

    return (
        <section id="produtos" className="py-20 px-4 bg-muted/50">
            <div className="container mx-auto">
                <div className="mx-auto max-w-7xl">
                    <h2 className="text-4xl font-bold text-center mb-12">
                        <span className="text-brand-blue">Nossos Produtos</span>
                    </h2>


                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, index) => (
                            <div key={index} className="flex flex-col gap-4">
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow p-0 border-0">
                                    <div className="relative w-full aspect-[3/4]">
                                        <Image
                                            src={product.image}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </Card>
                                <Link href={product.href}>
                                    <Button className="w-full">
                                        Comprar Acesso
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
