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

    if (!coupon.active) {
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
    if (coupon.maxUses && (coupon.currentUses ?? 0) >= coupon.maxUses) {
      return {
        isValid: false as const,
        errorMessage: "Cupom esgotado",
      };
    }

    // Calculate discount
    let discountAmount = 0;
    let finalPrice = args.originalPrice;
    let description = "";

    switch (coupon.type) {
      case "percentage": {
        discountAmount = (args.originalPrice * coupon.value) / 100;
        finalPrice = args.originalPrice - discountAmount;
        description = `${coupon.value}% de desconto`;
        break;
      }
      case "fixed": {
        discountAmount = Math.min(coupon.value, args.originalPrice);
        finalPrice = args.originalPrice - discountAmount;
        description = `R$ ${coupon.value.toFixed(2)} de desconto`;
        break;
      }
      case "fixed_price": {
        discountAmount = args.originalPrice - coupon.value;
        finalPrice = coupon.value;
        description = `Preço fixo: R$ ${coupon.value.toFixed(2)}`;
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
        type: coupon.type,
        value: coupon.value,
        description,
      },
    };
  },
});
