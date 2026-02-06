"use client";

import { useState } from "react";

import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

interface UseCouponParams {
  productId: Id<"products"> | undefined;
  productPrice: number;
  productPixPrice: number | undefined;
  selectedPaymentMethod: "PIX" | "CREDIT_CARD";
  cpfValue: string | undefined;
}

export interface AppliedCoupon {
  finalPrice: number;
  discountAmount: number;
  couponDescription: string;
}

export function useCoupon({
  productId,
  productPrice,
  productPixPrice,
  selectedPaymentMethod,
  cpfValue,
}: UseCouponParams) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null
  );
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const handleValidateCoupon = async () => {
    if (!couponCode.trim() || !productId) return;

    setIsValidatingCoupon(true);
    setCouponError(null);

    try {
      const basePrice =
        selectedPaymentMethod === "PIX"
          ? productPixPrice || productPrice
          : productPrice;
      const cleanCpf = cpfValue ? cpfValue.replaceAll(/\D/g, "") : undefined;

      const { ConvexHttpClient } = await import("convex/browser");
      const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

      const result = await client.query(api.coupons.validateAndApplyCoupon, {
        code: couponCode,
        originalPrice: basePrice,
        userCpf: cleanCpf,
        productId,
      });

      if (result.isValid) {
        setAppliedCoupon({
          finalPrice: result.finalPrice,
          discountAmount: result.discountAmount,
          couponDescription: result.couponDescription,
        });
        setCouponError(null);
      } else {
        setCouponError(result.errorMessage);
        setAppliedCoupon(null);
      }
    } catch (err) {
      console.error("Coupon validation error:", err);
      setCouponError("Erro ao validar cupom");
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponError(null);
  };

  return {
    couponCode,
    setCouponCode,
    appliedCoupon,
    couponError,
    isValidatingCoupon,
    handleValidateCoupon,
    handleRemoveCoupon,
  };
}
