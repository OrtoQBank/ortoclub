// ──────────────────────────────────────────────────────
// Asaas API Types
// ──────────────────────────────────────────────────────

// Payment Statuses (all values returned by the API)
export const ASAAS_PAYMENT_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "RECEIVED",
  "OVERDUE",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
  "RECEIVED_IN_CASH_UNDONE",
  "CHARGEBACK_REQUESTED",
  "CHARGEBACK_DISPUTE",
  "AWAITING_CHARGEBACK_REVERSAL",
  "DUNNING_REQUESTED",
  "DUNNING_RECEIVED",
  "AWAITING_RISK_ANALYSIS",
] as const;

export type AsaasPaymentStatus = (typeof ASAAS_PAYMENT_STATUSES)[number];

// Billing Types (all values supported by the API)
export const ASAAS_BILLING_TYPES = [
  "PIX",
  "CREDIT_CARD",
  "BOLETO",
  "UNDEFINED",
  "DEPOSIT",
  "TRANSFER",
] as const;

export type AsaasBillingType = (typeof ASAAS_BILLING_TYPES)[number];

// Webhook Events (all payment events from the API docs)
export const ASAAS_WEBHOOK_EVENTS = [
  "PAYMENT_CREATED",
  "PAYMENT_CONFIRMED",
  "PAYMENT_RECEIVED",
  "PAYMENT_UPDATED",
  "PAYMENT_DELETED",
  "PAYMENT_RESTORED",
  "PAYMENT_OVERDUE",
  "PAYMENT_REFUNDED",
  "PAYMENT_PARTIALLY_REFUNDED",
  "PAYMENT_REFUND_IN_PROGRESS",
  "PAYMENT_ANTICIPATED",
  "PAYMENT_AWAITING_RISK_ANALYSIS",
  "PAYMENT_APPROVED_BY_RISK_ANALYSIS",
  "PAYMENT_REPROVED_BY_RISK_ANALYSIS",
  "PAYMENT_AUTHORIZED",
  "PAYMENT_CREDIT_CARD_CAPTURE_REFUSED",
  "PAYMENT_RECEIVED_IN_CASH_UNDONE",
  "PAYMENT_CHARGEBACK_REQUESTED",
  "PAYMENT_CHARGEBACK_DISPUTE",
  "PAYMENT_AWAITING_CHARGEBACK_REVERSAL",
  "PAYMENT_DUNNING_REQUESTED",
  "PAYMENT_DUNNING_RECEIVED",
  "PAYMENT_BANK_SLIP_VIEWED",
  "PAYMENT_CHECKOUT_VIEWED",
  "PAYMENT_SPLIT_DIVERGENCE_BLOCK",
  "PAYMENT_SPLIT_DIVERGENCE_BLOCK_FINISHED",
] as const;

export type AsaasWebhookEvent = (typeof ASAAS_WEBHOOK_EVENTS)[number];

// ──────────────────────────────────────────────────────
// Request Types
// ──────────────────────────────────────────────────────

// Credit Card - Request (sent to the API when creating a charge)
export interface AsaasCreditCardData {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

// Create Charge Request
// Single payment (1x): use `value` only, no installment fields
// Installment payment (2x+): use `totalValue` + `installmentCount`, no `value`
interface AsaasCreateChargeBase {
  customer: string;
  billingType: "PIX" | "CREDIT_CARD";
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
}

interface AsaasSingleChargeRequest extends AsaasCreateChargeBase {
  value: number;
  totalValue?: never;
  installmentCount?: never;
  installmentValue?: never;
}

interface AsaasInstallmentChargeRequest extends AsaasCreateChargeBase {
  value?: never;
  totalValue: number;
  installmentCount: number;
  installmentValue?: number;
}

export type AsaasCreateChargeRequest =
  | AsaasSingleChargeRequest
  | AsaasInstallmentChargeRequest;

// ──────────────────────────────────────────────────────
// Response Types
// ──────────────────────────────────────────────────────

// Credit Card - Response (returned by the API in payment responses)
export interface AsaasCreditCardResponse {
  creditCardNumber: string;
  creditCardBrand: string;
  creditCardToken: string;
}

// Payment Response (full shape returned by POST /v3/payments and GET /v3/payments/{id})
export interface AsaasPaymentResponse {
  object: string;
  id: string;
  dateCreated: string;
  customer: string;
  installment: string | null;
  checkoutSession: string | null;
  paymentLink: string | null;
  value: number;
  netValue: number;
  originalValue: number | null;
  interestValue: number | null;
  description: string | null;
  billingType: AsaasBillingType;
  confirmedDate: string | null;
  creditCard: AsaasCreditCardResponse | null;
  pixTransaction: unknown | null;
  status: AsaasPaymentStatus;
  dueDate: string;
  originalDueDate: string;
  paymentDate: string | null;
  clientPaymentDate: string | null;
  installmentNumber: number | null;
  invoiceUrl: string;
  invoiceNumber: string;
  externalReference: string | null;
  deleted: boolean;
  anticipated: boolean;
  anticipable: boolean;
  creditDate: string | null;
  estimatedCreditDate: string | null;
  transactionReceiptUrl: string | null;
  nossoNumero: string | null;
  bankSlipUrl: string | null;
  lastInvoiceViewedDate: string | null;
  lastBankSlipViewedDate: string | null;
  discount: {
    value: number;
    limitDate: string | null;
    dueDateLimitDays: number;
    type: "FIXED" | "PERCENTAGE";
  } | null;
  fine: {
    value: number;
    type: "FIXED" | "PERCENTAGE";
  } | null;
  interest: {
    value: number;
    type: "PERCENTAGE" | "FIXED";
  } | null;
  postalService: boolean;
  escrow: unknown | null;
  refunds: unknown | null;
}

// Customer Response
export interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
  mobilePhone?: string;
}

// PIX QR Code Response
export interface AsaasPixQrCode {
  encodedImage: string;
  payload: string;
  expirationDate: string;
}

// Invoice Response
export interface AsaasInvoice {
  id: string;
  status: string;
  customer: string;
  serviceDescription: string;
  observations?: string;
  pdfUrl?: string;
  xmlUrl?: string;
  effectiveDate?: string;
}

// ──────────────────────────────────────────────────────
// Webhook Payload
// ──────────────────────────────────────────────────────

// Webhook Payload (sent by Asaas via POST to webhook endpoint)
export interface AsaasWebhookPayload {
  event: AsaasWebhookEvent;
  payment: AsaasPaymentResponse;
}
