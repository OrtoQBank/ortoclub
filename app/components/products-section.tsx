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
        parseAsString.withDefault('').withOptions({ scroll: false })
    );

    const productSections = [
        {
            sectionTitle: 'TEOT/TEPOT',
            products: [
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
            ]
        },
        {
            sectionTitle: 'R+ / Subespecialidades',
            products: [
                {
                    title: 'SBCJ Qbank',
                    description: 'Base sólida em ortodontia convencional',
                    image: '/SBCJQBank.webp',
                    href: '/sbcj-qbank'
                },
                {
                    title: 'Mão Qbank',
                    description: 'Base sólida em ortodontia convencional',
                    image: '/MaqBan.webp',
                    href: '/mao-qbank'
                }
            ]
        },
        {
            sectionTitle: 'Consultório',
            products: [
                {
                    title: 'Gestão Aulas',
                    description: 'Base sólida em ortodontia convencional',
                    image: '/gestao-aulas.jpeg',
                    href: '/gestao-video'
                }
            ]
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
        <section className="py-8 md:py-12 px-4">
            <div className="container mx-auto">
                <div className="mx-auto max-w-7xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 md:mb-8">
                        <span className="text-brand-blue">Nossos Produtos</span>
                    </h1>

                    {productSections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="mb-12 md:mb-16">
                            <h2 className="text-gray-600 mb-6 md:mb-8 text-center text-lg sm:text-2xl font-bold md:text-xl">
                                {section.sectionTitle}
                            </h2>

                            <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-4xl mx-auto">
                                {section.products.map((product, index) => (
                                    <div key={index} className="flex flex-col gap-3 md:gap-4 w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)]">
                                        <Card className="overflow-hidden hover:shadow-lg transition-shadow p-0 border-0">
                                            <div className="relative w-full aspect-4/5 sm:aspect-3/4">
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
                                                Lista de Espera
                                            </Button>
                                        ) : (
                                            <Link href={product.href}>
                                                <Button className="w-full text-white font-semibold bg-brand-blue hover:bg-brand-blue/90">
                                                    Garantir Acesso
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
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
