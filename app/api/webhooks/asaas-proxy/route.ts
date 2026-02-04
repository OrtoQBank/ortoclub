import { NextRequest, NextResponse } from "next/server";

/**
 * Asaas Webhook Proxy
 *
 * This route receives webhooks from Asaas and routes them to the correct
 * Convex deployment based on the externalReference format: appSlug:orderId
 *
 * Configuration:
 * - ASAAS_WEBHOOK_SECRET: The secret token for webhook validation
 * - ASAAS_APP_ROUTES: JSON mapping of app slugs to webhook URLs
 *   Example: {"ortoclub":"https://deploy1.convex.site/webhooks/asaas","ortoclub":"https://deploy1.convex.site/webhooks/asaas","derma":"https://deploy2.convex.site/webhooks/asaas"}
 *
 * Or use individual environment variables:
 * - WEBHOOK_URL_ortoclub: Webhook URL for ortoclub app
 */

// Map app slugs to their Convex webhook URLs
function getAppRoutes(): Record<string, string> {
  const routes: Record<string, string> = {};

  // Try to parse JSON mapping from environment variable
  if (process.env.ASAAS_APP_ROUTES) {
    try {
      const parsed = JSON.parse(process.env.ASAAS_APP_ROUTES);
      Object.assign(routes, parsed);
    } catch (e) {
      console.error("Failed to parse ASAAS_APP_ROUTES:", e);
    }
  }

  // Also support individual env vars for each app (WEBHOOK_URL_<appSlug>)
  // This allows adding apps without updating JSON
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith("WEBHOOK_URL_") && value) {
      const appSlug = key.replace("WEBHOOK_URL_", "").toLowerCase();
      routes[appSlug] = value;
    }
  }

  return routes;
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for forwarding
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);

    // Verify Asaas signature
    const webhookSecret = process.env.ASAAS_WEBHOOK_SECRET;
    const signature =
      request.headers.get("asaas-access-token") ||
      request.headers.get("authorization");

    if (!webhookSecret) {
      console.error("❌ ASAAS_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!signature) {
      console.error("❌ Missing Asaas authentication header");
      return NextResponse.json(
        { error: "Unauthorized - Missing authentication" },
        { status: 401 }
      );
    }

    if (signature !== webhookSecret) {
      console.error("❌ Invalid Asaas webhook signature");
      return NextResponse.json(
        { error: "Unauthorized - Invalid signature" },
        { status: 401 }
      );
    }

    // Parse externalReference to get app slug
    const externalReference = body.payment?.externalReference || "";
    const colonIndex = externalReference.indexOf(":");

    if (colonIndex === -1) {
      console.error(
        `❌ Invalid externalReference format: ${externalReference}. Expected format: appSlug:orderId`
      );
      return NextResponse.json(
        {
          error: "Invalid reference format",
          detail: "Expected format: appSlug:orderId",
        },
        { status: 400 }
      );
    }

    const appSlug = externalReference.substring(0, colonIndex);
    const orderId = externalReference.substring(colonIndex + 1);

    // Get the target URL for this app
    const routes = getAppRoutes();
    const targetUrl = routes[appSlug];

    if (!targetUrl) {
      console.error(
        `❌ Unknown app: ${appSlug}. Available: ${Object.keys(routes).join(", ")}`
      );
      return NextResponse.json(
        { error: "Unknown app", app: appSlug },
        { status: 400 }
      );
    }

    console.log(`📨 Routing webhook to ${appSlug}:`);
    console.log(`   Event: ${body.event}`);
    console.log(`   Payment ID: ${body.payment?.id}`);
    console.log(`   Order ID: ${orderId}`);
    console.log(`   Target: ${targetUrl}`);

    // Forward to correct Convex deployment
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "asaas-access-token": signature,
      },
      body: rawBody, // Forward original body
    });

    const responseText = await response.text();

    console.log(`✅ Forwarded to ${appSlug}, status: ${response.status}`);

    return new NextResponse(responseText, {
      status: response.status,
    });
  } catch (error) {
    console.error("❌ Webhook proxy error:", error);
    return NextResponse.json(
      { error: "Proxy error", detail: String(error) },
      { status: 500 }
    );
  }
}

// Use Edge runtime for better performance
export const runtime = "edge";
