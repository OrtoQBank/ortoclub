'use node';

import { v } from 'convex/values';

import { action } from './_generated/server';
import { appendToSheet, PRODUCT_SHEETS } from './googleSheets';

export const createLead = action({
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
  handler: async (_, args) => {
    const sheetId = PRODUCT_SHEETS[args.produto];

    if (!sheetId) {
      throw new Error(
        `Planilha não encontrada para o produto: ${args.produto}`,
      );
    }

    await appendToSheet(
      sheetId,
      [
        'Nome Completo',
        'Número',
        'Email',
        'Produto',
        'Nível de Residência',
        'Subespecialidade',
        'Data',
      ],
      [
        args.nomeCompleto,
        args.numero,
        args.email,
        args.produto,
        args.residencyLevel,
        args.subspecialty,
        new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      ],
    );

    return { ok: true };
  },
});
