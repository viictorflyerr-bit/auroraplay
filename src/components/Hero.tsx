"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Play, Star, Plus, Check, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";
import { SERIES } from "@/lib/data";
import { useAuth } from "./AuthProvider";

function Particles({ count = 22 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: `${(i * 41 + 7) % 100}%`,
        bottom: `${(i * 13) % 30}%`,
        size: 3 + ((i * 7) % 6),
        dur: `${7 + ((i * 3) % 8)}s`,
        delay: `${(i % 7) * 0.9}s`,
      })),
    [count]
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{ left: p.left, bottom: p.bottom, width: p.size, height: p.size, animationDuration: p.dur, animationDelay: p.delay }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const featured = SERIES.filter((s) => s.trending).slice(0, 4);
  const [idx, setIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const { favorites, toggleFavorite, triggerPremium, user } = useAuth();
  const current = featured[idx];
  const isFav = favorites.includes(current.slug);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % featured.length), 7000);
    return () => clearInterval(t);
  }, [featured.length]);

  return (
    <section className="relative min-h-[92vh] overflow-hidden pt-[68px]">
      {/* bg */}
      {featured.map((s, i) => (
        <div key={s.slug} className={`absolute inset-0 transition-opacity duration-[1200ms] ${i === idx ? "opacity-100" : "opacity-0"}`}>
          <img src={s.backdrop} alt="" className="kenburns h-full w-full object-cover" />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/75 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#120018]/40 via-transparent to-transparent" />
      {/* aurora beams */}
      <div className="aurora-beam absolute left-[8%] top-[-5%] h-[60%] w-[140px]" />
      <div className="aurora-beam absolute left-[32%] top-[5%] h-[50%] w-[80px]" style={{ animationDelay: "-2s" }} />
      <div className="absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-[#7B2CFF]/25 blur-[110px]" />
      <div className="absolute right-[-60px] top-[20%] h-72 w-72 rounded-full bg-[#ff5ee7]/15 blur-[100px]" />
      <Particles />

      <div className="relative mx-auto flex min-h-[calc(92vh-68px)] max-w-[1400px] flex-col justify-end px-4 pb-14 sm:justify-center sm:px-6 sm:pb-0 lg:px-10">
        <div key={current.slug} className="max-w-[640px]">
          <div className="fade-up flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-[#7B2CFF]/20 px-3 py-1.5 text-[11px] font-extrabold tracking-[0.14em] text-[#d9b8ff] backdrop-blur border border-[#7B2CFF]/40">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#b24bff]" /> AURORA ORIGINAL
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white/80 backdrop-blur">#{current.top10} EM ALTA HOJE</span>
          </div>

          <h1 className="fade-up stagger-1 font-display mt-4 text-[42px] font-extrabold leading-[0.95] tracking-tight sm:text-[64px]">
            Histórias que prendem você <span className="aurora-text">do começo ao fim.</span>
          </h1>
          <p className="fade-up stagger-2 mt-3 font-display text-[17px] font-bold text-[#e6d5ff] sm:text-[20px]">
            {current.title} — {current.description}
          </p>
          <p className="fade-up stagger-2 mt-2 max-w-[520px] text-[14px] leading-relaxed text-white/60">
            Assista aos melhores ReelShorts em episódios rápidos e emocionantes. {current.episodesCount} episódios • {current.category} • {current.durationLabel}
          </p>

          <div className="fade-up stagger-3 mt-6 flex flex-wrap items-center gap-3">
            <Link href={`/watch/${current.slug}`} className="neon-btn flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-extrabold">
              <Play size={18} className="fill-white" /> Assistir agora
            </Link>
            <button
              onClick={() => triggerPremium()}
              className="flex items-center gap-2 rounded-full border border-[#7B2CFF]/50 bg-white/5 px-7 py-3.5 text-[15px] font-bold text-white backdrop-blur transition hover:bg-[#7B2CFF]/20 hover:shadow-[0_0_30px_rgba(123,44,255,.4)]"
            >
              <Star size={17} className="text-amber-300" /> Seja Premium
            </button>
            <button
              onClick={() => toggleFavorite(current.slug)}
              className="grid h-[52px] w-[52px] place-items-center rounded-full border border-white/15 bg-white/5 backdrop-blur transition hover:border-[#7B2CFF] hover:bg-[#7B2CFF]/20"
              aria-label="Minha lista"
            >
              {isFav ? <Check size={19} /> : <Plus size={19} />}
            </button>
          </div>

          <div className="fade-up stagger-4 mt-5 flex items-center gap-3 text-[12.5px] text-white/55">
            <span className="flex items-center gap-1 font-bold text-emerald-300">★ {current.rating.toFixed(1)}</span>
            <span>•</span><span>{current.year}</span>
            <span>•</span><span>{current.kind}</span>
            <span>•</span><span className="rounded border border-white/20 px-1.5 py-0.5 text-[10.5px]">12+</span>
            <span className="hidden sm:inline">• {current.tags.slice(0, 2).join(" • ")}</span>
          </div>
        </div>

        {/* carousel dots + thumbs */}
        <div className="mt-10 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            {featured.map((f, i) => (
              <button
                key={f.slug}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === idx ? "w-10 bg-gradient-to-r from-[#7B2CFF] to-[#e0aaff] shadow-[0_0_12px_rgba(123,44,255,.9)]" : "w-4 bg-white/25 hover:bg-white/50"}`}
                aria-label={f.title}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIdx((idx - 1 + featured.length) % featured.length)} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/40 backdrop-blur hover:border-[#7B2CFF]" aria-label="Anterior">
              <ChevronLeft size={17} />
            </button>
            <button onClick={() => setIdx((idx + 1) % featured.length)} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/40 backdrop-blur hover:border-[#7B2CFF]" aria-label="Próximo">
              <ChevronRight size={17} />
            </button>
            <button onClick={() => setMuted((m) => !m)} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/40 backdrop-blur hover:border-[#7B2CFF]" aria-label="Som">
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* bottom fade into catalog */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050505] to-transparent" />
    </section>
  );
}
