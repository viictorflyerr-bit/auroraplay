import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server-auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Faça login para assinar." }, { status: 401 });
  await db.update(users).set({ plan: "premium" }).where(eq(users.id, user.id));
  return NextResponse.json({ ok: true, user: { ...user, plan: "premium" } });
}

export async function DELETE() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sem sessão." }, { status: 401 });
  await db.update(users).set({ plan: "free" }).where(eq(users.id, user.id));
  return NextResponse.json({ ok: true, user: { ...user, plan: "free" } });
}
