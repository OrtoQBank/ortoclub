"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AppliedCoupon {
  finalPrice: number;
  discountAmount: number;
  couponDescription: string;
}

interface ProductInfo {
  name: string;
  price: number;
  pixPrice?: number;
}

interface OrderSummaryProps {
  product: ProductInfo;
  isCombo: boolean;
  comboItemTeot: ProductInfo | null | undefined;
  comboItemOrtoQBank: ProductInfo | null | undefined;
  selectedPaymentMethod: "PIX" | "CREDIT_CARD";
  appliedCoupon: AppliedCoupon | null;
  couponCode: string;
  regularPrice: number;
  pixPrice: number;
  pixSavings: number;
  basePrice: number;
}

export function OrderSummary({
  product,
  isCombo,
  comboItemTeot,
  comboItemOrtoQBank,
  selectedPaymentMethod,
  appliedCoupon,
  couponCode,
  regularPrice,
  pixPrice,
  pixSavings,
  basePrice,
}: OrderSummaryProps) {
  return (
    <div className="lg:col-span-1">
      <div className="lg:sticky lg:top-8">
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Combo breakdown */}
              {isCombo && comboItemTeot && comboItemOrtoQBank ? (
                <>
                  <div className="text-sm font-semibold text-gray-800">
                    {product.name}
                  </div>
                  <div className="space-y-2 pl-2 border-l-2 border-blue-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {comboItemTeot.name}
                      </span>
                      <span className="font-medium">
                        R$ {comboItemTeot.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {comboItemOrtoQBank.name}
                      </span>
                      <span className="font-medium">
                        R$ {comboItemOrtoQBank.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2 text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      R$ {regularPrice.toFixed(2)}
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
                </>
              ) : (
                <>
                  {/* Single product */}
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
                </>
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
  );
}
