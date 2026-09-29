"use client";

import Link from "next/link";
import { Play, Plus, Check, Star, Lock } from "lucide-react";
import type { Series } from "@/lib/data";
import { useAuth } from "./AuthProvider";

export default function SeriesCard({ series, rank }: { series: Series; rank?: number }) {
  const { favorites, toggleFavorite, user } = useAuth();
  const isFav = favorites.includes(series.slug);
  const isLockedPreview = user?.plan !== "premium";

  return (
    <div className="series-card group relative w-[160px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#120018] sm:w-[190px]">
      <Link href={`/watch/${series.slug}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={series.cover}
            alt={series.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          {/* top badges */}
          <div className="absolute left-2 top-2 flex gap-1.5">
            {series.isNew && (
              <span className="rounded-md bg-[#7B2CFF] px-2 py-0.5 text-[10px] font-extrabold tracking-wide shadow-[0_0_14px_rgba(123,44,255,.8)]">NOVO</span>
            )}
            {series.top10 && (
              <span className="rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-extrabold tracking-wide backdrop-blur">TOP {series.top10}</span>
            )}
          </div>
          {rank !== undefined && (
            <span className="absolute -left-1 bottom-1 font-display text-[64px] font-extrabold leading-none text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,.35)] drop-shadow-[0_0_18px_rgba(123,44,255,.5)]">
              {rank}
            </span>
          )}

          {/* center play on hover */}
          <span className="absolute inset-0 grid place-items-center opacity-0 transition-all duration-300 group-hover:opacity-100">
            <span className="grid h-14 w-14 scale-75 place-items-center rounded-full bg-[#7B2CFF]/90 shadow-[0_0_30px_rgba(123,44,255,.9)] backdrop-blur transition-transform duration-300 group-hover:scale-100">
              <Play size={22} className="ml-0.5 fill-white text-white" />
            </span>
          </span>

          {/* bottom info */}
          <div className="absolute inset-x-0 bottom-0 p-3">
            <p className="flex items-center gap-1 text-[11px] font-bold text-emerald-300">
              <Star size={11} className="fill-emerald-300" /> {series.matchScore}% relevante
            </p>
            <h3 className="mt-0.5 font-display text-[14.5px] font-bold leading-tight">{series.title}</h3>
            <p className="mt-1 text-[11.5px] text-white/60">
              {series.category} • {series.episodesCount} episódios
            </p>
            {/* hover extra */}
            <div className="grid grid-rows-[0fr] transition-all duration-300 group-hover:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <div className="flex items-center gap-2 pt-2.5">
                  <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-black">
                    <Play size={11} className="fill-black" /> Assistir
                  </span>
                  {isLockedPreview && (
                    <span className="flex items-center gap-1 rounded-full border border-white/20 bg-black/60 px-2 py-1.5 text-[10px] font-semibold text-white/70">
                      <Lock size={10} /> EP 6+
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <button
        onClick={() => toggleFavorite(series.slug)}
        aria-label="Favoritar"
        className={`absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full backdrop-blur transition ${
          isFav ? "bg-[#7B2CFF] text-white shadow-[0_0_16px_rgba(123,44,255,.8)]" : "bg-black/60 text-white/80 hover:bg-black/90 hover:text-white"
        }`}
      >
        {isFav ? <Check size={15} strokeWidth={3} /> : <Plus size={15} />}
      </button>
    </div>
  );
}
