'use client';

import { useQueryState, parseAsString } from 'nuqs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import Image from 'next/image';
import Link from 'next/link';
import EmailCollectionForm from './email-collection-form';

// Produtos que ainda não têm landing page disponível
const VIP_ONLY_PRODUCTS = [
    '/mentoria-video',
    '/sbcj-qbank',
    '/mao-qbank',
    '/gestao-video',
];

export default function ProductsSection() {
    // Estado gerenciado pela URL - ex: ?produto=Mentoria%20Aulas
    const [selectedProduct, setSelectedProduct] = useQueryState(
        'produto',
        parseAsString.withDefault('')
    );

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
            href: '/teot-video'
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
            href: '/gestao-video'
        },
        {
            title: 'SBCJ Qbank',
            description: 'Base sólida em ortodontia convencional',
            image: '/mao-qbank.jpeg',
            href: '/sbcj-qbank'
        },
        {
            title: 'Mão Qbank',
            description: 'Base sólida em ortodontia convencional',
            image: '/mao-qbank.jpeg',
            href: '/mao-qbank'
        }
    ];

    const isVipOnly = (href: string) => VIP_ONLY_PRODUCTS.includes(href);

    const isModalOpen = selectedProduct !== '';

    const handleVipClick = (productTitle: string) => {
        setSelectedProduct(productTitle);
    };

    const handleCloseModal = (open: boolean) => {
        if (!open) {
            setSelectedProduct('');
        }
    };

    return (
        <section className="py-12 md:py-20 px-4 ">
            <div className="container mx-auto">
                <div className="mx-auto max-w-7xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
                        <span className="text-brand-blue">Nossos Produtos</span>
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                            {products.map((product, index) => (
                                <div key={index} className="flex flex-col gap-3 md:gap-4">
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow p-0 border-0">
                                    <div className="relative w-full aspect-[4/5] sm:aspect-3/4">
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                    />
                                    </div>
                                </Card>

                                {isVipOnly(product.href) ? (
                                    <Button
                                    className="w-full text-white font-semibold bg-brand-blue hover:bg-brand-blue/90"
                                    onClick={() => handleVipClick(product.title)}
                                    >
                                    ENTRAR PARA A LISTA VIP
                                    </Button>
                                ) : (
                                    <Link href={product.href}>
                                    <Button className="w-full text-white font-semibold bg-brand-blue hover:bg-brand-blue/90">
                                        Comprar Acesso
                                    </Button>
                                    </Link>
                                )}
                                </div>
                            ))}
                            </div>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
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
                        productName={selectedProduct || undefined}
                        onSuccess={() => {
                            setTimeout(() => setSelectedProduct(''), 2000);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </section>
    );
}
