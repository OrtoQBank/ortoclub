'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, ChevronDown } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

// Produtos que ainda não têm acesso disponível (lista de espera)
const VIP_ONLY_PRODUCTS = [
    '/mentoria-video',
    '/sbcj-qbank',
    '/mao-qbank',
    '/gestao-video',
    '/teot-video',
];

interface SidebarMobileProps {
    products: Array<{ title: string; href: string }>;
    menuItems: Array<{ href: string; label: string }>;
    onStudentAreaClick: () => void;
    onWaitlistClick?: (productTitle: string) => void;
}

export default function SidebarMobile({ products, menuItems, onStudentAreaClick, onWaitlistClick }: SidebarMobileProps) {
    const isVipOnly = (href: string) => VIP_ONLY_PRODUCTS.includes(href);
    return (
        <Sheet>
            <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Menu className="h-5 w-5 md:h-6 md:w-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px] bg-brand-blue text-white border-0 pl-6 [&>button]:hidden">
                <VisuallyHidden>
                    <SheetTitle>Menu de Navegação</SheetTitle>
                </VisuallyHidden>
                
                <div className="flex flex-col">
                    {/* Logo e Nome no Topo */}
                    <div className="flex items-center gap-2 pb-6 pt-6">
                        <Image src="/logo-transparente.png" alt="OrtoClub" width={28} height={28} />
                        <span className="font-(family-name:--font-sifonn-pro) translate-y-1 text-xl font-bold">OrtoClub</span>
                    </div>

                    {/* Menu Items */}
                    <div className="flex flex-col">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="text-base font-medium hover:opacity-80 transition-opacity py-4 flex items-center justify-between border-b border-white/5 text-white pr-6">
                                Produtos
                                <ChevronDown className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white w-full">
                                {products.map((product) => (
                                    <DropdownMenuItem key={product.href} asChild>
                                        {isVipOnly(product.href) && onWaitlistClick ? (
                                            <button 
                                                onClick={() => onWaitlistClick(product.title)}
                                                className="cursor-pointer w-full text-left"
                                            >
                                                {product.title} (Lista de Espera)
                                            </button>
                                        ) : (
                                            <Link href={product.href} className="cursor-pointer">
                                                {product.title}
                                            </Link>
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-base font-medium hover:opacity-80 transition-opacity py-4 border-b border-white/5 pr-6"
                            >
                                {item.label}
                            </Link>
                        ))}
                        
                        {/* Botão Área do Aluno */}
                        <div className="pt-6 pr-6 flex justify-center">
                            <Button
                                size="sm"
                                className="bg-white text-brand-blue hover:bg-white/90 font-semibold px-6"
                                onClick={onStudentAreaClick}
                            >
                                Área do Aluno
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
