import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;
let tabelaPronta: Promise<void> | null = null;

export function getDb(): Client {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!url) {
      throw new Error("TURSO_DATABASE_URL não configurada no .env");
    }
    client = createClient({ url, authToken });
  }
  return client;
}

// Cria a tabela de confirmações uma única vez (cacheada por processo)
export function ensureRsvpTable(): Promise<void> {
  if (!tabelaPronta) {
    tabelaPronta = getDb()
      .execute(
        `CREATE TABLE IF NOT EXISTS rsvps (
          id TEXT PRIMARY KEY,
          nome TEXT NOT NULL,
          presenca TEXT NOT NULL,
          recado TEXT,
          criado_em TEXT NOT NULL
        )`,
      )
      .then(() => undefined)
      .catch((err) => {
        // permite tentar de novo na próxima requisição
        tabelaPronta = null;
        throw err;
      });
  }
  return tabelaPronta;
}
