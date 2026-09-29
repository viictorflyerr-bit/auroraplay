"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import PremiumModal from "@/components/PremiumModal";
import SeriesCard from "@/components/SeriesCard";
import { SERIES, CATEGORIES } from "@/lib/data";
import { Search, SlidersHorizontal } from "lucide-react";

function ExplorarInner() {
  const params = useSearchParams();
  const router = useRouter();
  const qParam = params.get("q") ?? "";
  const catParam = params.get("categoria") ?? "Todas";
  const tipoParam = params.get("tipo") ?? "Todos";

  const [q, setQ] = useState(qParam);
  const [sort, setSort] = useState("relevancia");

  const filtered = useMemo(() => {
    let list = [...SERIES];
    if (catParam !== "Todas") list = list.filter((s) => s.category === catParam);
    if (tipoParam !== "Todos") list = list.filter((s) => s.kind === tipoParam);
    const qq = (qParam || q).trim().toLowerCase();
    if (qq) {
      list = list.filter((s) =>
        [s.title, s.category, s.description, ...s.tags].join(" ").toLowerCase().includes(qq)
      );
    }
    if (sort === "avaliacao") list.sort((a, b) => b.rating - a.rating);
    if (sort === "episodios") list.sort((a, b) => b.episodesCount - a.episodesCount);
    if (sort === "recentes") list.sort((a, b) => b.year - a.year);
    if (sort === "relevancia") list.sort((a, b) => b.matchScore - a.matchScore);
    return list;
  }, [catParam, tipoParam, qParam, q, sort]);

  const setParam = (key: string, value: string) => {
    const sp = new URLSearchParams(params.toString());
    if (value === "Todas" || value === "Todos" || value === "") sp.delete(key);
    else sp.set(key, value);
    router.push(`/explorar?${sp.toString()}`);
  };

  return (
    <div className="aurora-bg min-h-screen pb-24 md:pb-0">
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 pt-[100px] sm:px-6 lg:px-10">
        <h1 className="font-display text-[30px] font-extrabold tracking-tight sm:text-[38px]">
          Explorar <span className="aurora-text">catálogo</span>
        </h1>
        <p className="mt-1 text-[14px] text-white/55">
          {tipoParam !== "Todos" ? `${tipoParam}s` : "Séries e novelas"} • {filtered.length} títulos encontrados
        </p>

        {/* search */}
        <form
          onSubmit={(e) => { e.preventDefault(); setParam("q", q); }}
          className="mt-5 flex items-center gap-2 rounded-2xl border border-white/12 bg-white/5 p-2 pl-4 backdrop-blur focus-within:border-[#7B2CFF]"
        >
          <Search size={18} className="shrink-0 text-white/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Busca inteligente: tente 'bilionário', 'vingança', 'lobo'..."
            className="w-full bg-transparent text-[14.5px] outline-none placeholder:text-white/35"
          />
          <button className="neon-btn shrink-0 rounded-xl px-5 py-2.5 text-[13.5px] font-bold">Buscar</button>
        </form>

        {/* filters */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-[12.5px] font-bold text-white/50"><SlidersHorizontal size={13} /> Filtros:</span>
          {["Todas", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setParam("categoria", c)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                catParam === c
                  ? "bg-gradient-to-r from-[#7B2CFF] to-[#a93cff] shadow-[0_0_18px_rgba(123,44,255,.5)]"
                  : "border border-white/12 bg-white/5 text-white/65 hover:border-[#7B2CFF]/50 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {["Todos", "Série", "Novela"].map((t) => (
            <button
              key={t}
              onClick={() => setParam("tipo", t)}
              className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition ${
                tipoParam === t ? "bg-white text-black" : "border border-white/12 bg-transparent text-white/60 hover:text-white"
              }`}
            >
              {t === "Todos" ? "Séries + Novelas" : `${t}s`}
            </button>
          ))}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="ml-auto rounded-full border border-white/12 bg-[#120018] px-4 py-2 text-[12.5px] font-semibold outline-none"
          >
            <option value="relevancia">Mais relevantes</option>
            <option value="avaliacao">Melhor avaliados</option>
            <option value="episodios">Mais episódios</option>
            <option value="recentes">Lançamentos</option>
          </select>
        </div>

        {/* grid */}
        {filtered.length ? (
          <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((s) => (
              <div key={s.slug} className="[&>div]:w-full">
                <SeriesCard series={s} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center">
            <p className="font-display text-xl font-bold">Nenhum título encontrado 🔍</p>
            <p className="mt-2 text-white/55">Tente buscar por romance, vingança, bilionário ou lobo.</p>
            <button
              onClick={() => { setQ(""); router.push("/explorar"); }}
              className="neon-btn mt-5 rounded-full px-6 py-3 text-sm font-bold"
            >
              Limpar busca
            </button>
          </div>
        )}

        <div className="h-10" />
      </main>
      <Footer />
      <MobileNav />
      <PremiumModal />
    </div>
  );
}

export default function ExplorarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <ExplorarInner />
    </Suspense>
  );
}
