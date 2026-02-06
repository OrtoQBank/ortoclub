import { v } from "convex/values";

import { query } from "./_generated/server";

/**
 * Validate and apply a coupon code
 */
export const validateAndApplyCoupon = query({
  args: {
    code: v.string(),
    originalPrice: v.number(),
    userCpf: v.optional(v.string()),
    productId: v.optional(v.id("products")),
  },
  returns: v.union(
    v.object({
      isValid: v.literal(true),
      finalPrice: v.number(),
      discountAmount: v.number(),
      couponDescription: v.string(),
      coupon: v.object({
        _id: v.id("coupons"),
        code: v.string(),
        type: v.union(
          v.literal("percentage"),
          v.literal("fixed"),
          v.literal("fixed_price")
        ),
        value: v.number(),
        description: v.string(),
      }),
    }),
    v.object({
      isValid: v.literal(false),
      errorMessage: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const coupon = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .unique();

    if (!coupon) {
      return {
        isValid: false as const,
        errorMessage: "Cupom não encontrado",
      };
    }

    if (!coupon.isActive) {
      return {
        isValid: false as const,
        errorMessage: "Cupom inativo",
      };
    }

    // Check validity dates
    const now = Date.now();
    if (coupon.validFrom && now < coupon.validFrom) {
      return {
        isValid: false as const,
        errorMessage: "Cupom ainda não é válido",
      };
    }

    if (coupon.validUntil && now > coupon.validUntil) {
      return {
        isValid: false as const,
        errorMessage: "Cupom expirado",
      };
    }

    // Check max uses
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return {
        isValid: false as const,
        errorMessage: "Cupom esgotado",
      };
    }

    // Check per-user limit
    if (coupon.maxUsesPerUser && args.userCpf) {
      const userUsages = await ctx.db
        .query("couponUsage")
        .withIndex("by_user_cpf", (q) => q.eq("userCpf", args.userCpf!))
        .collect();

      const userUsageCount = userUsages.filter(
        (u) => u.couponId === coupon._id
      ).length;

      if (userUsageCount >= coupon.maxUsesPerUser) {
        return {
          isValid: false as const,
          errorMessage: "Você já atingiu o limite de uso deste cupom",
        };
      }
    }

    // Check product restriction
    if (coupon.productIds && coupon.productIds.length > 0 && args.productId) {
      if (!coupon.productIds.includes(args.productId)) {
        return {
          isValid: false as const,
          errorMessage: "Cupom não válido para este produto",
        };
      }
    }

    // Calculate discount
    let discountAmount = 0;
    let finalPrice = args.originalPrice;
    let description = "";

    switch (coupon.discountType) {
      case "percentage": {
        discountAmount = (args.originalPrice * coupon.discountValue) / 100;
        finalPrice = args.originalPrice - discountAmount;
        description = `${coupon.discountValue}% de desconto`;
        break;
      }
      case "fixed": {
        discountAmount = Math.min(coupon.discountValue, args.originalPrice);
        finalPrice = args.originalPrice - discountAmount;
        description = `R$ ${coupon.discountValue.toFixed(2)} de desconto`;
        break;
      }
      case "fixed_price": {
        discountAmount = args.originalPrice - coupon.discountValue;
        finalPrice = coupon.discountValue;
        description = `Preço fixo: R$ ${coupon.discountValue.toFixed(2)}`;
        break;
      }
    }

    // Ensure final price is not negative
    finalPrice = Math.max(0, finalPrice);
    discountAmount = Math.round(discountAmount * 100) / 100;
    finalPrice = Math.round(finalPrice * 100) / 100;

    return {
      isValid: true as const,
      finalPrice,
      discountAmount,
      couponDescription: description,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        type: coupon.discountType,
        value: coupon.discountValue,
        description,
      },
    };
  },
});
