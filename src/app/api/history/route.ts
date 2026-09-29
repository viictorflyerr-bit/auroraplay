import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server-auth";
import { db } from "@/db";
import { watchHistory } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ history: [] });
  const rows = await db
    .select()
    .from(watchHistory)
    .where(eq(watchHistory.userId, user.id))
    .orderBy(desc(watchHistory.updatedAt))
    .limit(20);
  return NextResponse.json({ history: rows });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: true, guest: true });
  try {
    const { slug, episode, progress } = await req.json();
    if (!slug || !episode) return NextResponse.json({ error: "missing" }, { status: 400 });
    const existing = await db
      .select()
      .from(watchHistory)
      .where(
        and(
          eq(watchHistory.userId, user.id),
          eq(watchHistory.seriesSlug, String(slug))
        )
      )
      .limit(1);
    if (existing.length) {
      await db
        .update(watchHistory)
        .set({ episodeNumber: Number(episode), progressSec: Number(progress ?? 0), updatedAt: new Date() })
        .where(eq(watchHistory.id, existing[0].id));
    } else {
      await db.insert(watchHistory).values({
        userId: user.id,
        seriesSlug: String(slug),
        episodeNumber: Number(episode),
        progressSec: Number(progress ?? 0),
      });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "fail" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
