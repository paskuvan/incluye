"use client";

import { useMemo, useState } from "react";

export type Job = {
  id: string;
  company_name: string;
  title: string;
  description: string;
  region: string | null;
  modality: string | null;
  employment_type: string | null;
  apply_url: string | null;
  apply_email: string | null;
  source: string | null;
  source_name: string | null;
};

export default function EmpleosView({ jobs }: { jobs: Job[] }) {
  const [query, setQuery] = useState("");
  const [modality, setModality] = useState("todas");

  const modalities = useMemo(
    () =>
      Array.from(
        new Set(jobs.map((j) => j.modality).filter(Boolean) as string[]),
      ),
    [jobs],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      if (modality !== "todas" && j.modality !== modality) return false;
      if (
        q &&
        !`${j.title} ${j.company_name} ${j.region ?? ""} ${j.description}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [jobs, query, modality]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          aria-label="Buscar empleos"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar cargo, empresa o región…"
          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 sm:max-w-sm dark:border-slate-700 dark:bg-slate-800"
        />
        <select
          value={modality}
          onChange={(e) => setModality(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <option value="todas">Todas las modalidades</option>
          {modalities.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <span className="text-sm text-slate-500 sm:ml-auto dark:text-slate-400">
          {filtered.length} vacante{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
          No hay vacantes que coincidan con la búsqueda.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((j) => {
            const applyHref = j.apply_url
              ? j.apply_url
              : j.apply_email
                ? `mailto:${j.apply_email}?subject=${encodeURIComponent(`Postulación: ${j.title}`)}`
                : null;
            return (
              <article
                key={j.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{j.title}</h2>
                    <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      {j.company_name}
                      {j.source === "externa" && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          Externa{j.source_name ? ` · ${j.source_name}` : ""}
                        </span>
                      )}
                    </p>
                  </div>
                  {applyHref && (
                    <a
                      href={applyHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                    >
                      Postular
                    </a>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {[j.region, j.modality, j.employment_type]
                    .filter(Boolean)
                    .map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                </div>

                {j.description && (
                  <p className="mt-3 whitespace-pre-line text-sm text-slate-600 dark:text-slate-400">
                    {j.description}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
