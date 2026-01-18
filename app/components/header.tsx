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
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Menu } from 'lucide-react';

export default function Header() {
    const menuItems = [
        { href: '#produtos', label: 'Produtos' },
        { href: '#metodologia', label: 'Metodologia' },
        { href: '#equipe', label: 'Nossa Equipe' },
        { href: '#faq', label: 'FAQ' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b z-50">
            <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 text-(--blue-brand)">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
                            </svg>
                        </div>
                        <span className="font-semibold text-lg">OrtoClub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {menuItems.map((item) => (
                                    <NavigationMenuItem key={item.href}>
                                        <NavigationMenuLink asChild>
                                            <Link href={item.href} className={navigationMenuTriggerStyle()}>
                                                {item.label}
                                            </Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>

                        <Button
                            asChild
                            style={{ backgroundColor: 'var(--blue-brand)' }}
                            className="hover:opacity-90"
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
                </nav>
            </div>
        </header>
    );
}
