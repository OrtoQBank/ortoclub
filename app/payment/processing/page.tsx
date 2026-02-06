"use client";

import { useQuery } from "convex/react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

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

  // Real-time payment status
  const paymentStatus = useQuery(
    api.orders.checkPaymentStatus,
    orderIdParam ? { orderId: orderIdParam as Id<"orders"> } : "skip"
  );

  useEffect(() => {
    if (!orderIdParam) {
      router.push("/?error=payment_required");
      return;
    }
  }, [orderIdParam, router]);

  useEffect(() => {
    if (paymentStatus) {
      if (paymentStatus.status === "confirmed") {
        router.push(`/checkout/success?order=${orderIdParam}`);
      }
    }
  }, [paymentStatus, router, orderIdParam]);

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
