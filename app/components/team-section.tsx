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
      '7° lugar TEOT 2025', 'Cirurgia da Coluna Vertebral (IOT-HCFMUSP)', '⁠Ortopedista pelo Instituto de Ortopedia e Traumatologia do HC-FMUSP', 'Médico pela Faculdade de Medicina da USP'],
  },
  {
    id: 2,
    name: 'Vitor Ricardo Moraes',
    imageUrl: '/medico2.jpg',
    description: ['1° lugar TEOT 2025', 'Cirurgia do Joelho (IOT-HCFMUSP)', 'Ortopedista pelo Instituto de Ortopedia e Traumatologia do HC-FMUSP', 'Médico pela Faculdade de Medicina da USP'],
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

function StaffCard({ member, fullWidth = false, smallMobile = false }: { member: StaffMember; fullWidth?: boolean; smallMobile?: boolean }) {
  // smallMobile: cards menores para caber 2 na tela do celular
  const cardWidth = smallMobile
    ? 'w-[calc(50vw-24px)] sm:w-[280px]'
    : fullWidth
      ? 'w-[calc(100vw-80px)] sm:w-[280px]'
      : 'w-[240px] sm:w-[280px]';

  const imageSize = smallMobile
    ? 'h-[calc(50vw-24px)] w-[calc(50vw-24px)] sm:h-[280px] sm:w-[280px]'
    : fullWidth
      ? 'h-[calc(100vw-80px)] w-[calc(100vw-80px)] sm:h-[280px] sm:w-[280px]'
      : 'h-[240px] w-[240px] sm:h-[280px] sm:w-[280px]';

  return (
    <div className={`border-brand-blue/20 shrink-0 overflow-hidden rounded-lg border bg-white shadow-lg ${cardWidth}`}>
      <div className="overflow-hidden">
        <Image
          src={member.imageUrl || '/placeholder.svg'}
          alt={`Foto de ${member.name}`}
          width={280}
          height={280}
          className={`object-cover ${imageSize}`}
        />
      </div>
      <div className="space-y-1 p-2 sm:p-4">
        <h2 className="text-sm sm:text-lg text-brand-blue font-semibold line-clamp-1">{member.name}</h2>
        {(member.id === 1 || member.id === 2 || member.id === 7) && (
          <p className="text-xs sm:text-sm font-semibold text-gray-900">
            {member.description[0]}
          </p>
        )}

        <ul className="list-disc space-y-0.5 sm:space-y-1 pl-3 sm:pl-4 text-[10px] sm:text-xs text-gray-600">
          {member.description.map((point, i) => {
            if (
              (member.id === 1 || member.id === 2 || member.id === 7) &&
              i === 0
            ) {
              return null // remove da lista
            }

            return <li key={i} className="line-clamp-2 sm:line-clamp-none">{point}</li>
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

  // Estado para o carrossel da primeira fila (mobile only)
  const [firstRowItems, setFirstRowItems] = useState<StaffMember[]>(firstRow);
  const [firstRowTranslate, setFirstRowTranslate] = useState(0);
  const [firstRowAnimating, setFirstRowAnimating] = useState(false);
  const firstRowDirectionRef = useRef<'left' | 'right'>('right');
  const [isMobile, setIsMobile] = useState(false);

  // Touch/swipe support
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const firstRowTouchStartX = useRef<number>(0);
  const firstRowTouchEndX = useRef<number>(0);

  const getStep = useCallback(() => {
    // card + gap (gap-4=16px | md:gap-6=24px)
    if (typeof window === 'undefined') return 280 + 24;
    // No mobile: 50vw - 24px (card width) + 16px (gap)
    const mobileCardWidth = (window.innerWidth / 2) - 24;
    return window.innerWidth < 640 ? mobileCardWidth + 16 : 280 + 24;
  }, []);

  // Step para primeira fila (full width no mobile)
  const getFirstRowStep = useCallback(() => {
    if (typeof window === 'undefined') return 280 + 24;
    // No mobile: largura da tela - 80px (padding) + 32px (gap-8)
    return window.innerWidth < 640 ? (window.innerWidth - 80) + 32 : 280 + 24;
  }, []);

  // Detecta se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // se mudar de tamanho (mobile/desktop), mantém alinhado
  useEffect(() => {
    const onResize = () => {
      if (!animating) setTranslate(0);
      if (!firstRowAnimating) setFirstRowTranslate(0);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [animating, firstRowAnimating]);

  // Auto-scroll para segunda fila (Professores)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!animating) {
        directionRef.current = 'right';
        setAnimating(true);
        const step = getStep();
        setTranslate(-step);
      }
    }, 2000); // 2 segundos

    return () => clearInterval(interval);
  }, [animating, getStep]);

  // Auto-scroll para primeira fila (Fundadores - apenas mobile)
  useEffect(() => {
    if (!isMobile) return;

    const interval = setInterval(() => {
      if (!firstRowAnimating) {
        firstRowDirectionRef.current = 'right';
        setFirstRowAnimating(true);
        const step = getFirstRowStep();
        setFirstRowTranslate(-step);
      }
    }, 2500); // 2.5 segundos

    return () => clearInterval(interval);
  }, [isMobile, firstRowAnimating, getFirstRowStep]);

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

  // Scroll para a primeira fila (mobile)
  const scrollFirstRow = useCallback(
    (dir: 'left' | 'right') => {
      if (firstRowAnimating) return;

      firstRowDirectionRef.current = dir;
      setFirstRowAnimating(true);

      const step = getFirstRowStep();
      setFirstRowTranslate(dir === 'right' ? -step : step);
    },
    [firstRowAnimating, getFirstRowStep]
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

  // Transition end para a primeira fila
  const onFirstRowTransitionEnd = useCallback(() => {
    if (!firstRowAnimating) return;

    setFirstRowItems((prev) => {
      if (prev.length <= 1) return prev;

      if (firstRowDirectionRef.current === 'right') {
        const [first, ...rest] = prev;
        return [...rest, first];
      } else {
        const last = prev[prev.length - 1];
        const rest = prev.slice(0, -1);
        return [last, ...rest];
      }
    });

    setFirstRowTranslate(0);
    setFirstRowAnimating(false);
  }, [firstRowAnimating]);

  // Touch handlers para segunda fila (professores)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        scroll('right');
      } else {
        scroll('left');
      }
    }
  }, [scroll]);

  // Touch handlers para primeira fila (fundadores - mobile)
  const handleFirstRowTouchStart = useCallback((e: React.TouchEvent) => {
    firstRowTouchStartX.current = e.touches[0].clientX;
  }, []);

  const handleFirstRowTouchMove = useCallback((e: React.TouchEvent) => {
    firstRowTouchEndX.current = e.touches[0].clientX;
  }, []);

  const handleFirstRowTouchEnd = useCallback(() => {
    const diff = firstRowTouchStartX.current - firstRowTouchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        scrollFirstRow('right');
      } else {
        scrollFirstRow('left');
      }
    }
  }, [scrollFirstRow]);

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-brand-blue mb-8 md:mb-12 text-center text-2xl sm:text-3xl font-bold md:text-4xl">
          Nossa Equipe
        </h1>
        <h2 className=" text-gray-600 mb-8 md:mb-12 text-center text-lg sm:text-2xl font-bold md:text-xl">Fundadores</h2>

        <div className="relative space-y-6 md:space-y-8">
          {/* Primeira fila - carrossel no mobile, estático no desktop */}
          {isMobile ? (
            <div className="relative overflow-hidden">
              <button
                onClick={() => scrollFirstRow('left')}
                className="absolute left-1 top-[70%] z-10 -translate-y-1/2 rounded-full p-2  transition-all hover:bg-white hover:scale-110"
                aria-label="Scroll para esquerda"
              >
                <ChevronLeft className="h-4 w-4 text-brand-blue" />
              </button>

              <button
                onClick={() => scrollFirstRow('right')}
                className="absolute right-1 top-[70%] z-10 -translate-y-1/2 rounded-full p-2  transition-all hover:bg-white hover:scale-110"
                aria-label="Scroll para direita"
              >
                <ChevronRight className="h-4 w-4 text-brand-blue" />
              </button>

              <div
                className="flex justify-center overflow-hidden touch-pan-y"
                onTouchStart={handleFirstRowTouchStart}
                onTouchMove={handleFirstRowTouchMove}
                onTouchEnd={handleFirstRowTouchEnd}
              >
                <div
                  className="flex gap-8 will-change-transform"
                  onTransitionEnd={onFirstRowTransitionEnd}
                  style={{
                    transform: `translateX(${firstRowTranslate}px)`,
                    transition: firstRowAnimating ? 'transform 0.25s ease' : 'none',
                  }}
                >
                  {firstRowItems.map((member) => (
                    <StaffCard key={member.id} member={member} fullWidth />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden">
              <div className="flex justify-center gap-6">
                {firstRow.map((member) => (
                  <StaffCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}


          <h2 className="text-gray-600 mb-8 md:mb-12 text-center text-lg sm:text-2xl font-bold md:text-xl">Professores</h2>
          {/* Segunda fila - carrossel infinito */}
          <div
            className="relative overflow-hidden touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* setas só para a segunda fila - posicionadas na área do texto */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-1 md:left-2 top-[70%] z-10 -translate-y-1/2 rounded-full p-2 md:p-3  transition-all hover:bg-white hover:scale-110"
              aria-label="Scroll para esquerda"
            >
              <ChevronLeft className="h-4 w-4 md:h-6 md:w-6 text-brand-blue" />
            </button>

            <button
              onClick={() => scroll('right')}
              className="absolute right-1 md:right-2 top-[70%] z-10 -translate-y-1/2 rounded-full p-2 md:p-3  transition-all hover:bg-white hover:scale-110"
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
                <StaffCard key={member.id} member={member} smallMobile />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

