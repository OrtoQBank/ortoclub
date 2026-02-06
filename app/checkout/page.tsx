"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import cardValidator from "card-validator";
import { useAction, useMutation, useQuery } from "convex/react";
import { Loader2, Tag } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { api } from "../../convex/_generated/api";

// Utility functions
const formatCPF = (value: string) => {
  const numbers = value.replaceAll(/\D/g, "");
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replaceAll(/\D/g, "");
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let checkDigit = 11 - (sum % 11);
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
  if (checkDigit !== Number.parseInt(cleanCPF.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  checkDigit = 11 - (sum % 11);
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
  if (checkDigit !== Number.parseInt(cleanCPF.charAt(10))) return false;

  return true;
};

// Form validation schema
const checkoutSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    cpf: z
      .string()
      .min(11, "CPF deve ter 11 dígitos")
      .max(14, "CPF inválido")
      .refine(validateCPF, { message: "CPF inválido. Verifique os dígitos." }),
    phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
    postalCode: z.string().min(8, "CEP deve ter 8 dígitos"),
    address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
    addressNumber: z.string().optional(),
    paymentMethod: z.enum(["PIX", "CREDIT_CARD"]),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvv: z.string().optional(),
    installments: z.number().min(1).max(12).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "CREDIT_CARD") {
      const cardNumberValidation = cardValidator.number(data.cardNumber || "");
      if (!cardNumberValidation.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Número do cartão inválido",
          path: ["cardNumber"],
        });
      }

      const expiryValidation = cardValidator.expirationDate(
        data.cardExpiry || ""
      );
      if (!expiryValidation.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Data de validade inválida",
          path: ["cardExpiry"],
        });
      }

      const cvvValidation = cardValidator.cvv(data.cardCvv || "");
      if (!cvvValidation.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CVV deve ter 3 ou 4 dígitos",
          path: ["cardCvv"],
        });
      }
    }
  });

type CheckoutForm = z.infer<typeof checkoutSchema>;

