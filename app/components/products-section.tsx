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
                    title: 'OrtoQBank',
                    description: 'Técnica exclusiva de ortodontia com resultados comprovados',
                    image: '/ortoqbank.jpeg',
                    href: '/orto-qbank'
                },
                {
                    title: 'OrtoClub TEOT',
                    description: 'Construa sua marca pessoal no mercado ortodôntico',
                    image: '/teot-aulas.jpeg',
                    href: '/teot-video'
                },
                {
                    title: 'Mentoria TEOT',
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
                    title: 'SBCJQBank',
                    description: 'Base sólida em ortodontia convencional',
                    image: '/SBCJQBank.webp',
                    href: '/sbcj-qbank'
                },
                {
                    title: 'MãoQBank',
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
                    title: 'Gestão de Consultório',
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
        <section className="py-6 md:py-8 px-4">
            <div className="container mx-auto">
                <div className="mx-auto max-w-7xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 md:mb-8">
                        <span className="text-brand-blue">Nossos Produtos</span>
                    </h1>

                    {productSections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="mb-8 md:mb-10">
                            <h2 className="text-gray-600 mb-6 md:mb-8 text-center text-lg sm:text-2xl font-bold md:text-xl">
                                {section.sectionTitle}
                            </h2>

                            <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-4xl mx-auto">
                                {section.products.map((product, index) => (
                                    <div key={index} className="group flex flex-col w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] rounded-xl transition-all duration-300 hover:bg-brand-blue hover:shadow-xl hover:shadow-brand-blue/30 p-2 -m-2 hover:scale-105">
                                        <Card className="overflow-hidden transition-shadow group-hover:shadow-lg p-0 border-0">
                                            <div className="relative w-full aspect-[3/4]">
                                                <Image
                                                    src={product.image}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </Card>

                                        <div className="mt-3 md:mt-4">
                                            {isVipOnly(product.href) ? (
                                                <Button
                                                    className="w-full font-semibold bg-brand-blue text-white hover:bg-brand-blue/90 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-black/30"
                                                    onClick={() => handleVipClick(product.title)}
                                                >
                                                    Lista de Espera
                                                </Button>
                                            ) : (
                                                <Link href={product.href}>
                                                    <Button className="w-full font-semibold bg-brand-blue text-white hover:bg-brand-blue/90 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-black/30">
                                                        Garantir Acesso
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-brand-blue border-brand-blue text-white **:data-[slot=dialog-close]:text-white">
                    <DialogHeader className="text-center">
                        <DialogTitle className="text-xl font-bold text-white text-center">
                            Preencha os campos para confirmar sua vaga!
                        </DialogTitle>
                        <DialogDescription className="text-center text-white/80">
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
