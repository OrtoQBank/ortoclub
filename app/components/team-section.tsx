'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';

export default function TeamSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const teamMembers = [
        {
            name: 'Dr. João Silva',
            role: 'Ortodontista Sênior',
            specialty: 'Especialista em TEOT',
            bio: 'Mais de 15 anos de experiência em ortodontia'
        },
        {
            name: 'Dra. Maria Santos',
            role: 'Coordenadora Acadêmica',
            specialty: 'Mestre em Ortodontia',
            bio: 'Dedicada ao ensino e pesquisa há 10 anos'
        },
        {
            name: 'Dr. Pedro Costa',
            role: 'Instrutor Principal',
            specialty: 'Especialista em Casos Complexos',
            bio: 'Reconhecido internacionalmente por suas técnicas'
        },
        {
            name: 'Dra. Ana Oliveira',
            role: 'Mentora',
            specialty: 'Ortodontia Estética',
            bio: 'Focada em resultados estéticos excepcionais'
        },
        {
            name: 'Dr. Carlos Mendes',
            role: 'Consultor Técnico',
            specialty: 'Biomecânica Avançada',
            bio: 'PhD em mecânica ortodôntica'
        }
    ];

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
    };

    return (
        <section id="equipe" className="py-20 px-4 bg-muted/50">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center mb-4">
                    <span style={{ color: 'var(--blue-brand)' }}>NOSSA EQUIPE</span>
                </h2>
                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Profissionais renomados dedicados ao seu sucesso
                </p>

                <div className="relative max-w-6xl mx-auto">
                    <div className="flex items-center justify-center gap-4 overflow-hidden">
                        <Button
                            onClick={prevSlide}
                            variant="outline"
                            size="icon"
                            className="shrink-0 rounded-full"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>

                        <div className="flex gap-6 w-full justify-center">
                            {teamMembers.map((member, index) => {
                                const isActive = index === currentIndex;
                                const isVisible =
                                    index === currentIndex ||
                                    index === (currentIndex + 1) % teamMembers.length ||
                                    index === (currentIndex + 2) % teamMembers.length;

                                if (!isVisible) return null;

                                return (
                                    <Card
                                        key={index}
                                        className={`overflow-hidden transition-all duration-300 ${isActive ? 'w-80 opacity-100 scale-105' : 'w-64 opacity-60 scale-95'
                                            }`}
                                    >
                                        <div
                                            className="h-48 flex items-center justify-center"
                                            style={{ backgroundColor: 'var(--blue-brand)' }}
                                        >
                                            <Avatar className="w-24 h-24 border-4 border-white">
                                                <AvatarFallback className="bg-white" style={{ color: 'var(--blue-brand)' }}>
                                                    <User className="w-12 h-12" />
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <CardHeader>
                                            <CardTitle>{member.name}</CardTitle>
                                            <CardDescription>
                                                <Badge
                                                    variant="secondary"
                                                    className="mb-2"
                                                    style={{ backgroundColor: 'var(--blue-brand)', color: 'white' }}
                                                >
                                                    {member.role}
                                                </Badge>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm font-medium mb-2">{member.specialty}</p>
                                            <p className="text-sm text-muted-foreground">{member.bio}</p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        <Button
                            onClick={nextSlide}
                            variant="outline"
                            size="icon"
                            className="shrink-0 rounded-full"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="flex justify-center gap-2 mt-8">
                        {teamMembers.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 rounded-full transition-all ${index === currentIndex ? 'w-8' : 'w-2'
                                    }`}
                                style={{
                                    backgroundColor: index === currentIndex ? 'var(--blue-brand)' : '#d1d5db'
                                }}
                                aria-label={`Ir para slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
