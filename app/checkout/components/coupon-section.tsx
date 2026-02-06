"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Tag } from "lucide-react";

interface AppliedCoupon {
  finalPrice: number;
  discountAmount: number;
  couponDescription: string;
}

interface CouponSectionProps {
  couponCode: string;
  onCouponCodeChange: (code: string) => void;
  appliedCoupon: AppliedCoupon | null;
  couponError: string | null;
  isValidatingCoupon: boolean;
  isLoading: boolean;
  onValidate: () => void;
  onRemove: () => void;
}

export function CouponSection({
  couponCode,
  onCouponCodeChange,
  appliedCoupon,
  couponError,
  isValidatingCoupon,
  isLoading,
  onValidate,
  onRemove,
}: CouponSectionProps) {
  return (
    <div className="space-y-2">
      <Label>Cupom de Desconto (Opcional)</Label>
      {appliedCoupon ? (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
          <Tag className="h-4 w-4 text-green-600" />
          <div className="flex-1">
            <div className="font-medium text-green-900">{couponCode}</div>
            <div className="text-sm text-green-700">
              {appliedCoupon.couponDescription}
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            Remover
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="Digite o código"
            value={couponCode}
            onChange={(e) => onCouponCodeChange(e.target.value.toUpperCase())}
            disabled={isLoading || isValidatingCoupon}
          />
          <Button
            type="button"
            variant="outline"
            onClick={onValidate}
            disabled={isLoading || isValidatingCoupon || !couponCode.trim()}
          >
            {isValidatingCoupon ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Aplicar"
            )}
          </Button>
        </div>
      )}
      {couponError && (
        <p className="text-sm text-red-600">{couponError}</p>
      )}
    </div>
  );
}
