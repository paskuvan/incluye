"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type Gestor = {
  id: string;
  name: string;
  role: string | null;
  email: string | null;
  certified: boolean;
};

export default function GestorManager({
  orgId,
  currentUserId,
  isAdmin,
  gestores,
}: {
  orgId: string;
  currentUserId: string;
  isAdmin: boolean;
  gestores: Gestor[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [certified, setCertified] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.from("inclusion_managers").insert({
      organization_id: orgId,
      name: name.trim(),
      role: role.trim() || null,
      email: email.trim() || null,
      certified,
      created_by: currentUserId,
    });
    if (error) setError(error.message);
    else {
      setName("");
      setRole("");
      setEmail("");
      setCertified(false);
      router.refresh();
    }
    setBusy(false);
  }

  async function toggleCertified(g: Gestor) {
    await supabase
      .from("inclusion_managers")
      .update({ certified: !g.certified })
      .eq("id", g.id);
    router.refresh();
  }

  async function remove(id: string) {
    await supabase.from("inclusion_managers").delete().eq("id", id);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Lista */}
      <section>
        <h2 className="font-semibold">Gestores registrados ({gestores.length})</h2>
        {gestores.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Aún no hay un gestor(a) de inclusión registrado para esta empresa.
          </p>
        ) : (
          <div className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {gestores.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between gap-3 bg-white px-4 py-3 dark:bg-slate-900"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {g.name}
                    {g.certified && (
                      <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-800 dark:bg-green-950 dark:text-green-300">
                        ✓ Certificado/a
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {[g.role, g.email].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
                {isAdmin && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => toggleCertified(g)}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs hover:border-slate-400 dark:border-slate-700"
                    >
                      {g.certified ? "Marcar no cert." : "Marcar certificado/a"}
                    </button>
                    <button
                      onClick={() => remove(g.id)}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-red-600 hover:border-red-300 dark:border-slate-700"
                    >
                      Quitar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Alta */}
      {isAdmin && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold">Agregar gestor(a)</h2>
          <form onSubmit={add} className="mt-4 space-y-3">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre completo"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Cargo (ej. Jefa de RRHH)"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={certified}
                onChange={(e) => setCertified(e.target.checked)}
                className="accent-indigo-600"
              />
              Certificado/a por ChileValora
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={busy || !name.trim()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {busy ? "Guardando…" : "Agregar"}
            </button>
          </form>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            ¿No sabes si está certificado/a? Verifícalo en el{" "}
            <a
              href="https://certificacion.chilevalora.cl/ChileValora-publica/candidatosList.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              registro de ChileValora ↗
            </a>
            .
          </p>
        </section>
      )}
    </div>
  );
}
