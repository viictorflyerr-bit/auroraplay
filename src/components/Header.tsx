"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Crown, Menu, X, User, LogOut, Star } from "lucide-react";
import { useAuth } from "./AuthProvider";

const NAV = [
  { label: "Início", href: "/" },
  { label: "Séries", href: "/explorar?tipo=Série" },
  { label: "Novelas", href: "/explorar?tipo=Novela" },
  { label: "Categorias", href: "/explorar" },
  { label: "Planos", href: "/planos" },
];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#7B2CFF] via-[#a93cff] to-[#4a0fa3] shadow-[0_0_22px_rgba(123,44,255,.7)]">
        <span className="font-display text-lg font-extrabold leading-none">A</span>
        <span className="absolute inset-0 rounded-xl bg-gradient-to-t from-white/0 via-white/15 to-white/25 opacity-60" />
      </span>
      {!compact && (
        <span className="font-display text-[17px] font-800 tracking-[0.18em] font-extrabold">
          AURORA <span className="aurora-text">PLAY</span>
        </span>
      )}
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]) && href !== "/";
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-white/10 bg-[#050505]/85 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,.6)]"
            : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-[1400px] items-center gap-6 px-4 sm:px-6 lg:px-10">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                className={`relative rounded-full px-4 py-2 text-[13.5px] font-medium transition-all ${
                  isActive(n.href)
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {n.label}
                {isActive(n.href) && (
                  <span className="absolute inset-x-4 -bottom-[1px] h-[2px] rounded-full bg-gradient-to-r from-[#7B2CFF] to-[#e0aaff] shadow-[0_0_12px_rgba(123,44,255,.9)]" />
                )}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2.5">
            <div className={`hidden items-center overflow-hidden transition-all duration-300 md:flex ${showSearch ? "w-56 opacity-100" : "w-0 opacity-0"}`}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  router.push(`/explorar?q=${encodeURIComponent(q)}`);
                }}
                className="w-full"
              >
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar séries..."
                  className="w-full rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm outline-none placeholder:text-white/40 focus:border-[#7B2CFF]"
                />
              </form>
            </div>
            <button
              onClick={() => setShowSearch((s) => !s)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:border-[#7B2CFF]/60 hover:text-white"
              aria-label="Buscar"
            >
              <Search size={17} />
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-[#7B2CFF]/40 bg-gradient-to-r from-[#7B2CFF]/20 to-transparent py-1 pl-1 pr-3 transition hover:border-[#7B2CFF]"
                >
                  <span
                    className="grid h-8 w-8 place-items-center rounded-full text-sm font-bold"
                    style={{ background: user.avatarColor }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[100px] truncate text-[13px] font-semibold sm:block">
                    {user.name.split(" ")[0]}
                  </span>
                  {user.plan === "premium" && <Crown size={14} className="text-amber-300" />}
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#120018]/95 p-2 shadow-2xl backdrop-blur-xl">
                      <div className="px-3 py-2.5">
                        <p className="truncate text-sm font-semibold">{user.name}</p>
                        <p className="truncate text-xs text-white/50">{user.email}</p>
                        <span className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${user.plan === "premium" ? "bg-gradient-to-r from-amber-400 to-yellow-200 text-black" : "bg-white/10 text-white/70"}`}>
                          {user.plan === "premium" ? <><Star size={11} /> PREMIUM</> : "FREE"}
                        </span>
                      </div>
                      <Link href="/conta" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white">
                        <User size={15} /> Minha conta
                      </Link>
                      <Link href="/planos" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white">
                        <Crown size={15} /> Planos
                      </Link>
                      <button onClick={() => { logout(); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white">
                        <LogOut size={15} /> Sair
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden rounded-full px-5 py-2.5 text-[13.5px] font-semibold text-white/85 transition hover:text-white sm:block"
                >
                  Entrar
                </Link>
                <Link
                  href="/planos"
                  className="neon-btn hidden rounded-full px-5 py-2.5 text-[13.5px] font-bold sm:block"
                >
                  Assine Premium
                </Link>
              </>
            )}

            <button
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 lg:hidden"
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {open && (
          <div className="border-t border-white/10 bg-[#0a0012]/95 px-5 py-4 backdrop-blur-xl lg:hidden">
            <div className="grid gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-[15px] font-medium text-white/80 hover:bg-white/5 hover:text-white"
                >
                  {n.label}
                </Link>
              ))}
              {!user && (
                <div className="mt-2 flex gap-2">
                  <Link href="/login" onClick={() => setOpen(false)} className="flex-1 rounded-full border border-white/15 py-3 text-center text-sm font-semibold">
                    Entrar
                  </Link>
                  <Link href="/planos" onClick={() => setOpen(false)} className="neon-btn flex-1 rounded-full py-3 text-center text-sm font-bold">
                    Assine Premium
                  </Link>
                </div>
              )}
              <form onSubmit={(e) => { e.preventDefault(); setOpen(false); router.push(`/explorar?q=${encodeURIComponent(q)}`); }} className="mt-2 md:hidden">
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar séries, novelas..." className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-[#7B2CFF]" />
              </form>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
