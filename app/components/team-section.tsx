'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StaffMember {
    name: string;
    description: string[];
    imageUrl: string;
}

const staffMembers: StaffMember[] = [
    {
        name: 'Daniel Duarte Perini',
        description: [
            'Médico - USP',
            'Ortopedista - IOT HC-FMUSP',
            'Fellowship Cirurgia da Coluna',
        ],
        imageUrl: '/medico1.jpg',
    },
    {
        name: 'Vitor Ricardo Moraes',
        description: [
            'Médico - FMRP-USP',
            'Ortopedista - IOT HC-FMUSP',
            'Fellowship Cirurgia do Joelho',
        ],
        imageUrl: '/medico2.jpg',
    },
    {
        name: 'Rodrigo Astolfi',
        description: [
            'Médico - FMRP-USP',
            'Ortopedista - IOT HC-FMUSP',
            'Fellowship Cirurgia do Joelho',
        ],
        imageUrl: '/medico1.jpg',
    },
    {
        name: 'Dr. Alejandro Cedeño',
        description: [
            'Infectologista - HC FMUSP',
            'Doutorando em Ciências Médicas',
            'Especialista em Doenças Infecciosas',
        ],
        imageUrl: '/medico2.jpg',
    },
    {
        name: 'Dra. Laura Coimbra',
        description: [
            'Médica - UFOP',
            'Residência em Pediatria - UNICAMP',
            'Especialista em Pediatria',
        ],
        imageUrl: '/medico1.jpg',
    },
    {
        name: 'Dr. David Nunes',
        description: [
            'Médico - UFTM',
            'Residência em Cardiologia',
            'Instituto Dante Pazzanese',
        ],
        imageUrl: '/medico2.jpg',
    },
    {
        name: 'Dr. Renato Nemoto',
        description: [
            'Médico - FAMUC',
            'Cardiologista - INCOR',
            'Preceptor do INCOR',
        ],
        imageUrl: '/medico1.jpg',
    },
    {
        name: 'Dr. Hugo',
        description: [
            'Ortopedista - IOT FMUSP',
            'Especialista em Cirurgia',
            'Fellow em Trauma',
        ],
        imageUrl: '/medico2.jpg',
    },
    {
        name: 'Dr. Henrique Dalmolin',
        description: [
            'Reumatologia - FMUSP',
            'Preceptoria - HC/FMUSP',
            'Especialista em Autoimunes',
        ],
        imageUrl: '/medico1.jpg',
    },
    {
        name: 'Dra. Nicole Kemberly',
        description: [
            'Médica - FMUSP',
            'Ginecologia e Obstetrícia',
            'Preceptora - HC/FMUSP',
        ],
        imageUrl: '/medico2.jpg',
    },
    {
        name: 'Dra. Tayrine Mazotti',
        description: [
            'Médica - HC/FMUSP',
            'Preceptoria em Medicina',
            'Especialista em Clínica Médica',
        ],
        imageUrl: '/medico1.jpg',
    },
];

// Divide os membros em duas filas
const firstRow = staffMembers.slice(0, 6);
const secondRow = staffMembers.slice(6, 11);

function StaffCard({ member }: { member: StaffMember }) {
    return (
        <div className="border-brand-blue/20 w-[280px] flex-shrink-0 overflow-hidden rounded-lg border bg-white shadow-lg">
            <div className="overflow-hidden">
                <Image
                    src={member.imageUrl || '/placeholder.svg'}
                    alt={`Foto de ${member.name}`}
                    width={280}
                    height={280}
                    className="h-[280px] w-[280px] object-cover"
                />
            </div>
            <div className="p-4">
                <h3 className="text-brand-blue mb-2 text-lg font-semibold">
                    {member.name}
                </h3>
                <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
                    {member.description.map((point, i) => (
                        <li key={i}>{point}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default function StaffSection() {
    const [isPaused, setIsPaused] = useState(false);
    const [offset1, setOffset1] = useState(0);
    const [offset2, setOffset2] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Animação automática
    useEffect(() => {
        if (isPaused) return;

        const interval1 = setInterval(() => {
            setOffset1((prev) => {
                const cardWidth = 280 + 24; // width + gap
                const maxOffset = cardWidth * 6;
                if (prev <= -maxOffset) return 0;
                return prev - 1;
            });
        }, 50);

        const interval2 = setInterval(() => {
            setOffset2((prev) => {
                const cardWidth = 280 + 24;
                const maxOffset = cardWidth * 5;
                if (prev >= 0) return -maxOffset;
                return prev + 1;
            });
        }, 60);

        return () => {
            clearInterval(interval1);
            clearInterval(interval2);
        };
    }, [isPaused]);

    const scroll = (direction: 'left' | 'right') => {
        const scrollAmount = 300;
        if (direction === 'left') {
            setOffset1((prev) => prev - scrollAmount);
            setOffset2((prev) => prev - scrollAmount);
        } else {
            setOffset1((prev) => prev + scrollAmount);
            setOffset2((prev) => prev + scrollAmount);
        }
    };

    return (
        <section className="bg-white py-12 md:py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-brand-blue mb-12 text-center text-3xl font-bold md:text-4xl">
                    Nossa Equipe
                </h2>

                <div 
                    ref={containerRef}
                    className="carousel-container relative space-y-8"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Seta esquerda */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg transition-all hover:bg-white hover:scale-110"
                        aria-label="Scroll para esquerda"
                    >
                        <ChevronLeft className="h-6 w-6 text-brand-blue" />
                    </button>

                    {/* Seta direita */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg transition-all hover:bg-white hover:scale-110"
                        aria-label="Scroll para direita"
                    >
                        <ChevronRight className="h-6 w-6 text-brand-blue" />
                    </button>

                    <div className="overflow-hidden">
                        {/* Primeira fila - move para a esquerda */}
                        <div className="relative overflow-hidden">
                            <div 
                                className="flex gap-6 transition-transform"
                                style={{ 
                                    transform: `translateX(${offset1}px)`,
                                    transition: isPaused ? 'transform 0.3s ease' : 'none'
                                }}
                            >
                                {[...firstRow, ...firstRow, ...firstRow].map((member, index) => (
                                    <StaffCard key={`row1-${index}`} member={member} />
                                ))}
                            </div>
                        </div>

                        {/* Segunda fila - move para a direita */}
                        <div className="relative mt-8 overflow-hidden">
                            <div 
                                className="flex gap-6 transition-transform"
                                style={{ 
                                    transform: `translateX(${offset2}px)`,
                                    transition: isPaused ? 'transform 0.3s ease' : 'none'
                                }}
                            >
                                {[...secondRow, ...secondRow, ...secondRow].map((member, index) => (
                                    <StaffCard key={`row2-${index}`} member={member} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
