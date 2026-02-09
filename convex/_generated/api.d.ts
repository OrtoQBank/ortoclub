/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as asaas from "../asaas.js";
import type * as asaas_client from "../asaas/client.js";
import type * as asaas_types from "../asaas/types.js";
import type * as coupons from "../coupons.js";
import type * as deployments from "../deployments.js";
import type * as http from "../http.js";
import type * as invoices from "../invoices.js";
import type * as leads from "../leads.js";
import type * as lib_rateLimits from "../lib/rateLimits.js";
import type * as orders from "../orders.js";
import type * as payments from "../payments.js";
import type * as pricingPlans from "../pricingPlans.js";
import type * as products from "../products.js";
import type * as promoCoupons from "../promoCoupons.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";
import type * as waitlist from "../waitlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  asaas: typeof asaas;
  "asaas/client": typeof asaas_client;
  "asaas/types": typeof asaas_types;
  coupons: typeof coupons;
  deployments: typeof deployments;
  http: typeof http;
  invoices: typeof invoices;
  leads: typeof leads;
  "lib/rateLimits": typeof lib_rateLimits;
  orders: typeof orders;
  payments: typeof payments;
  pricingPlans: typeof pricingPlans;
  products: typeof products;
  promoCoupons: typeof promoCoupons;
  seed: typeof seed;
  users: typeof users;
  waitlist: typeof waitlist;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
