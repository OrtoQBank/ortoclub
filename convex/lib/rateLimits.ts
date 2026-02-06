import type { MutationCtx } from "../_generated/server";

/**
 * Stub rate limiter - always allows.
 * Replace with a real implementation (e.g. Convex rate limit helpers) when needed.
 */
export const rateLimiter = {
  async limit(
    _ctx: MutationCtx,
    _name: string,
    _opts: { key: string },
  ): Promise<{ ok: boolean; retryAfter?: number }> {
    return { ok: true };
  },
};
