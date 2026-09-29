"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, X } from "lucide-react";
import { SERIES, getSeries } from "@/lib/data";

interface Item {
  slug: string;
  episode: number;
}

export default function ContinueWatching() {
  const [items, setItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      // try server history first
      try {
        const r = await fetch("/api/history", { cache: "no-store" });
        if (r.ok) {
          const j = await r.json();
          if (j.history?.length) {
            setItems(j.history.map((h: { seriesSlug: string; episodeNumber: number }) => ({ slug: h.seriesSlug, episode: h.episodeNumber })));
            setLoaded(true);
            return;
          }
        }
      } catch {}
      try {
        const raw = localStorage.getItem("aurora_continue");
        if (raw) setItems(JSON.parse(raw));
      } catch {}
      setLoaded(true);
    }
    load();
  }, []);

  if (!loaded) {
    return (
      <section className="px-4 sm:px-6 lg:px-10">
        <div className="mb-3 h-6 w-48 skeleton rounded-lg" />
        <div className="flex gap-3.5 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[150px] w-[260px] shrink-0 skeleton rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  const valid = items.map((it) => ({ ...it, series: getSeries(it.slug) })).filter((x) => x.series);
  if (!valid.length) return null;

  return (
    <section>
      <div className="mb-3 px-4 sm:px-6 lg:px-10">
        <h2 className="font-display text-[19px] font-extrabold sm:text-[22px]">Continuar assistindo</h2>
        <p className="text-[13px] text-white/50">Retome de onde parou</p>
      </div>
      <div className="no-scrollbar flex gap-3.5 overflow-x-auto px-4 pb-2 sm:px-6 lg:px-10">
        {valid.slice(0, 8).map(({ slug, episode, series }) => (
          <Link
            key={slug}
            href={`/watch/${slug}?ep=${episode}`}
            className="group relative h-[150px] w-[260px] shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:h-[160px] sm:w-[300px]"
          >
            <img src={series!.backdrop} alt={series!.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#7B2CFF]/90 shadow-[0_0_26px_rgba(123,44,255,.8)] transition group-hover:scale-110">
              <Play size={19} className="ml-0.5 fill-white" />
            </span>
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="font-display text-[14px] font-bold">{series!.title}</p>
              <p className="text-[12px] text-white/60">EP {String(episode).padStart(2, "0")} • Continuar</p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-[#7B2CFF] to-[#ff5ee7]" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function saveContinue(slug: string, episode: number) {
  try {
    const raw = localStorage.getItem("aurora_continue");
    let arr: Item[] = raw ? JSON.parse(raw) : [];
    arr = [{ slug, episode }, ...arr.filter((x) => x.slug !== slug)].slice(0, 10);
    localStorage.setItem("aurora_continue", JSON.stringify(arr));
  } catch {}
}
