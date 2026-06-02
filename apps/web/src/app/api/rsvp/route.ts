import { NextResponse } from "next/server";
import { z } from "zod";
import { ensureRsvpTable, getDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rsvpSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(80),
  presenca: z.enum(["sim", "nao"]),
  recado: z.string().trim().max(300).optional().default(""),
});

export async function GET() {
  try {
    await ensureRsvpTable();
    const db = getDb();
    const res = await db.execute(
      "SELECT nome, presenca, recado, criado_em FROM rsvps ORDER BY criado_em DESC",
    );

    const confirmados = res.rows.filter((r) => r.presenca === "sim");

    return NextResponse.json({
      totalPessoas: confirmados.length,
      totalRespostas: res.rows.length,
      confirmados: confirmados.map((r) => ({
        nome: r.nome,
        recado: r.recado,
      })),
    });
  } catch (err) {
    console.error("Erro ao listar confirmações:", err);
    return NextResponse.json(
      { error: "Erro ao consultar o banco de dados." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 },
    );
  }

  try {
    await ensureRsvpTable();
    const db = getDb();
    await db.execute({
      sql: "INSERT INTO rsvps (id, nome, presenca, recado, criado_em) VALUES (?, ?, ?, ?, ?)",
      args: [
        crypto.randomUUID(),
        parsed.data.nome,
        parsed.data.presenca,
        parsed.data.recado,
        new Date().toISOString(),
      ],
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Erro ao salvar confirmação:", err);
    return NextResponse.json(
      { error: "Erro ao salvar no banco de dados." },
      { status: 500 },
    );
  }
}
