'use client';

import { useState } from 'react';
import { useAction } from 'convex/react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/convex/_generated/api';

interface LeadCaptureButtonProps {
  produto: string;
  redirectUrl: string;
  children: React.ReactNode;
  className?: string;
}

const RESIDENCY_LEVELS = ['R1', 'R2', 'R3', 'Já concluí'] as const;
const SUBSPECIALTIES = [
  'Pediátrica',
  'Tumor',
  'Quadril',
  'Joelho',
  'Ombro e Cotovelo',
  'Mão',
  'Coluna',
  'Pé e Tornozelo',
] as const;

type ResidencyLevel = (typeof RESIDENCY_LEVELS)[number];
type Subspecialty = (typeof SUBSPECIALTIES)[number];

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function phoneDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export default function LeadCaptureButton({
  produto,
  redirectUrl,
  children,
  className,
}: LeadCaptureButtonProps) {
  const [open, setOpen] = useState(false);
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [numero, setNumero] = useState('');
  const [residencyLevel, setResidencyLevel] = useState<ResidencyLevel | ''>('');
  const [subspecialty, setSubspecialty] = useState<Subspecialty | ''>('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const createLead = useAction(api.leads.createLead);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!residencyLevel || !subspecialty) {
      setMessage('Por favor, preencha todos os campos obrigatórios.');
      setIsError(true);
      return;
    }

    if (phoneDigits(numero).length !== 11) {
      setMessage('O número de telefone deve ter 11 dígitos (DDD + número).');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const result = await createLead({
        nomeCompleto,
        numero: phoneDigits(numero),
        email,
        produto,
        residencyLevel,
        subspecialty,
      });

      if (result.status === 'email_already_exists') {
        setMessage('Este email já está cadastrado!');
        setIsError(true);
        setIsLoading(false);
        return;
      }

      setMessage('Obrigado! Redirecionando...');
      setIsError(false);

      // Redirect immediately (synchronous with user event) to avoid popup blockers.
      // Loading state is kept until after redirect so the button stays disabled.
      if (redirectUrl) {
        window.open(redirectUrl, '_blank');
      }
      setOpen(false);
      setNomeCompleto('');
      setEmail('');
      setNumero('');
      setResidencyLevel('');
      setSubspecialty('');
      setMessage('');
      setIsLoading(false);
    } catch {
      setMessage('Erro ao cadastrar. Tente novamente.');
      setIsError(true);
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        {children}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Preencha seus dados</DialogTitle>
            <DialogDescription>
              Complete o formulário abaixo para continuar.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="* Nome completo"
              value={nomeCompleto}
              onChange={e => setNomeCompleto(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              type="email"
              placeholder="* E-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              type="tel"
              placeholder="* WhatsApp (DDD + número)"
              value={numero}
              onChange={e => setNumero(formatPhone(e.target.value))}
              maxLength={16}
              required
              disabled={isLoading}
            />
            <Select
              value={residencyLevel}
              onValueChange={value => setResidencyLevel(value as ResidencyLevel)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="* Nível atual na Residência" />
              </SelectTrigger>
              <SelectContent>
                {RESIDENCY_LEVELS.map(level => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={subspecialty}
              onValueChange={value => setSubspecialty(value as Subspecialty)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="* Subespecialidade que deseja seguir" />
              </SelectTrigger>
              <SelectContent>
                {SUBSPECIALTIES.map(spec => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="submit"
              className="hover:bg-opacity-90 bg-white text-brand-blue font-semibold py-3"
              disabled={isLoading}
            >
              {isLoading ? 'Cadastrando...' : 'Continuar'}
            </Button>
            <p className="text-xs text-center text-gray-500">
              Política de Privacidade e Termos de Uso
            </p>
            {message && (
              <p className={`text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>
                {message}
              </p>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
