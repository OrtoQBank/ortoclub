"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import type { CheckoutForm } from "./checkout-schema";

interface AddressFieldsProps {
  isLoading: boolean;
}

export function AddressFields({ isLoading }: AddressFieldsProps) {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<CheckoutForm>();
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replaceAll(/\D/g, "");
    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cleanCep}/json/`
        );
        const data = await response.json();
        if (!data.erro) {
          setValue("address", `${data.logradouro}, ${data.bairro}`);
          setValue("postalCode", data.cep);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="font-semibold">Endereço</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="postalCode">CEP *</Label>
          <div className="relative">
            <Input
              id="postalCode"
              placeholder="00000-000"
              {...register("postalCode")}
              disabled={isLoading || isLoadingCep}
              maxLength={9}
              onChange={(e) => {
                const value = e.target.value.replaceAll(/\D/g, "");
                const formatted = value.replace(
                  /(\d{5})(\d{3})/,
                  "$1-$2"
                );
                e.target.value = formatted;
                handleCepChange(formatted);
              }}
            />
            {isLoadingCep && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
            )}
          </div>
          {errors.postalCode && (
            <p className="text-sm text-red-600">
              {errors.postalCode.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            placeholder="(11) 99999-9999"
            {...register("phone")}
            disabled={isLoading}
            maxLength={15}
            onChange={(e) => {
              const value = e.target.value.replaceAll(/\D/g, "");
              const formatted = value.replace(
                /(\d{2})(\d{5})(\d{4})/,
                "($1) $2-$3"
              );
              e.target.value = formatted;
            }}
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="address">Endereço *</Label>
              <Input
                id="address"
                placeholder="Rua, Avenida, etc"
                {...register("address")}
                disabled={isLoading}
              />
              {errors.address && (
                <p className="text-sm text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressNumber">Número</Label>
              <Input
                id="addressNumber"
                placeholder="123"
                {...register("addressNumber")}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
