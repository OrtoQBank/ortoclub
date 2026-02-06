import { v } from "convex/values";

import { api } from "./_generated/api";
import { action } from "./_generated/server";

// Asaas API Types
interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
  mobilePhone?: string;
}

interface AsaasPayment {
  id: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "RECEIVED"
    | "OVERDUE"
    | "REFUNDED"
    | "RECEIVED_IN_CASH_UNDONE"
    | "CHARGEBACK_REQUESTED"
    | "CHARGEBACK_DISPUTE"
    | "AWAITING_CHARGEBACK_REVERSAL"
    | "DUNNING_REQUESTED"
    | "DUNNING_RECEIVED"
    | "AWAITING_RISK_ANALYSIS";
  value: number;
  netValue?: number;
  paymentDate?: string;
  confirmedDate?: string;
  dueDate: string;
  billingType: "PIX" | "CREDIT_CARD";
  customer: string;
  description?: string;
  externalReference?: string;
  invoiceUrl?: string;
}

interface AsaasCreditCardData {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

interface AsaasPixQrCode {
  encodedImage: string;
  payload: string;
  expirationDate: string;
}

interface AsaasInvoice {
  id: string;
  status: string;
  customer: string;
  serviceDescription: string;
  observations?: string;
  pdfUrl?: string;
  xmlUrl?: string;
  effectiveDate?: string;
}

// AsaaS API Client
class AsaasClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    // Use ASAAS_ENVIRONMENT to determine sandbox vs production
    const isProduction = process.env.ASAAS_ENVIRONMENT === "production";
    this.baseUrl = isProduction
      ? "https://api.asaas.com/v3"
      : "https://api-sandbox.asaas.com/v3";
    this.apiKey = process.env.ASAAS_API_KEY!;

    console.log("AsaaS Environment:", isProduction ? "production" : "sandbox");
    console.log("AsaaS Base URL:", this.baseUrl);
  }

  async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        access_token: this.apiKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`AsaaS API Error: ${response.status} - ${errorBody}`);
    }

    return response.json();
  }

  async createCustomer(customer: {
    name: string;
    email: string;
    cpfCnpj: string;
    phone?: string;
    mobilePhone?: string;
    postalCode?: string;
    address?: string;
    addressNumber?: string;
  }): Promise<AsaasCustomer> {
    return this.makeRequest<AsaasCustomer>("/customers", {
      method: "POST",
      body: JSON.stringify(customer),
    });
  }

  async createCharge(charge: {
    customer: string;
    billingType: "PIX" | "CREDIT_CARD";
    value?: number;
    totalValue?: number;
    installmentCount?: number;
    installmentValue?: number;
    dueDate: string;
    description?: string;
    externalReference?: string;
    creditCard?: AsaasCreditCardData;
    creditCardHolderInfo?: {
      name: string;
      email: string;
      cpfCnpj: string;
      postalCode?: string;
      address?: string;
      addressNumber?: string;
      phone?: string;
      mobilePhone?: string;
    };
    remoteIp?: string;
  }): Promise<AsaasPayment> {
    return this.makeRequest<AsaasPayment>("/payments", {
      method: "POST",
      body: JSON.stringify(charge),
    });
  }

  async getPixQrCode(chargeId: string): Promise<AsaasPixQrCode> {
    return this.makeRequest<AsaasPixQrCode>(`/payments/${chargeId}/pixQrCode`);
  }

  async getPayment(paymentId: string): Promise<AsaasPayment> {
    return this.makeRequest<AsaasPayment>(`/payments/${paymentId}`);
  }

  async scheduleInvoice(params: {
    payment: string;
    serviceDescription: string;
    value?: number;
    municipalServiceId?: string;
    municipalServiceCode?: string;
    municipalServiceName: string;
    observations?: string;
    taxes?: {
      retainIss?: boolean;
      iss?: number;
      cofins?: number;
      csll?: number;
      inss?: number;
      ir?: number;
      pis?: number;
    };
  }): Promise<AsaasInvoice> {
    return this.makeRequest<AsaasInvoice>("/invoices", {
      method: "POST",
      body: JSON.stringify({
        payment: params.payment,
        serviceDescription: params.serviceDescription,
        value: params.value,
        municipalServiceId: params.municipalServiceId || null,
        municipalServiceCode: params.municipalServiceCode || null,
        municipalServiceName: params.municipalServiceName,
        observations: params.observations,
        ...(params.taxes && { taxes: params.taxes }),
      }),
    });
  }
}

