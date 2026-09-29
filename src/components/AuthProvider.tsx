"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  plan: "free" | "premium";
  avatarColor: string;
}

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  upgradeToPremium: () => Promise<boolean>;
  favorites: string[];
  toggleFavorite: (slug: string) => Promise<void>;
  showPremiumModal: boolean;
  setShowPremiumModal: (v: boolean) => void;
  premiumContext: string;
  triggerPremium: (ctx?: string) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth outside provider");
  return v;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumContext, setPremiumContext] = useState("Você chegou ao episódio 6 🚀");

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/auth/me", { cache: "no-store" });
      const j = await r.json();
      if (j.user) {
        setUser(j.user);
        // load favorites
        const f = await fetch("/api/favorites", { cache: "no-store" });
        if (f.ok) {
          const fj = await f.json();
          setFavorites(fj.favorites ?? []);
        }
      } else {
        setUser(null);
        // guest favorites from localStorage
        try {
          const raw = localStorage.getItem("aurora_guest_favs");
          if (raw) setFavorites(JSON.parse(raw));
        } catch {}
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const j = await r.json();
    if (!r.ok) return { ok: false, error: j.error || "Falha no login" };
    setUser(j.user);
    await refresh();
    return { ok: true };
  }, [refresh]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const r = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const j = await r.json();
    if (!r.ok) return { ok: false, error: j.error || "Falha no cadastro" };
    setUser(j.user);
    await refresh();
    return { ok: true };
  }, [refresh]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setFavorites([]);
  }, []);

  const upgradeToPremium = useCallback(async () => {
    const r = await fetch("/api/subscribe", { method: "POST" });
    if (!r.ok) return false;
    const j = await r.json();
    if (j.user) setUser(j.user);
    else await refresh();
    return true;
  }, [refresh]);

  const toggleFavorite = useCallback(async (slug: string) => {
    // optimistic
    let next: string[];
    setFavorites((prev) => {
      next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      if (!user) {
        try { localStorage.setItem("aurora_guest_favs", JSON.stringify(next)); } catch {}
      }
      return next;
    });
    if (user) {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      // resync
      try {
        const f = await fetch("/api/favorites", { cache: "no-store" });
        if (f.ok) {
          const fj = await f.json();
          setFavorites(fj.favorites ?? []);
        }
      } catch {}
    }
  }, [user]);

  const triggerPremium = useCallback((ctx?: string) => {
    if (ctx) setPremiumContext(ctx);
    setShowPremiumModal(true);
  }, []);

  const value = useMemo<AuthCtx>(() => ({
    user, loading, login, register, logout, refresh, upgradeToPremium,
    favorites, toggleFavorite, showPremiumModal, setShowPremiumModal,
    premiumContext, triggerPremium,
  }), [user, loading, login, register, logout, refresh, upgradeToPremium, favorites, toggleFavorite, showPremiumModal, premiumContext, triggerPremium]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
