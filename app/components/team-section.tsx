'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StaffMember {
  id: number;
  name: string;
  description: string[];
  imageUrl: string;
}

const staffMembers: StaffMember[] = [
  {
    id: 1,
    name: 'Daniel Duarte Perini',
    imageUrl: '/medico1.jpg',
    description: [
      '7° lugar TEOT 2025','Cirurgia da Coluna Vertebral (IOT-HCFMUSP)', '⁠Ortopedista pelo Instituto de Ortopedia e Traumatologia do HC-FMUSP', 'Médico pela Faculdade de Medicina da USP'],
  },
  {
    id: 2,
    name: 'Vitor Ricardo Moraes',
    imageUrl: '/medico2.jpg',
    description: ['1° lugar TEOT 2025','Cirurgia do Joelho (IOT-HCFMUSP)', 'Ortopedista pelo Instituto de Ortopedia e Traumatologia do HC-FMUSP','Médico pela Faculdade de Medicina da USP'],
  },
  {
    id: 3,
    name: 'Rodrigo Astolfi',
    imageUrl: '/rodrigo-astolfi.webp',
    description: [
      'Cirurgia do Pé e Tornozelo (IOT-HCFMUSP)',
      'Médico pela Faculdade de Medicina da USP',
      'Ortopedista pela Faculdade de Medicina da USP',
      'Mestre e Doutor pela Universidade Federal do Ceará',
    ],
  },
  {
    id: 4,
    name: 'Diogo Kenzo Takazono',
    imageUrl: '/diogo-kenzo.webp',
    description: [
      'Cirurgia da Mão e Microcirurgia (IOT-HCFMUSP)',
      'Ortopedista pelo Instituto de Ortopedia e Traumatologia do HC-FMUSP',
      'Médico pela Faculdade de Medicina da USP',
    ],
  },
  {
    id: 5,
    name: 'Thales Augusto Tomé',
    imageUrl: '/thales-augusto.webp',
    description: [
      'Cirurgia da Mão e Microcirurgia (IOT-HCFMUSP)',
      'Ortopedista pelo Instituto de Ortopedia e Traumatologia do HC-FMUSP',
      'Médico pela Faculdade de Medicina da USP',
    ],
  },
  {
    id: 6,
    name: 'Felippi Guizardi Cordeiro',
    imageUrl: '/felippi-guisard.webp',
    description: [
      'Ortopedia Pediátrica (IOT-HCFMUSP)',
      'Ortopedista pelo Instituto de Ortopedia e Traumatologia do HC-FMUSP',
      'Médico pela Faculdade de Medicina da USP',
    ],
  },
  {
    id: 7,
    name: 'João Victor Belfort',
    imageUrl: '/joao-victor.webp',
    description: [
      '4° lugar TEOT 2025',
      'Cirurgia do Joelho (IOT-HCFMUSP)',
      'Ortopedista pelo Instituto de Ortopedia e Traumatologia do HC-FMUSP',
      'Médico pela Faculdade de Medicina da UFPE',
    ],
  },
  {
    id: 8,
    name: 'Vinícius Santos Aragão',
    imageUrl: '/vinicius-antonio.webp',
    description: [
      'Cirurgia da Coluna Vertebral (IOT-HCFMUSP)',
      'Ortopedista pelo Instituto de Ortopedia e Traumatologia do HC-FMUSP',
      'Médico pela Faculdade de Medicina da UFS',
    ],
  },
  {
    id: 9,
    name: 'Gil Goulart Choi',
    imageUrl: '/gil-goulart.webp',
    description: [
      'Cirurgia da Coluna Vertebral (IOT-HCFMUSP)',
      'Ortopedista pelo Instituto de Ortopedia e Traumatologia do HC-FMUSP',
      'Médico pela Faculdade de Medicina da USP',
    ],
  },
  {
    id: 10,
    name: 'Gustavo Lage',
    imageUrl: '/gustavo-lage.webp',
    description: [
      'Cirurgia do Quadril (IOT-HCFMUSP)',
      'Ortopedista pelo Instituto de Ortopedia e Traumatologia do HC-FMUSP',
      'Médico pela Faculdade de Ciências Médicas da Santa Casa de São Paulo',
    ],
  },
  {
    id: 11,
    name: 'Lucas Capello Smarieri',
    imageUrl: '/lucas-capello.webp',
    description: [
      'Cirurgia do Ombro e Cotovelo (IOT-HCFMUSP)',
      'Ortopedista pelo Instituto de Ortopedia e Traumatologia do HC-FMUSP',
      'Médico pela Faculdade de Medicina de Ribeirão Preto da USP',
    ],
  },
  {
    id: 12,
    name: 'Giovanni Fornino',
    imageUrl: '/giovanni-fornino.webp',
    description: [
      'Cirurgia do Pé e Tornozelo (IOT-HCFMUSP)',
      'Ortopedista pela Faculdade de Ciências Médicas da Santa Casa de São Paulo',
      'Médico pela Faculdade de Ciências Médicas da Santa Casa de São Paulo',
    ],
  },
];

