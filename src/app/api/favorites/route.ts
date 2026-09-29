import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server-auth";
import { db } from "@/db";
import { favorites } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ favorites: [] });
  const rows = await db.select().from(favorites).where(eq(favorites.userId, user.id));
  return NextResponse.json({ favorites: rows.map((r) => r.seriesSlug) });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Login necessário" }, { status: 401 });
  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  const existing = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, user.id), eq(favorites.seriesSlug, String(slug))))
    .limit(1);
  if (existing.length) {
    await db.delete(favorites).where(and(eq(favorites.userId, user.id), eq(favorites.seriesSlug, String(slug))));
    return NextResponse.json({ favorited: false });
  } else {
    await db.insert(favorites).values({ userId: user.id, seriesSlug: String(slug) });
    return NextResponse.json({ favorited: true });
  }
}

export const dynamic = "force-dynamic";
