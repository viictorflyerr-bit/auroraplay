"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Crown, User } from "lucide-react";

export default function MobileNav() {
  const path = usePathname();
  const items = [
    { label: "Início", href: "/", icon: Home },
    { label: "Explorar", href: "/explorar", icon: Compass },
    { label: "Premium", href: "/planos", icon: Crown },
    { label: "Conta", href: "/conta", icon: User },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0a0012]/90 backdrop-blur-xl md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="grid grid-cols-4">
        {items.map((it) => {
          const active = it.href === "/" ? path === "/" : path.startsWith(it.href);
          const Icon = it.icon;
          return (
            <Link key={it.label} href={it.href} className="flex flex-col items-center gap-1 py-2.5">
              <span className={`grid h-7 w-12 place-items-center rounded-full transition ${active ? "bg-[#7B2CFF]/25 text-white shadow-[0_0_16px_rgba(123,44,255,.4)]" : "text-white/50"}`}>
                <Icon size={19} />
              </span>
              <span className={`text-[10.5px] font-semibold ${active ? "text-white" : "text-white/45"}`}>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
