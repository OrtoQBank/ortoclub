"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";

import type { CheckoutForm } from "./checkout-schema";

interface CreditCardFieldsProps {
  isLoading: boolean;
  selectedInstallments: number;
  onInstallmentsChange: (value: number) => void;
  appliedCouponFinalPrice: number | null;
  regularPrice: number;
}

export function CreditCardFields({
  isLoading,
  selectedInstallments,
  onInstallmentsChange,
  appliedCouponFinalPrice,
  regularPrice,
}: CreditCardFieldsProps) {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<CheckoutForm>();

  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="font-semibold">Dados do Cartão</h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-12">
        <div className="col-span-2 space-y-2 md:col-span-6">
          <Label htmlFor="cardNumber">Número do Cartão</Label>
          <Input
            id="cardNumber"
            placeholder="0000 0000 0000 0000"
            {...register("cardNumber")}
            disabled={isLoading}
            maxLength={23}
            onChange={(e) => {
              const value = e.target.value.replaceAll(/\D/g, "");
              const formatted = value.replaceAll(/(\d{4})(?=\d)/g, "$1 ");
              setValue("cardNumber", formatted);
            }}
          />
          {errors.cardNumber && (
            <p className="text-sm text-red-600">
              {errors.cardNumber.message}
            </p>
          )}
        </div>

        <div className="col-span-1 space-y-2 md:col-span-3">
          <Label htmlFor="cardExpiry">Validade</Label>
          <Input
            id="cardExpiry"
            placeholder="MM/AA"
            {...register("cardExpiry")}
            disabled={isLoading}
            maxLength={5}
            className="text-center"
            onChange={(e) => {
              let value = e.target.value.replaceAll(/\D/g, "");
              if (value.length >= 2) {
                value = value.slice(0, 2) + "/" + value.slice(2, 4);
              }
              setValue("cardExpiry", value);
            }}
          />
          {errors.cardExpiry && (
            <p className="text-xs text-red-600">
              {errors.cardExpiry.message}
            </p>
          )}
        </div>

        <div className="col-span-1 space-y-2 md:col-span-3">
          <Label htmlFor="cardCvv">CVV</Label>
          <Input
            id="cardCvv"
            placeholder="CVV"
            {...register("cardCvv")}
            disabled={isLoading}
            maxLength={4}
            className="text-center"
            onChange={(e) => {
              const value = e.target.value.replaceAll(/\D/g, "");
              setValue("cardCvv", value);
            }}
          />
          {errors.cardCvv && (
            <p className="text-xs text-red-600">
              {errors.cardCvv.message}
            </p>
          )}
        </div>
      </div>

      {/* Installments */}
      <div className="space-y-2 border-t pt-4">
        <Label>Parcelamento</Label>
        <select
          value={selectedInstallments}
          onChange={(e) => onInstallmentsChange(Number(e.target.value))}
          disabled={isLoading}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
            const priceForInstallments =
              appliedCouponFinalPrice ?? regularPrice;
            const installmentValue = priceForInstallments / num;
            return (
              <option key={num} value={num}>
                {num === 1
                  ? `À vista - R$ ${priceForInstallments.toFixed(2)}`
                  : `${num}x de R$ ${installmentValue.toFixed(2)}`}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
