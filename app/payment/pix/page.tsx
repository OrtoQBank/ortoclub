"use client";

import { useQuery } from "convex/react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Copy,
  Loader2,
  QrCode,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
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

function PixPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderIdParam = searchParams.get("order");
  const [copied, setCopied] = useState(false);
  const [showManualCheck, setShowManualCheck] = useState(false);

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
        console.log("Payment confirmed, redirecting to success page");
        router.push(`/checkout/success?order=${orderIdParam}`);
        return;
      }
    }

    // Show manual check option after 30 seconds
    const timer = setTimeout(() => {
      if (paymentStatus?.status === "pending") {
        setShowManualCheck(true);
      }
    }, 30_000);

    return () => clearTimeout(timer);
  }, [paymentStatus, router, orderIdParam]);

  const handleCopyPixCode = () => {
    if (paymentStatus?.pixData?.qrPayload) {
      navigator.clipboard.writeText(paymentStatus.pixData.qrPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
            <CardTitle className="text-red-600">
              Pagamento Não Encontrado
            </CardTitle>
            <CardDescription>
              Não foi possível encontrar informações sobre este pagamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Button onClick={() => router.push("/")}>Voltar ao Início</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasPixData =
    paymentStatus?.pixData?.qrCodeBase64 || paymentStatus?.pixData?.qrPayload;

  if (!paymentStatus || !hasPixData) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
            <CardTitle className="text-blue-600">Gerando QR Code PIX</CardTitle>
            <CardDescription>
              Aguarde enquanto geramos seu código PIX...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <QrCode className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-blue-600">
              Pagamento via PIX
            </CardTitle>
            <CardDescription>
              Escaneie o QR Code ou copie o código para realizar o pagamento
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Payment Info */}
            {paymentStatus.orderDetails && (
              <div className="rounded-lg bg-blue-50 p-4">
                <h3 className="mb-2 font-semibold text-blue-800">
                  Detalhes do Pedido
                </h3>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>
                    <strong>Email:</strong> {paymentStatus.orderDetails.email}
                  </p>
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

            {/* QR Code Display */}
            {paymentStatus.pixData?.qrCodeBase64 && (
              <div className="flex flex-col items-center rounded-lg border-2 border-gray-200 bg-white p-6">
                <div className="relative mb-4 h-64 w-64">
                  <Image
                    src={`data:image/png;base64,${paymentStatus.pixData.qrCodeBase64}`}
                    alt="QR Code PIX"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <p className="text-center text-sm text-gray-600">
                  Abra o app do seu banco e escaneie este QR Code
                </p>
              </div>
            )}

            {/* Copy PIX Code */}
            {paymentStatus.pixData?.qrPayload && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Ou copie o código PIX Copia e Cola:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={paymentStatus.pixData.qrPayload}
                    readOnly
                    className="w-full overflow-hidden text-ellipsis rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-xs"
                  />
                  <Button
                    onClick={handleCopyPixCode}
                    variant={copied ? "default" : "outline"}
                    className="flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Instructions */}
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>
                    <strong>Como pagar:</strong>
                  </p>
                  <ol className="ml-4 list-decimal space-y-1 text-sm">
                    <li>Abra o aplicativo do seu banco</li>
                    <li>Acesse a área PIX</li>
                    <li>Escolha Pagar com QR Code ou PIX Copia e Cola</li>
                    <li>Escaneie o código acima ou cole o código copiado</li>
                    <li>Confirme o pagamento</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>

            {/* Real-time status */}
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="mb-2 flex items-center gap-3">
                <div className="h-3 w-3 animate-pulse rounded-full bg-yellow-500"></div>
                <span className="font-medium text-yellow-900">
                  Aguardando pagamento...
                </span>
              </div>
              <p className="text-sm text-yellow-800">
                Esta página atualiza automaticamente quando o pagamento for
                confirmado.
              </p>
            </div>

            {showManualCheck && (
              <Alert>
                <AlertDescription>
                  <p>
                    <strong>Está demorando mais que o esperado?</strong>
                  </p>
                  <p className="text-sm">
                    A confirmação do pagamento PIX pode levar alguns minutos.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-2 border-t pt-4">
              <Button variant="outline" onClick={() => router.push("/")}>
                Voltar ao Início
              </Button>
              <p className="text-center text-xs text-gray-500">
                Não feche esta página até a confirmação do pagamento
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PixPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <PixPaymentContent />
    </Suspense>
  );
}
