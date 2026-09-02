"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ActualizarPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function init() {
      // Enlace PKCE: intercambia el "code" por una sesión de recuperación.
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setInvalid(true);
          return;
        }
        setReady(true);
        return;
      }
      // Si ya hay sesión (evento de recuperación), permitir cambiar.
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) setReady(true);
      else setInvalid(true);
    }

    init();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1200);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 block text-center text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
        >
          incluye<span className="text-indigo-500">.</span>
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-lg font-semibold">Nueva contraseña</h1>

          {invalid ? (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-red-600 dark:text-red-400">
                El enlace es inválido o expiró.
              </p>
              <Link
                href="/recuperar"
                className="inline-block text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Pedir un nuevo enlace
              </Link>
            </div>
          ) : done ? (
            <p className="mt-3 text-sm text-green-600 dark:text-green-400">
              ¡Contraseña actualizada! Redirigiendo…
            </p>
          ) : !ready ? (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Validando el enlace…
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nueva contraseña (mín. 6)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                {loading ? "Guardando…" : "Guardar contraseña"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
