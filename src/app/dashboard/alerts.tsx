import Link from "next/link";
import type { Reminders } from "@/lib/reminders";
import EmailRemindersButton from "./email-reminders-button";

function fmt(d: string) {
  return new Date(d).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
  });
}

export default function Alerts({ reminders }: { reminders: Reminders }) {
  const { overdue, dueSoon, needsReview, needsGestor, total } = reminders;

  const empty = total === 0;

  return (
    <section
      className={`rounded-2xl border p-5 ${
        empty
          ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          className={`flex items-center gap-2 font-semibold ${
            empty
              ? "text-slate-700 dark:text-slate-200"
              : "text-amber-900 dark:text-amber-200"
          }`}
        >
          🔔 Recordatorios{" "}
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              empty
                ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                : "bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100"
            }`}
          >
            {total}
          </span>
        </h2>
        <EmailRemindersButton />
      </div>

      {empty && (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Sin recordatorios pendientes por ahora. Puedes enviarte un resumen
          igual para probar.
        </p>
      )}

      <div className="mt-3 space-y-3">
        {overdue.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
              Tareas vencidas ({overdue.length})
            </p>
            <ul className="mt-1 space-y-1">
              {overdue.map((t) => (
                <li key={t.id} className="text-sm">
                  <Link
                    href={`/dashboard/org/${t.orgId}/plan`}
                    className="text-slate-700 hover:underline dark:text-slate-200"
                  >
                    <span className="text-red-600 dark:text-red-400">
                      Venció {fmt(t.dueDate)}
                    </span>{" "}
                    · {t.title}{" "}
                    <span className="text-slate-400">— {t.orgName}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {dueSoon.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
              Por vencer ({dueSoon.length})
            </p>
            <ul className="mt-1 space-y-1">
              {dueSoon.map((t) => (
                <li key={t.id} className="text-sm">
                  <Link
                    href={`/dashboard/org/${t.orgId}/plan`}
                    className="text-slate-700 hover:underline dark:text-slate-200"
                  >
                    <span className="text-amber-700 dark:text-amber-300">
                      Vence {fmt(t.dueDate)}
                    </span>{" "}
                    · {t.title}{" "}
                    <span className="text-slate-400">— {t.orgName}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {needsGestor.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
              Falta gestor de inclusión ({needsGestor.length})
            </p>
            <ul className="mt-1 space-y-1">
              {needsGestor.map((g) => (
                <li key={g.orgId} className="text-sm">
                  <Link
                    href={`/dashboard/org/${g.orgId}/gestor`}
                    className="text-slate-700 hover:underline dark:text-slate-200"
                  >
                    <b>{g.orgName}</b>{" "}
                    <span className="text-slate-400">
                      — {g.employees} trabajadores, Ley 21.275
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {needsReview.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Toca (re)evaluar ({needsReview.length})
            </p>
            <ul className="mt-1 space-y-1">
              {needsReview.map((r) => (
                <li key={r.orgId} className="text-sm">
                  <Link
                    href={`/dashboard/org/${r.orgId}/evaluacion`}
                    className="text-slate-700 hover:underline dark:text-slate-200"
                  >
                    <b>{r.orgName}</b>{" "}
                    <span className="text-slate-400">
                      {r.lastDate
                        ? `— última hace ${r.days} días`
                        : "— sin evaluar aún"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
