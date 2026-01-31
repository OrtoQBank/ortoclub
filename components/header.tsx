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
import { Menu } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
    const menuItems = [
        {
            href: '#produtos', label: 'Produtos'

        },
        { href: '#metodologia', label: 'Metodologia' },
        { href: '#equipe', label: 'Nossa Equipe' },
        { href: '#faq', label: 'FAQ' },
    ];

    return (
        <header className="bg-brand-blue sticky top-0 z-50 text-white font-(family-name:--font-sifonn-pro)">
            <div className="container mx-auto flex items-center justify-between px-4 py-4">
                {/* Logo e Nome - Lado Esquerdo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo-transparente.png" alt="OrtoClub" width={32} height={32} />
                    <span className="font-sifonn translate-y-1 text-2xl font-bold">OrtoClub</span>
                </Link>

                {/* Desktop Navigation - Lado Direito */}
                <div className="hidden md:flex items-center gap-6">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {menuItems.map((item) => (
                                <NavigationMenuItem key={item.href}>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href={item.href}
                                            className="inline-flex h-9 items-center justify-center px-4 py-2 text-sm font-medium text-white hover:opacity-80 transition-opacity"
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
                        className="border border-white  text-white bg-transparent hover:bg-white hover:text-(--blue-brand) transition-colors rounded-full"
                    >
                        <Link href="#aluno">Área do Aluno</Link>
                    </Button>
                </div>

                {/* Mobile Navigation */}
                <Sheet>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <div className="flex flex-col gap-4 mt-8">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-lg font-medium hover:text-(--blue-brand) transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <Button
                                asChild
                                style={{ backgroundColor: 'var(--blue-brand)' }}
                                className="hover:opacity-90 mt-4"
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
