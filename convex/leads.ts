import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const createLead = mutation({
  args: {
    nomeCompleto: v.string(),
    numero: v.string(),
    email: v.string(),
    produto: v.string(),
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
  returns: v.union(v.id('leads'), v.literal('email_already_exists')),
  handler: async (ctx, args) => {
    // Check if email already exists
    const existingLead = await ctx.db
      .query('leads')
      .withIndex('by_email', q => q.eq('email', args.email))
      .first();

    if (existingLead) {
      return 'email_already_exists';
    }

    // Create the lead
    const leadId = await ctx.db.insert('leads', {
      nomeCompleto: args.nomeCompleto,
      numero: args.numero,
      email: args.email,
      produto: args.produto,
      residencyLevel: args.residencyLevel,
      subspecialty: args.subspecialty,
    });

    return leadId;
  },
});

export const list = query({
  args: {
    produto: v.optional(v.string()),
  },
  returns: v.array(
    v.object({
      _id: v.id('leads'),
      _creationTime: v.number(),
      nomeCompleto: v.string(),
      numero: v.string(),
      email: v.string(),
      produto: v.string(),
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
  handler: async (ctx, { produto }) => {
    if (produto) {
      return await ctx.db
        .query('leads')
        .withIndex('by_produto', q => q.eq('produto', produto))
        .collect();
    }
    return await ctx.db.query('leads').collect();
  },
});
