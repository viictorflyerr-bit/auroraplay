"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, Crown } from "lucide-react";
import { Logo } from "@/components/Header";
import { useAuth } from "@/components/AuthProvider";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = mode === "login"
      ? await login(email, password)
      : await register(name, email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Algo deu errado.");
      return;
    }
    router.push(next);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* left cinematic */}
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="https://images.pexels.com/photos/7719561/pexels-photo-7719561.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"
          alt="Aurora Play Originals"
          className="kenburns absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#120018]/30 to-[#0a0012]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/50" />
        <div className="aurora-beam absolute left-[30%] top-0 h-full w-[130px]" />
        <div className="absolute left-10 top-8"><Logo /></div>
        <div className="absolute inset-x-10 bottom-12">
          <p className="inline-flex rounded-full bg-[#7B2CFF]/25 px-3 py-1 text-[11px] font-extrabold tracking-[0.16em] text-[#d9b8ff] backdrop-blur border border-[#7B2CFF]/40">AURORA ORIGINALS</p>
          <p className="font-display mt-3 text-[34px] font-extrabold leading-tight">Sua próxima obsessão começa em 60 segundos.</p>
          <p className="mt-2 max-w-[420px] text-[14px] text-white/65">Entre para continuar assistindo, salvar favoritos e desbloquear o Premium.</p>
          <div className="mt-5 flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-1.5 rounded-full ${i === 1 ? "w-10 bg-[#7B2CFF]" : "w-4 bg-white/25"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* right form */}
      <div className="aurora-bg relative flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="absolute left-1/2 top-[-100px] h-64 w-96 -translate-x-1/2 rounded-full bg-[#7B2CFF]/20 blur-[100px]" />
        <div className="relative w-full max-w-[440px]">
          <div className="lg:hidden"><Logo /></div>
          <h1 className="font-display mt-6 text-[30px] font-extrabold leading-tight">
            {mode === "login" ? <>Bem-vindo de volta <span className="aurora-text">✦</span></> : <>Crie sua conta <span className="aurora-text">grátis</span></>}
          </h1>
          <p className="mt-1.5 text-[14px] text-white/55">
            {mode === "login" ? "Entre para continuar sua maratona." : "Leva 20 segundos. Sem cartão."}
          </p>

          {/* tabs */}
          <div className="mt-6 grid grid-cols-2 rounded-2xl border border-white/10 bg-white/5 p-1">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={`rounded-xl py-2.5 text-[14px] font-bold transition ${mode === m ? "bg-gradient-to-r from-[#7B2CFF] to-[#a93cff] shadow-[0_0_20px_rgba(123,44,255,.5)]" : "text-white/55 hover:text-white"}`}
              >
                {m === "login" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-5 space-y-3.5">
            {mode === "register" && (
              <label className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/5 px-4 py-3.5 focus-within:border-[#7B2CFF]">
                <User size={17} className="shrink-0 text-white/40" />
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" className="w-full bg-transparent text-[14.5px] outline-none placeholder:text-white/35" />
              </label>
            )}
            <label className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/5 px-4 py-3.5 focus-within:border-[#7B2CFF]">
              <Mail size={17} className="shrink-0 text-white/40" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full bg-transparent text-[14.5px] outline-none placeholder:text-white/35" />
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/5 px-4 py-3.5 focus-within:border-[#7B2CFF]">
              <Lock size={17} className="shrink-0 text-white/40" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPass ? "text" : "password"} placeholder="Senha" className="w-full bg-transparent text-[14.5px] outline-none placeholder:text-white/35" />
              <button type="button" onClick={() => setShowPass((s) => !s)} className="text-white/40 hover:text-white">{showPass ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            </label>

            {error && (
              <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13.5px] text-red-200">{error}</p>
            )}

            <div className="flex items-center justify-between text-[13px]">
              <label className="flex cursor-pointer items-center gap-2 text-white/60">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-[#7B2CFF]" />
                Continuar conectado
              </label>
              <span className="cursor-pointer font-semibold text-[#c99cff] hover:text-white">Esqueci a senha</span>
            </div>

            <button disabled={loading} className="neon-btn w-full rounded-2xl py-4 text-[15px] font-extrabold disabled:opacity-70">
              {loading ? <span className="flex items-center justify-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Entrando...</span> : mode === "login" ? "Entrar" : "Criar conta grátis"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-[12px] text-white/35">
            <span className="h-px flex-1 bg-white/10" /> ou continue com <span className="h-px flex-1 bg-white/10" />
          </div>

          <button
            onClick={() => setError("Login com Google em breve — use email e senha por enquanto 💜")}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/15 bg-white py-3.5 text-[14.5px] font-bold text-black transition hover:bg-white/90"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-yellow-400 text-[11px] font-extrabold text-white">G</span>
            Entrar com Google
          </button>

          <Link href="/planos" className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-[#7B2CFF]/40 bg-[#7B2CFF]/10 py-3.5 text-[14px] font-bold text-[#d9b8ff] transition hover:bg-[#7B2CFF]/20">
            <Crown size={16} /> Quero ser Premium — R$10/mês
          </Link>

          <p className="mt-5 text-center text-[12px] text-white/35">
            Ao continuar você concorda com os Termos e a Política de Privacidade da Aurora Play.
          </p>
          <p className="mt-3 text-center text-[13px] text-white/50">
            <Link href="/" className="font-semibold text-white/70 hover:text-white">← Voltar ao início</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <LoginInner />
    </Suspense>
  );
}
