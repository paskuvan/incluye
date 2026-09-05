"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type Applicant = {
  application_id: string;
  job_title: string;
  full_name: string | null;
  headline: string | null;
  region: string | null;
  uses_lsch: boolean | null;
  contact_email: string | null;
  cover_note: string | null;
  status: string;
  created_at: string;
};

const STATUSES = [
  { v: "sent", label: "Enviada" },
  { v: "reviewed", label: "Revisada" },
  { v: "contacted", label: "Contactada" },
  { v: "rejected", label: "Descartada" },
];

export default function ApplicantsList({ initial }: { initial: Applicant[] }) {
  const supabase = createClient();
  const [rows, setRows] = useState(initial);

  async function setStatus(id: string, status: string) {
    setRows((rs) =>
      rs.map((r) => (r.application_id === id ? { ...r, status } : r)),
    );
    await supabase
      .from("applications")
      .update({ status })
      .eq("id", id);
  }

  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        Todavía no hay postulaciones a tus vacantes.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((a) => (
        <div
          key={a.application_id}
          className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{a.full_name ?? "Candidato/a"}</h3>
                {a.uses_lsch && (
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    🤟 LSCh
                  </span>
                )}
              </div>
              {a.headline && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {a.headline}
                </p>
              )}
              <p className="mt-0.5 text-xs text-slate-400">
                Postuló a <b>{a.job_title}</b>
                {a.region ? ` · ${a.region}` : ""}
              </p>
            </div>
            <select
              value={a.status}
              onChange={(e) => setStatus(a.application_id, e.target.value)}
              aria-label="Estado de la postulación"
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              {STATUSES.map((s) => (
                <option key={s.v} value={s.v}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {a.cover_note && (
            <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
              {a.cover_note}
            </p>
          )}

          {a.contact_email && (
            <a
              href={`mailto:${a.contact_email}?subject=${encodeURIComponent(`Tu postulación: ${a.job_title}`)}`}
              className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Contactar por email →
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
