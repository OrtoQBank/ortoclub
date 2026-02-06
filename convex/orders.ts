import { v } from "convex/values";

import { api } from "./_generated/api";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";

/**
 * Create a new order (Step 1 of checkout flow)
 */
export const createOrder = mutation({
  args: {
    email: v.string(),
    cpf: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    address: v.optional(v.string()),
    addressNumber: v.optional(v.string()),
    productSlug: v.string(),
    paymentMethod: v.string(), // 'PIX' or 'CREDIT_CARD'
    couponCode: v.optional(v.string()),
  },
  returns: v.object({
    orderId: v.id("orders"),
    priceBreakdown: v.object({
      originalPrice: v.number(),
      couponDiscount: v.number(),
      pixDiscount: v.number(),
      finalPrice: v.number(),
    }),
  }),
  handler: async (ctx, args) => {
    // Get product by slug
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.productSlug))
      .unique();

    if (!product || !product.isActive) {
      throw new Error("Product not found or inactive");
    }

    // Base prices from the product
    const regularPrice = product.price;
    const pixPrice = product.pixPrice || regularPrice;

    if (regularPrice <= 0 || pixPrice <= 0) {
      throw new Error("Invalid product price");
    }

    // Determine which base price to use based on payment method
    const basePrice = args.paymentMethod === "PIX" ? pixPrice : regularPrice;
    let finalPrice = basePrice;
    let couponDiscount = 0;
    let appliedCouponCode: string | undefined;

    // Apply coupon if provided
    if (args.couponCode && args.couponCode.trim()) {
      const couponResult = await ctx.runQuery(
        api.coupons.validateAndApplyCoupon,
        {
          code: args.couponCode,
          originalPrice: basePrice,
          userCpf: args.cpf.replaceAll(/\D/g, ""),
          productId: product._id,
        }
      );

      if (couponResult.isValid) {
        finalPrice = couponResult.finalPrice;
        couponDiscount = couponResult.discountAmount;
        appliedCouponCode = args.couponCode.toUpperCase();
        console.log(
          `✅ Applied coupon ${appliedCouponCode}: -R$ ${couponDiscount}`
        );
      } else {
        throw new Error(couponResult.errorMessage || "Cupom inválido");
      }
    }

    // Calculate PIX savings
    const pixDiscount =
      args.paymentMethod === "PIX" ? regularPrice - pixPrice : 0;

    // Round to 2 decimal places
    finalPrice = Math.round(finalPrice * 100) / 100;
    couponDiscount = Math.round(couponDiscount * 100) / 100;

    if (finalPrice <= 0) {
      throw new Error("Invalid final price");
    }

    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    // Create order
    const orderId = await ctx.db.insert("orders", {
      email: args.email,
      cpf: args.cpf.replaceAll(/\D/g, ""),
      name: args.name,
      phone: args.phone,
      postalCode: args.postalCode?.replaceAll(/\D/g, ""),
      address: args.address,
      addressNumber: args.addressNumber || "SN",
      productId: product._id,
      productName: product.name,
      originalPrice: regularPrice,
      finalPrice,
      couponCode: appliedCouponCode,
      couponDiscount,
      pixDiscount,
      paymentMethod: args.paymentMethod,
      status: "pending",
      accessExpiresAt: product.accessExpiresAt,
      createdAt: now,
      expiresAt: now + sevenDays,
    });

    console.log(`📝 Created order ${orderId}`);
    console.log(
      `💰 Price breakdown: Method=${args.paymentMethod}, Base R$ ${basePrice}, Coupon R$ ${couponDiscount}, Final R$ ${finalPrice}`
    );

    return {
      orderId,
      priceBreakdown: {
        originalPrice: regularPrice,
        couponDiscount,
        pixDiscount,
        finalPrice,
      },
    };
  },
});

/**
 * Link payment to order (Step 2 of checkout flow)
 */
