import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, setSessionCookie } from "@/lib/server-auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Informe email e senha." }, { status: 400 });
    const cleanEmail = String(email).trim().toLowerCase();
    const rows = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);
    const u = rows[0];
    if (!u || !verifyPassword(String(password), u.salt, u.passwordHash)) {
      return NextResponse.json({ error: "Email ou senha incorretos." }, { status: 401 });
    }
    await setSessionCookie(u.id);
    return NextResponse.json({
      user: { id: u.id, name: u.name, email: u.email, plan: u.plan, avatarColor: u.avatarColor },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
