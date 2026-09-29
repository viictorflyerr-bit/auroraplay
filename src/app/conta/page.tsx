"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import PremiumModal from "@/components/PremiumModal";
import SeriesCard from "@/components/SeriesCard";
import { useAuth } from "@/components/AuthProvider";
import { getSeries, SERIES } from "@/lib/data";
import { Crown, Play, Heart, Settings, LogOut, Star, ChevronRight, BadgeCheck } from "lucide-react";

export default function ContaPage() {
  const { user, loading, logout, favorites } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<{ seriesSlug: string; episodeNumber: number }[]>([]);
  const [tab, setTab] = useState<"continuar" | "lista" | "favoritos" | "config">("continuar");

  useEffect(() => {
    if (!loading && !user) router.push("/login?next=/conta");
  }, [loading, user, router]);

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch("/api/history", { cache: "no-store" });
        if (r.ok) {
          const j = await r.json();
          setHistory(j.history ?? []);
          return;
        }
      } catch {}
      try {
        const raw = localStorage.getItem("aurora_continue");
        if (raw) {
          const arr = JSON.parse(raw);
          setHistory(arr.map((x: { slug: string; episode: number }) => ({ seriesSlug: x.slug, episodeNumber: x.episode })));
        }
      } catch {}
    }
    if (user) load();
  }, [user]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#050505]">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-[3px] border-[#7B2CFF]/30 border-t-[#7B2CFF]" />
          <p className="font-display mt-4 text-lg font-bold">Carregando seu universo...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const favSeries = favorites.map((s) => getSeries(s)).filter(Boolean);
  const continueSeries = history.map((h) => ({ ...h, series: getSeries(h.seriesSlug) })).filter((x) => x.series);

  return (
    <div className="aurora-bg min-h-screen pb-24 md:pb-0">
      <Header />
      <main className="mx-auto max-w-[1200px] px-4 pt-[100px] sm:px-6">
        {/* profile header */}
        <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-[#1e0038] via-[#120018] to-black p-6 sm:p-8">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#7B2CFF]/30 blur-[80px]" />
          <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <span className="grid h-20 w-20 place-items-center rounded-3xl text-[28px] font-extrabold shadow-[0_0_30px_rgba(123,44,255,.5)]" style={{ background: user.avatarColor }}>
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div className="flex-1">
              <p className="flex flex-wrap items-center gap-2 font-display text-[24px] font-extrabold">
                {user.name}
                {user.plan === "premium" && (
                  <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-300 to-yellow-100 px-3 py-1 text-[11px] font-extrabold text-black">
                    <Star size={11} /> PREMIUM
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-[13.5px] text-white/55">{user.email}</p>
              <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-[12.5px]">
                Plano atual: <strong className={user.plan === "premium" ? "text-amber-300" : "text-white"}>{user.plan === "premium" ? "⭐ PREMIUM" : "FREE"}</strong>
              </p>
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              {user.plan !== "premium" ? (
                <Link href="/planos" className="neon-btn flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-[14px] font-extrabold sm:flex-none">
                  <Crown size={16} /> Virar Premium
                </Link>
              ) : (
                <span className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-amber-300/40 bg-amber-300/10 px-6 py-3.5 text-[14px] font-bold text-amber-200 sm:flex-none">
                  <BadgeCheck size={16} /> Premium ativo
                </span>
              )}
              <button onClick={async () => { await logout(); router.push("/"); }} className="grid h-[52px] w-[52px] place-items-center rounded-2xl border border-white/12 bg-white/5 hover:bg-white/10" aria-label="Sair">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* tabs */}
        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
          {[
            { id: "continuar", label: "Continuar assistindo", icon: Play },
            { id: "lista", label: "Minha lista", icon: Heart },
            { id: "favoritos", label: "Favoritos", icon: Star },
            { id: "config", label: "Configurações", icon: Settings },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-bold transition ${tab === t.id ? "bg-gradient-to-r from-[#7B2CFF] to-[#a93cff] shadow-[0_0_18px_rgba(123,44,255,.5)]" : "border border-white/12 bg-white/5 text-white/60 hover:text-white"}`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "continuar" && (
            continueSeries.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {continueSeries.slice(0, 6).map(({ seriesSlug, episodeNumber, series }) => (
                  <Link key={seriesSlug} href={`/watch/${seriesSlug}?ep=${episodeNumber}`} className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-[#7B2CFF]/50">
                    <img src={series!.cover} alt={series!.title} className="h-[110px] w-[76px] shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1 py-1">
                      <p className="truncate font-display text-[15px] font-bold">{series!.title}</p>
                      <p className="mt-0.5 text-[12.5px] text-white/55">EP {String(episodeNumber).padStart(2, "0")} • {series!.category}</p>
                      <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#7B2CFF] px-3.5 py-1.5 text-[12px] font-bold transition group-hover:shadow-[0_0_18px_rgba(123,44,255,.6)]">
                        <Play size={12} className="fill-white" /> Retomar
                      </span>
                    </div>
                    <ChevronRight size={16} className="self-center text-white/30" />
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState title="Nada por aqui ainda 👀" desc="Comece uma série e ela aparece aqui para continuar." cta="Explorar catálogo" href="/explorar" />
            )
          )}

          {(tab === "lista" || tab === "favoritos") && (
            favSeries.length ? (
              <div className="flex flex-wrap gap-3.5">
                {favSeries.map((s) => s && <SeriesCard key={s.slug} series={s} />)}
              </div>
            ) : (
              <EmptyState title="Sua lista está vazia 💜" desc="Toque no + dos cards para salvar suas séries favoritas." cta="Descobrir séries" href="/explorar" />
            )
          )}

          {tab === "config" && (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="font-display text-[16px] font-bold">Perfil</p>
                <div className="mt-4 space-y-3 text-[14px]">
                  <div className="flex justify-between border-b border-white/10 pb-3"><span className="text-white/55">Nome</span><span className="font-semibold">{user.name}</span></div>
                  <div className="flex justify-between border-b border-white/10 pb-3"><span className="text-white/55">Email</span><span className="font-semibold">{user.email}</span></div>
                  <div className="flex justify-between"><span className="text-white/55">Plano</span><span className="font-bold text-[#c99cff]">{user.plan.toUpperCase()}</span></div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="font-display text-[16px] font-bold">Assinatura</p>
                <p className="mt-2 text-[13.5px] text-white/55">
                  {user.plan === "premium" ? "Sua assinatura Premium está ativa. Aproveite episódios ilimitados!" : "Você está no plano gratuito (até EP 05). Desbloqueie tudo por apenas R$10/mês."}
                </p>
                <Link href="/planos" className={`mt-4 block rounded-2xl py-3.5 text-center text-[14px] font-extrabold ${user.plan === "premium" ? "border border-white/15 bg-white/5" : "neon-btn"}`}>
                  {user.plan === "premium" ? "Gerenciar plano" : "Assinar Premium"}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* stats */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            [String(SERIES.length * 8), "Títulos disponíveis"],
            [String(favorites.length), "Na sua lista"],
            [user.plan === "premium" ? "∞" : "5", "EPs por série"],
          ].map(([n, l]) => (
            <div key={l} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center sm:p-5">
              <p className="font-display text-[22px] font-extrabold text-[#c99cff] sm:text-[26px]">{n}</p>
              <p className="mt-0.5 text-[12px] text-white/50">{l}</p>
            </div>
          ))}
        </div>
        <div className="h-10" />
      </main>
      <Footer />
      <MobileNav />
      <PremiumModal />
    </div>
  );
}

function EmptyState({ title, desc, cta, href }: { title: string; desc: string; cta: string; href: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-[#7B2CFF]/40 bg-[#7B2CFF]/5 p-10 text-center">
      <p className="font-display text-[18px] font-bold">{title}</p>
      <p className="mx-auto mt-2 max-w-[380px] text-[13.5px] text-white/55">{desc}</p>
      <Link href={href} className="neon-btn mt-5 inline-block rounded-full px-6 py-3 text-[13.5px] font-bold">{cta}</Link>
    </div>
  );
}
