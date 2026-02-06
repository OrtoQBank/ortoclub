"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { api } from "../../convex/_generated/api";
import { AddressFields } from "./components/address-fields";
import {
  type CheckoutForm,
  checkoutSchema,
} from "./components/checkout-schema";
import { CouponSection } from "./components/coupon-section";
import { CreditCardFields } from "./components/credit-card-fields";
import { OrderSummary } from "./components/order-summary";
import { PaymentMethodSelector } from "./components/payment-method-selector";
import { PersonalInfoFields } from "./components/personal-info-fields";
import { useCheckoutSubmit } from "./components/use-checkout-submit";
import { useCoupon } from "./components/use-coupon";

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");
  const prefillName = searchParams.get("name") || "";
  const prefillEmail = searchParams.get("email") || "";
  const prefillPhone = searchParams.get("phone") || "";

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "PIX" | "CREDIT_CARD"
  >("PIX");
  const [selectedInstallments, setSelectedInstallments] = useState(1);

  const product = useQuery(
    api.products.getBySlug,
    productSlug ? { slug: productSlug } : "skip"
  );

  const isCombo = productSlug === "extensivo-2027";
  const comboItemTeot = useQuery(
    api.products.getBySlug,
    isCombo ? { slug: "teot-video" } : "skip"
  );
  const comboItemOrtoQBank = useQuery(
    api.products.getBySlug,
    isCombo ? { slug: "orto-qbank" } : "skip"
  );

  const formMethods = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "PIX" },
  });
  const { handleSubmit, setValue, watch } = formMethods;

  const cpfValue = watch("cpf");

  const coupon = useCoupon({
    productId: product?._id,
    productPrice: product?.price ?? 0,
    productPixPrice: product?.pixPrice,
    selectedPaymentMethod,
    cpfValue,
  });

  const { isLoading, error, onSubmit } = useCheckoutSubmit({
    productSlug: productSlug ?? "",
    appliedCouponCode: coupon.appliedCoupon ? coupon.couponCode : undefined,
    selectedInstallments,
  });

  useEffect(() => {
    if (prefillName) setValue("name", prefillName);
    if (prefillEmail) setValue("email", prefillEmail);
    if (prefillPhone) setValue("phone", prefillPhone);
  }, [prefillName, prefillEmail, prefillPhone, setValue]);

  const handleSelectPaymentMethod = (method: "PIX" | "CREDIT_CARD") => {
    setSelectedPaymentMethod(method);
    setValue("paymentMethod", method);
    coupon.handleRemoveCoupon();
  };

  if (!productSlug) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Produto não especificado</p>
      </div>
    );
  }

  if (product === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="flex min-h-screen items-center justify-center py-8">
        <p className="text-red-600">
          Produto não encontrado: &quot;{productSlug}&quot;
        </p>
      </div>
    );
  }

  const regularPrice = product.price;
  const pixPrice = product.pixPrice || regularPrice;
  const basePrice = selectedPaymentMethod === "PIX" ? pixPrice : regularPrice;
  const pixSavings = regularPrice - pixPrice;

  return (
    <div className="min-h-screen pt-28 pb-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Finalizar Compra</CardTitle>
                <CardDescription>
                  Preencha seus dados e escolha a forma de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormProvider {...formMethods}>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <PersonalInfoFields isLoading={isLoading} />
                    <AddressFields isLoading={isLoading} />
                    <PaymentMethodSelector
                      selectedPaymentMethod={selectedPaymentMethod}
                      onSelect={handleSelectPaymentMethod}
                    />
                    <CouponSection
                      couponCode={coupon.couponCode}
                      onCouponCodeChange={coupon.setCouponCode}
                      appliedCoupon={coupon.appliedCoupon}
                      couponError={coupon.couponError}
                      isValidatingCoupon={coupon.isValidatingCoupon}
                      isLoading={isLoading}
                      onValidate={coupon.handleValidateCoupon}
                      onRemove={coupon.handleRemoveCoupon}
                    />
                    {selectedPaymentMethod === "CREDIT_CARD" && (
                      <CreditCardFields
                        isLoading={isLoading}
                        selectedInstallments={selectedInstallments}
                        onInstallmentsChange={setSelectedInstallments}
                        appliedCouponFinalPrice={
                          coupon.appliedCoupon?.finalPrice ?? null
                        }
                        regularPrice={regularPrice}
                      />
                    )}
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
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
                </FormProvider>
              </CardContent>
            </Card>
          </div>

          <OrderSummary
            product={product}
            isCombo={isCombo}
            comboItemTeot={comboItemTeot}
            comboItemOrtoQBank={comboItemOrtoQBank}
            selectedPaymentMethod={selectedPaymentMethod}
            appliedCoupon={coupon.appliedCoupon}
            couponCode={coupon.couponCode}
            regularPrice={regularPrice}
            pixPrice={pixPrice}
            pixSavings={pixSavings}
            basePrice={basePrice}
          />
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
