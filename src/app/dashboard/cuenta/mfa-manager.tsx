"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Enrolling = { factorId: string; qr: string; secret: string };

/** Verificación en dos pasos (TOTP) sobre el soporte nativo de Supabase. */
export default function MfaManager() {
  const supabase = createClient();
  const [hasVerified, setHasVerified] = useState<boolean | null>(null);
  const [enrolling, setEnrolling] = useState<Enrolling | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.mfa.listFactors();
    const verified = (data?.totp ?? []).some((f) => f.status === "verified");
    setHasVerified(verified);
  }, [supabase]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function startEnroll() {
    setBusy(true);
    setMsg(null);
    // Limpia factores TOTP sin verificar que hayan quedado de intentos previos.
    const { data: list } = await supabase.auth.mfa.listFactors();
    for (const f of list?.totp ?? []) {
      if (f.status !== "verified") {
        await supabase.auth.mfa.unenroll({ factorId: f.id });
      }
    }
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
    });
    if (error || !data) {
      setMsg({ ok: false, text: error?.message ?? "No se pudo iniciar." });
    } else {
      setEnrolling({
        factorId: data.id,
        qr: data.totp.qr_code,
        secret: data.totp.secret,
      });
    }
    setBusy(false);
  }

  async function confirmEnroll(e: React.FormEvent) {
    e.preventDefault();
    if (!enrolling) return;
    setBusy(true);
    setMsg(null);
    const { data: ch, error: chErr } = await supabase.auth.mfa.challenge({
      factorId: enrolling.factorId,
    });
    if (chErr || !ch) {
      setMsg({ ok: false, text: chErr?.message ?? "Error al validar." });
      setBusy(false);
      return;
    }
    const { error } = await supabase.auth.mfa.verify({
      factorId: enrolling.factorId,
      challengeId: ch.id,
      code: code.trim(),
    });
    if (error) {
      setMsg({ ok: false, text: "Código incorrecto. Intenta de nuevo." });
    } else {
      setEnrolling(null);
      setCode("");
      setMsg({ ok: true, text: "Verificación en dos pasos activada." });
      await refresh();
    }
    setBusy(false);
  }

  async function cancelEnroll() {
    if (enrolling) {
      await supabase.auth.mfa.unenroll({ factorId: enrolling.factorId });
    }
    setEnrolling(null);
    setCode("");
    setMsg(null);
  }

  async function disableMfa() {
    setBusy(true);
    setMsg(null);
    const { data } = await supabase.auth.mfa.listFactors();
    for (const f of data?.totp ?? []) {
      await supabase.auth.mfa.unenroll({ factorId: f.id });
    }
    setMsg({ ok: true, text: "Verificación en dos pasos desactivada." });
    await refresh();
    setBusy(false);
  }

  // El QR puede venir como SVG crudo o como data URL; normalizamos a data URL.
  const qrSrc = enrolling
    ? enrolling.qr.startsWith("data:")
      ? enrolling.qr
      : `data:image/svg+xml;utf8,${encodeURIComponent(enrolling.qr)}`
    : null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">Verificación en dos pasos</h2>
        {hasVerified && (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-950 dark:text-green-300">
            Activada
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Agrega un segundo factor con una app de autenticación (Google
        Authenticator, Microsoft Authenticator, 1Password). Al iniciar sesión te
        pediremos un código de 6 dígitos.
      </p>

      {hasVerified === null && (
        <p className="mt-4 text-sm text-slate-400">Cargando…</p>
      )}

      {/* Sin MFA y sin proceso en curso */}
      {hasVerified === false && !enrolling && (
        <button
          onClick={startEnroll}
          disabled={busy}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {busy ? "Preparando…" : "Activar verificación en dos pasos"}
        </button>
      )}

      {/* Proceso de enrolamiento */}
      {enrolling && qrSrc && (
        <div className="mt-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <p className="text-sm font-medium">
            1. Escanea este código con tu app de autenticación
          </p>
          <div className="mt-3 inline-block rounded-lg bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrSrc} alt="Código QR para configurar 2FA" width={160} height={160} />
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            ¿No puedes escanear? Ingresa esta clave manualmente:{" "}
            <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
              {enrolling.secret}
            </code>
          </p>

          <form onSubmit={confirmEnroll} className="mt-4">
            <label className="text-sm font-medium">
              2. Escribe el código de 6 dígitos
            </label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              <input
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                aria-label="Código de verificación"
                className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-center text-lg tracking-widest outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
              />
              <button
                type="submit"
                disabled={busy || code.length !== 6}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                {busy ? "Verificando…" : "Activar"}
              </button>
              <button
                type="button"
                onClick={cancelEnroll}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-700"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MFA activa: opción de desactivar */}
      {hasVerified === true && !enrolling && (
        <button
          onClick={disableMfa}
          disabled={busy}
          className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40"
        >
          {busy ? "Desactivando…" : "Desactivar"}
        </button>
      )}

      {msg && (
        <p
          className={`mt-3 text-sm ${msg.ok ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
        >
          {msg.text}
        </p>
      )}
    </section>
  );
}
