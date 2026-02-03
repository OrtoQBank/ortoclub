'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Menu, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
    const products = [
        { title: 'OrtoQbank', href: '/orto-qbank' },
        { title: 'TEOT Aulas', href: '/teot-video' },
        { title: 'Mentoria Aulas', href: '/mentoria-video' },
        { title: 'Gestão Aulas', href: '/gestao-video' },
        { title: 'SBCJ Qbank', href: '/sbcj-qbank' },
        { title: 'Mão Qbank', href: '/mao-qbank' },
    ];

    const menuItems = [
        { href: '#metodologia', label: 'Metodologia' },
        { href: '#equipe', label: 'Nossa Equipe' },
        { href: '#faq', label: 'FAQ' },
    ];

    return (
        <header className="fixed w-full bg-brand-blue z-10 text-white mb-200">
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
                        asChild
                        variant="outline"
                        className="border border-white  text-white bg-transparent hover:bg-white hover:text-brand-blue transition-colors rounded-full"
                    >
                        <Link href="#aluno">Área do Aluno</Link>
                    </Button>
                </div>

                {/* Mobile Navigation */}
                <Sheet>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <Menu className="h-5 w-5 md:h-6 md:w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                        <div className="flex flex-col gap-4 mt-8">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="text-base md:text-lg font-medium hover:text-brand-blue transition-colors py-2 flex items-center justify-between">
                                    Produtos
                                    <ChevronDown className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white w-full">
                                    {products.map((product) => (
                                        <DropdownMenuItem key={product.href} asChild>
                                            <Link href={product.href} className="cursor-pointer">
                                                {product.title}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-base md:text-lg font-medium hover:text-brand-blue transition-colors py-2"
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <Button
                                asChild
                                className="bg-brand-blue hover:bg-brand-blue/90 mt-4"
                            >
                                <Link href="#aluno">Área do Aluno</Link>
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
