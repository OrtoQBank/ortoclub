"use client";

import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";

import type { CheckoutForm } from "./checkout-schema";

interface PaymentMethodSelectorProps {
  selectedPaymentMethod: "PIX" | "CREDIT_CARD";
  onSelect: (method: "PIX" | "CREDIT_CARD") => void;
}

export function PaymentMethodSelector({
  selectedPaymentMethod,
  onSelect,
}: PaymentMethodSelectorProps) {
  const { register } = useFormContext<CheckoutForm>();

  return (
    <div className="space-y-3">
      <Label>Forma de Pagamento</Label>
      <div className="grid grid-cols-2 gap-3">
        <div
          className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
            selectedPaymentMethod === "PIX"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onSelect("PIX")}
        >
          <div className="text-center">
            <div className="font-semibold">PIX</div>
            <div className="text-sm text-gray-600">Desconto especial</div>
          </div>
        </div>
        <div
          className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
            selectedPaymentMethod === "CREDIT_CARD"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onSelect("CREDIT_CARD")}
        >
          <div className="text-center">
            <div className="font-semibold">Cartão</div>
            <div className="text-sm text-gray-600">Aprovação imediata</div>
          </div>
        </div>
      </div>
      <input type="hidden" {...register("paymentMethod")} />
    </div>
  );
}
