import { v } from "convex/values";
import { makeFunctionReference } from "convex/server";

import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import type { ActionCtx } from "./_generated/server";
import { action } from "./_generated/server";

import { AsaasClient } from "./asaas/client";
import type { AsaasPixQrCode } from "./asaas/types";

// Re-export types used by other modules (e.g. http.ts)
export {
  ASAAS_PAYMENT_STATUSES,
  ASAAS_BILLING_TYPES,
  ASAAS_WEBHOOK_EVENTS,
  type AsaasWebhookEvent,
  type AsaasWebhookPayload,
} from "./asaas/types";

// ──────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const PIX_QR_RETRY_DELAY_MS = 1_000;
const MAX_INSTALLMENTS = 21;

/** Maps Asaas payment statuses to internal status strings. */
const ASAAS_STATUS_MAP: Record<string, string> = {
  CONFIRMED: "confirmed",
  RECEIVED: "confirmed",
  PENDING: "pending",
  OVERDUE: "expired",
};

// ──────────────────────────────────────────────────────
// Shared Helpers
// ──────────────────────────────────────────────────────

// Typed function reference to avoid circular type dependency with api
interface OrderForPayment {
  finalPrice: number;
  productName: string;
  couponCode?: string;
}

const getOrderById = makeFunctionReference<
  "query",
  { orderId: Id<"orders"> },
  OrderForPayment | null
>("orders:getOrderById");

/**
 * Fetch an order and validate it has a positive price.
 * Throws if the order is not found or the price is invalid.
 */
async function fetchAndValidateOrder(
  ctx: ActionCtx,
  orderId: Id<"orders">,
): Promise<OrderForPayment> {
  const order = await ctx.runQuery(getOrderById, { orderId });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.finalPrice <= 0) {
    throw new Error("Invalid order price");
  }

  return order;
}

/**
 * Build a human-readable payment description string.
 */
function buildDescription(
  productName: string,
  billingLabel: string,
  couponCode?: string,
  installments?: number,
): string {
  let description = `${productName} - ${billingLabel}`;
  if (couponCode) {
    description += ` (Cupom: ${couponCode})`;
  }
  if (installments && installments > 1) {
    description += ` (${installments}x)`;
  }
  return description;
}

/**
 * Confirm a payment and schedule provisioning.
 * Shared by credit card action, polling fallback, and webhook handler.
 */
export async function confirmAndProvision(
  ctx: ActionCtx,
  orderId: Id<"orders">,
  asaasPaymentId: string,
): Promise<void> {
  await ctx.runMutation(internal.orders.confirmPayment, {
    orderId,
    asaasPaymentId,
  });

  await ctx.scheduler.runAfter(0, internal.payments.processPaymentConfirmed, {
    orderId,
  });
}

// ──────────────────────────────────────────────────────
// Actions
// ──────────────────────────────────────────────────────

/**
 * Create Asaas customer for transparent checkout.
 */
export const createAsaasCustomer = action({
  args: {
    name: v.string(),
    email: v.string(),
    cpf: v.string(),
    phone: v.optional(v.string()),
    mobilePhone: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    address: v.optional(v.string()),
    addressNumber: v.optional(v.string()),
  },
  returns: v.object({
    customerId: v.string(),
  }),
  handler: async (ctx, args) => {
    const asaas = new AsaasClient();

    const customer = await asaas.createCustomer({
      name: args.name,
      email: args.email,
      cpfCnpj: args.cpf.replaceAll(/\D/g, ""),
      phone: args.phone,
      mobilePhone: args.mobilePhone,
      postalCode: args.postalCode,
      address: args.address,
      addressNumber: args.addressNumber || "SN",
    });

    return { customerId: customer.id };
  },
});

/**
 * Create PIX payment for transparent checkout.
 */
