import { httpRouter } from "convex/server";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

/**
 * Asaas webhook handler
 * Receives payment confirmation webhooks and triggers provisioning
 */
http.route({
  path: "/webhooks/asaas",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const rawBody = await request.text();

      // Validate webhook authentication
      const asaasSignature =
        request.headers.get("asaas-access-token") ||
        request.headers.get("authorization") ||
        request.headers.get("x-asaas-signature");

      const webhookSecret = process.env.ASAAS_WEBHOOK_SECRET;

      if (!webhookSecret) {
        console.error("ASAAS_WEBHOOK_SECRET not configured");
        return new Response("Server configuration error", { status: 500 });
      }

      if (!asaasSignature) {
        console.error("Missing Asaas authentication header");
        return new Response("Unauthorized - Missing authentication", {
          status: 401,
        });
      }

      if (asaasSignature !== webhookSecret) {
        console.error("Invalid Asaas webhook signature");
        return new Response("Unauthorized - Invalid signature", {
          status: 401,
        });
      }

      console.log("✅ Webhook authentication successful");

      const body = JSON.parse(rawBody);
      const { event, payment } = body;

      console.log(`📥 Asaas webhook received: ${event}`, {
        paymentId: payment?.id,
        externalReference: payment?.externalReference,
      });

      // Process payment confirmation events
      if (
        (event === "PAYMENT_CONFIRMED" || event === "PAYMENT_RECEIVED") &&
        (payment?.status === "RECEIVED" || payment?.status === "CONFIRMED")
      ) {
        const orderId = payment.externalReference;

        if (!orderId) {
          console.error("No externalReference (orderId) in payment");
          return new Response("Missing order reference", { status: 400 });
        }

        console.log(`📦 Processing payment for order: ${orderId}`);

        // Verify payment amount matches order (security check)
        const order = await ctx.runQuery(
          internal.orders.getOrderByAsaasPaymentId,
          {
            asaasPaymentId: payment.id,
          }
        );

        if (!order) {
          console.error(`Order not found for payment ${payment.id}`);
          return new Response("Order not found", { status: 404 });
        }

        // Verify payment amount
        const tolerance = 0.02; // 2 cents tolerance
        const paidAmount = payment.value || 0;

        // Handle installment payments
        const isInstallmentPayment =
          payment.installmentNumber && payment.installment;

        if (isInstallmentPayment) {
          // For installment payments, verify per-installment amount
          const installmentCount = order.installmentCount || 1;
          if (installmentCount > 1) {
            const expectedInstallmentValue =
              order.finalPrice / installmentCount;
            if (Math.abs(paidAmount - expectedInstallmentValue) > tolerance) {
              console.error(`🚨 Installment amount mismatch!`, {
                orderId,
                expected: expectedInstallmentValue,
                paid: paidAmount,
              });
              return new Response("Payment amount mismatch", { status: 400 });
            }
          }

          // Only process on first installment
          if (payment.installmentNumber !== 1) {
            console.log(
              `⏭️ Skipping installment ${payment.installmentNumber} - order processed on first installment`
            );
            return new Response("OK - Subsequent installment", { status: 200 });
          }
        } else {
          // For single payments, verify full amount
          if (Math.abs(paidAmount - order.finalPrice) > tolerance) {
            console.error(`🚨 Payment amount mismatch!`, {
              orderId,
              expected: order.finalPrice,
              paid: paidAmount,
            });
            return new Response("Payment amount mismatch", { status: 400 });
          }
        }

        console.log(`✅ Payment amount verified: R$ ${paidAmount}`);

        // Confirm payment and update order status
        await ctx.runMutation(internal.orders.confirmPayment, {
          orderId: order._id,
          asaasPaymentId: payment.id,
        });

        // Schedule provisioning to all target deployments
        await ctx.scheduler.runAfter(
          0,
          internal.payments.processPaymentConfirmed,
          {
            orderId: order._id,
          }
        );

        console.log(`✅ Payment confirmed, provisioning scheduled`);
      } else {
        console.log(`ℹ️ Ignoring event: ${event} (status: ${payment?.status})`);
      }

      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("❌ Webhook processing error:", error);
      return new Response("Webhook processing failed", { status: 500 });
    }
  }),
});

export default http;
