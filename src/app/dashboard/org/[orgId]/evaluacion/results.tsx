"use client";

import Link from "next/link";
import {
  scoreLevel,
  type AssessmentResult,
} from "@/lib/assessment/scoring";

const toneClasses: Record<string, string> = {
  green:
    "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  amber:
    "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  red: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const barColor: Record<string, string> = {
  green: "bg-green-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
};

function areaTone(score: number) {
  return scoreLevel(score).tone;
}

export default function Results({
  result,
  orgId,
  onEdit,
}: {
  result: AssessmentResult;
  orgId: string;
  onEdit: () => void;
}) {
  const level = scoreLevel(result.overall);

  return (
    <div className="space-y-8">
      {/* Puntaje global */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-6">
          <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-4 border-indigo-500">
            <span className="text-2xl font-bold">{result.overall}%</span>
          </div>
          <div>
            <span
              className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${toneClasses[level.tone]}`}
            >
              Nivel {level.label}
            </span>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {result.answeredCount} de {result.totalCount} preguntas respondidas.
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            <button
              onClick={onEdit}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:border-slate-400 dark:border-slate-700"
            >
              Editar respuestas
            </button>
            <Link
              href={`/dashboard/org/${orgId}/reporte`}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Ver reporte
            </Link>
          </div>
        </div>
      </div>

      {/* Puntaje por área */}
      <div>
        <h2 className="text-lg font-semibold">Resultado por área</h2>
        <div className="mt-4 space-y-4">
          {result.areas.map((ar) => {
            const tone = areaTone(ar.score);
            return (
              <div key={ar.area.key}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {ar.area.icon} {ar.area.title}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {ar.score}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full ${barColor[tone]}`}
                    style={{ width: `${ar.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recomendaciones */}
      <div>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">
            Recomendaciones ({result.recommendations.length})
          </h2>
          {result.recommendations.length > 0 && (
            <Link
              href={`/dashboard/org/${orgId}/plan`}
              className="rounded-lg border border-indigo-300 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950"
            >
              Llevar a plan de acción →
            </Link>
          )}
        </div>
        {result.recommendations.length === 0 ? (
          <p className="mt-2 rounded-xl bg-green-50 p-4 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
            ¡Excelente! No hay acciones pendientes según tus respuestas.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {result.recommendations.map((rec, i) => (
              <li
                key={i}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  {rec.areaTitle}
                </p>
                <p className="mt-1 text-sm font-medium">{rec.questionText}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {rec.text}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
