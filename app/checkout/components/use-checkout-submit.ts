"use client";

import { useAction, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "../../../convex/_generated/api";
import type { CheckoutForm } from "./checkout-schema";

interface UseCheckoutSubmitParams {
  productSlug: string;
  appliedCouponCode: string | undefined;
  selectedInstallments: number;
}

export function useCheckoutSubmit({
  productSlug,
  appliedCouponCode,
  selectedInstallments,
}: UseCheckoutSubmitParams) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useMutation(api.orders.createOrder);
  const linkPaymentToOrder = useMutation(api.orders.linkPaymentToOrder);
  const createCustomer = useAction(api.asaas.createAsaasCustomer);
  const createPixPayment = useAction(api.asaas.createPixPayment);
  const createCreditCardPayment = useAction(api.asaas.createCreditCardPayment);

  const onSubmit = async (data: CheckoutForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const addressNumber = data.addressNumber?.trim() || "SN";
      const cleanCpf = data.cpf.replaceAll(/\D/g, "");

      const { orderId } = await createOrder({
        email: data.email,
        cpf: cleanCpf,
        name: data.name,
        phone: data.phone,
        postalCode: data.postalCode,
        address: data.address,
        addressNumber,
        productSlug,
        paymentMethod: data.paymentMethod,
        couponCode: appliedCouponCode,
      });

      const { customerId } = await createCustomer({
        name: data.name,
        email: data.email,
        cpf: cleanCpf,
        phone: data.phone,
        postalCode: data.postalCode,
        address: data.address,
        addressNumber,
      });

      if (data.paymentMethod === "PIX") {
        const payment = await createPixPayment({ customerId, orderId });

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
        const installmentsToSend =
          selectedInstallments > 1 ? selectedInstallments : undefined;

        const payment = await createCreditCardPayment({
          customerId,
          orderId,
          creditCard: {
            holderName: data.name,
            number: data.cardNumber.replaceAll(/\s/g, ""),
            expiryMonth: expMonth,
            expiryYear: `20${expYear}`,
            ccv: data.cardCvv,
          },
          creditCardHolderInfo: {
            name: data.name,
            email: data.email,
            cpfCnpj: cleanCpf,
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

  return { isLoading, error, onSubmit };
}
