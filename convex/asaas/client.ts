import type {
  AsaasCreateChargeRequest,
  AsaasCustomer,
  AsaasInvoice,
  AsaasPaymentResponse,
  AsaasPixQrCode,
} from "./types";

/**
 * HTTP client for the Asaas payment gateway API.
 * Handles authentication, environment selection, and typed requests.
 */
export class AsaasClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    const apiKey = process.env.ASAAS_API_KEY;
    if (!apiKey) {
      throw new Error("ASAAS_API_KEY environment variable is not set");
    }
    this.apiKey = apiKey;

    const isProduction = process.env.ASAAS_ENVIRONMENT === "production";
    this.baseUrl = isProduction
      ? "https://api.asaas.com/v3"
      : "https://api-sandbox.asaas.com/v3";
  }

  // ── Internal request helper ──────────────────────────

  private async makeRequest<T>(
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
      throw new Error(`Asaas API Error: ${response.status} - ${errorBody}`);
    }

    return response.json();
  }

  // ── Customers ────────────────────────────────────────

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

  // ── Payments ─────────────────────────────────────────

  async createCharge(
    charge: AsaasCreateChargeRequest
  ): Promise<AsaasPaymentResponse> {
    return this.makeRequest<AsaasPaymentResponse>("/payments", {
      method: "POST",
      body: JSON.stringify(charge),
    });
  }

  async getPayment(paymentId: string): Promise<AsaasPaymentResponse> {
    return this.makeRequest<AsaasPaymentResponse>(`/payments/${paymentId}`);
  }

  async getPixQrCode(chargeId: string): Promise<AsaasPixQrCode> {
    return this.makeRequest<AsaasPixQrCode>(
      `/payments/${chargeId}/pixQrCode`
    );
  }

  // ── Invoices ─────────────────────────────────────────

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