export const linkPaymentToOrder = mutation({
  args: {
    orderId: v.id("orders"),
    asaasPaymentId: v.string(),
    asaasCustomerId: v.optional(v.string()),
    installmentCount: v.optional(v.number()),
    pixData: v.optional(
      v.object({
        qrPayload: v.optional(v.string()),
        qrCodeBase64: v.optional(v.string()),
        expirationDate: v.optional(v.string()),
      })
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      asaasPaymentId: args.asaasPaymentId,
      asaasCustomerId: args.asaasCustomerId,
      installmentCount: args.installmentCount,
      pixData: args.pixData,
    });

    console.log(
      `🔗 Linked payment ${args.asaasPaymentId} to order ${args.orderId}`
    );
    if (args.installmentCount && args.installmentCount > 1) {
      console.log(`💳 Installment payment: ${args.installmentCount}x`);
    }
    return null;
  },
});

/**
 * Get order by ID (public query for frontend)
 */
export const getOrderById = query({
  args: {
    orderId: v.id("orders"),
  },
  returns: v.union(
    v.object({
      _id: v.id("orders"),
      email: v.string(),
      cpf: v.string(),
      name: v.string(),
      productId: v.id("products"),
      productName: v.string(),
      originalPrice: v.number(),
      finalPrice: v.number(),
      couponCode: v.optional(v.string()),
      couponDiscount: v.optional(v.number()),
      pixDiscount: v.optional(v.number()),
      paymentMethod: v.string(),
      status: v.string(),
      asaasPaymentId: v.optional(v.string()),
      installmentCount: v.optional(v.number()),
      pixData: v.optional(
        v.object({
          qrPayload: v.optional(v.string()),
          qrCodeBase64: v.optional(v.string()),
          expirationDate: v.optional(v.string()),
        })
      ),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      return null;
    }
    return {
      _id: order._id,
      email: order.email,
      cpf: order.cpf,
      name: order.name,
      productId: order.productId,
      productName: order.productName,
      originalPrice: order.originalPrice,
      finalPrice: order.finalPrice,
      couponCode: order.couponCode,
      couponDiscount: order.couponDiscount,
      pixDiscount: order.pixDiscount,
      paymentMethod: order.paymentMethod,
      status: order.status,
      asaasPaymentId: order.asaasPaymentId,
      installmentCount: order.installmentCount,
      pixData: order.pixData,
    };
  },
});

/**
 * Check payment status (for real-time UI updates)
 */
export const checkPaymentStatus = query({
  args: {
    orderId: v.id("orders"),
  },
  returns: v.object({
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("failed")
    ),
    orderDetails: v.optional(
      v.object({
        email: v.string(),
        productName: v.string(),
        finalPrice: v.number(),
      })
    ),
    pixData: v.optional(
      v.object({
        qrPayload: v.optional(v.string()),
        qrCodeBase64: v.optional(v.string()),
        expirationDate: v.optional(v.string()),
      })
    ),
  }),
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);

    if (!order) {
      return { status: "failed" as const };
    }

    if (
      order.status === "paid" ||
      order.status === "provisioning" ||
      order.status === "completed"
    ) {
      return {
        status: "confirmed" as const,
        orderDetails: {
          email: order.email,
          productName: order.productName,
          finalPrice: order.finalPrice,
        },
        pixData: order.pixData,
      };
    }

    return {
      status: "pending" as const,
      orderDetails: {
        email: order.email,
        productName: order.productName,
        finalPrice: order.finalPrice,
      },
      pixData: order.pixData,
    };
  },
});

/**
 * Get order by Asaas payment ID (internal, for webhook processing)
 */
