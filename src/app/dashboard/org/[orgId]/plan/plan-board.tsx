"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type Task = {
  id: string;
  question_key: string | null;
  title: string;
  area: string | null;
  status: "pendiente" | "en_curso" | "hecho";
  assigned_to: string | null;
  due_date: string | null;
};
export type Member = { user_id: string; email: string };
export type Suggestion = { question_key: string; title: string; area: string };

const COLUMNS: { key: Task["status"]; label: string; color: string }[] = [
  { key: "pendiente", label: "Pendiente", color: "border-t-slate-400" },
  { key: "en_curso", label: "En curso", color: "border-t-amber-500" },
  { key: "hecho", label: "Hecho", color: "border-t-green-500" },
];

export default function PlanBoard({
  orgId,
  currentUserId,
  tasks,
  members,
  suggestions,
}: {
  orgId: string;
  currentUserId: string;
  tasks: Task[];
  members: Member[];
  suggestions: Suggestion[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [newTask, setNewTask] = useState("");
  const [busy, setBusy] = useState(false);

  async function addFromDiagnostic() {
    if (suggestions.length === 0) return;
    setBusy(true);
    await supabase.from("action_items").insert(
      suggestions.map((s) => ({
        organization_id: orgId,
        question_key: s.question_key,
        title: s.title,
        area: s.area,
        created_by: currentUserId,
      })),
    );
    router.refresh();
    setBusy(false);
  }

  async function addCustom(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.trim()) return;
    setBusy(true);
    await supabase.from("action_items").insert({
      organization_id: orgId,
      title: newTask.trim(),
      created_by: currentUserId,
    });
    setNewTask("");
    router.refresh();
    setBusy(false);
  }

  async function patch(id: string, fields: Partial<Task>) {
    await supabase.from("action_items").update(fields).eq("id", id);
    router.refresh();
  }

  async function remove(id: string) {
    await supabase.from("action_items").delete().eq("id", id);
    router.refresh();
  }

  const done = tasks.filter((t) => t.status === "hecho").length;

  return (
    <div className="space-y-6">
      {/* Acciones */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {suggestions.length > 0 && (
          <button
            onClick={addFromDiagnostic}
            disabled={busy}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            Generar {suggestions.length} tarea{suggestions.length === 1 ? "" : "s"} del diagnóstico
          </button>
        )}
        <form onSubmit={addCustom} className="flex flex-1 gap-2">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Agregar tarea propia…"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
          />
          <button
            type="submit"
            disabled={busy || !newTask.trim()}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:border-slate-400 disabled:opacity-60 dark:border-slate-700"
          >
            Agregar
          </button>
        </form>
      </div>

      {tasks.length > 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Progreso: {done}/{tasks.length} completadas
        </p>
      )}

      {/* Columnas */}
      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = tasks.filter((t) => t.status === col.key);
          return (
            <div
              key={col.key}
              className={`rounded-2xl border border-t-4 border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50 ${col.color}`}
            >
              <h3 className="px-1 pb-2 text-sm font-semibold">
                {col.label}{" "}
                <span className="text-slate-400">({items.length})</span>
              </h3>
              <div className="space-y-2">
                {items.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                  >
                    {t.area && (
                      <p className="text-[10px] font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                        {t.area}
                      </p>
                    )}
                    <p className="mt-0.5 text-sm">{t.title}</p>

                    <div className="mt-3 space-y-2">
                      <select
                        value={t.status}
                        onChange={(e) =>
                          patch(t.id, { status: e.target.value as Task["status"] })
                        }
                        className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_curso">En curso</option>
                        <option value="hecho">Hecho</option>
                      </select>

                      <select
                        value={t.assigned_to ?? ""}
                        onChange={(e) =>
                          patch(t.id, {
                            assigned_to: e.target.value || null,
                          })
                        }
                        className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                      >
                        <option value="">Sin responsable</option>
                        {members.map((m) => (
                          <option key={m.user_id} value={m.user_id}>
                            {m.email}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center gap-1">
                        <input
                          type="date"
                          value={t.due_date ?? ""}
                          onChange={(e) =>
                            patch(t.id, { due_date: e.target.value || null })
                          }
                          className="flex-1 rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                        />
                        <button
                          onClick={() => remove(t.id)}
                          aria-label="Eliminar tarea"
                          className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-red-600 hover:border-red-300 dark:border-slate-700"
                        >
                          <span aria-hidden="true">✕</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="px-1 py-4 text-center text-xs text-slate-400">
                    Sin tareas
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
