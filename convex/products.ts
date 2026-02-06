import { v } from "convex/values";

import { internalQuery, query } from "./_generated/server";

/**
 * Get product by slug (public)
 */
export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(
    v.object({
      _id: v.id("products"),
      name: v.string(),
      slug: v.string(),
      lot: v.number(),
      price: v.number(),
      pixPrice: v.optional(v.number()),
      description: v.optional(v.string()),
      features: v.optional(v.array(v.string())),
      isActive: v.boolean(),
      accessExpiresAt: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!product) {
      return null;
    }

    return {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      lot: product.lot,
      price: product.price,
      pixPrice: product.pixPrice,
      description: product.description,
      features: product.features,
      isActive: product.isActive,
      accessExpiresAt: product.accessExpiresAt,
    };
  },
});

/**
 * Get all active products (public)
 */
export const getActiveProducts = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("products"),
      name: v.string(),
      slug: v.string(),
      lot: v.number(),
      price: v.number(),
      pixPrice: v.optional(v.number()),
      description: v.optional(v.string()),
      features: v.optional(v.array(v.string())),
      displayOrder: v.optional(v.number()),
    })
  ),
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    return products
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .map((p) => ({
        _id: p._id,
        name: p.name,
        slug: p.slug,
        lot: p.lot,
        price: p.price,
        pixPrice: p.pixPrice,
        description: p.description,
        features: p.features,
        displayOrder: p.displayOrder,
      }));
  },
});

/**
 * Get product by ID with target deployments (internal, for provisioning)
 */
export const getProductWithDeployments = internalQuery({
  args: {
    productId: v.id("products"),
  },
  returns: v.union(
    v.object({
      _id: v.id("products"),
      name: v.string(),
      targetDeployments: v.array(v.id("deployments")),
      accessExpiresAt: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);

    if (!product) {
      return null;
    }

    return {
      _id: product._id,
      name: product.name,
      targetDeployments: product.targetDeployments,
      accessExpiresAt: product.accessExpiresAt,
    };
  },
});
