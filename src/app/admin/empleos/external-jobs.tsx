"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type ExtJob = {
  id: string;
  company_name: string;
  title: string;
  region: string | null;
  modality: string | null;
  employment_type: string | null;
  apply_url: string | null;
  source_name: string | null;
  status: "open" | "closed";
};

const MODALITIES = ["Presencial", "Remoto", "Híbrido"];
const TYPES = ["Jornada completa", "Media jornada", "Por horas", "Práctica"];

export default function ExternalJobs({
  currentUserId,
  jobs,
}: {
  currentUserId: string;
  jobs: ExtJob[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [f, setF] = useState({
    company_name: "",
    title: "",
    region: "",
    modality: "Presencial",
    employment_type: "Jornada completa",
    description: "",
    apply_url: "",
    source_name: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof f, v: string) => setF({ ...f, [k]: v });

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.from("jobs").insert({
      organization_id: null,
      source: "externa",
      source_name: f.source_name.trim() || null,
      company_name: f.company_name.trim(),
      title: f.title.trim(),
      region: f.region.trim() || null,
      modality: f.modality,
      employment_type: f.employment_type,
      description: f.description.trim(),
      apply_url: f.apply_url.trim() || null,
      created_by: currentUserId,
    });
    if (error) setError(error.message);
    else {
      setF({
        company_name: "",
        title: "",
        region: "",
        modality: "Presencial",
        employment_type: "Jornada completa",
        description: "",
        apply_url: "",
        source_name: "",
      });
      router.refresh();
    }
    setBusy(false);
  }

  async function toggle(j: ExtJob) {
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
      <section>
        <h2 className="font-semibold">Vacantes externas ({jobs.length})</h2>
        {jobs.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Aún no hay vacantes externas curadas.
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
                    {[j.company_name, j.region, j.modality, j.source_name]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
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
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold">Agregar vacante externa</h2>
        <form onSubmit={create} className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              required
              value={f.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Cargo"
              className={field}
            />
            <input
              required
              value={f.company_name}
              onChange={(e) => set("company_name", e.target.value)}
              placeholder="Empresa"
              className={field}
            />
          </div>
          <textarea
            value={f.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Descripción del puesto"
            rows={3}
            className={`${field} resize-y`}
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              value={f.region}
              onChange={(e) => set("region", e.target.value)}
              placeholder="Región / comuna"
              className={field}
            />
            <select
              value={f.modality}
              onChange={(e) => set("modality", e.target.value)}
              className={field}
              aria-label="Modalidad"
            >
              {MODALITIES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={f.employment_type}
              onChange={(e) => set("employment_type", e.target.value)}
              className={field}
              aria-label="Tipo de jornada"
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
              value={f.apply_url}
              onChange={(e) => set("apply_url", e.target.value)}
              placeholder="Enlace a la publicación original (URL)"
              className={field}
            />
            <input
              value={f.source_name}
              onChange={(e) => set("source_name", e.target.value)}
              placeholder="Fuente (ej. Fundación ConTrabajo)"
              className={field}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={busy || !f.title.trim() || !f.company_name.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {busy ? "Guardando…" : "Publicar vacante externa"}
          </button>
        </form>
      </section>
    </div>
  );
}
