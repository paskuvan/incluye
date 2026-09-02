import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCatalog } from "@/lib/assessment/get-catalog";
import { computeResult, scoreLevel, type Answers } from "@/lib/assessment/scoring";
import PrintButton from "./print-button";

const toneBadge: Record<string, string> = {
  green: "bg-green-100 text-green-800",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-800",
};
const barColor: Record<string, string> = {
  green: "bg-green-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
};

export default async function ReportePage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name, rut, employees")
    .eq("id", orgId)
    .single();

  if (!org) notFound();

  const { data: gestores } = await supabase
    .from("inclusion_managers")
    .select("name, role, certified")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: true });

  const { data: last } = await supabase
    .from("assessments")
    .select("id, created_at, score")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Sin evaluación previa: invitar a hacerla.
  if (!last) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Volver al panel
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-400">
            {org.name} todavía no tiene una autoevaluación.
          </p>
          <Link
            href={`/dashboard/org/${orgId}/evaluacion`}
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Hacer autoevaluación
          </Link>
        </div>
      </div>
    );
  }

  const { data: rows } = await supabase
    .from("answers")
    .select("question_key, value")
    .eq("assessment_id", last.id);

  const answers: Answers = Object.fromEntries(
    (rows ?? []).map((r) => [r.question_key, r.value]),
  );
  const catalog = await getCatalog();
  const result = computeResult(answers, catalog);
  const level = scoreLevel(result.overall);

  // Ley 21.015: cuota del 1% para empresas de 100+ trabajadores.
  const quota =
    org.employees && org.employees >= 100
      ? Math.ceil(org.employees * 0.01)
      : null;

  const fecha = new Date(last.created_at).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Barra de acciones (no se imprime) */}
      <div className="no-print flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Volver al panel
        </Link>
        <PrintButton />
      </div>

      {/* Reporte */}
      <article className="print-area mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 print:border-0 print:shadow-none">
        <header className="print-break border-b border-slate-200 pb-6 dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold tracking-tight text-indigo-600">
                incluye
              </p>
              <h1 className="mt-1 text-2xl font-bold">
                Reporte de accesibilidad e inclusión
              </h1>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${toneBadge[level.tone]}`}
            >
              Nivel {level.label}
            </span>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-slate-500">Empresa</dt>
              <dd className="font-medium">{org.name}</dd>
            </div>
            {org.rut && (
              <div>
                <dt className="text-slate-500">RUT</dt>
                <dd className="font-medium">{org.rut}</dd>
              </div>
            )}
            <div>
              <dt className="text-slate-500">Trabajadores</dt>
              <dd className="font-medium">{org.employees ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Fecha evaluación</dt>
              <dd className="font-medium">{fecha}</dd>
            </div>
          </dl>
        </header>

        {/* Resumen */}
        <section className="print-break mt-6 flex items-center gap-6">
          <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-4 border-indigo-500">
            <span className="text-2xl font-bold">{result.overall}%</span>
            <span className="text-[10px] text-slate-500">cumplimiento</span>
          </div>
          <div className="text-sm">
            <p>
              Puntaje global de accesibilidad e inclusión:{" "}
              <b>{result.overall}%</b> ({result.answeredCount} de{" "}
              {result.totalCount} preguntas).
            </p>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              {result.recommendations.length === 0
                ? "Sin acciones pendientes según las respuestas."
                : `${result.recommendations.length} acciones recomendadas para mejorar.`}
            </p>
          </div>
        </section>

        {/* Ley 21.015 */}
        {quota !== null && (
          <section className="print-break mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
            <h2 className="font-semibold">Ley 21.015 — Cuota de inclusión</h2>
            <p className="mt-1">
              Con {org.employees} trabajadores, la empresa debe incluir al menos{" "}
              <b>
                {quota} {quota === 1 ? "persona" : "personas"}
              </b>{" "}
              con discapacidad (1% de la dotación).
            </p>
          </section>
        )}

        {/* Gestor(a) de inclusión */}
        {(gestores ?? []).length > 0 && (
          <section className="print-break mt-6">
            <h2 className="text-lg font-semibold">Gestor(a) de inclusión</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {(gestores ?? []).map((g, i) => (
                <li key={i}>
                  <b>{g.name}</b>
                  {g.role ? ` — ${g.role}` : ""}
                  {g.certified ? " · certificado/a (ChileValora)" : ""}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Resultado por área */}
        <section className="print-break mt-6">
          <h2 className="text-lg font-semibold">Resultado por área</h2>
          <div className="mt-4 space-y-3">
            {result.areas.map((ar) => {
              const tone = scoreLevel(ar.score).tone;
              return (
                <div key={ar.area.key}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {ar.area.icon} {ar.area.title}
                    </span>
                    <span className="text-slate-500">{ar.score}%</span>
                  </div>
                  <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${barColor[tone]}`}
                      style={{ width: `${ar.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recomendaciones */}
        <section className="print-break mt-6">
          <h2 className="text-lg font-semibold">
            Plan de acción ({result.recommendations.length})
          </h2>
          {result.recommendations.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              No hay recomendaciones pendientes. ¡Excelente trabajo!
            </p>
          ) : (
            <ol className="mt-3 space-y-2 text-sm">
              {result.recommendations.map((rec, i) => (
                <li
                  key={i}
                  className="print-break rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                >
                  <span className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                    {rec.areaTitle}
                  </span>
                  <p className="mt-0.5 font-medium">{rec.questionText}</p>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-400">
                    {rec.text}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </section>

        <footer className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-400 dark:border-slate-700">
          Reporte generado por Incluye · Portal de accesibilidad para empresas.
          Documento de autodiagnóstico; no constituye certificación legal de
          cumplimiento de la Ley 21.015.
        </footer>
      </article>
    </div>
  );
}
