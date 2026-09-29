import Link from "next/link";
import { Logo } from "./Header";

export default function Footer() {
  return (
    <footer className="relative mt-16 border-t border-white/10 bg-[#080008]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7B2CFF] to-transparent" />
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[320px] text-[13.5px] leading-relaxed text-white/50">
              Histórias que prendem você do começo ao fim. ReelShorts premium em episódios verticais rápidos e emocionantes.
            </p>
            <div className="mt-4 flex gap-2">
              {["Instagram", "TikTok", "YouTube"].map((s) => (
                <span key={s} className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[12px] font-semibold text-white/60">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.16em] text-white/40">NAVEGAR</p>
            <ul className="mt-3 space-y-2 text-[14px] text-white/70">
              <li><Link href="/" className="hover:text-white">Início</Link></li>
              <li><Link href="/explorar?tipo=Série" className="hover:text-white">Séries</Link></li>
              <li><Link href="/explorar?tipo=Novela" className="hover:text-white">Novelas</Link></li>
              <li><Link href="/explorar" className="hover:text-white">Categorias</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.16em] text-white/40">CONTA</p>
            <ul className="mt-3 space-y-2 text-[14px] text-white/70">
              <li><Link href="/login" className="hover:text-white">Entrar</Link></li>
              <li><Link href="/planos" className="hover:text-white">Planos</Link></li>
              <li><Link href="/conta" className="hover:text-white">Minha conta</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.16em] text-white/40">CATEGORIAS</p>
            <ul className="mt-3 space-y-2 text-[14px] text-white/70">
              {["Romance", "Drama", "Ação", "Mistério", "Fantasia"].map((c) => (
                <li key={c}><Link href={`/explorar?categoria=${c}`} className="hover:text-white">{c}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[12.5px] text-white/35 sm:flex-row">
          <p>© 2026 AURORA PLAY — Todos os direitos reservados.</p>
          <p className="flex items-center gap-1.5">Feito com <span className="text-[#a86bff]">✦</span> para maratonistas de ReelShorts</p>
        </div>
      </div>
    </footer>
  );
}