function CheckoutPageContent() {
  const router = useRouter();
  const productSlug = useSearchParams().get("product");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "PIX" | "CREDIT_CARD"
  >("PIX");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    finalPrice: number;
    discountAmount: number;
    couponDescription: string;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [selectedInstallments, setSelectedInstallments] = useState<number>(1);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // Convex actions and mutations
  const createOrder = useMutation(api.orders.createOrder);
  const linkPaymentToOrder = useMutation(api.orders.linkPaymentToOrder);
  const createCustomer = useAction(api.asaas.createAsaasCustomer);
  const createPixPayment = useAction(api.asaas.createPixPayment);
  const createCreditCardPayment = useAction(api.asaas.createCreditCardPayment);

  // Get product
  const product = useQuery(
    api.products.getBySlug,
    productSlug ? { slug: productSlug } : "skip"
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "PIX",
    },
  });

  const name = watch("name") || "";
  const cardNumber = watch("cardNumber") || "";
  const cardExpiry = watch("cardExpiry") || "";

  // ViaCEP integration
  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replaceAll(/\D/g, "");
    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cleanCep}/json/`
        );
        const data = await response.json();
        if (!data.erro) {
          setValue("address", `${data.logradouro}, ${data.bairro}`);
          setValue("postalCode", data.cep);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  // Validate coupon
  const handleValidateCoupon = async () => {
    if (!couponCode.trim() || !product) return;

    setIsValidatingCoupon(true);
    setCouponError(null);

    try {
      const basePrice =
        selectedPaymentMethod === "PIX"
          ? product.pixPrice || product.price
          : product.price;
      const cpfValue = watch("cpf");
      const cleanCpf = cpfValue ? cpfValue.replaceAll(/\D/g, "") : undefined;

      const { ConvexHttpClient } = await import("convex/browser");
      const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

      const result = await client.query(api.coupons.validateAndApplyCoupon, {
        code: couponCode,
        originalPrice: basePrice,
        userCpf: cleanCpf,
        productId: product._id,
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

  if (!productSlug) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Produto não especificado</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const regularPrice = product.price;
  const pixPrice = product.pixPrice || regularPrice;
  const basePrice = selectedPaymentMethod === "PIX" ? pixPrice : regularPrice;
  const pixSavings = regularPrice - pixPrice;

  const onSubmit = async (data: CheckoutForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const addressNumber = data.addressNumber?.trim() || "SN";

      // Step 1: Create order
      const { orderId, priceBreakdown } = await createOrder({
        email: data.email,
        cpf: data.cpf.replaceAll(/\D/g, ""),
        name: data.name,
        phone: data.phone,
        postalCode: data.postalCode,
        address: data.address,
        addressNumber,
        productSlug: productSlug,
        paymentMethod: data.paymentMethod,
        couponCode: appliedCoupon ? couponCode : undefined,
      });

      // Step 2: Create customer
      const { customerId } = await createCustomer({
        name: data.name,
        email: data.email,
        cpf: data.cpf.replaceAll(/\D/g, ""),
        phone: data.phone,
        postalCode: data.postalCode,
        address: data.address,
        addressNumber,
      });

      // Step 3: Create payment
      if (data.paymentMethod === "PIX") {
        const payment = await createPixPayment({
          customerId,
          orderId,
        });

        await linkPaymentToOrder({
          orderId,
          asaasPaymentId: payment.paymentId,
          asaasCustomerId: customerId,
          pixData: {
            qrPayload: payment.qrPayload,
            qrCodeBase64: payment.qrCodeBase64,
            expirationDate: payment.expirationDate,
          },
        });

        router.push(`/payment/pix?order=${orderId}`);
      } else {
        if (!data.cardNumber || !data.cardExpiry || !data.cardCvv) {
          throw new Error("Dados do cartão incompletos");
        }

        const [expMonth, expYear] = data.cardExpiry.split("/");
        const fullYear = `20${expYear}`;
        const installmentsToSend =
          selectedInstallments > 1 ? selectedInstallments : undefined;

        const payment = await createCreditCardPayment({
          customerId,
          orderId,
          creditCard: {
            holderName: data.name,
            number: data.cardNumber.replaceAll(/\s/g, ""),
            expiryMonth: expMonth,
            expiryYear: fullYear,
            ccv: data.cardCvv,
          },
          creditCardHolderInfo: {
            name: data.name,
            email: data.email,
            cpfCnpj: data.cpf.replaceAll(/\D/g, ""),
            phone: data.phone,
            postalCode: data.postalCode,
            address: data.address,
            addressNumber,
          },
          installments: installmentsToSend,
        });

        await linkPaymentToOrder({
          orderId,
          asaasPaymentId: payment.paymentId,
          asaasCustomerId: customerId,
          installmentCount: installmentsToSend,
        });

        router.push(`/payment/processing?order=${orderId}`);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Finalizar Compra</CardTitle>
                <CardDescription>
                  Preencha seus dados e escolha a forma de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        placeholder="Seu nome completo"
                        {...register("name")}
                        disabled={isLoading}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        placeholder="000.000.000-00"
                        {...register("cpf")}
                        disabled={isLoading}
                        maxLength={14}
                        onChange={(e) => {
                          e.target.value = formatCPF(e.target.value);
                        }}
                      />
                      {errors.cpf && (
                        <p className="text-sm text-red-600">
                          {errors.cpf.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      {...register("email")}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-semibold">Endereço</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">CEP *</Label>
                        <div className="relative">
                          <Input
                            id="postalCode"
                            placeholder="00000-000"
                            {...register("postalCode")}
                            disabled={isLoading || isLoadingCep}
                            maxLength={9}
                            onChange={(e) => {
                              const value = e.target.value.replaceAll(
                                /\D/g,
                                ""
                              );
                              const formatted = value.replace(
                                /(\d{5})(\d{3})/,
                                "$1-$2"
                              );
                              e.target.value = formatted;
                              handleCepChange(formatted);
                            }}
                          />
                          {isLoadingCep && (
                            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
                          )}
                        </div>
                        {errors.postalCode && (
                          <p className="text-sm text-red-600">
                            {errors.postalCode.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          placeholder="(11) 99999-9999"
                          {...register("phone")}
                          disabled={isLoading}
                          maxLength={15}
                          onChange={(e) => {
                            const value = e.target.value.replaceAll(/\D/g, "");
                            const formatted = value.replace(
                              /(\d{2})(\d{5})(\d{4})/,
                              "($1) $2-$3"
                            );
                            e.target.value = formatted;
                          }}
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-600">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                          <div className="space-y-2 md:col-span-3">
                            <Label htmlFor="address">Endereço *</Label>
                            <Input
                              id="address"
                              placeholder="Rua, Avenida, etc"
                              {...register("address")}
                              disabled={isLoading}
                            />
                            {errors.address && (
                              <p className="text-sm text-red-600">
                                {errors.address.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="addressNumber">Número</Label>
                            <Input
                              id="addressNumber"
                              placeholder="123"
                              {...register("addressNumber")}
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-3">
                    <Label>Forma de Pagamento</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                          selectedPaymentMethod === "PIX"
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => {
                          setSelectedPaymentMethod("PIX");
                          setValue("paymentMethod", "PIX");
                          handleRemoveCoupon();
                        }}
                      >
                        <div className="text-center">
                          <div className="font-semibold">PIX</div>
                          <div className="text-sm text-gray-600">
                            Desconto especial
                          </div>
                        </div>
                      </div>
                      <div
                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                          selectedPaymentMethod === "CREDIT_CARD"
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => {
                          setSelectedPaymentMethod("CREDIT_CARD");
                          setValue("paymentMethod", "CREDIT_CARD");
                          handleRemoveCoupon();
                        }}
                      >
                        <div className="text-center">
                          <div className="font-semibold">Cartão</div>
                          <div className="text-sm text-gray-600">
                            Aprovação imediata
                          </div>
                        </div>
                      </div>
                    </div>
                    <input type="hidden" {...register("paymentMethod")} />
                  </div>

                  {/* Coupon */}
                  <div className="space-y-2">
                    <Label>Cupom de Desconto (Opcional)</Label>
                    {appliedCoupon ? (
                      <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
                        <Tag className="h-4 w-4 text-green-600" />
                        <div className="flex-1">
                          <div className="font-medium text-green-900">
                            {couponCode}
                          </div>
                          <div className="text-sm text-green-700">
                            {appliedCoupon.couponDescription}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveCoupon}
                        >
                          Remover
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Digite o código"
                          value={couponCode}
                          onChange={(e) =>
                            setCouponCode(e.target.value.toUpperCase())
                          }
                          disabled={isLoading || isValidatingCoupon}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleValidateCoupon}
                          disabled={
                            isLoading ||
                            isValidatingCoupon ||
                            !couponCode.trim()
                          }
                        >
                          {isValidatingCoupon ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Aplicar"
                          )}
                        </Button>
                      </div>
                    )}
                    {couponError && (
                      <p className="text-sm text-red-600">{couponError}</p>
                    )}
                  </div>

                  {/* Credit Card Fields */}
                  {selectedPaymentMethod === "CREDIT_CARD" && (
                    <div className="space-y-4 border-t pt-4">
                      <h3 className="font-semibold">Dados do Cartão</h3>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-12">
                        <div className="col-span-2 space-y-2 md:col-span-6">
                          <Label htmlFor="cardNumber">Número do Cartão</Label>
                          <Input
                            id="cardNumber"
                            placeholder="0000 0000 0000 0000"
                            {...register("cardNumber")}
                            disabled={isLoading}
                            maxLength={23}
                            onChange={(e) => {
                              const value = e.target.value.replaceAll(
                                /\D/g,
                                ""
                              );
                              const formatted = value.replaceAll(
                                /(\d{4})(?=\d)/g,
                                "$1 "
                              );
                              setValue("cardNumber", formatted);
                            }}
                          />
                          {errors.cardNumber && (
                            <p className="text-sm text-red-600">
                              {errors.cardNumber.message}
                            </p>
                          )}
                        </div>

                        <div className="col-span-1 space-y-2 md:col-span-3">
                          <Label htmlFor="cardExpiry">Validade</Label>
                          <Input
                            id="cardExpiry"
                            placeholder="MM/AA"
                            {...register("cardExpiry")}
                            disabled={isLoading}
                            maxLength={5}
                            className="text-center"
                            onChange={(e) => {
                              let value = e.target.value.replaceAll(/\D/g, "");
                              if (value.length >= 2) {
                                value =
                                  value.slice(0, 2) + "/" + value.slice(2, 4);
                              }
                              setValue("cardExpiry", value);
                            }}
                          />
                          {errors.cardExpiry && (
                            <p className="text-xs text-red-600">
                              {errors.cardExpiry.message}
                            </p>
                          )}
                        </div>

                        <div className="col-span-1 space-y-2 md:col-span-3">
                          <Label htmlFor="cardCvv">CVV</Label>
                          <Input
                            id="cardCvv"
                            placeholder="CVV"
                            {...register("cardCvv")}
                            disabled={isLoading}
                            maxLength={4}
                            className="text-center"
                            onChange={(e) => {
                              const value = e.target.value.replaceAll(
                                /\D/g,
                                ""
                              );
                              setValue("cardCvv", value);
                            }}
                          />
                          {errors.cardCvv && (
                            <p className="text-xs text-red-600">
                              {errors.cardCvv.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Installments */}
                      <div className="space-y-2 border-t pt-4">
                        <Label>Parcelamento</Label>
                        <select
                          value={selectedInstallments}
                          onChange={(e) =>
                            setSelectedInstallments(Number(e.target.value))
                          }
                          disabled={isLoading}
                          className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(
                            (num) => {
                              const priceForInstallments = appliedCoupon
                                ? appliedCoupon.finalPrice
                                : regularPrice;
                              const installmentValue =
                                priceForInstallments / num;
                              return (
                                <option key={num} value={num}>
                                  {num === 1
                                    ? `À vista - R$ ${priceForInstallments.toFixed(2)}`
                                    : `${num}x de R$ ${installmentValue.toFixed(2)}`}
                                </option>
                              );
                            }
                          )}
                        </select>
                      </div>
                    </div>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {selectedPaymentMethod === "PIX"
                          ? "Gerando PIX..."
                          : "Processando..."}
                      </>
                    ) : selectedPaymentMethod === "PIX" ? (
                      "Gerar Pagamento PIX"
                    ) : (
                      "Pagar com Cartão"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{product.name}</span>
                      <span className="font-medium">
                        {selectedPaymentMethod === "PIX" ? (
                          <>
                            <span className="mr-2 text-gray-400 line-through">
                              R$ {regularPrice.toFixed(2)}
                            </span>
                            <span>R$ {pixPrice.toFixed(2)}</span>
                          </>
                        ) : (
                          <span>R$ {regularPrice.toFixed(2)}</span>
                        )}
                      </span>
                    </div>

                    {selectedPaymentMethod === "PIX" &&
                      pixSavings > 0 &&
                      !appliedCoupon && (
                        <div className="flex items-center justify-between text-sm text-blue-600">
                          <span>💰 Desconto PIX</span>
                          <span>- R$ {pixSavings.toFixed(2)}</span>
                        </div>
                      )}

                    {appliedCoupon && (
                      <div className="flex items-center justify-between text-sm text-green-600">
                        <span>🎟️ Cupom ({couponCode})</span>
                        <span>
                          - R$ {appliedCoupon.discountAmount.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t pt-4 text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">
                        R${" "}
                        {appliedCoupon
                          ? appliedCoupon.finalPrice.toFixed(2)
                          : basePrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="space-y-2 border-t pt-4 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>🔒</span>
                        <span>Pagamento seguro</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>✓</span>
                        <span>Acesso imediato após aprovação</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
