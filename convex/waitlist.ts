import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const createWaitlistEntry = mutation({
  args: {
    productName: v.optional(v.string()),
    name: v.string(),
    email: v.string(),
    whatsapp: v.string(),
    instagram: v.optional(v.string()),
    residencyLevel: v.union(
      v.literal('R1'),
      v.literal('R2'),
      v.literal('R3'),
      v.literal('Já concluí'),
    ),
    subspecialty: v.union(
      v.literal('Pediátrica'),
      v.literal('Tumor'),
      v.literal('Quadril'),
      v.literal('Joelho'),
      v.literal('Ombro e Cotovelo'),
      v.literal('Mão'),
      v.literal('Coluna'),
      v.literal('Pé e Tornozelo'),
    ),
  },
  returns: v.union(v.id('waitlist'), v.literal('email_already_exists')),
  handler: async (ctx, args) => {
    // Check if email already exists
    const existingEntry = await ctx.db
      .query('waitlist')
      .withIndex('by_email', q => q.eq('email', args.email))
      .first();

    if (existingEntry) {
      return 'email_already_exists';
    }

    // Create the waitlist entry
    const entryId = await ctx.db.insert('waitlist', {
      productName: args.productName,
      name: args.name,
      email: args.email,
      whatsapp: args.whatsapp,
      instagram: args.instagram,
      residencyLevel: args.residencyLevel,
      subspecialty: args.subspecialty,
    });

    return entryId;
  },
});

export const list = query({
  args: {
    productName: v.optional(v.string()),
  },
  returns: v.array(
    v.object({
      _id: v.id('waitlist'),
      _creationTime: v.number(),
      productName: v.optional(v.string()),
      name: v.string(),
      email: v.string(),
      whatsapp: v.string(),
      instagram: v.optional(v.string()),
      residencyLevel: v.union(
        v.literal('R1'),
        v.literal('R2'),
        v.literal('R3'),
        v.literal('Já concluí'),
      ),
      subspecialty: v.union(
        v.literal('Pediátrica'),
        v.literal('Tumor'),
        v.literal('Quadril'),
        v.literal('Joelho'),
        v.literal('Ombro e Cotovelo'),
        v.literal('Mão'),
        v.literal('Coluna'),
        v.literal('Pé e Tornozelo'),
      ),
    }),
  ),
  handler: async (ctx, { productName }) => {
    if (productName) {
      return await ctx.db
        .query('waitlist')
        .withIndex('by_product', q => q.eq('productName', productName))
        .collect();
    }
    return await ctx.db.query('waitlist').collect();
  },
});