function StaffCard({ member }: { member: StaffMember }) {
  return (
    <div className="border-brand-blue/20 w-[240px] sm:w-[280px] flex-shrink-0 overflow-hidden rounded-lg border bg-white shadow-lg">
      <div className="overflow-hidden">
        <Image
          src={member.imageUrl || '/placeholder.svg'}
          alt={`Foto de ${member.name}`}
          width={280}
          height={280}
          className="h-[240px] w-[240px] sm:h-[280px] sm:w-[280px] object-cover"
        />
      </div>
      <div className="space-y-1 p-3 sm:p-4">
        <h2 className="text-lg  text-brand-blue font-semibold">{member.name}</h2>
        {(member.id === 1 || member.id === 2 || member.id === 7) && (
          <p className="text-sm font-semibold text-gray-900">
            {member.description[0]}
          </p>
        )}

        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
          {member.description.map((point, i) => {
            if (
              (member.id === 1 || member.id === 2 || member.id === 7) &&
              i === 0
            ) {
              return null // remove da lista
            }

            return <li key={i}>{point}</li>
          })}
        </ul>
      </div>
    </div>
  );
}

export default function StaffSection() {
  // ✅ primeira fila fixa com 1,2,3
  const firstRow = useMemo(() => staffMembers.slice(0, 3), []);

  // ✅ segunda fila: resto (4..12) em carrossel infinito por clique
  const baseRow = useMemo(() => staffMembers.filter((m) => m.id > 3), []);
  const [items, setItems] = useState<StaffMember[]>(baseRow);

  const [translate, setTranslate] = useState(0);
  const [animating, setAnimating] = useState(false);
  const directionRef = useRef<'left' | 'right'>('right');

  const getStep = useCallback(() => {
    // card + gap (gap-4=16px | md:gap-6=24px)
    if (typeof window === 'undefined') return 280 + 24;
    return window.innerWidth < 640 ? 240 + 16 : 280 + 24;
  }, []);

  // se mudar de tamanho (mobile/desktop), mantém alinhado
  useEffect(() => {
    const onResize = () => {
      if (!animating) setTranslate(0);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [animating]);

  const scroll = useCallback(
    (dir: 'left' | 'right') => {
      if (animating) return;

      directionRef.current = dir;
      setAnimating(true);

      const step = getStep();
      setTranslate(dir === 'right' ? -step : step);
    },
    [animating, getStep]
  );

  const onTransitionEnd = useCallback(() => {
    if (!animating) return;

    setItems((prev) => {
      if (prev.length <= 1) return prev;

      if (directionRef.current === 'right') {
        // move primeiro para o final
        const [first, ...rest] = prev;
        return [...rest, first];
      } else {
        // move último para o começo
        const last = prev[prev.length - 1];
        const rest = prev.slice(0, -1);
        return [last, ...rest];
      }
    });

    // reseta sem animar (não dá “reh”)
    setTranslate(0);
    setAnimating(false);
  }, [animating]);

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-brand-blue mb-8 md:mb-12 text-center text-2xl sm:text-3xl font-bold md:text-4xl">
          Nossa Equipe
        </h1>
        <h2 className="text-black mb-8 md:mb-12 text-center text-lg sm:text-3xl font-bold md:text-2xl">Fundadores</h2>

        <div className="relative space-y-6 md:space-y-8">
          {/* Primeira fila - estática (1,2,3) */}
          <div className="overflow-hidden">
            <div className="flex justify-center gap-4 md:gap-6">
              {firstRow.map((member) => (
                <StaffCard key={member.id} member={member} />
              ))}
            </div>
          </div>
          

          <h2 className="text-black mb-8 md:mb-12 text-center text-lg sm:text-3xl font-bold md:text-2xl">Professores</h2>
          {/* Segunda fila - carrossel infinito */}
          <div className="relative overflow-hidden">
            {/* setas só para a segunda fila */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-1 md:left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 md:p-3 shadow-lg transition-all hover:bg-white hover:scale-110"
              aria-label="Scroll para esquerda"
            >
              <ChevronLeft className="h-4 w-4 md:h-6 md:w-6 text-brand-blue" />
            </button>

            <button
              onClick={() => scroll('right')}
              className="absolute right-1 md:right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 md:p-3 shadow-lg transition-all hover:bg-white hover:scale-110"
              aria-label="Scroll para direita"
            >
              <ChevronRight className="h-4 w-4 md:h-6 md:w-6 text-brand-blue" />
            </button>

            <div
              className="flex gap-4 md:gap-6 will-change-transform"
              onTransitionEnd={onTransitionEnd}
              style={{
                transform: `translateX(${translate}px)`,
                transition: animating ? 'transform 0.25s ease' : 'none',
              }}
            >
              {items.map((member) => (
                <StaffCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

