import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    imageUrl: v.optional(v.string()),
    onboardingCompleted: v.boolean(),
    role: v.union(
      v.literal("user"),
      v.literal("admin"),
      v.literal("superadmin"),
    ),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("suspended"),
    ),
    hasActiveYearAccess: v.boolean(),
    paid: v.boolean(),
    paymentDate: v.optional(v.number()),
    paymentId: v.optional(v.string()),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded"),
    ),
    testeId: v.optional(v.string()),
  })
    .index("by_clerkUserId", ["clerkUserId"])
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_hasActiveYearAccess", ["hasActiveYearAccess"]),

    coupons: defineTable({
      code: v.string(), // store uppercase
      type: v.union(
        v.literal("percentage"),
        v.literal("fixed"),
        v.literal("fixed_price"),
      ),
      value: v.number(),
      description: v.string(),
      active: v.boolean(),
      validFrom: v.optional(v.number()), // epoch ms
      validUntil: v.optional(v.number()), // epoch ms
      // Usage limits
      currentUses: v.optional(v.number()), // Current total usage count
      maxUses: v.optional(v.number()), // Maximum total uses allowed
    })
      .index("by_code", ["code"]),
  
    // Coupon usage tracking
    couponUsage: defineTable({
      couponId: v.id("coupons"),
      couponCode: v.string(),
      orderId: v.id("orders"),
      userEmail: v.string(),
      userCpf: v.string(),
      discountAmount: v.number(),
      originalPrice: v.number(),
      finalPrice: v.number(),
      usedAt: v.number(),
    })
      .index("by_coupon", ["couponId"])
      .index("by_coupon_user", ["couponCode", "userCpf"])
      .index("by_email", ["userEmail"])
      .index("by_cpf", ["userCpf"]),
  
    // Pricing plans
    pricingPlans: defineTable({
      name: v.string(),
      badge: v.string(),
      originalPrice: v.optional(v.string()), // Marketing strikethrough price
      price: v.string(),
      installments: v.string(),
      installmentDetails: v.string(),
      description: v.string(),
      features: v.array(v.string()),
      buttonText: v.string(),
      // Extended fields for product identification and access control
      productId: v.string(), // e.g., "Ortoclub_2025", "Ortoclub_2026", "premium_pack" - REQUIRED
      category: v.optional(
        v.union(
          v.literal("year_access"),
          v.literal("premium_pack"),
          v.literal("addon"),
        ),
      ),
      year: v.optional(v.number()), // 2025, 2026, 2027, etc. - kept for productId naming/identification
      // Pricing (converted to numbers for calculations)
      regularPriceNum: v.optional(v.number()),
      pixPriceNum: v.optional(v.number()),
      // Access control - year-based
      accessYears: v.optional(v.array(v.number())), // Array of years user gets access to (e.g., [2026, 2027])
      isActive: v.optional(v.boolean()),
      displayOrder: v.optional(v.number()),
    })
      .index("by_product_id", ["productId"])
      .index("by_category", ["category"])
      .index("by_year", ["year"])
      .index("by_active", ["isActive"]),

  // Existing waitlist table
  waitlist: defineTable({
    productName: v.optional(v.string()),
    name: v.string(),
    email: v.string(),
    whatsapp: v.string(),
    instagram: v.optional(v.string()),
    residencyLevel: v.union(
      v.literal("R1"),
      v.literal("R2"),
      v.literal("R3"),
      v.literal("Já concluí")
    ),
    subspecialty: v.union(
      v.literal("Pediátrica"),
      v.literal("Tumor"),
      v.literal("Quadril"),
      v.literal("Joelho"),
      v.literal("Ombro e Cotovelo"),
      v.literal("Mão"),
      v.literal("Coluna"),
      v.literal("Pé e Tornozelo")
    ),
  })
    .index("by_email", ["email"])
    .index("by_product", ["productName"]),

  leads: defineTable({
    nomeCompleto: v.string(),
    numero: v.string(),
    email: v.string(),
    produto: v.string(),
    residencyLevel: v.union(
      v.literal("R1"),
      v.literal("R2"),
      v.literal("R3"),
      v.literal("Já concluí"),
    ),
    subspecialty: v.union(
      v.literal("Pediátrica"),
      v.literal("Tumor"),
      v.literal("Quadril"),
      v.literal("Joelho"),
      v.literal("Ombro e Cotovelo"),
      v.literal("Mão"),
      v.literal("Coluna"),
      v.literal("Pé e Tornozelo"),
    ),
  })
    .index("by_email", ["email"])
    .index("by_produto", ["produto"]),

  // ============================================
  // COMMERCE SYSTEM TABLES
  // ============================================

  // Registry of Convex deployments that can receive provisioning
  deployments: defineTable({
    name: v.string(), // "OrtoQBank", "TEOT", etc.
    slug: v.string(), // "ortoqbank", "teot"
    provisionUrl: v.string(), // "https://ortoqbank.convex.site"
    domain: v.optional(v.string()), // "ortoqbank.com" for Clerk redirects
    isActive: v.boolean(),
  }).index("by_slug", ["slug"]),

  // Simplified product model - no complex pricingPlans
  products: defineTable({
    name: v.string(), // "OrtoQBank 2025", "Combo OrtoQBank + TEOT"
    slug: v.string(), // URL-friendly identifier

    // Pricing with lot support (early bird, etc.)
    lot: v.number(), // 1, 2, 3... for tiered pricing
    price: v.number(), // Current price in BRL (credit card)
    pixPrice: v.optional(v.number()), // Discounted PIX price

    // Target deployments - which Convex apps get access
    targetDeployments: v.array(v.id("deployments")),

    // Access configuration
    accessExpiresAt: v.optional(v.number()), // When access expires (timestamp)

    // Display info
    description: v.optional(v.string()),
    features: v.optional(v.array(v.string())),

    isActive: v.boolean(),
    displayOrder: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_active", ["isActive"])
    .index("by_lot", ["lot"]),

  // Order lifecycle tracking
  orders: defineTable({
    // Customer info
    email: v.string(),
    cpf: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    address: v.optional(v.string()),
    addressNumber: v.optional(v.string()),

    // Product reference
    productId: v.id("products"),
    productName: v.string(), // Denormalized for history

    // Pricing at time of purchase
    originalPrice: v.number(),
    finalPrice: v.number(),
    couponCode: v.optional(v.string()),
    couponDiscount: v.optional(v.number()),
    pixDiscount: v.optional(v.number()),

    // Payment info
    paymentMethod: v.string(), // "PIX" | "CREDIT_CARD"
    installmentCount: v.optional(v.number()),
    asaasPaymentId: v.optional(v.string()),
    asaasCustomerId: v.optional(v.string()),

    // PIX data
    pixData: v.optional(
      v.object({
        qrPayload: v.optional(v.string()),
        qrCodeBase64: v.optional(v.string()),
        expirationDate: v.optional(v.string()),
      })
    ),

    // Status tracking
    status: v.string(), // "pending" | "paid" | "provisioning" | "completed" | "failed"

    // User linking (after Clerk signup)
    clerkUserId: v.optional(v.string()),

    // Access expiration (copied from product at purchase time)
    accessExpiresAt: v.optional(v.number()),

    // Provisioning status per deployment
    provisioningStatus: v.optional(
      v.array(
        v.object({
          deploymentId: v.id("deployments"),
          deploymentName: v.string(),
          status: v.string(), // "pending" | "success" | "failed"
          provisionedAt: v.optional(v.number()),
          error: v.optional(v.string()),
        })
      )
    ),

    // Timestamps
    createdAt: v.number(),
    paidAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    expiresAt: v.optional(v.number()), // Order expiration (for pending orders)
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_asaas_payment", ["asaasPaymentId"]),

 
 

  // Invoice tracking
  invoices: defineTable({
    orderId: v.id("orders"),
    asaasPaymentId: v.string(),
    asaasInvoiceId: v.optional(v.string()),
    status: v.string(), // "pending" | "processing" | "issued" | "failed"
    municipalServiceId: v.string(),
    serviceDescription: v.string(),
    value: v.number(), // Total invoice value
    // Installment info (for reference only)
    installmentNumber: v.optional(v.number()),
    totalInstallments: v.optional(v.number()),
    // Customer info (denormalized for invoice generation)
    customerName: v.string(),
    customerEmail: v.string(),
    customerCpfCnpj: v.string(),
    customerPhone: v.optional(v.string()),
    customerMobilePhone: v.optional(v.string()),
    customerPostalCode: v.optional(v.string()),
    customerAddress: v.optional(v.string()),
    customerAddressNumber: v.optional(v.string()),
    // Timestamps
    createdAt: v.number(),
    issuedAt: v.optional(v.number()),
    // Error tracking
    errorMessage: v.optional(v.string()),
  }).index("by_order", ["orderId"]),

  // Clerk invitation tracking
  emailInvitations: defineTable({
    orderId: v.id("orders"),
    email: v.string(),
    customerName: v.string(),
    status: v.string(), // "pending" | "sent" | "accepted" | "failed"
    clerkInvitationId: v.optional(v.string()),
    sentAt: v.optional(v.number()),
    acceptedAt: v.optional(v.number()),
    retryCount: v.number(),
    errorMessage: v.optional(v.string()),
    // Primary deployment for redirect URL
    primaryDeploymentId: v.optional(v.id("deployments")),
  })
    .index("by_email", ["email"])
    .index("by_order", ["orderId"]),
});
