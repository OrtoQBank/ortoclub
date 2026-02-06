'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { api } from '@/convex/_generated/api';

interface LeadFormDialogProps {
  productSlug: string;
  productDisplayName: string;
  buttonText: string;
  buttonClassName?: string;
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

export default function LeadFormDialog({
  productSlug,
  productDisplayName,
  buttonText,
  buttonClassName,
}: LeadFormDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [numero, setNumero] = useState('');
  const [residencyLevel, setResidencyLevel] = useState<ResidencyLevel | ''>('');
  const [subspecialty, setSubspecialty] = useState<Subspecialty | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const createLead = useMutation(api.leads.createLead);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!residencyLevel || !subspecialty) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await createLead({
        nomeCompleto,
        numero,
        email,
        produto: productDisplayName,
        residencyLevel,
        subspecialty,
      });

      // Redirect to checkout with lead data pre-filled
      const params = new URLSearchParams({
        product: productSlug,
        name: nomeCompleto,
        email,
        phone: numero,
      });
      router.push(`/checkout?${params.toString()}`);
    } catch {
      setError('Erro ao cadastrar. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          buttonClassName ||
          'inline-flex items-center justify-center rounded-lg bg-brand-blue px-8 py-3 text-white font-semibold shadow-md hover:opacity-95 transition cursor-pointer'
        }
      >
        {buttonText}
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold text-gray-900 text-center">
              Garanta o seu acesso!
            </DialogTitle>
            <DialogDescription className="text-center">
              Preencha seus dados para continuar para o pagamento.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="* Nome Completo"
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              type="email"
              placeholder="* E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              type="tel"
              placeholder="* WhatsApp"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              required
              disabled={isLoading}
            />
            <Select
              value={residencyLevel}
              onValueChange={(value) => setResidencyLevel(value as ResidencyLevel)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="* Nível atual na Residência" />
              </SelectTrigger>
              <SelectContent>
                {RESIDENCY_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={subspecialty}
              onValueChange={(value) => setSubspecialty(value as Subspecialty)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="* Subespecialidade que deseja seguir" />
              </SelectTrigger>
              <SelectContent>
                {SUBSPECIALTIES.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {error && (
              <p className="text-center text-red-500 text-sm">{error}</p>
            )}

            <Button
              type="submit"
              className="hover:bg-opacity-90 bg-brand-blue text-white font-semibold py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                'Garantir o meu acesso'
              )}
            </Button>

            <p className="text-xs text-center text-gray-500">
              Seus dados estão seguros. Política de Privacidade e Termos de Uso.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
