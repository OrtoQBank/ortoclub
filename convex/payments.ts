import { v } from "convex/values";

import { internal } from "./_generated/api";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";

// ──────────────────────────────────────────────────────
// Queries
// ──────────────────────────────────────────────────────

/**
 * Get order details for provisioning.
 */
export const getOrderForProvisioning = internalQuery({
  args: {
    orderId: v.id("orders"),
  },
  returns: v.union(
    v.object({
      _id: v.id("orders"),
      email: v.string(),
      name: v.string(),
      productId: v.id("products"),
      productName: v.string(),
      finalPrice: v.number(),
      accessExpiresAt: v.optional(v.number()),
      clerkUserId: v.optional(v.string()),
      couponCode: v.optional(v.string()),
      couponDiscount: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      return null;
    }
    return {
      _id: order._id,
      email: order.email,
      name: order.name,
      productId: order.productId,
      productName: order.productName,
      finalPrice: order.finalPrice,
      accessExpiresAt: order.accessExpiresAt,
      clerkUserId: order.clerkUserId,
      couponCode: order.couponCode,
      couponDiscount: order.couponDiscount,
    };
  },
});

// ──────────────────────────────────────────────────────
// Provisioning
// ──────────────────────────────────────────────────────

/**
 * Process payment confirmation and provision to all target deployments.
 */
export const processPaymentConfirmed = internalAction({
  args: {
    orderId: v.id("orders"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    console.log(`Processing payment confirmed for order ${args.orderId}`);

    // Get order details
    const order = await ctx.runQuery(
      internal.payments.getOrderForProvisioning,
      {
        orderId: args.orderId,
      }
    );

    if (!order) {
      console.error(`Order not found: ${args.orderId}`);
      return null;
    }

    // Get product with target deployments
    const product = await ctx.runQuery(
      internal.products.getProductWithDeployments,
      {
        productId: order.productId,
      }
    );

    if (!product) {
      console.error(`Product not found: ${order.productId}`);
      return null;
    }

    // Get all target deployments
    const deployments = await ctx.runQuery(
      internal.deployments.getDeploymentsByIds,
      {
        deploymentIds: product.targetDeployments,
      }
    );

    console.log(
      `Provisioning to ${deployments.length} deployment(s):`,
      deployments.map((d) => d.name)
    );

    // Provision to each deployment in parallel
    const provisionSecret = process.env.PROVISION_SECRET;
    if (!provisionSecret) {
      console.error("PROVISION_SECRET not configured");
      return null;
    }

    const provisioningResults = await Promise.allSettled(
      deployments.map(async (deployment) => {
        console.log(`Provisioning to ${deployment.name}...`);

        const response = await fetch(
          `${deployment.provisionUrl}/api/provision-access`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${provisionSecret}`,
            },
            body: JSON.stringify({
              email: order.email,
              clerkUserId: order.clerkUserId,
              productName: order.productName,
              orderId: order._id,
              purchasePrice: order.finalPrice,
              accessExpiresAt: order.accessExpiresAt,
              couponUsed: order.couponCode,
              discountAmount: order.couponDiscount,
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Provisioning failed for ${deployment.name}: ${response.status} - ${errorText}`
          );
        }

        console.log(`Provisioned to ${deployment.name}`);
        return { deployment, success: true };
      })
    );

    // Update order with provisioning status
    const provisioningStatus = provisioningResults.map((result, index) => {
      const deployment = deployments[index];
      if (result.status === "fulfilled") {
        return {
          deploymentId: deployment._id,
          deploymentName: deployment.name,
          status: "success" as const,
          provisionedAt: Date.now(),
        };
      } else {
        return {
          deploymentId: deployment._id,
          deploymentName: deployment.name,
          status: "failed" as const,
          error: result.reason?.message || "Unknown error",
        };
      }
    });

    await ctx.runMutation(internal.orders.updateProvisioningStatus, {
      orderId: args.orderId,
      provisioningStatus,
    });

    // Send Clerk invitation
    const primaryDeployment = deployments[0];
    await ctx.runAction(internal.payments.sendClerkInvitation, {
      email: order.email,
      orderId: args.orderId,
      customerName: order.name,
      redirectDomain: primaryDeployment?.domain,
      primaryDeploymentId: primaryDeployment?._id,
    });

    console.log(`Completed processing for order ${args.orderId}`);
    return null;
  },
});

// ──────────────────────────────────────────────────────
// Clerk Invitations
// ──────────────────────────────────────────────────────

/**
 * Send Clerk invitation email.
 */
export const sendClerkInvitation = internalAction({
  args: {
    email: v.string(),
    orderId: v.id("orders"),
    customerName: v.string(),
    redirectDomain: v.optional(v.string()),
    primaryDeploymentId: v.optional(v.id("deployments")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

    if (!CLERK_SECRET_KEY) {
      console.error("CLERK_SECRET_KEY not configured");
      return null;
    }

    // Create invitation tracking record
    const invitationId = await ctx.runMutation(
      internal.payments.createEmailInvitation,
      {
        orderId: args.orderId,
        email: args.email,
        customerName: args.customerName,
        primaryDeploymentId: args.primaryDeploymentId,
      }
    );

    console.log(`Sending Clerk invitation to ${args.email}`);

    // Determine redirect URL
    let redirectUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ortoclub.com";
    if (args.redirectDomain) {
      redirectUrl = `https://${args.redirectDomain}/sign-up`;
    }

    try {
      const response = await fetch("https://api.clerk.com/v1/invitations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: args.email,
          redirect_url: redirectUrl,
          public_metadata: {
            orderId: args.orderId,
            customerName: args.customerName,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Failed to send invitation:", error);

        await ctx.runMutation(internal.payments.updateEmailInvitationFailure, {
          invitationId,
          errorMessage: `Clerk API error: ${response.status}`,
        });
        return null;
      }

      const invitation = await response.json();
      console.log(`Invitation sent: ${invitation.id}`);

      await ctx.runMutation(internal.payments.updateEmailInvitationSuccess, {
        invitationId,
        clerkInvitationId: invitation.id,
      });
    } catch (error) {
      console.error("Error sending invitation:", error);

      await ctx.runMutation(internal.payments.updateEmailInvitationFailure, {
        invitationId,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return null;
  },
});

/**
 * Create email invitation tracking record.
 */
export const createEmailInvitation = internalMutation({
  args: {
    orderId: v.id("orders"),
    email: v.string(),
    customerName: v.string(),
    primaryDeploymentId: v.optional(v.id("deployments")),
  },
  returns: v.id("emailInvitations"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("emailInvitations", {
      orderId: args.orderId,
      email: args.email,
      customerName: args.customerName,
      status: "pending",
      retryCount: 0,
      primaryDeploymentId: args.primaryDeploymentId,
    });
  },
});

/**
 * Update email invitation to success status.
 */
export const updateEmailInvitationSuccess = internalMutation({
  args: {
    invitationId: v.id("emailInvitations"),
    clerkInvitationId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.invitationId, {
      status: "sent",
      clerkInvitationId: args.clerkInvitationId,
      sentAt: Date.now(),
    });
    return null;
  },
});

/**
 * Update email invitation to failure status.
 */
export const updateEmailInvitationFailure = internalMutation({
  args: {
    invitationId: v.id("emailInvitations"),
    errorMessage: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get(args.invitationId);
    if (invitation) {
      await ctx.db.patch(args.invitationId, {
        status: "failed",
        errorMessage: args.errorMessage,
        retryCount: invitation.retryCount + 1,
      });
    }
    return null;
  },
});
