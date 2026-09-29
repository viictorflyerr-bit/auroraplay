import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, setSessionCookie } from "@/lib/server-auth";

const AVATARS = ["#7B2CFF", "#b24bff", "#ff5ee7", "#5e6bff", "#00d1b2", "#ff7a3d"];

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Preencha nome, email e senha." }, { status: 400 });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }
    if (String(password).length < 6) {
      return NextResponse.json({ error: "A senha precisa de ao menos 6 caracteres." }, { status: 400 });
    }
    const existing = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);
    if (existing.length) {
      return NextResponse.json({ error: "Este email já está cadastrado. Tente entrar." }, { status: 409 });
    }
    const { salt, hash } = hashPassword(String(password));
    const color = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    const inserted = await db
      .insert(users)
      .values({ name: String(name).trim().slice(0, 60), email: cleanEmail, passwordHash: hash, salt, plan: "free", avatarColor: color })
      .returning();
    const u = inserted[0];
    await setSessionCookie(u.id);
    return NextResponse.json({
      user: { id: u.id, name: u.name, email: u.email, plan: u.plan, avatarColor: u.avatarColor },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 });
  }
}
