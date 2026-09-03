"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type ExpRow = {
  id: string;
  company_name: string;
  role: string | null;
  rating: number | null;
  had_interpreter: boolean | null;
  process_accessible: boolean | null;
  offer_real: boolean | null;
  comment: string;
  contact_email: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

const bool = (v: boolean | null) => (v === null ? "—" : v ? "Sí" : "No");

export default function Moderation({ rows }: { rows: ExpRow[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [busy, setBusy] = useState<string | null>(null);

  async function setStatus(id: string, status: ExpRow["status"]) {
    setBusy(id);
    await supabase.from("experiences").update({ status }).eq("id", id);
    router.refresh();
    setBusy(null);
  }
  async function remove(id: string) {
    setBusy(id);
    await supabase.from("experiences").delete().eq("id", id);
    router.refresh();
    setBusy(null);
  }

  if (rows.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No hay experiencias para moderar.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((e) => (
        <div
          key={e.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold">
              {e.company_name}
              {e.role && (
                <span className="ml-2 text-sm font-normal text-slate-400">
                  · {e.role}
                </span>
              )}
            </p>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                e.status === "approved"
                  ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                  : e.status === "rejected"
                    ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              }`}
            >
              {e.status === "approved"
                ? "Aprobada"
                : e.status === "rejected"
                  ? "Rechazada"
                  : "Pendiente"}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Comunicación: {bool(e.had_interpreter)} · Proceso:{" "}
            {bool(e.process_accessible)} · Inclusión real: {bool(e.offer_real)}
            {e.rating != null && ` · ${e.rating}★`}
            {e.contact_email && ` · ${e.contact_email}`}
          </p>

          <p className="mt-2 whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">
            {e.comment}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {e.status !== "approved" && (
              <button
                onClick={() => setStatus(e.id, "approved")}
                disabled={busy === e.id}
                className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-500 disabled:opacity-60"
              >
                Aprobar y publicar
              </button>
            )}
            {e.status !== "rejected" && (
              <button
                onClick={() => setStatus(e.id, "rejected")}
                disabled={busy === e.id}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium hover:border-slate-400 dark:border-slate-700"
              >
                Rechazar
              </button>
            )}
            <button
              onClick={() => remove(e.id)}
              disabled={busy === e.id}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-red-600 hover:border-red-300 dark:border-slate-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
