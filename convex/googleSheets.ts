'use node';

import { JWT } from 'google-auth-library';

/**
 * Mapa de nome do produto para spreadsheet ID do Google Sheets.
 * Adicione novos produtos aqui conforme necessário.
 */
export const PRODUCT_SHEETS: Record<string, string> = {
  OrtoQbank: '1AmAIkOkwRBW83FGKtUfFt6QOttGn8uWr0RBNQutkpSA',
  'TEOT Aulas': '1TP6gdI4S0Y1obxb2mgac8ZdxzzPVPy4IkegvSnuF54U', // TODO: trocar pelo spreadsheet ID correto do TEOT Aulas
  'Mentoria Aulas': '1Nk21HhUYuqkD7RuZDOL57sjm3GBzHf5q0WvYWnAJW-I',
  // 'SBCJ Qbank': 'SPREADSHEET_ID_AQUI',
  // 'Mão Qbank': 'SPREADSHEET_ID_AQUI',
  // 'Gestão Aulas': 'SPREADSHEET_ID_AQUI',
};

/**
 * Autentica com a service account do Google e retorna o access token.
 */
export async function getGoogleAuthToken(): Promise<string> {
  const auth = new JWT({
    email: process.env.GOOGLE_SERVICE_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const token = await auth.authorize();

  if (!token.access_token) {
    throw new Error('Falha ao obter access token do Google');
  }

  return token.access_token;
}

/**
 * Verifica se a planilha já possui cabeçalho (primeira linha).
 * Se não tiver, insere o cabeçalho antes de adicionar dados.
 */
async function ensureHeaders(
  spreadsheetId: string,
  headers: string[],
  accessToken: string,
): Promise<void> {
  const readUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:Z1`;

  const readRes = await fetch(readUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!readRes.ok) {
    const errorText = await readRes.text();
    throw new Error(`Erro ao ler cabeçalho da planilha: ${errorText}`);
  }

  const data = await readRes.json();

  // Se não há valores na primeira linha, insere o cabeçalho
  if (!data.values || data.values.length === 0) {
    const writeUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1?valueInputOption=RAW`;

    const writeRes = await fetch(writeUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [headers],
      }),
    });

    if (!writeRes.ok) {
      const errorText = await writeRes.text();
      throw new Error(`Erro ao inserir cabeçalho na planilha: ${errorText}`);
    }
  }
}

/**
 * Adiciona uma linha na planilha Google Sheets especificada.
 * Garante que o cabeçalho exista antes de inserir os dados.
 */
export async function appendToSheet(
  spreadsheetId: string,
  headers: string[],
  row: string[],
): Promise<void> {
  const accessToken = await getGoogleAuthToken();

  await ensureHeaders(spreadsheetId, headers, accessToken);

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=RAW`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [row],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erro ao adicionar linha na planilha: ${errorText}`);
  }
}
