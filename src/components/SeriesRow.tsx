"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Series } from "@/lib/data";
import SeriesCard from "./SeriesCard";

export default function SeriesRow({ title, subtitle, items, numbered = false }: { title: string; subtitle?: string; items: Series[]; numbered?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 520, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <section className="relative">
      <div className="mb-3 flex items-end justify-between px-4 sm:px-6 lg:px-10">
        <div>
          <h2 className="font-display text-[19px] font-extrabold tracking-tight sm:text-[22px]">
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-[13px] text-white/50">{subtitle}</p>}
        </div>
        <div className="hidden gap-2 sm:flex">
          <button onClick={() => scroll(-1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-white/5 text-white/70 hover:border-[#7B2CFF] hover:text-white" aria-label="Anterior">
            <ChevronLeft size={17} />
          </button>
          <button onClick={() => scroll(1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-white/5 text-white/70 hover:border-[#7B2CFF] hover:text-white" aria-label="Próximo">
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
      <div ref={ref} className="no-scrollbar flex gap-3.5 overflow-x-auto scroll-smooth px-4 pb-2 sm:px-6 lg:px-10">
        {items.map((s, i) => (
          <SeriesCard key={s.slug} series={s} rank={numbered ? i + 1 : undefined} />
        ))}
        <div className="w-2 shrink-0" />
      </div>
    </section>
  );
}
