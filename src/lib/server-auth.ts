import { cookies } from "next/headers";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const SECRET = process.env.AUTH_SECRET;

if (!SECRET) {
  throw new Error("AUTH_SECRET não configurado");
}

export function hashPassword(password: string, salt?: string) {
  const s = salt || randomBytes(16).toString("hex");
  const hash = scryptSync(password, s, 64).toString("hex");
  return { salt: s, hash };
}

export function verifyPassword(password: string, salt: string, hash: string) {
  try {
    const derived = scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, "hex");
    if (derived.length !== expected.length) return false;
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

export function signSession(userId: string) {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30d
  const payload = `${userId}.${exp}`;
  const sig = createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export function verifySessionToken(token: string): { userId: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [userId, expStr, sig] = decoded.split(".");
    if (!userId || !expStr || !sig) return null;
    const payload = `${userId}.${expStr}`;
    const expected = createHmac("sha256", SECRET).update(payload).digest("hex");
    if (expected !== sig) return null;
    if (Number(expStr) < Date.now()) return null;
    return { userId };
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const parsed = verifySessionToken(token);
  if (!parsed) return null;
  const rows = await db.select().from(users).where(eq(users.id, parsed.userId)).limit(1);
  const u = rows[0];
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    plan: (u.plan as "free" | "premium") ?? "free",
    avatarColor: u.avatarColor,
    createdAt: u.createdAt,
  };
}

export async function setSessionCookie(userId: string) {
  const store = await cookies();
  const token = signSession(userId);
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

export const SESSION_COOKIE = COOKIE_NAME;