/**
 * Create AsaaS customer for transparent checkout
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

    return {
      customerId: customer.id,
    };
  },
});

/**
 * Create PIX payment for transparent checkout
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
    // Get the order to get the final price
    const order = await ctx.runQuery(api.orders.getOrderById, {
      orderId: args.orderId,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const finalPrice = order.finalPrice;

    if (finalPrice <= 0) {
      throw new Error("Invalid order price");
    }

    const asaas = new AsaasClient();

    // Build description
    let description = `${order.productName} - PIX`;
    if (order.couponCode) {
      description += ` (Cupom: ${order.couponCode})`;
    }

    // Create PIX payment with orderId as externalReference
    const payment = await asaas.createCharge({
      customer: args.customerId,
      billingType: "PIX",
      value: finalPrice,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // Tomorrow
      description,
      externalReference: args.orderId,
    });

    // Get PIX QR Code
    let pixData: AsaasPixQrCode | null = null;
    try {
      pixData = await asaas.getPixQrCode(payment.id);
    } catch (error) {
      console.warn("Failed to get PIX QR code immediately, will retry:", error);

      // Sometimes the QR code is not immediately available, wait a bit and retry
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        pixData = await asaas.getPixQrCode(payment.id);
      } catch (retryError) {
        console.error("Failed to get PIX QR code after retry:", retryError);
      }
    }

    return {
      paymentId: payment.id,
      value: finalPrice,
      qrPayload: pixData?.payload,
      qrCodeBase64: pixData?.encodedImage,
      expirationDate: pixData?.expirationDate,
    };
  },
});

/**
 * Create Credit Card payment for transparent checkout
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
    // Get the order to get the final price
    const order = await ctx.runQuery(api.orders.getOrderById, {
      orderId: args.orderId,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const finalPrice = order.finalPrice;

    if (finalPrice <= 0) {
      throw new Error("Invalid order price");
    }

    const asaas = new AsaasClient();

    // Build description
    let description = `${order.productName} - Cartão de Crédito`;
    if (order.couponCode) {
      description += ` (Cupom: ${order.couponCode})`;
    }

    // Handle installments
    let installmentCount: number | undefined;
    let isInstallmentPayment = false;

    if (args.installments && args.installments > 1) {
      if (args.installments < 1 || args.installments > 21) {
        throw new Error(
          `Invalid installment count: ${args.installments}. Must be between 1 and 21.`
        );
      }

      installmentCount = args.installments;
      isInstallmentPayment = true;
      description += ` (${installmentCount}x)`;

      console.log(`💳 INSTALLMENT PAYMENT:`, {
        installmentCount,
        totalValue: finalPrice,
      });
    }

    // Build payment request
    const paymentRequest: Parameters<typeof asaas.createCharge>[0] = {
      customer: args.customerId,
      billingType: "CREDIT_CARD",
      dueDate: new Date().toISOString().split("T")[0],
      description,
      externalReference: args.orderId,
      creditCard: args.creditCard,
      creditCardHolderInfo: args.creditCardHolderInfo,
    };

    // Use different field based on payment type
    if (isInstallmentPayment && installmentCount !== undefined) {
      paymentRequest.totalValue = finalPrice;
      paymentRequest.installmentCount = installmentCount;
    } else {
      paymentRequest.value = finalPrice;
    }

    if (args.remoteIp) {
      paymentRequest.remoteIp = args.remoteIp;
    }

    // Create Credit Card payment
    const payment = await asaas.createCharge(paymentRequest);

    return {
      paymentId: payment.id,
      value: finalPrice,
      status: payment.status,
      creditCardToken: (payment as any).creditCardToken,
      invoiceUrl: payment.invoiceUrl,
    };
  },
});

/**
 * Get payment status from AsaaS
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

    // Map AsaaS status to our status
    let status = "pending";
    switch (payment.status) {
      case "CONFIRMED":
      case "RECEIVED": {
        status = "confirmed";
        break;
      }
      case "PENDING": {
        status = "pending";
        break;
      }
      case "OVERDUE": {
        status = "expired";
        break;
      }
      default: {
        status = "failed";
      }
    }

    return {
      status,
      paymentId: payment.id,
      value: payment.value,
      paymentDate: payment.paymentDate,
      confirmedDate: payment.confirmedDate,
      dueDate: payment.dueDate,
      asaasStatus: payment.status,
    };
  },
});

/**
 * Schedule invoice generation for a paid order
 */
export const scheduleInvoice = action({
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
        iss: v.optional(v.number()),
        cofins: v.optional(v.number()),
        csll: v.optional(v.number()),
        inss: v.optional(v.number()),
        ir: v.optional(v.number()),
        pis: v.optional(v.number()),
      })
    ),
  },
  returns: v.object({
    invoiceId: v.string(),
    status: v.string(),
  }),
  handler: async (ctx, args) => {
    const asaas = new AsaasClient();

    console.log(`📄 Scheduling invoice for payment ${args.asaasPaymentId}`);

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

    console.log(
      `✅ Invoice scheduled: ${invoice.id} (status: ${invoice.status})`
    );

    return {
      invoiceId: invoice.id,
      status: invoice.status,
    };
  },
});
