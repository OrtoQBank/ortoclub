import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
    return (
        <section className="pt-32 pb-20 px-4">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                                OrtoClub
                            </h1>
                            <h2 className="text-5xl md:text-6xl font-bold" style={{ color: 'var(--blue-brand)' }}>
                                TEOT
                            </h2>
                        </div>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Transformando a educação ortodôntica com métodos inovadores e uma equipe de especialistas dedicados ao seu crescimento profissional.
                        </p>

                        <div className="flex gap-2 items-center">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4, 5, 6, 7].map((person) => (
                                    <Avatar
                                        key={person}
                                        className="border-2 border-background"
                                        style={{ backgroundColor: 'var(--blue-brand)' }}
                                    >
                                        <AvatarFallback
                                            className="text-white"
                                            style={{ backgroundColor: 'var(--blue-brand)' }}
                                        >
                                            <Users className="w-4 h-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">+1000 alunos</span>
                        </div>
                    </div>

                    <div className=" rounded-2xl flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <Image src="/turma-ortoclub.jpeg" alt="Hero Section" width={700} height={700} />

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
