import { v } from "convex/values";

import { internalQuery, query } from "./_generated/server";

/**
 * Get deployment by slug (public)
 */
export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(
    v.object({
      _id: v.id("deployments"),
      name: v.string(),
      slug: v.string(),
      domain: v.optional(v.string()),
      isActive: v.boolean(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const deployment = await ctx.db
      .query("deployments")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!deployment) {
      return null;
    }

    return {
      _id: deployment._id,
      name: deployment.name,
      slug: deployment.slug,
      domain: deployment.domain,
      isActive: deployment.isActive,
    };
  },
});

/**
 * Get deployments by IDs (internal, for provisioning)
 */
export const getDeploymentsByIds = internalQuery({
  args: {
    deploymentIds: v.array(v.id("deployments")),
  },
  returns: v.array(
    v.object({
      _id: v.id("deployments"),
      name: v.string(),
      slug: v.string(),
      provisionUrl: v.string(),
      domain: v.optional(v.string()),
      isActive: v.boolean(),
    })
  ),
  handler: async (ctx, args) => {
    const deployments = await Promise.all(
      args.deploymentIds.map((id) => ctx.db.get(id))
    );

    return deployments
      .filter((d): d is NonNullable<typeof d> => d !== null && d.isActive)
      .map((d) => ({
        _id: d._id,
        name: d.name,
        slug: d.slug,
        provisionUrl: d.provisionUrl,
        domain: d.domain,
        isActive: d.isActive,
      }));
  },
});

/**
 * Get all active deployments (public)
 */
export const getActiveDeployments = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("deployments"),
      name: v.string(),
      slug: v.string(),
      domain: v.optional(v.string()),
    })
  ),
  handler: async (ctx) => {
    const deployments = await ctx.db.query("deployments").collect();

    return deployments
      .filter((d) => d.isActive)
      .map((d) => ({
        _id: d._id,
        name: d.name,
        slug: d.slug,
        domain: d.domain,
      }));
  },
});