export const getOrderByAsaasPaymentId = internalQuery({
  args: {
    asaasPaymentId: v.string(),
  },
  returns: v.union(
    v.object({
      _id: v.id("orders"),
      email: v.string(),
      name: v.string(),
      productId: v.id("products"),
      productName: v.string(),
      finalPrice: v.number(),
      status: v.string(),
      installmentCount: v.optional(v.number()),
      couponCode: v.optional(v.string()),
      couponDiscount: v.optional(v.number()),
      accessExpiresAt: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_asaas_payment", (q) =>
        q.eq("asaasPaymentId", args.asaasPaymentId)
      )
      .unique();

    if (!order) {
      return null;
    }

    return {
      _id: order._id,
      email: order.email,
      name: order.name,
      productId: order.productId,
      productName: order.productName,
      finalPrice: order.finalPrice,
      status: order.status,
      installmentCount: order.installmentCount,
      couponCode: order.couponCode,
      couponDiscount: order.couponDiscount,
      accessExpiresAt: order.accessExpiresAt,
    };
  },
});

/**
 * Confirm payment and update order status (internal, called from webhook)
 */
export const confirmPayment = internalMutation({
  args: {
    orderId: v.id("orders"),
    asaasPaymentId: v.string(),
  },
  returns: v.union(
    v.object({
      email: v.string(),
      name: v.string(),
      productId: v.id("products"),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);

    if (!order) {
      console.error(`No order found: ${args.orderId}`);
      return null;
    }

    if (
      order.status === "paid" ||
      order.status === "provisioning" ||
      order.status === "completed"
    ) {
      console.log(`Order ${args.orderId} already processed, skipping`);
      return {
        email: order.email,
        name: order.name,
        productId: order.productId,
      };
    }

    // Update order status to paid
    await ctx.db.patch(args.orderId, {
      status: "paid",
      paidAt: Date.now(),
      asaasPaymentId: args.asaasPaymentId,
    });

    console.log(`✅ Payment confirmed for order ${args.orderId}`);

    // Track coupon usage
    if (order.couponCode) {
      const coupon = await ctx.db
        .query("coupons")
        .withIndex("by_code", (q) => q.eq("code", order.couponCode!))
        .unique();

      if (coupon) {
        await ctx.db.insert("couponUsage", {
          couponId: coupon._id,
          couponCode: order.couponCode,
          orderId: args.orderId,
          userEmail: order.email,
          userCpf: order.cpf,
          discountAmount: order.couponDiscount || 0,
          usedAt: Date.now(),
        });

        const currentUses = coupon.currentUses || 0;
        await ctx.db.patch(coupon._id, {
          currentUses: currentUses + 1,
        });

        console.log(
          `📊 Confirmed coupon usage: ${order.couponCode} (${currentUses + 1}/${coupon.maxUses || "∞"})`
        );
      }
    }

    return {
      email: order.email,
      name: order.name,
      productId: order.productId,
    };
  },
});

/**
 * Update order status to provisioning and record provisioning status
 */
export const updateProvisioningStatus = internalMutation({
  args: {
    orderId: v.id("orders"),
    provisioningStatus: v.array(
      v.object({
        deploymentId: v.id("deployments"),
        deploymentName: v.string(),
        status: v.string(),
        provisionedAt: v.optional(v.number()),
        error: v.optional(v.string()),
      })
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const allSuccessful = args.provisioningStatus.every(
      (s) => s.status === "success"
    );
    const anyFailed = args.provisioningStatus.some(
      (s) => s.status === "failed"
    );

    await ctx.db.patch(args.orderId, {
      status: allSuccessful ? "completed" : anyFailed ? "provisioning" : "paid",
      provisioningStatus: args.provisioningStatus,
      completedAt: allSuccessful ? Date.now() : undefined,
    });

    console.log(
      `📦 Updated provisioning status for order ${args.orderId}:`,
      args.provisioningStatus
    );
    return null;
  },
});

/**
 * Link Clerk user to order (called when user accepts invitation)
 */
export const linkClerkUserToOrder = internalMutation({
  args: {
    email: v.string(),
    clerkUserId: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    orderId: v.optional(v.id("orders")),
  }),
  handler: async (ctx, args) => {
    // Find the most recent paid order for this email
    const order = await ctx.db
      .query("orders")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .order("desc")
      .first();

    if (!order) {
      console.log(`No order found for email: ${args.email}`);
      return { success: false };
    }

    // Update order with Clerk user ID
    await ctx.db.patch(order._id, {
      clerkUserId: args.clerkUserId,
    });

    console.log(
      `🔗 Linked Clerk user ${args.clerkUserId} to order ${order._id}`
    );
    return { success: true, orderId: order._id };
  },
});