export const createPixPayment = action({
  args: {
    customerId: v.string(),
    orderId: v.id("orders"),
  },
  returns: v.object({
    paymentId: v.string(),
    value: v.number(),
    qrPayload: v.optional(v.string()),
    qrCodeBase64: v.optional(v.string()),
    expirationDate: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const order = await fetchAndValidateOrder(ctx, args.orderId);
    const asaas = new AsaasClient();

    const description = buildDescription(
      order.productName,
      "PIX",
      order.couponCode,
    );

    const tomorrow = new Date(Date.now() + ONE_DAY_MS)
      .toISOString()
      .split("T")[0];

    const payment = await asaas.createCharge({
      customer: args.customerId,
      billingType: "PIX",
      value: order.finalPrice,
      dueDate: tomorrow,
      description,
      externalReference: args.orderId,
    });

    // Fetch PIX QR Code with a single retry
    let pixData: AsaasPixQrCode | null = null;
    try {
      pixData = await asaas.getPixQrCode(payment.id);
    } catch (error) {
      console.warn("Failed to get PIX QR code immediately, will retry:", error);
      await new Promise((resolve) =>
        setTimeout(resolve, PIX_QR_RETRY_DELAY_MS),
      );

      try {
        pixData = await asaas.getPixQrCode(payment.id);
      } catch (retryError) {
        console.error("Failed to get PIX QR code after retry:", retryError);
      }
    }

    return {
      paymentId: payment.id,
      value: order.finalPrice,
      qrPayload: pixData?.payload,
      qrCodeBase64: pixData?.encodedImage,
      expirationDate: pixData?.expirationDate,
    };
  },
});

/**
 * Create Credit Card payment for transparent checkout.
 */
export const createCreditCardPayment = action({
  args: {
    customerId: v.string(),
    orderId: v.id("orders"),
    creditCard: v.object({
      holderName: v.string(),
      number: v.string(),
      expiryMonth: v.string(),
      expiryYear: v.string(),
      ccv: v.string(),
    }),
    creditCardHolderInfo: v.object({
      name: v.string(),
      email: v.string(),
      cpfCnpj: v.string(),
      postalCode: v.optional(v.string()),
      address: v.optional(v.string()),
      addressNumber: v.optional(v.string()),
      phone: v.optional(v.string()),
      mobilePhone: v.optional(v.string()),
    }),
    remoteIp: v.optional(v.string()),
    installments: v.optional(v.number()),
  },
  returns: v.object({
    paymentId: v.string(),
    value: v.number(),
    status: v.string(),
    creditCardToken: v.optional(v.string()),
    invoiceUrl: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const order = await fetchAndValidateOrder(ctx, args.orderId);
    const asaas = new AsaasClient();

    // Validate installments range
    let installmentCount: number | undefined;
    let isInstallmentPayment = false;

    if (args.installments !== undefined) {
      if (args.installments < 1 || args.installments > MAX_INSTALLMENTS) {
        throw new Error(
          `Invalid installment count: ${args.installments}. Must be between 1 and ${MAX_INSTALLMENTS}.`,
        );
      }

      if (args.installments > 1) {
        installmentCount = args.installments;
        isInstallmentPayment = true;

        console.log("Installment payment:", {
          installmentCount,
          totalValue: order.finalPrice,
        });
      }
    }

    const description = buildDescription(
      order.productName,
      "Cartão de Crédito",
      order.couponCode,
      installmentCount,
    );

    // Build payment request
    // Single (1x): use `value` only | Installment (2x+): use `totalValue` + `installmentCount`
    const baseRequest = {
      customer: args.customerId,
      billingType: "CREDIT_CARD" as const,
      dueDate: new Date().toISOString().split("T")[0],
      description,
      externalReference: args.orderId,
      creditCard: args.creditCard,
      creditCardHolderInfo: args.creditCardHolderInfo,
      ...(args.remoteIp && { remoteIp: args.remoteIp }),
    };

    const paymentRequest =
      isInstallmentPayment && installmentCount !== undefined
        ? { ...baseRequest, totalValue: order.finalPrice, installmentCount }
        : { ...baseRequest, value: order.finalPrice };

    const payment = await asaas.createCharge(paymentRequest);

    // Credit card payments are often confirmed immediately by Asaas.
    // If so, update the order right away instead of waiting for the webhook.
    if (payment.status === "CONFIRMED" || payment.status === "RECEIVED") {
      console.log(
        `Credit card payment ${payment.id} confirmed immediately (status: ${payment.status})`,
      );
      await confirmAndProvision(ctx, args.orderId, payment.id);
    }

    return {
      paymentId: payment.id,
      value: order.finalPrice,
      status: payment.status,
      creditCardToken: payment.creditCard?.creditCardToken,
      invoiceUrl: payment.invoiceUrl,
    };
  },
});

/**
 * Poll Asaas and confirm payment if confirmed.
 * Fallback for when the webhook doesn't arrive in time.
 */
export const pollAndConfirmPayment = action({
  args: {
    orderId: v.id("orders"),
    asaasPaymentId: v.string(),
  },
  returns: v.object({
    status: v.string(),
  }),
  handler: async (ctx, args) => {
    const asaas = new AsaasClient();
    const payment = await asaas.getPayment(args.asaasPaymentId);

    if (payment.status === "CONFIRMED" || payment.status === "RECEIVED") {
      console.log(
        `Polling fallback: Payment ${args.asaasPaymentId} confirmed (status: ${payment.status})`,
      );
      await confirmAndProvision(ctx, args.orderId, args.asaasPaymentId);
      return { status: "confirmed" };
    }

    if (payment.status === "PENDING") {
      return { status: "pending" };
    }

    return { status: "failed" };
  },
});

/**
 * Get payment status from Asaas.
 */
export const getPaymentStatus = action({
  args: {
    paymentId: v.string(),
  },
  returns: v.object({
    status: v.string(),
    paymentId: v.string(),
    value: v.number(),
    paymentDate: v.optional(v.string()),
    confirmedDate: v.optional(v.string()),
    dueDate: v.string(),
    asaasStatus: v.string(),
  }),
  handler: async (ctx, args) => {
    const asaas = new AsaasClient();
    const payment = await asaas.getPayment(args.paymentId);

    const status = ASAAS_STATUS_MAP[payment.status] ?? "failed";

    return {
      status,
      paymentId: payment.id,
      value: payment.value,
      paymentDate: payment.paymentDate ?? undefined,
      confirmedDate: payment.confirmedDate ?? undefined,
      dueDate: payment.dueDate,
      asaasStatus: payment.status,
    };
  },
});

/**
 * Get fiscal service ID by searching for the service description.
 * For software services, use: "02964 | 1.09"
 */
export const getFiscalServiceId = action({
  args: {
    serviceDescription: v.string(),
  },
  returns: v.union(
    v.object({
      serviceId: v.string(),
      description: v.string(),
      issTax: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const asaas = new AsaasClient();

    try {
      console.log(
        `Searching for fiscal service: ${args.serviceDescription}`,
      );

      const result = await asaas.listFiscalServices({
        description: args.serviceDescription,
        limit: 10,
      });

      if (!result.data || result.data.length === 0) {
        console.warn(
          `Fiscal service not found for: ${args.serviceDescription}`,
        );
        return null;
      }

      console.log(`Found ${result.data.length} fiscal service(s):`);
      for (const svc of result.data) {
        console.log(
          `  - ID: ${svc.id} | ISS: ${svc.issTax}% | Desc: ${svc.description}`,
        );
      }

      // Skip known expired service IDs
      const EXPIRED_SERVICE_IDS = new Set(["306562"]);

      const service =
        result.data.find((svc) => !EXPIRED_SERVICE_IDS.has(svc.id)) ||
        result.data[0];

      if (EXPIRED_SERVICE_IDS.has(service.id)) {
        console.warn(
          `WARNING: Using expired service ID ${service.id}. All available services are expired!`,
        );
      }

      console.log(
        `Using fiscal service: ${service.id} - ${service.description}`,
      );

      return {
        serviceId: service.id,
        description: service.description,
        issTax: service.issTax,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`Failed to fetch fiscal service:`, errorMsg);
      return null;
    }
  },
});

/**
 * Schedule invoice generation for a paid order.
 */
export const createInvoice = action({
  args: {
    asaasPaymentId: v.string(),
    serviceDescription: v.string(),
    value: v.optional(v.number()),
    municipalServiceId: v.optional(v.string()),
    municipalServiceCode: v.optional(v.string()),
    municipalServiceName: v.string(),
    observations: v.optional(v.string()),
    taxes: v.optional(
      v.object({
        retainIss: v.boolean(),
        iss: v.number(),
        cofins: v.optional(v.number()),
        csll: v.optional(v.number()),
        inss: v.optional(v.number()),
        ir: v.optional(v.number()),
        pis: v.optional(v.number()),
      }),
    ),
  },
  returns: v.object({
    invoiceId: v.string(),
    status: v.string(),
  }),
  handler: async (ctx, args) => {
    const asaas = new AsaasClient();

    console.log(`Scheduling invoice for payment ${args.asaasPaymentId}`);

    const invoice = await asaas.scheduleInvoice({
      payment: args.asaasPaymentId,
      serviceDescription: args.serviceDescription,
      value: args.value,
      municipalServiceId: args.municipalServiceId,
      municipalServiceCode: args.municipalServiceCode,
      municipalServiceName: args.municipalServiceName,
      observations: args.observations,
      taxes: args.taxes,
    });

    console.log(`Invoice scheduled: ${invoice.id} (status: ${invoice.status})`);

    return {
      invoiceId: invoice.id,
      status: invoice.status,
    };
  },
});
