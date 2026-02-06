"use client";

import { useQuery } from "convex/react";
import { CheckCircle, Loader2, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

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

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderIdParam = searchParams.get("order");

  const order = useQuery(
    api.orders.getOrderById,
    orderIdParam ? { orderId: orderIdParam as Id<"orders"> } : "skip"
  );

  if (!orderIdParam || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
            <CardTitle>Carregando...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <CardTitle className="text-2xl text-green-600">
            Pagamento Confirmado!
          </CardTitle>
          <CardDescription>
            Seu pagamento foi processado com sucesso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Details */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 font-semibold text-gray-800">
              Detalhes do Pedido
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Produto:</span>
                <span className="font-medium">{order.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{order.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Valor:</span>
                <span className="font-medium text-green-600">
                  R$ {order.finalPrice.toFixed(2)}
                </span>
              </div>
              {order.couponCode && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Cupom:</span>
                  <span className="font-medium text-green-600">
                    {order.couponCode}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Próximos Passos</h3>
            </div>
            <ol className="ml-4 list-decimal space-y-2 text-sm text-blue-700">
              <li>Você receberá um email de confirmação em breve</li>
              <li>Verifique sua caixa de entrada (e spam)</li>
              <li>Clique no link do email para criar sua conta</li>
              <li>Após criar a conta, você terá acesso imediato ao conteúdo</li>
            </ol>
          </div>

          {/* Support */}
          <div className="text-center text-sm text-gray-600">
            <p>
              Dúvidas? Entre em contato:{" "}
              <a
                href="mailto:suporte@ortoclub.com"
                className="text-blue-600 hover:underline"
              >
                suporte@ortoclub.com
              </a>
            </p>
          </div>

          <Button
            onClick={() => router.push("/")}
            className="w-full"
            variant="outline"
          >
            Voltar ao Início
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
