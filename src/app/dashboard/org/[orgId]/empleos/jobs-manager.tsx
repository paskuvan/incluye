"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type Job = {
  id: string;
  title: string;
  description: string;
  region: string | null;
  modality: string | null;
  employment_type: string | null;
  apply_url: string | null;
  apply_email: string | null;
  status: "open" | "closed";
};

const MODALITIES = ["Presencial", "Remoto", "Híbrido"];
const TYPES = ["Jornada completa", "Media jornada", "Por horas", "Práctica"];

export default function JobsManager({
  orgId,
  orgName,
  currentUserId,
  isAdmin,
  jobs,
}: {
  orgId: string;
  orgName: string;
  currentUserId: string;
  isAdmin: boolean;
  jobs: Job[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");
  const [modality, setModality] = useState("Presencial");
  const [type, setType] = useState("Jornada completa");
  const [applyEmail, setApplyEmail] = useState("");
  const [applyUrl, setApplyUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.from("jobs").insert({
      organization_id: orgId,
      company_name: orgName,
      title: title.trim(),
      description: description.trim(),
      region: region.trim() || null,
      modality,
      employment_type: type,
      apply_email: applyEmail.trim() || null,
      apply_url: applyUrl.trim() || null,
      created_by: currentUserId,
    });
    if (error) setError(error.message);
    else {
      setTitle("");
      setDescription("");
      setRegion("");
      setApplyEmail("");
      setApplyUrl("");
      router.refresh();
    }
    setBusy(false);
  }

  async function toggle(j: Job) {
    await supabase
      .from("jobs")
      .update({ status: j.status === "open" ? "closed" : "open" })
      .eq("id", j.id);
    router.refresh();
  }
  async function remove(id: string) {
    await supabase.from("jobs").delete().eq("id", id);
    router.refresh();
  }

  const field =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800";

  return (
    <div className="space-y-6">
      {/* Publicadas */}
      <section>
        <h2 className="font-semibold">Vacantes ({jobs.length})</h2>
        {jobs.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Aún no hay vacantes publicadas.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {jobs.map((j) => (
              <div
                key={j.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {j.title}
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-medium ${j.status === "open" ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}
                    >
                      {j.status === "open" ? "Abierta" : "Cerrada"}
                    </span>
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {[j.region, j.modality, j.employment_type]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                {isAdmin && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => toggle(j)}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs hover:border-slate-400 dark:border-slate-700"
                    >
                      {j.status === "open" ? "Cerrar" : "Reabrir"}
                    </button>
                    <button
                      onClick={() => remove(j.id)}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-red-600 hover:border-red-300 dark:border-slate-700"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Publicar */}
      {isAdmin && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold">Publicar vacante</h2>
          <form onSubmit={create} className="mt-4 space-y-3">
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Cargo (ej. Analista de datos)"
              className={field}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del puesto, ajustes disponibles, requisitos…"
              rows={4}
              className={`${field} resize-y`}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Región / comuna"
                className={field}
              />
              <select
                value={modality}
                onChange={(e) => setModality(e.target.value)}
                className={field}
              >
                {MODALITIES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={field}
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="email"
                value={applyEmail}
                onChange={(e) => setApplyEmail(e.target.value)}
                placeholder="Email para postular"
                className={field}
              />
              <input
                value={applyUrl}
                onChange={(e) => setApplyUrl(e.target.value)}
                placeholder="o URL de postulación"
                className={field}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enmarca la vacante como empleo inclusivo. No pidas a la persona
              declarar su tipo de discapacidad.
            </p>
            <button
              type="submit"
              disabled={busy || !title.trim()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {busy ? "Publicando…" : "Publicar vacante"}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
