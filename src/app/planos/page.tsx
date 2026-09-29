"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import PremiumModal from "@/components/PremiumModal";
import { Check, X, Crown, Sparkles, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function PlanosPage() {
  const { user, upgradeToPremium } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePremium = async () => {
    if (!user) {
      router.push("/login?next=/planos");
      return;
    }
    if (user.plan === "premium") return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    await upgradeToPremium();
    setLoading(false);
    router.push("/conta");
  };

  return (
    <div className="aurora-bg min-h-screen pb-24 md:pb-0">
      <Header />
      <main className="relative mx-auto max-w-[1100px] px-4 pt-[110px] sm:px-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[400px] overflow-hidden">
          <div className="aurora-beam absolute left-[30%] top-[-10%] h-full w-[140px]" />
          <div className="absolute left-1/2 top-[-80px] h-64 w-[500px] -translate-x-1/2 rounded-full bg-[#7B2CFF]/25 blur-[100px]" />
        </div>

        <div className="relative text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#7B2CFF]/40 bg-[#7B2CFF]/10 px-4 py-1.5 text-[12px] font-extrabold tracking-[0.14em] text-[#d9b8ff]">
            <Sparkles size={13} /> ESCOLHA SEU PLANO
          </p>
          <h1 className="font-display mx-auto mt-4 max-w-[640px] text-[32px] font-extrabold leading-tight sm:text-[46px]">
            Desbloqueie o final <span className="aurora-text">de todas as histórias</span>
          </h1>
          <p className="mx-auto mt-3 max-w-[520px] text-[14.5px] text-white/60">
            Grátis você prova. Premium você vicia. A partir de menos de R$0,34 por dia.
          </p>
        </div>

        <div className="relative mt-10 grid gap-5 md:grid-cols-2 md:items-stretch">
          {/* Free */}
          <div className="rounded-[26px] border border-white/12 bg-white/[0.03] p-8 backdrop-blur">
            <p className="text-[13px] font-extrabold tracking-[0.16em] text-white/50">PLANO GRATUITO</p>
            <p className="font-display mt-3 text-[44px] font-extrabold leading-none">R$0</p>
            <p className="mt-1 text-[13px] text-white/50">Para sempre, sem cartão</p>
            <ul className="mt-6 space-y-3 text-[14px]">
              <li className="flex gap-2.5"><Check size={17} className="mt-0.5 shrink-0 text-emerald-300" /> Assistir até episódio 5</li>
              <li className="flex gap-2.5"><Check size={17} className="mt-0.5 shrink-0 text-emerald-300" /> Acesso limitado ao catálogo</li>
              <li className="flex gap-2.5 text-white/40"><X size={17} className="mt-0.5 shrink-0" /> Episódios completos bloqueados</li>
              <li className="flex gap-2.5 text-white/40"><X size={17} className="mt-0.5 shrink-0" /> Sem lançamentos antecipados</li>
              <li className="flex gap-2.5 text-white/40"><X size={17} className="mt-0.5 shrink-0" /> Com anúncios</li>
            </ul>
            <Link href="/explorar" className="mt-7 block rounded-2xl border border-white/15 bg-white/5 py-4 text-center text-[15px] font-bold transition hover:bg-white/10">
              Começar grátis
            </Link>
          </div>

          {/* Premium */}
          <div className="premium-pulse relative rounded-[26px] border border-[#7B2CFF]/60 bg-gradient-to-b from-[#2a0a5e]/60 via-[#120018] to-[#0a0012] p-8">
            <span className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-300 px-4 py-1.5 text-[11px] font-extrabold tracking-wide text-black shadow-[0_0_24px_rgba(250,204,21,.5)]">
              <Crown size={12} /> ⭐ MAIS POPULAR
            </span>
            <p className="flex items-center gap-2 text-[13px] font-extrabold tracking-[0.16em] text-[#c99cff]">
              <Crown size={14} /> PLANO PREMIUM
            </p>
            <p className="font-display mt-3 text-[44px] font-extrabold leading-none">
              R$10<span className="text-[16px] font-semibold text-white/55">/mês</span>
            </p>
            <p className="mt-1 text-[13px] text-white/50">Cancele quando quiser • Ativação imediata</p>
            <ul className="mt-6 space-y-3 text-[14px] font-medium">
              {["Episódios ilimitados", "Todas as séries liberadas", "Sem anúncios", "Qualidade máxima", "Novos lançamentos toda semana"].map((b) => (
                <li key={b} className="flex gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#7B2CFF]"><Check size={12} strokeWidth={3} /></span> {b}
                </li>
              ))}
            </ul>
            <button
              onClick={handlePremium}
              disabled={loading || user?.plan === "premium"}
              className="neon-btn mt-7 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-extrabold disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Ativando...</span>
              ) : user?.plan === "premium" ? (
                <><ShieldCheck size={17} /> Você já é Premium ⭐</>
              ) : (
                <><Crown size={17} /> Assinar agora</>
              )}
            </button>
            <p className="mt-3 text-center text-[12px] text-white/40">PIX • Cartão • Boleto — 7 dias de garantia</p>
          </div>
        </div>

        {/* comparison strip */}
        <div className="relative mt-8 overflow-hidden rounded-[22px] border border-white/10 bg-black/40 p-6 sm:p-8">
          <div className="grid gap-4 text-[13.5px] sm:grid-cols-3">
            {[
              ["⚡", "Ativação em segundos", "Pagamento confirmado e episódios liberados na hora."],
              ["📱", "Assista em qualquer tela", "Celular, tablet, PC e TV. Seu progresso sincroniza."],
              ["💜", "Suporte apaixonado", "Time real que ama ReelShort tanto quanto você."],
            ].map(([e, t, d]) => (
              <div key={t} className="rounded-2xl bg-white/[0.03] p-5">
                <p className="text-[22px]">{e}</p>
                <p className="font-display mt-2 text-[15px] font-bold">{t}</p>
                <p className="mt-1 text-white/55">{d}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="h-10" />
      </main>
      <Footer />
      <MobileNav />
      <PremiumModal />
    </div>
  );
}
