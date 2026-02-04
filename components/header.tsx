'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SidebarMobile from './sidebar-mobile';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import EmailCollectionForm from '@/app/components/email-collection-form';

// Produtos que ainda não têm acesso disponível (lista de espera)
const VIP_ONLY_PRODUCTS = [
    '/mentoria-video',
    '/sbcj-qbank',
    '/mao-qbank',
    '/gestao-video',
    '/teot-video',
];

export default function Header() {
    const [isStudentAreaOpen, setIsStudentAreaOpen] = useState(false);
    const [waitlistProduct, setWaitlistProduct] = useState<string | null>(null);

    const products = [
        { title: 'OrtoQbank', href: '/orto-qbank' },
        { title: 'TEOT Aulas', href: '/teot-video' },
        { title: 'Mentoria Aulas', href: '/mentoria-video' },
        { title: 'Gestão Aulas', href: '/gestao-video' },
        { title: 'SBCJ Qbank', href: '/sbcj-qbank' },
        { title: 'Mão Qbank', href: '/mao-qbank' },
    ];

    const studentAreaProducts = [
        { title: 'OrtoQbank', image: '/ortoqbank.jpeg', href: 'https://ortoqbank.com.br', external: true },
        { title: 'TEOT Aulas', image: '/teot-aulas.jpeg', href: '/teot-video', external: false },
        { title: 'Mentoria Aulas', image: '/mentoria-aulas.jpeg', href: '/mentoria-video', external: false },
        { title: 'Gestão Aulas', image: '/gestao-aulas.jpeg', href: '/gestao-video', external: false },
        { title: 'SBCJ Qbank', image: '/SBCJQBank.webp', href: '/sbcj-qbank', external: false },
        { title: 'Mão Qbank', image: '/MaqBan.webp', href: '/mao-qbank', external: false },
    ];

    const isVipOnly = (href: string) => VIP_ONLY_PRODUCTS.includes(href);

    const handleWaitlistClick = (productTitle: string) => {
        setIsStudentAreaOpen(false);
        setWaitlistProduct(productTitle);
    };

    const menuItems = [
        { href: '#metodologia', label: 'Metodologia' },
        { href: '#equipe', label: 'Nossa Equipe' },
        { href: '#faq', label: 'FAQ' },
    ];

    return (
        <header className="fixed w-full bg-brand-blue z-10 text-white">
            <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
                {/* Logo e Nome - Lado Esquerdo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo-transparente.png" alt="OrtoClub" width={28} height={28} className="md:w-8 md:h-8" />
                    <span className="font-(family-name:--font-sifonn-pro) translate-y-1 text-xl md:text-2xl font-bold">OrtoClub</span>
                </Link>

                {/* Desktop Navigation - Lado Direito */}
                <div className="hidden md:flex items-center gap-6">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="inline-flex h-9 items-center justify-center px-4 py-2 text-md font-medium text-white hover:opacity-80 transition-opacity">
                                        Produtos
                                        <ChevronDown className="ml-1 h-4 w-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-white">
                                        {products.map((product) => (
                                            <DropdownMenuItem key={product.href} asChild>
                                                <Link href={product.href} className="cursor-pointer">
                                                    {product.title}
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </NavigationMenuItem>
                            {menuItems.map((item) => (
                                <NavigationMenuItem key={item.href}>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href={item.href}
                                            className="inline-flex h-9 items-center justify-center px-4 py-2 text-md font-medium text-white hover:opacity-80 transition-opacity"
                                        >
                                            {item.label}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>

                    <Button
                        variant="outline"
                        className="border border-white text-brand-blue bg-white hover:bg-brand-blue/50 hover:border-brand-white hover:text-white transition-colors rounded-full"
                        onClick={() => setIsStudentAreaOpen(true)}
                    >
                        Área do Aluno
                    </Button>
                </div>

                {/* Mobile Navigation */}
                <SidebarMobile
                    products={products}
                    menuItems={menuItems}
                    onStudentAreaClick={() => setIsStudentAreaOpen(true)}
                    onWaitlistClick={(productTitle) => setWaitlistProduct(productTitle)}
                />
            </div>

            {/* Modal Área do Aluno */}
            <Dialog open={isStudentAreaOpen} onOpenChange={setIsStudentAreaOpen}>
                <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="text-center">
                        <DialogTitle className="text-2xl font-bold text-brand-blue text-center">
                            Área do Aluno
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                        {studentAreaProducts.map((product) => (
                            <div key={product.title} className="flex flex-col gap-2">
                                <div className="relative w-full aspect-3/4 rounded-lg overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                {product.external ? (
                                    <a
                                        href={product.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button className="w-full text-white font-semibold bg-brand-blue hover:bg-brand-blue/90 text-sm">
                                            Acessar
                                        </Button>
                                    </a>
                                ) : isVipOnly(product.href) ? (
                                    <Button
                                        className="w-full text-white font-semibold bg-brand-blue hover:bg-brand-blue/90 text-sm"
                                        onClick={() => handleWaitlistClick(product.title)}
                                    >
                                        Lista de Espera
                                    </Button>
                                ) : (
                                    <Link href={product.href} onClick={() => setIsStudentAreaOpen(false)}>
                                        <Button className="w-full text-white font-semibold bg-brand-blue hover:bg-brand-blue/90 text-sm">
                                            Acessar
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal Lista de Espera */}
            <Dialog open={waitlistProduct !== null} onOpenChange={(open) => !open && setWaitlistProduct(null)}>
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
                        productName={waitlistProduct || undefined}
                        onSuccess={() => {
                            setTimeout(() => setWaitlistProduct(null), 2000);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </header>
    );
}
