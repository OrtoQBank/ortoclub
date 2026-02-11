'use node';

import { JWT } from 'google-auth-library';

/**
 * Mapa de nome do produto para spreadsheet ID do Google Sheets.
 * Adicione novos produtos aqui conforme necessário.
 */
export const PRODUCT_SHEETS: Record<string, string> = {
  OrtoQbank: '1ruCA6A-utwRh_YWmTcbDN9CBgb5HetS2oR_nbQf5RYw',
  'Extensivo': '1cZ4ZIHgQ5vAv5MZlYnozn9z1JEl4IHnXtZrIB8LoqGU',
  'TEOT Aulas': '1tnbTqTMACz6g6nX6e7DaC9k5n6-TngRMxxZ5LPVq2sE',
  'Mentoria Aulas': '13jLSqTZ_Jz-YhqbXbYh1H1mhKdXBwRteDLKQf1F4WHg',
  'SBCJ Qbank': '115EewaFk6N9qQdbD6PLB0Ay2GdizDIaX0_21Pwo3Blo',
  'Mão Qbank': '10XuTlyh70IlaCHMyBH2kBvvvXhvRqfuVO0Y4e5CoTWA',
  'Gestão Aulas': '1rBmKNT7O9h08En33CvUdssL0Hs9VxVSF4fubdyDiWMg',
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
 * Obtém o nome da primeira aba da planilha.
 * Necessário porque o nome padrão varia conforme o idioma da conta Google
 * (ex: "Sheet1" em inglês, "Planilha1" em português).
 */
async function getFirstSheetName(
  spreadsheetId: string,
  accessToken: string,
): Promise<string> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erro ao obter metadados da planilha: ${errorText}`);
  }

  const data = await res.json();

  if (!data.sheets || data.sheets.length === 0) {
    throw new Error('A planilha não possui nenhuma aba');
  }

  return data.sheets[0].properties.title;
}

/**
 * Constrói o range em A1 notation com o nome da aba.
 * Nomes com espaços ou caracteres especiais são envolvidos em aspas simples.
 */
function buildRange(sheetName: string, cellRange: string): string {
  const escapedName = sheetName.replace(/'/g, "''");
  return `'${escapedName}'!${cellRange}`;
}

/**
 * Verifica se a planilha já possui cabeçalho (primeira linha).
 * Se não tiver, insere o cabeçalho antes de adicionar dados.
 */
async function ensureHeaders(
  spreadsheetId: string,
  sheetName: string,
  headers: string[],
  accessToken: string,
): Promise<void> {
  const range = buildRange(sheetName, 'A1:Z1');
  const readUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;

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
    const writeRange = buildRange(sheetName, 'A1');
    const writeUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(writeRange)}?valueInputOption=RAW`;

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
 * Verifica se um email já existe na planilha.
 * Lê todos os valores da coluna especificada e compara (case-insensitive).
 *
 * @param spreadsheetId - ID da planilha
 * @param emailColumnLetter - Letra da coluna onde está o email (ex: 'B', 'C')
 * @param email - Email a ser verificado
 * @returns true se o email já existe na planilha
 */
export async function emailExistsInSheet(
  spreadsheetId: string,
  emailColumnLetter: string,
  email: string,
): Promise<boolean> {
  const accessToken = await getGoogleAuthToken();
  const sheetName = await getFirstSheetName(spreadsheetId, accessToken);
  const range = buildRange(sheetName, `${emailColumnLetter}:${emailColumnLetter}`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erro ao verificar email na planilha: ${errorText}`);
  }

  const data = await res.json();
  const rows: string[][] = data.values ?? [];
  const normalizedEmail = email.trim().toLowerCase();

  // Pula a primeira linha (cabeçalho) e verifica se o email existe
  return rows
    .slice(1)
    .some(
      (row: string[]) =>
        row[0] && row[0].trim().toLowerCase() === normalizedEmail,
    );
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
  const sheetName = await getFirstSheetName(spreadsheetId, accessToken);

  await ensureHeaders(spreadsheetId, sheetName, headers, accessToken);

  const range = buildRange(sheetName, 'A1');
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=RAW`;

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
