"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Play, Pause, Volume2, VolumeX, Maximize, ChevronLeft, ChevronRight,
  Lock, Check, Plus, Star, Crown, SkipForward, RotateCcw, Heart, Share2, ChevronDown,
} from "lucide-react";
import { getEpisodes, formatDuration, type Series } from "@/lib/data";
import { useAuth } from "./AuthProvider";
import { saveContinue } from "./ContinueWatching";
import SeriesRow from "./SeriesRow";
import { SERIES } from "@/lib/data";

export default function PlayerClient({ series, initialEp }: { series: Series; initialEp: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, triggerPremium, favorites, toggleFavorite } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  const episodes = useMemo(() => getEpisodes(series, Math.min(series.episodesCount, 30)), [series]);
  const [ep, setEp] = useState(() => {
    const q = Number(searchParams.get("ep"));
    return q >= 1 && q <= episodes.length ? q : initialEp;
  });
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showList, setShowList] = useState(false);
  const [liked, setLiked] = useState(false);

  const isPremium = user?.plan === "premium";
  const isLocked = (n: number) => !isPremium && n > 5;
  const current = episodes[ep - 1];
  const isFav = favorites.includes(series.slug);

  const goTo = useCallback((n: number) => {
    if (n < 1 || n > episodes.length) return;
    if (isLocked(n)) {
      triggerPremium(`Você chegou ao episódio ${n} 🚀`);
      return;
    }
    setEp(n);
    setProgress(0);
    setPlaying(false);
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("ep", String(n));
    router.replace(`?${sp.toString()}`, { scroll: false });
    saveContinue(series.slug, n);
    fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: series.slug, episode: n, progress: 0 }),
    }).catch(() => {});
    setTimeout(() => videoRef.current?.play().catch(() => {}), 150);
  }, [episodes.length, isPremium, triggerPremium, searchParams, router, series.slug]);

  // initial save
  useEffect(() => {
    saveContinue(series.slug, ep);
    fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: series.slug, episode: ep, progress: 0 }),
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      setProgress(v.currentTime);
      setDuration(v.duration || 0);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [ep]);

  useEffect(() => {
    // autoplay attempt muted? try with sound, fallback
    videoRef.current?.play().catch(() => setPlaying(false));
  }, [ep]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const pct = duration ? Math.min(100, (progress / duration) * 100) : 0;
  const related = SERIES.filter((s) => s.slug !== series.slug && s.category === series.category).concat(
    SERIES.filter((s) => s.slug !== series.slug && s.category !== series.category)
  ).slice(0, 8);

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* top bar */}
      <div className="fixed inset-x-0 top-0 z-40 bg-gradient-to-b from-black/90 to-transparent px-4 pb-8 pt-4 sm:px-6">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3">
          <Link href="/" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur hover:bg-white/20" aria-label="Voltar">
            <ChevronLeft size={20} />
          </Link>
          <div className="min-w-0">
            <p className="truncate font-display text-[15px] font-extrabold">{series.title}</p>
            <p className="text-[12px] text-white/55">{series.category} • {series.episodesCount} episódios • {isPremium ? "⭐ PREMIUM" : "FREE"}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {!isPremium && (
              <button onClick={() => triggerPremium()} className="neon-btn hidden items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-extrabold sm:flex">
                <Crown size={13} /> Premium
              </button>
            )}
            <button onClick={() => toggleFavorite(series.slug)} className={`grid h-10 w-10 place-items-center rounded-full backdrop-blur ${isFav ? "bg-[#7B2CFF]" : "bg-white/10 hover:bg-white/20"}`} aria-label="Favoritar">
              {isFav ? <Check size={17} /> : <Plus size={17} />}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-6 px-0 pt-[76px] sm:px-6 lg:grid-cols-[1fr_380px] lg:px-10 lg:pt-[90px]">
        {/* video column */}
        <div>
          <div className="relative mx-auto w-full max-w-[430px]">
            <div className="video-glow relative aspect-[9/16] max-h-[78vh] overflow-hidden rounded-none bg-black sm:rounded-[24px]">
              <video
                ref={videoRef}
                key={current.videoUrl + ep}
                src={current.videoUrl}
                poster={series.cover}
                playsInline
                loop={false}
                muted={muted}
                onClick={togglePlay}
                onEnded={() => {
                  const next = ep + 1;
                  if (next <= episodes.length) {
                    if (isLocked(next)) triggerPremium(`Você chegou ao episódio ${next} 🚀`);
                    else goTo(next);
                  }
                }}
                className="h-full w-full cursor-pointer object-cover"
              />
              {/* gradient overlays */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* EP badge */}
              <div className="absolute left-3 top-3 flex items-center gap-2">
                <span className="rounded-lg bg-black/70 px-2.5 py-1 text-[12px] font-extrabold tracking-wide backdrop-blur">EP {String(ep).padStart(2, "0")}</span>
                <span className="rounded-lg bg-[#7B2CFF]/90 px-2.5 py-1 text-[11px] font-bold shadow-[0_0_16px_rgba(123,44,255,.7)]">{series.category.toUpperCase()}</span>
              </div>

              {/* center play */}
              {!playing && (
                <button onClick={togglePlay} className="absolute inset-0 grid place-items-center" aria-label="Play">
                  <span className="grid h-[76px] w-[76px] place-items-center rounded-full bg-[#7B2CFF]/90 shadow-[0_0_50px_rgba(123,44,255,.9)] backdrop-blur transition hover:scale-105">
                    <Play size={30} className="ml-1 fill-white text-white" />
                  </span>
                </button>
              )}

              {/* side actions (reel style) */}
              <div className="absolute bottom-24 right-2.5 flex flex-col gap-3">
                <button onClick={() => setLiked((v) => !v)} className="flex flex-col items-center gap-1" aria-label="Curtir">
                  <span className={`grid h-11 w-11 place-items-center rounded-full backdrop-blur ${liked ? "bg-[#ff2d78]" : "bg-black/55"}`}>
                    <Heart size={19} className={liked ? "fill-white" : ""} />
                  </span>
                  <span className="text-[10.5px] font-bold">{liked ? "12.9k" : "12.8k"}</span>
                </button>
                <button onClick={() => toggleFavorite(series.slug)} className="flex flex-col items-center gap-1" aria-label="Lista">
                  <span className={`grid h-11 w-11 place-items-center rounded-full backdrop-blur ${isFav ? "bg-[#7B2CFF]" : "bg-black/55"}`}>
                    {isFav ? <Check size={18} /> : <Plus size={18} />}
                  </span>
                  <span className="text-[10.5px] font-bold">Lista</span>
                </button>
                <button className="flex flex-col items-center gap-1" aria-label="Compartilhar" onClick={() => { try { navigator.clipboard.writeText(window.location.href); } catch {} }}>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-black/55 backdrop-blur"><Share2 size={17} /></span>
                  <span className="text-[10.5px] font-bold">Share</span>
                </button>
              </div>

              {/* bottom controls */}
              <div className="absolute inset-x-0 bottom-0 p-3.5">
                <p className="font-display text-[15px] font-bold leading-tight">{current.title}</p>
                <p className="mt-0.5 line-clamp-2 text-[12px] text-white/65">{current.synopsis}</p>
                <div className="mt-2.5 flex items-center gap-2.5">
                  <button onClick={togglePlay} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-black" aria-label="Play/Pause">
                    {playing ? <Pause size={15} className="fill-black" /> : <Play size={15} className="ml-0.5 fill-black" />}
                  </button>
                  <button onClick={() => { if (videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10); }} className="grid h-9 w-9 place-items-center rounded-full bg-white/15 backdrop-blur" aria-label="Voltar 10s">
                    <RotateCcw size={15} />
                  </button>
                  <button onClick={() => goTo(ep + 1)} className="grid h-9 w-9 place-items-center rounded-full bg-white/15 backdrop-blur" aria-label="Próximo">
                    <SkipForward size={15} />
                  </button>
                  <span className="text-[11.5px] font-semibold text-white/70">{formatDuration(Math.floor(progress))} / {formatDuration(Math.floor(duration || current.durationSec))}</span>
                  <div className="ml-auto flex gap-2">
                    <button onClick={() => setMuted((m) => { const v = videoRef.current; if (v) v.muted = !m; return !m; })} className="grid h-9 w-9 place-items-center rounded-full bg-white/15 backdrop-blur" aria-label="Mudo">
                      {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                    </button>
                    <button onClick={() => videoRef.current?.requestFullscreen?.().catch(() => {})} className="grid h-9 w-9 place-items-center rounded-full bg-white/15 backdrop-blur" aria-label="Tela cheia">
                      <Maximize size={15} />
                    </button>
                  </div>
                </div>
                <div className="mt-2.5 h-[4px] overflow-hidden rounded-full bg-white/20">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#7B2CFF] via-[#b24bff] to-[#ff5ee7] transition-[width]" style={{ width: `${pct}%` }} />
                </div>
                <input
                  type="range" min={0} max={duration || 100} step={0.5} value={progress}
                  onChange={(e) => { const v = videoRef.current; if (v) v.currentTime = Number(e.target.value); }}
                  className="mt-1 w-full accent-[#7B2CFF]"
                  aria-label="Progresso"
                />
              </div>
            </div>

            {/* prev/next bar */}
            <div className="mx-3 mt-3 flex gap-2 sm:mx-0">
              <button
                onClick={() => goTo(ep - 1)} disabled={ep <= 1}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/5 py-3 text-[13.5px] font-bold disabled:opacity-40"
              >
                <ChevronLeft size={16} /> Anterior
              </button>
              <button
                onClick={() => goTo(ep + 1)}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7B2CFF] to-[#a93cff] py-3 text-[13.5px] font-extrabold shadow-[0_0_22px_rgba(123,44,255,.45)]"
              >
                Próximo EP <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* info below */}
          <div className="mx-3 mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:mx-0 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 text-[12px]">
              <span className="font-bold text-emerald-300">★ {series.rating.toFixed(1)}</span>
              <span className="text-white/40">•</span><span className="text-white/60">{series.year}</span>
              <span className="text-white/40">•</span><span className="text-white/60">{series.kind}</span>
              <span className="rounded border border-white/20 px-1.5 py-0.5 text-[10.5px] text-white/60">12+</span>
              <span className="rounded-full bg-[#7B2CFF]/20 px-2.5 py-1 font-bold text-[#c99cff]">{series.category}</span>
            </div>
            <h1 className="font-display mt-2 text-[22px] font-extrabold">{series.title}</h1>
            <p className="mt-2 text-[14px] leading-relaxed text-white/65">{series.longSynopsis}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {series.tags.map((t) => (
                <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] text-white/60">#{t}</span>
              ))}
            </div>
            <p className="mt-3 text-[12.5px] text-white/40">Elenco: {series.cast.join(" • ")}</p>
            {!isPremium && (
              <button onClick={() => triggerPremium()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#7B2CFF]/50 bg-[#7B2CFF]/10 py-3.5 text-[14px] font-bold text-[#d9b8ff]">
                <Lock size={15} /> EP 06+ bloqueados — Desbloquear Premium
              </button>
            )}
          </div>
        </div>

        {/* episode list sidebar */}
        <aside className="px-3 sm:px-0">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d0016]/80 backdrop-blur lg:sticky lg:top-[90px]">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div>
                <p className="font-display text-[16px] font-extrabold">Episódios</p>
                <p className="text-[12px] text-white/50">{isPremium ? `${episodes.length} liberados • Premium ⭐` : "5 grátis • resto Premium 🔒"}</p>
              </div>
              <button onClick={() => setShowList((s) => !s)} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 lg:hidden" aria-label="Expandir">
                <ChevronDown size={17} className={`transition ${showList ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* free progress */}
            {!isPremium && (
              <div className="border-b border-white/10 p-4">
                <div className="flex justify-between text-[12px] font-bold"><span className="text-white/60">Plano gratuito</span><span className="text-[#c99cff]">{Math.min(ep, 5)}/5 EPs</span></div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#7B2CFF] to-[#ff5ee7]" style={{ width: `${(Math.min(ep, 5) / 5) * 100}%` }} />
                </div>
              </div>
            )}

            <div className={`cinematic-scroll max-h-[520px] overflow-y-auto p-2.5 ${showList ? "" : "hidden lg:block"}`}>
              {episodes.slice(0, 15).map((e) => {
                const locked = isLocked(e.number);
                const active = e.number === ep;
                return (
                  <button
                    key={e.number}
                    onClick={() => goTo(e.number)}
                    className={`group flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition ${active ? "bg-[#7B2CFF]/20 ring-1 ring-[#7B2CFF]/60" : "hover:bg-white/5"}`}
                  >
                    <span className="relative h-[64px] w-[46px] shrink-0 overflow-hidden rounded-xl">
                      <img src={series.cover} alt="" className={`h-full w-full object-cover ${locked ? "opacity-40 grayscale-[.3]" : ""}`} />
                      <span className="absolute inset-0 grid place-items-center">
                        {locked ? (
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-black/70"><Lock size={13} /></span>
                        ) : active ? (
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#7B2CFF]"><Play size={12} className="ml-0.5 fill-white" /></span>
                        ) : (
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-black/60 opacity-0 transition group-hover:opacity-100"><Play size={12} className="ml-0.5 fill-white" /></span>
                        )}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`flex items-center gap-1.5 text-[13.5px] font-bold ${locked ? "text-white/45" : ""}`}>
                        EP {String(e.number).padStart(2, "0")} {locked && <Lock size={11} className="text-[#c99cff]" />}
                        {e.number <= 5 && <span className="rounded bg-emerald-400/15 px-1.5 py-0.5 text-[9.5px] font-extrabold text-emerald-300">GRÁTIS</span>}
                      </span>
                      <span className="block truncate text-[12px] text-white/50">{e.title}</span>
                      <span className="text-[11px] text-white/35">{formatDuration(e.durationSec)}</span>
                    </span>
                    {active && <span className="h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-[#7B2CFF] to-[#ff5ee7]" />}
                  </button>
                );
              })}
              <button onClick={() => triggerPremium()} className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#7B2CFF]/50 bg-[#7B2CFF]/5 p-4 text-[13px] font-bold text-[#c99cff] hover:bg-[#7B2CFF]/10">
                <Crown size={15} /> Desbloquear {series.episodesCount - 15}+ episódios
              </button>
            </div>
          </div>

          {/* up next mobile */}
          <div className="mt-4 lg:hidden">
            <div className="no-scrollbar flex gap-2.5 overflow-x-auto">
              {episodes.slice(0, 8).map((e) => (
                <button
                  key={e.number}
                  onClick={() => goTo(e.number)}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold ${e.number === ep ? "bg-[#7B2CFF] shadow-[0_0_16px_rgba(123,44,255,.6)]" : isLocked(e.number) ? "border border-white/15 bg-white/5 text-white/40" : "border border-white/15 bg-white/10"}`}
                >
                  {isLocked(e.number) ? <Lock size={14} /> : String(e.number).padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="mx-auto mt-10 max-w-[1400px] space-y-8 pb-24">
        <SeriesRow title="Você também vai amar" subtitle={`Mais ${series.category} para maratonar`} items={related} />
      </div>
    </div>
  );
}
