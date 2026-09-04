"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { POLICY_VERSION } from "@/lib/legal";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setMessage(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const supabase = createClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } else {
      if (!acceptPolicy) {
        setError(
          "Debes aceptar la Política de privacidad para crear tu cuenta.",
        );
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          // El consentimiento viaja en los metadatos y lo persiste el trigger
          // handle_new_user_consent (funciona con o sin confirmación de email).
          data: {
            consent_policy_version: POLICY_VERSION,
            consent_user_agent:
              typeof navigator !== "undefined" ? navigator.userAgent : null,
          },
        },
      });
      if (error) {
        setError(error.message);
      } else if (data.session) {
        // Confirmación de email desactivada: entra directo.
        router.push("/dashboard");
        router.refresh();
      } else {
        setMessage(
          "Te enviamos un correo para confirmar tu cuenta. Revisa tu bandeja.",
        );
      }
    }
    setLoading(false);
  }

  const field =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";
  const labelCls =
    "block text-sm font-medium text-slate-700 dark:text-slate-200";

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
          {/* Selector segmentado Ingresar / Crear cuenta */}
          <div
            role="tablist"
            aria-label="Ingresar o crear cuenta"
            className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
          >
            {([
              { m: "signin" as Mode, label: "Ingresar" },
              { m: "signup" as Mode, label: "Crear cuenta" },
            ]).map((t) => {
              const active = mode === t.m;
              return (
                <button
                  key={t.m}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => switchMode(t.m)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {mode === "signin"
              ? "Accede al panel de tu empresa."
              : "Registra tu empresa en Incluye."}
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="login-email" className={labelCls}>
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${field} mt-1.5`}
                placeholder="tu@empresa.cl"
              />
            </div>
            <div>
              <label htmlFor="login-password" className={labelCls}>
                Contraseña
              </label>
              <div className="relative mt-1.5">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete={
                    mode === "signin" ? "current-password" : "new-password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${field} pr-16`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {mode === "signup" && (
                <p className="mt-1 text-xs text-slate-400">
                  Mínimo 6 caracteres.
                </p>
              )}
            </div>

            {mode === "signup" && (
              <label className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={acceptPolicy}
                  onChange={(e) => setAcceptPolicy(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                />
                <span>
                  He leído y acepto la{" "}
                  <Link
                    href="/privacidad"
                    target="_blank"
                    className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    Política de privacidad
                  </Link>{" "}
                  y el tratamiento de mis datos según la Ley 21.719.
                </span>
              </label>
            )}

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
                {error}
              </p>
            )}
            {message && (
              <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-300">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || (mode === "signup" && !acceptPolicy)}
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Cargando…"
                : mode === "signin"
                  ? "Ingresar"
                  : "Crear cuenta"}
            </button>
          </form>

          {mode === "signin" && (
            <p className="mt-4 text-center text-sm">
              <Link
                href="/recuperar"
                className="text-slate-500 hover:text-indigo-600 hover:underline dark:text-slate-400"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
