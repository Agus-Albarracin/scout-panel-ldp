"use client";

import { Loader2, LockKeyhole, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuthSession } from "@/hooks/auth/useAuthSession";

export function AuthGate({ children }) {
  const auth = useAuthSession();

  if (auth.loading) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <Loader2 className="animate-spin text-[var(--primary)]" size={30} />
      </main>
    );
  }

  if (!auth.user) {
    return <AuthForm error={auth.error} submitting={auth.submitting} onLogin={auth.signIn} onRegister={auth.signUp} />;
  }

  return (
    <>
      <div className="fixed right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-[var(--line)] bg-[rgba(15,15,15,0.82)] px-3 py-2 text-sm text-[var(--muted)] shadow-[0_12px_30px_rgba(0,0,0,0.24)] backdrop-blur">
        <span>{auth.user.email}</span>
        <button className="inline-flex size-8 items-center justify-center rounded-full bg-[rgba(242,242,242,0.08)] text-[var(--text)]" onClick={auth.signOut} type="button" aria-label="Cerrar sesion">
          <LogOut size={15} />
        </button>
      </div>
      {children}
    </>
  );
}

function AuthForm({ error, onLogin, onRegister, submitting }) {
  const [mode, setMode] = useState("login");

  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      email: String(form.get("email") || ""),
      password: String(form.get("password") || "")
    };

    if (mode === "register") {
      onRegister({
        ...payload,
        name: String(form.get("name") || "")
      });
      return;
    }

    onLogin(payload);
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <form className="grid w-full max-w-[420px] gap-4 rounded-lg border border-[var(--line)] bg-[rgba(21,21,21,0.96)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)]" onSubmit={submit}>
        <div className="grid gap-2">
          <span className="inline-flex size-11 items-center justify-center rounded-lg bg-[rgba(0,224,148,0.12)] text-[var(--primary)]">
            <LockKeyhole size={22} />
          </span>
          <h1 className="m-0 text-2xl">{mode === "login" ? "Ingresar al panel" : "Crear usuario"}</h1>
          <p className="m-0 text-sm text-[var(--muted)]">Usa un usuario autorizado para acceder a jugadores, equipos y metricas.</p>
        </div>

        {mode === "register" ? (
          <label className="grid gap-1.5 text-sm font-bold">
            Nombre
            <input className="h-11 rounded-lg border border-[var(--line-strong)] bg-[#111] px-3 text-[var(--text)] outline-0" name="name" required minLength={2} />
          </label>
        ) : null}

        <label className="grid gap-1.5 text-sm font-bold">
          Email
          <input className="h-11 rounded-lg border border-[var(--line-strong)] bg-[#111] px-3 text-[var(--text)] outline-0" name="email" type="email" required defaultValue="scout@ldp.test" />
        </label>

        <label className="grid gap-1.5 text-sm font-bold">
          Password
          <input className="h-11 rounded-lg border border-[var(--line-strong)] bg-[#111] px-3 text-[var(--text)] outline-0" name="password" type="password" required minLength={mode === "register" ? 8 : 1} defaultValue="Scout1234" />
        </label>

        {error ? <div className="rounded-lg border border-[rgba(255,107,107,0.45)] bg-[var(--danger-soft)] px-3 py-2 text-sm font-bold text-[#ffc9c9]">{error}</div> : null}

        <button className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--primary)] px-4 font-black text-[#07110d] disabled:opacity-60" disabled={submitting} type="submit">
          {submitting ? "Procesando..." : mode === "login" ? "Ingresar" : "Crear cuenta"}
        </button>

        <button className="text-sm font-bold text-[var(--primary)]" type="button" onClick={() => setMode((current) => (current === "login" ? "register" : "login"))}>
          {mode === "login" ? "Crear una cuenta nueva" : "Ya tengo usuario"}
        </button>
      </form>
    </main>
  );
}
