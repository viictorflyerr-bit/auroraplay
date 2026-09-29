import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SeriesRow from "@/components/SeriesRow";
import ContinueWatching from "@/components/ContinueWatching";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import PremiumModal from "@/components/PremiumModal";
import { SERIES, CATEGORIES } from "@/lib/data";
import Link from "next/link";
import { Crown, Zap, Tv, BadgeCheck, Play, Star, Check } from "lucide-react";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const trending = SERIES.filter((s) => s.trending);
  const top10 = [...SERIES].sort((a, b) => (a.top10 ?? 99) - (b.top10 ?? 99)).slice(0, 10);
  const newReleases = SERIES.filter((s) => s.isNew);
  const romance = SERIES.filter((s) => s.category === "Romance");
  const drama = SERIES.filter((s) => s.category === "Drama");
  const misterio = SERIES.filter((s) => s.category === "Mistério" || s.category === "Ação");
  const fantasia = SERIES.filter((s) => s.category === "Fantasia");

  return (
    <div className="aurora-bg min-h-screen pb-20 md:pb-0">
      <Header />
      <Hero />

      <main className="relative z-10 -mt-6 space-y-10 pb-8">
        <ContinueWatching />
        <SeriesRow title="Em alta agora" subtitle="As mais maratonadas da semana" items={trending} />
        <SeriesRow title="Top 10 da Aurora hoje" subtitle="O ranking que todo mundo comenta" items={top10} numbered />

        {/* Premium banner */}
        <section className="px-4 sm:px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-[28px] border border-[#7B2CFF]/40 bg-gradient-to-br from-[#1b0030] via-[#120018] to-[#050505] p-8 sm:p-12">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#7B2CFF]/35 blur-[90px]" />
            <div className="absolute -left-16 bottom-[-60px] h-64 w-64 rounded-full bg-[#ff5ee7]/15 blur-[90px]" />
            <div className="aurora-beam absolute left-[45%] top-[-10%] h-[120%] w-[110px]" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_.7fr]">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-yellow-100 px-3 py-1 text-[11px] font-extrabold tracking-wide text-black">
                  <Crown size={12} /> AURORA PREMIUM — R$10/MÊS
                </p>
                <h2 className="font-display mt-4 text-[28px] font-extrabold leading-tight sm:text-[38px]">
                  Desbloqueie <span className="aurora-text">todos os episódios</span> e viva a história até o fim.
                </h2>
                <p className="mt-3 max-w-[520px] text-[14.5px] text-white/60">
                  Grátis você assiste até o EP 05. No Premium, episódios ilimitados, todas as séries liberadas, sem anúncios e lançamentos toda semana.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/planos" className="neon-btn flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-extrabold">
                    <Crown size={17} /> Assinar Premium
                  </Link>
                  <Link href="/explorar" className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-[15px] font-bold hover:bg-white/10">
                    <Play size={16} /> Explorar catálogo
                  </Link>
                </div>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-white/55">
                  {["Sem anúncios", "Cancele quando quiser", "Qualidade máxima"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5"><Check size={14} className="text-emerald-300" /> {t}</span>
                  ))}
                </div>
              </div>
              <div className="relative mx-auto grid w-full max-w-[320px] grid-cols-2 gap-3">
                {SERIES.slice(0, 4).map((s, i) => (
                  <div key={s.slug} className={`overflow-hidden rounded-2xl border border-white/10 glow-card ${i % 2 === 1 ? "mt-6" : ""}`}>
                    <img src={s.cover} alt={s.title} className="aspect-[2/3] w-full object-cover" loading="lazy" />
                  </div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-[#120018]/60 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        <SeriesRow title="Romance que vicia" subtitle="Bilionários, contratos e amores proibidos" items={romance} />
        <SeriesRow title="Drama & Novelas" subtitle="Vingança, poder e segredos de família" items={drama} />
        <SeriesRow title="Mistério & Ação" subtitle="Suspense até o último segundo" items={misterio} />
        <SeriesRow title="Fantasia & Mundos épicos" subtitle="Lobos, bruxas e profecias" items={[...fantasia, ...newReleases]} />

        {/* categories */}
        <section className="px-4 sm:px-6 lg:px-10">
          <h2 className="font-display text-[19px] font-extrabold sm:text-[22px]">Explorar por categoria</h2>
          <p className="mt-0.5 text-[13px] text-white/50">Encontre sua próxima obsessão</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORIES.map((c, i) => (
              <Link
                key={c}
                href={`/explorar?categoria=${encodeURIComponent(c)}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 p-5 transition hover:border-[#7B2CFF]/60"
                style={{ background: `linear-gradient(135deg, ${["#2a0a5e,#120018", "#4a0fa3,#120018", "#7B2CFF33,#0a0012", "#3d0b6e,#050505", "#5b21b6,#120018"][i % 5]})` }}
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#7B2CFF]/30 blur-2xl transition group-hover:bg-[#7B2CFF]/50" />
                <p className="font-display text-[17px] font-extrabold">{c}</p>
                <p className="mt-1 text-[12px] text-white/55">{SERIES.filter((s) => s.category === c).length * 24 + 48} títulos</p>
                <p className="mt-3 text-[12px] font-bold text-[#c99cff]">Explorar →</p>
              </Link>
            ))}
          </div>
        </section>

        {/* why aurora */}
        <section className="px-4 sm:px-6 lg:px-10">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Zap, title: "Episódios de 1 minuto", desc: "Feitos para maratonar no intervalo, no busão ou na madrugada." },
              { icon: Tv, title: "Vertical cinematográfico", desc: "Filmado para celular com qualidade de cinema e som imersivo." },
              { icon: BadgeCheck, title: "Novidades toda semana", desc: "Lançamentos exclusivos e continuações que você só vê aqui." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#7B2CFF]/20 text-[#c99cff]"><f.icon size={20} /></span>
                <p className="font-display mt-4 text-[16px] font-bold">{f.title}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/55">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* social proof marquee */}
        <section className="overflow-hidden border-y border-white/10 bg-white/[0.02] py-4">
          <div className="marquee-track flex w-max gap-8 whitespace-nowrap px-4 text-[13px] text-white/55">
            {[1, 2].map((k) => (
              <div key={k} className="flex gap-8">
                {[
                  "★ 4.9 — 'Viciei em Amor Proibido em uma noite' — Juliana",
                  "★ 5.0 — 'Melhor que ReelShort, e em português!' — Pedro",
                  "★ 4.8 — 'Assinei o Premium em 5 minutos' — Camila",
                  "★ 4.9 — 'Episódios curtos perfeitos' — Lucas",
                  "★ 5.0 — 'Lua de Lobos é absurda de boa' — Fernanda",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-2"><Star size={12} className="fill-amber-300 text-amber-300" /> {t}</span>
                ))}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
      <PremiumModal />
    </div>
  );
}
