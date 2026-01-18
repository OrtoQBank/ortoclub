import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
    const footerLinks = {
        navegacao: [
            { href: '#produtos', label: 'Produtos' },
            { href: '#metodologia', label: 'Metodologia' },
            { href: '#equipe', label: 'Nossa Equipe' },
            { href: '#faq', label: 'FAQ' },
        ],
        contato: [
            'contato@ortoclub.com.br',
            '(11) 99999-9999',
            'São Paulo, SP',
        ],
    };

    return (
        <footer className="bg-gray-900 text-white py-12 px-4">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 text-(--blue-brand)">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
                                </svg>
                            </div>
                            <span className="font-semibold text-lg">OrtoClub</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Transformando profissionais em especialistas de excelência
                        </p>
                    </div>

                    {/* Navegação */}
                    <div>
                        <h3 className="font-semibold mb-4">Navegação</h3>
                        <ul className="space-y-2">
                            {footerLinks.navegacao.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contato */}
                    <div>
                        <h3 className="font-semibold mb-4">Contato</h3>
                        <ul className="space-y-2">
                            {footerLinks.contato.map((info, index) => (
                                <li key={index} className="text-sm text-gray-400">
                                    {info}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Redes Sociais */}
                    <div>
                        <h3 className="font-semibold mb-4">Redes Sociais</h3>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                className="bg-gray-800 border-gray-700 hover:bg-(--blue-brand) hover:border-(--blue-brand) transition-colors"
                                asChild
                            >
                                <Link href="#" aria-label="Facebook">
                                    <Facebook className="w-5 h-5" />
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="bg-gray-800 border-gray-700 hover:bg-(--blue-brand) hover:border-(--blue-brand) transition-colors"
                                asChild
                            >
                                <Link href="#" aria-label="Instagram">
                                    <Instagram className="w-5 h-5" />
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="bg-gray-800 border-gray-700 hover:bg-(--blue-brand) hover:border-(--blue-brand) transition-colors"
                                asChild
                            >
                                <Link href="#" aria-label="YouTube">
                                    <Youtube className="w-5 h-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <Separator className="bg-gray-800 mb-8" />

                <div className="text-center text-sm text-gray-400">
                    <p>&copy; 2026 OrtoClub. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
