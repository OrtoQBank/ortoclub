'use node';

import { v } from 'convex/values';

import { action } from './_generated/server';
import {
  PRODUCT_SHEETS,
  appendToSheet,
  emailExistsInSheet,
} from './googleSheets';

export const createWaitlistEntry = action({
  args: {
    productName: v.string(),
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
  handler: async (_, args) => {
    const product = args.productName;
    const sheetId = PRODUCT_SHEETS[product];

    if (!sheetId) {
      throw new Error(`Planilha não encontrada para o produto: ${product}`);
    }

    // Verifica se o email já existe na planilha (coluna B = Email)
    const exists = await emailExistsInSheet(sheetId, 'B', args.email);
    if (exists) {
      return { ok: true, status: 'email_already_exists' as const };
    }

    await appendToSheet(
      sheetId,
      [
        'Nome',
        'Email',
        'WhatsApp',
        'Instagram',
        'Nível de Residência',
        'Subespecialidade',
        'Data',
      ],
      [
        args.name,
        args.email,
        args.whatsapp,
        args.instagram ?? '',
        args.residencyLevel,
        args.subspecialty,
        new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      ],
    );

    return { ok: true, status: 'created' as const };
  },
});
