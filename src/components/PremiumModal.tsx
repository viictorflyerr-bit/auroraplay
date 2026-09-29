"use client";

import Link from "next/link";
import { X, Crown, Check, Sparkles, Play } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PremiumModal() {
  const { showPremiumModal, setShowPremiumModal, premiumContext, upgradeToPremium, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!showPremiumModal) return null;

  const handleSubscribe = async () => {
    if (!user) {
      setShowPremiumModal(false);
      router.push("/login?next=/planos");
      return;
    }
    setLoading(true);
    // simulate checkout delay for cinematic feel
    await new Promise((r) => setTimeout(r, 900));
    const ok = await upgradeToPremium();
    setLoading(false);
    if (ok) {
      setDone(true);
      setTimeout(() => {
        setShowPremiumModal(false);
        setDone(false);
      }, 1800);
    } else {
      router.push("/planos");
      setShowPremiumModal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="backdrop-enter absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowPremiumModal(false)} />
      {/* aurora beams behind modal */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora-beam absolute left-[20%] top-[-10%] h-[70%] w-[120px]" />
        <div className="aurora-beam absolute right-[25%] top-[10%] h-[60%] w-[90px]" style={{ animationDelay: "-3s" }} />
      </div>

      <div className="modal-enter relative w-full max-w-[520px] overflow-hidden rounded-t-[28px] border border-[#7B2CFF]/50 bg-[#0d0016] sm:rounded-[28px] shadow-[0_0_80px_rgba(123,44,255,.45)]">
        {/* top glow */}
        <div className="absolute inset-x-0 top-0 h-[180px] bg-gradient-to-b from-[#7B2CFF]/35 via-[#7B2CFF]/10 to-transparent" />
        <div className="absolute -top-20 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-[#7B2CFF]/40 blur-[70px]" />

        <button onClick={() => setShowPremiumModal(false)} className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white">
          <X size={17} />
        </button>

        <div className="relative px-7 pb-7 pt-10 text-center sm:px-9">
          {!done ? (
            <>
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#7B2CFF] to-[#ff5ee7] shadow-[0_0_40px_rgba(123,44,255,.8)]">
                <Crown size={28} className="text-white" />
              </div>
              <p className="font-display text-[22px] font-extrabold leading-tight sm:text-[24px]">
                {premiumContext}
              </p>
              <p className="mx-auto mt-2 max-w-[380px] text-[14px] leading-relaxed text-white/65">
                Continue assistindo essa história incrível desbloqueando o Premium. Milhares de episódios te esperando.
              </p>

              <div className="mt-5 rounded-2xl border border-[#7B2CFF]/40 bg-gradient-to-b from-[#7B2CFF]/15 to-transparent p-5 text-left">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 text-[15px] font-extrabold">
                    <Sparkles size={16} className="text-[#c99cff]" /> AURORA PLAY PREMIUM
                  </p>
                  <span className="rounded-full bg-gradient-to-r from-amber-300 to-yellow-100 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-black">MAIS POPULAR</span>
                </div>
                <p className="mt-2 font-display text-[32px] font-extrabold leading-none">
                  R$10<span className="text-[15px] font-medium text-white/60">/mês</span>
                </p>
                <ul className="mt-4 space-y-2.5 text-[13.5px]">
                  {["Episódios ilimitados", "Todas as séries liberadas", "Sem anúncios", "Novos episódios toda semana", "Acesso premium completo"].map((b) => (
                    <li key={b} className="flex items-center gap-2.5 text-white/85">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#7B2CFF]/30 text-[#c99cff]"><Check size={12} strokeWidth={3} /></span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <button onClick={handleSubscribe} disabled={loading} className="neon-btn mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-extrabold disabled:opacity-70">
                {loading ? (
                  <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Processando...</span>
                ) : (
                  <><Crown size={17} /> Assinar Premium</>
                )}
              </button>
              <button onClick={() => setShowPremiumModal(false)} className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/5 py-3.5 text-[14px] font-semibold text-white/70 transition hover:bg-white/10 hover:text-white">
                <Play size={14} /> Continuar grátis
              </button>
              <p className="mt-3 text-[11.5px] text-white/35">Cancele quando quiser • Ativação imediata • PIX e cartão</p>
            </>
          ) : (
            <div className="py-8">
              <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_50px_rgba(52,211,153,.6)]">
                <Check size={36} strokeWidth={3} />
              </div>
              <p className="font-display text-2xl font-extrabold">Bem-vindo ao Premium! ⭐</p>
              <p className="mt-2 text-white/60">Todos os episódios desbloqueados. Boa maratona!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
