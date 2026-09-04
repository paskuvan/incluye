"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function Notice({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <p
      className={`text-sm ${ok ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
    >
      {children}
    </p>
  );
}

export default function AccountForm({ email }: { email: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwBusy, setPwBusy] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const [emailBusy, setEmailBusy] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState("");
  const [delBusy, setDelBusy] = useState(false);
  const [delErr, setDelErr] = useState<string | null>(null);

  const [exportBusy, setExportBusy] = useState(false);
  const [exportErr, setExportErr] = useState<string | null>(null);

  const field =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800";

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwBusy(true);
    setPwMsg(null);
    const { error } = await supabase.auth.updateUser({ password });
    setPwMsg(
      error
        ? { ok: false, text: error.message }
        : { ok: true, text: "Contraseña actualizada." },
    );
    if (!error) setPassword("");
    setPwBusy(false);
  }

  async function changeEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailBusy(true);
    setEmailMsg(null);
    const { error } = await supabase.auth.updateUser(
      { email: newEmail.trim() },
      { emailRedirectTo: `${window.location.origin}/dashboard/cuenta` },
    );
    setEmailMsg(
      error
        ? { ok: false, text: error.message }
        : {
            ok: true,
            text: "Te enviamos un correo de confirmación al nuevo email. Revisa tu bandeja.",
          },
    );
    if (!error) setNewEmail("");
    setEmailBusy(false);
  }

  async function downloadMyData() {
    setExportBusy(true);
    setExportErr(null);
    const { data, error } = await supabase.rpc("export_my_data");
    if (error) {
      setExportErr(error.message);
      setExportBusy(false);
      return;
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `incluye-mis-datos-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setExportBusy(false);
  }

  async function deleteAccount() {
    setDelBusy(true);
    setDelErr(null);
    const { error } = await supabase.rpc("delete_my_account");
    if (error) {
      setDelErr(error.message);
      setDelBusy(false);
      return;
    }
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Datos */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold">Tu cuenta</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Email actual: <span className="font-medium text-slate-700 dark:text-slate-200">{email}</span>
        </p>
      </section>

      {/* Cambiar contraseña */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold">Cambiar contraseña</h2>
        <form onSubmit={changePassword} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nueva contraseña (mín. 6)"
            aria-label="Nueva contraseña"
            className={field}
          />
          <button
            type="submit"
            disabled={pwBusy || password.length < 6}
            className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {pwBusy ? "Guardando…" : "Actualizar"}
          </button>
        </form>
        {pwMsg && <div className="mt-2"><Notice ok={pwMsg.ok}>{pwMsg.text}</Notice></div>}
      </section>

      {/* Cambiar email */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold">Cambiar email</h2>
        <form onSubmit={changeEmail} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Nuevo email"
            aria-label="Nuevo email"
            className={field}
          />
          <button
            type="submit"
            disabled={emailBusy || !newEmail.trim()}
            className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {emailBusy ? "Enviando…" : "Cambiar"}
          </button>
        </form>
        {emailMsg && <div className="mt-2"><Notice ok={emailMsg.ok}>{emailMsg.text}</Notice></div>}
      </section>

      {/* Tus datos y derechos (Ley 21.719) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold">Tus datos y derechos</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Bajo la Ley 21.719 puedes acceder a tus datos, rectificarlos (arriba),
          descargarlos y eliminarlos.
        </p>

        {/* Aviso: qué incluye la descarga */}
        <div className="mt-4 flex gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200">
          <span aria-hidden="true" className="text-base leading-none">
            ℹ️
          </span>
          <div>
            <p className="font-medium">Qué incluye la descarga</p>
            <p className="mt-0.5 text-indigo-800/90 dark:text-indigo-200/80">
              Un archivo <b>JSON</b> con tu cuenta, tus consentimientos, las
              empresas que creaste, tus membresías y las vacantes que
              publicaste. <b>No contiene tu contraseña</b> ni datos de terceros.
              Es tu derecho de acceso y portabilidad.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={downloadMyData}
            disabled={exportBusy}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {exportBusy ? "Preparando…" : "Descargar mis datos"}
          </button>
          <Link
            href="/privacidad"
            className="text-sm text-slate-500 hover:text-indigo-600 hover:underline dark:text-slate-400"
          >
            Ver cómo tratamos tus datos
          </Link>
        </div>
        {exportErr && <p className="mt-2 text-sm text-red-600">{exportErr}</p>}
      </section>

      {/* Zona de peligro */}
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/40">
        <h2 className="font-semibold text-red-700 dark:text-red-300">
          Eliminar mi cuenta
        </h2>
        <p className="mt-1 text-sm text-red-700/80 dark:text-red-300/80">
          Borra tu cuenta y tus datos de forma permanente, incluidas las empresas
          que creaste (con sus evaluaciones, tareas y vacantes). Escribe{" "}
          <b>ELIMINAR</b> para confirmar.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.value)}
            placeholder="ELIMINAR"
            aria-label="Escribe ELIMINAR para confirmar"
            className="rounded-lg border border-red-300 px-3 py-2 text-sm dark:border-red-800 dark:bg-slate-900"
          />
          <button
            onClick={deleteAccount}
            disabled={confirmDelete !== "ELIMINAR" || delBusy}
            className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
          >
            {delBusy ? "Eliminando…" : "Eliminar mi cuenta"}
          </button>
        </div>
        {delErr && <p className="mt-2 text-sm text-red-600">{delErr}</p>}
      </section>
    </div>
  );
}
