import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCatalog } from "@/lib/assessment/get-catalog";
import { computeResult, scoreLevel, type Answers } from "@/lib/assessment/scoring";
import TrendChart, { type TrendPoint } from "./trend-chart";

type Snapshot = {
  date: Date;
  overall: number;
  areas: Record<string, number>;
};

export default async function HistorialPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("id", orgId)
    .single();
  if (!org) notFound();

  const { data: assessments } = await supabase
    .from("assessments")
    .select("id, created_at")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: true });

  const list = assessments ?? [];
  const catalog = await getCatalog();

  // Respuestas de todas las evaluaciones en una sola consulta.
  const ids = list.map((a) => a.id);
  const byAssessment = new Map<string, Answers>();
  if (ids.length > 0) {
    const { data: rows } = await supabase
      .from("answers")
      .select("assessment_id, question_key, value")
      .in("assessment_id", ids);
    for (const r of rows ?? []) {
      const a = byAssessment.get(r.assessment_id) ?? {};
      a[r.question_key] = r.value;
      byAssessment.set(r.assessment_id, a);
    }
  }

  const snapshots: Snapshot[] = list.map((a) => {
    const result = computeResult(byAssessment.get(a.id) ?? {}, catalog);
    const areas: Record<string, number> = {};
    for (const ar of result.areas) areas[ar.area.key] = ar.score;
    return { date: new Date(a.created_at), overall: result.overall, areas };
  });

  const fmt = (d: Date) =>
    d.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit" });

  const points: TrendPoint[] = snapshots.map((s) => ({
    label: fmt(s.date),
    value: s.overall,
  }));

  const latest = snapshots.at(-1);
  const previous = snapshots.at(-2);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Volver al panel
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Historial y evolución</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {org.name}
        </p>
      </div>

      {snapshots.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-400">
            Todavía no hay evaluaciones para mostrar evolución.
          </p>
          <Link
            href={`/dashboard/org/${orgId}/evaluacion`}
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Hacer autoevaluación
          </Link>
        </div>
      ) : (
        <>
          {/* Tendencia */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <h2 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">
              Puntaje global en el tiempo
            </h2>
            {snapshots.length === 1 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Con una sola evaluación ({latest!.overall}%) todavía no hay
                evolución. Haz otra más adelante para comparar.
              </p>
            ) : (
              <TrendChart points={points} />
            )}
          </section>

          {/* Comparación por área */}
          {previous && latest && (
            <section>
              <h2 className="font-semibold">
                Cambio vs. evaluación anterior
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {fmt(previous.date)} → {fmt(latest.date)}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {catalog.map((area) => {
                  const now = latest.areas[area.key] ?? 0;
                  const before = previous.areas[area.key] ?? 0;
                  const delta = now - before;
                  return (
                    <div
                      key={area.key}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <span className="text-sm font-medium">
                        {area.icon} {area.title}
                      </span>
                      <span className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400">{now}%</span>
                        <span
                          className={`font-semibold ${
                            delta > 0
                              ? "text-green-600 dark:text-green-400"
                              : delta < 0
                                ? "text-red-600 dark:text-red-400"
                                : "text-slate-400"
                          }`}
                        >
                          {delta > 0 ? "▲" : delta < 0 ? "▼" : "="}{" "}
                          {delta > 0 ? "+" : ""}
                          {delta}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Lista de evaluaciones */}
          <section>
            <h2 className="font-semibold">Evaluaciones ({snapshots.length})</h2>
            <div className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {[...snapshots].reverse().map((s, i) => {
                const level = scoreLevel(s.overall);
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-white px-4 py-3 dark:bg-slate-900"
                  >
                    <span className="text-sm">
                      {s.date.toLocaleDateString("es-CL", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="text-sm font-semibold">
                        {s.overall}%
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {level.label}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
