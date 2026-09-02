import Link from "next/link";
import { scoreLevel } from "@/lib/assessment/scoring";

export type PortfolioRow = {
  id: string;
  name: string;
  employees: number | null;
  score: number | null;
  lastDate: string | null;
};

const toneBadge: Record<string, string> = {
  green: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  red: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export default function PortfolioTable({ rows }: { rows: PortfolioRow[] }) {
  // Promedio de accesibilidad de las empresas evaluadas.
  const scored = rows.filter((r) => r.score != null);
  const avg =
    scored.length > 0
      ? Math.round(
          scored.reduce((a, r) => a + (r.score ?? 0), 0) / scored.length,
        )
      : null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Resumen de cartera</h2>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {rows.length} empresas
          {avg != null && <> · promedio {avg}%</>}
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="pb-2 font-medium">Empresa</th>
              <th className="pb-2 font-medium">Trabajadores</th>
              <th className="pb-2 font-medium">Cuota 1%</th>
              <th className="pb-2 font-medium">Accesibilidad</th>
              <th className="pb-2 font-medium">Nivel</th>
              <th className="pb-2 font-medium">Última eval.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((r) => {
              const quota =
                r.employees && r.employees >= 100
                  ? Math.ceil(r.employees * 0.01)
                  : null;
              const level = r.score != null ? scoreLevel(r.score) : null;
              return (
                <tr key={r.id}>
                  <td className="py-2 font-medium">
                    <Link
                      href={`/dashboard/org/${r.id}/evaluacion`}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {r.name}
                    </Link>
                  </td>
                  <td className="py-2 text-slate-500 dark:text-slate-400">
                    {r.employees ?? "—"}
                  </td>
                  <td className="py-2 text-slate-500 dark:text-slate-400">
                    {quota ?? "—"}
                  </td>
                  <td className="py-2">
                    {r.score != null ? (
                      <span className="font-semibold">{r.score}%</span>
                    ) : (
                      <span className="text-slate-400">sin evaluar</span>
                    )}
                  </td>
                  <td className="py-2">
                    {level ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${toneBadge[level.tone]}`}
                      >
                        {level.label}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-2 text-slate-500 dark:text-slate-400">
                    {r.lastDate
                      ? new Date(r.lastDate).toLocaleDateString("es-CL")
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
