import { FunctionReturnType } from "convex/server";
import { v } from "convex/values";

import { api, internal } from "./_generated/api";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";

// ──────────────────────────────────────────────────────
// Fixed fiscal service configuration
// Single service: "Acesso à plataforma OrtoQBank"
// ──────────────────────────────────────────────────────

const FISCAL_SERVICE = {
  municipalServiceId: "306615",
  municipalServiceName:
    "02964 - 1.09 - Disponibilização, sem cessão definitiva, de conteúdos " +
    "de imagem e texto por meio da internet, respeitada a imunidade de " +
    "livros, jornais e periódicos (exceto a distribuição de conteúdos pelas " +
    "prestadoras de Serviço de Acesso Condicio...",
  serviceDescription: "Acesso à plataforma OrtoQBank",
} as const;

const INVOICE_TAXES = {
  retainIss: false,
  iss: 2,
  cofins: 0,
  csll: 0,
  inss: 0,
  ir: 0,
  pis: 0,
} as const;

/**
 * Create invoice record and trigger Asaas invoice generation
 * IMPORTANT: For installment payments, this generates ONE invoice with the TOTAL value
 * The invoice notes the payment method and number of installments
 */
export const generateInvoice = internalMutation({
  args: {
    orderId: v.id("orders"),
    asaasPaymentId: v.string(),
    totalValue: v.number(), // Total invoice value (full order amount)
    totalInstallments: v.optional(v.number()), // Number of installments (for payment info)
  },
  returns: v.union(v.id("invoices"), v.null()),
  handler: async (ctx, args) => {
    const totalInstallments = args.totalInstallments || 1;

    // Check if invoice already exists for this order
    const existingInvoice = await ctx.db
      .query("invoices")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .first();

    if (existingInvoice) {
      console.log(`Invoice already exists for order ${args.orderId}`);
      return existingInvoice._id;
    }

    // Get order details
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      console.error(`Order not found: ${args.orderId}`);
      return null;
    }

    // Build payment method description for logging
    let paymentMethodDescription = "Cartão de Crédito";
    if (order.paymentMethod === "PIX") {
      paymentMethodDescription = "PIX";
    } else if (totalInstallments > 1) {
      paymentMethodDescription = `Cartão de Crédito - ${totalInstallments}x de R$ ${(args.totalValue / totalInstallments).toFixed(2)}`;
    }

    console.log(
      `Creating invoice for order ${args.orderId}: ${FISCAL_SERVICE.serviceDescription} - R$ ${args.totalValue} (${paymentMethodDescription})`,
    );

    // Create invoice record with installment information for reference
    const invoiceId = await ctx.db.insert("invoices", {
      orderId: args.orderId,
      asaasPaymentId: args.asaasPaymentId,
      status: "pending",
      municipalServiceId: FISCAL_SERVICE.municipalServiceId,
      serviceDescription: FISCAL_SERVICE.serviceDescription,
      value: args.totalValue, // Always the TOTAL value
      installmentNumber: totalInstallments > 1 ? 1 : undefined, // Mark as installment payment
      totalInstallments: totalInstallments > 1 ? totalInstallments : undefined,
      customerName: order.name,
      customerEmail: order.email,
      customerCpfCnpj: order.cpf,
      // Customer address (required for invoice generation)
      customerPhone: order.phone,
      customerMobilePhone: undefined, // orders table doesn't store mobilePhone separately
      customerPostalCode: order.postalCode,
      customerAddress: order.address,
      customerAddressNumber: order.addressNumber,
      createdAt: Date.now(),
    });

    // Schedule async invoice generation
    await ctx.scheduler.runAfter(
      0,
      internal.invoices.processInvoiceGeneration,
      {
        invoiceId,
      },
    );

    console.log(`✅ Invoice ${invoiceId} created and scheduled for processing`);

    return invoiceId;
  },
});

/**
 * Process invoice generation with Asaas (async, non-blocking)
 *
 * NOTE: Invoice generation requires:
 * 1. Invoice/NF-e features enabled on your Asaas account
 * 2. Valid municipal service code for your municipality
 * 3. Proper account configuration with Asaas (certificate, etc.)
 *
 * If these are not available, the invoice will be marked as failed
 * but payment processing will NOT be affected.
 */
export const processInvoiceGeneration = internalAction({
  args: {
    invoiceId: v.id("invoices"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Get invoice record (outside try block so we can reference it in catch)
    const invoice: FunctionReturnType<typeof internal.invoices.getInvoiceById> =
      await ctx.runQuery(internal.invoices.getInvoiceById, {
        invoiceId: args.invoiceId,
      });

    if (!invoice) {
      return null;
    }

    try {
      // Update invoice status to processing
      await ctx.runMutation(internal.invoices.updateInvoiceServiceId, {
        invoiceId: args.invoiceId,
        municipalServiceId: FISCAL_SERVICE.municipalServiceId,
      });

      // Build observations with payment method and installment info
      let observations = `Pedido: ${invoice.orderId}`;

      if (invoice.totalInstallments && invoice.totalInstallments > 1) {
        const installmentValue = invoice.value / invoice.totalInstallments;
        observations += `\nForma de Pagamento: Cartão de Crédito`;
        observations += `\nParcelamento: ${invoice.totalInstallments}x de R$ ${installmentValue.toFixed(2)}`;
        observations += `\nValor Total: R$ ${invoice.value.toFixed(2)}`;
      }

      // Schedule invoice with Asaas using fixed service configuration
      const result = await ctx.runAction(api.asaas.createInvoice, {
        asaasPaymentId: invoice.asaasPaymentId,
        serviceDescription: FISCAL_SERVICE.serviceDescription,
        value: invoice.value,
        municipalServiceId: FISCAL_SERVICE.municipalServiceId,
        municipalServiceName: FISCAL_SERVICE.municipalServiceName,
        observations,
        taxes: { ...INVOICE_TAXES },
      });

      // Update invoice record with success
      await ctx.runMutation(internal.invoices.updateInvoiceSuccess, {
        invoiceId: args.invoiceId,
        asaasInvoiceId: result.invoiceId,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Update invoice record with error (non-blocking)
      await ctx.runMutation(internal.invoices.updateInvoiceError, {
        invoiceId: args.invoiceId,
        errorMessage,
      });
    }

    return null;
  },
});

// Helper queries and mutations for invoice processing
export const getInvoiceById = internalQuery({
  args: { invoiceId: v.id("invoices") },
  returns: v.union(v.any(), v.null()),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.invoiceId);
  },
});

export const updateInvoiceServiceId = internalMutation({
  args: {
    invoiceId: v.id("invoices"),
    municipalServiceId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.invoiceId, {
      municipalServiceId: args.municipalServiceId,
      status: "processing",
    });
    return null;
  },
});

export const updateInvoiceSuccess = internalMutation({
  args: {
    invoiceId: v.id("invoices"),
    asaasInvoiceId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.invoiceId, {
      asaasInvoiceId: args.asaasInvoiceId,
      status: "issued",
      issuedAt: Date.now(),
    });
    return null;
  },
});

export const updateInvoiceError = internalMutation({
  args: {
    invoiceId: v.id("invoices"),
    errorMessage: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.invoiceId, {
      status: "failed",
      errorMessage: args.errorMessage,
    });
    return null;
  },
});
