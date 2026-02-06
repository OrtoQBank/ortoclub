"use client";

import { useAction, useQuery } from "convex/react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

function ProcessingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderIdParam = searchParams.get("order");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasRedirected = useRef(false);

  // Real-time payment status from Convex (reactive)
  const paymentStatus = useQuery(
    api.orders.checkPaymentStatus,
    orderIdParam ? { orderId: orderIdParam as Id<"orders"> } : "skip"
  );

  // Action to check Asaas payment status directly and confirm if needed (fallback)
  const pollAndConfirm = useAction(api.asaas.pollAndConfirmPayment);

  // Get the order to find the asaasPaymentId
  const order = useQuery(
    api.orders.getOrderById,
    orderIdParam ? { orderId: orderIdParam as Id<"orders"> } : "skip"
  );

  const handleRedirectToSuccess = useCallback(() => {
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      router.push(`/checkout/success?order=${orderIdParam}`);
    }
  }, [router, orderIdParam]);

  useEffect(() => {
    if (!orderIdParam) {
      router.push("/?error=payment_required");
      return;
    }
  }, [orderIdParam, router]);

  // Redirect when Convex detects confirmed status (reactive, instant)
  useEffect(() => {
    if (paymentStatus?.status === "confirmed") {
      handleRedirectToSuccess();
    }
  }, [paymentStatus, handleRedirectToSuccess]);

  // Fallback: poll Asaas directly every 5s in case webhook didn't arrive
  useEffect(() => {
    if (
      !order?.asaasPaymentId ||
      !orderIdParam ||
      hasRedirected.current
    )
      return;

    const asaasPaymentId = order.asaasPaymentId;
    const orderId = orderIdParam as Id<"orders">;

    const pollAsaas = async () => {
      try {
        const result = await pollAndConfirm({
          orderId,
          asaasPaymentId,
        });
        if (result.status === "confirmed") {
          console.log("✅ Payment confirmed via polling fallback");
          // The reactive useQuery will detect the DB change and trigger redirect
          // but also call redirect directly as safety
          handleRedirectToSuccess();
        }
      } catch (err) {
        console.warn("Fallback poll error:", err);
      }
    };

    // Start polling after 5 seconds (give webhook/reactive update time to arrive first)
    const timeout = setTimeout(() => {
      pollAsaas(); // First check
      pollingRef.current = setInterval(pollAsaas, 5000);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [order?.asaasPaymentId, orderIdParam, pollAndConfirm, handleRedirectToSuccess]);

  if (!orderIdParam) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <CardTitle className="text-red-600">Erro</CardTitle>
            <CardDescription>ID do pedido não encontrado</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/")}>Voltar ao Início</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus?.status === "failed") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <CardTitle className="text-red-600">Pagamento Falhou</CardTitle>
            <CardDescription>
              Houve um problema ao processar seu pagamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-gray-600">
              Por favor, verifique os dados do cartão e tente novamente.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => router.push("/")}>Tentar Novamente</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus?.status === "confirmed") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
            <CardTitle className="text-green-600">
              Pagamento Aprovado!
            </CardTitle>
            <CardDescription>Redirecionando...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
          <CardTitle className="text-blue-600">Processando Pagamento</CardTitle>
          <CardDescription>
            Aguarde enquanto processamos seu pagamento...
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentStatus?.orderDetails && (
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="space-y-1 text-sm text-blue-700">
                <p>
                  <strong>Produto:</strong>{" "}
                  {paymentStatus.orderDetails.productName}
                </p>
                <p>
                  <strong>Valor:</strong> R${" "}
                  {paymentStatus.orderDetails.finalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          )}
          <p className="mt-4 text-center text-xs text-gray-500">
            Não feche esta página
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <ProcessingContent />
    </Suspense>
  );
}
