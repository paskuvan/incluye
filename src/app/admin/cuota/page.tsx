import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Cumplimiento de la cuota (Ley 21.015)" };

const CUOTA_KEY = "contratacion.cuota";

type OrgRow = {
  id: string;
  name: string;
  rut: string | null;
  employees: number | null;
};

type AnswerRow = {
  value: number;
  assessment: { organization_id: string; created_at: string } | null;
};

type IncumpleRow = {
  org: OrgRow;
  value: number; // 0 = No, 1 = Parcial
  at: string;
};

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CL", { dateStyle: "medium" });
}

export default async function CuotaPage() {
  const supabase = await createClient();

  const [{ data: orgsData }, { data: answersData }] = await Promise.all([
    supabase
      .from("organizations")
      .select("id, name, rut, employees")
      .returns<OrgRow[]>(),
    supabase
      .from("answers")
      .select("value, assessment:assessments(organization_id, created_at)")
      .eq("question_key", CUOTA_KEY)
      .returns<AnswerRow[]>(),
  ]);

  const orgs = new Map((orgsData ?? []).map((o) => [o.id, o]));

  // Última respuesta a la cuota del 1% por organización.
  const latest = new Map<string, { value: number; at: string }>();
  for (const a of answersData ?? []) {
    const orgId = a.assessment?.organization_id;
    const at = a.assessment?.created_at;
    if (!orgId || !at) continue;
    const prev = latest.get(orgId);
    if (!prev || at > prev.at) latest.set(orgId, { value: a.value, at });
  }

  // No alcanzan la cuota = respondieron No (0) o Parcial (1) en su evaluación
  // más reciente.
  const incumplen: IncumpleRow[] = [...latest.entries()]
    .filter(([, v]) => v.value < 2)
    .map(([orgId, v]) => ({ org: orgs.get(orgId), value: v.value, at: v.at }))
    .filter((r): r is IncumpleRow => Boolean(r.org))
    .sort(
      (a, b) => a.value - b.value || a.org.name.localeCompare(b.org.name),
    );

  const totalEvaluadas = latest.size;
  const noCumple = incumplen.filter((r) => r.value === 0).length;
  const parcial = incumplen.filter((r) => r.value === 1).length;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Administración
        </Link>
        <h1 className="mt-2 text-2xl font-bold">
          Cumplimiento de la cuota (Ley 21.015)
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Empresas que en su autoevaluación más reciente declararon{" "}
          <strong>no alcanzar</strong> la cuota del 1% de personas con
          discapacidad. La cuota es obligatoria para empresas de 100 o más
          trabajadores.
        </p>
      </div>

      {totalEvaluadas > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {noCumple}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              No cumple
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {parcial}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Parcial
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="text-2xl font-bold">{totalEvaluadas}</div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Empresas evaluadas
            </div>
          </div>
        </div>
      )}

      {incumplen.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Ninguna empresa evaluada declaró estar bajo la cuota del 1%. Aparecerán
          aquí a medida que las empresas completen su autoevaluación.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                <th className="px-4 py-3 font-medium">Empresa</th>
                <th className="px-4 py-3 font-medium">RUT</th>
                <th className="px-4 py-3 font-medium">Dotación</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Última evaluación</th>
              </tr>
            </thead>
            <tbody>
              {incumplen.map((r) => {
                const obligada =
                  typeof r.org.employees === "number" && r.org.employees >= 100;
                return (
                  <tr
                    key={r.org.id}
                    className="border-b border-slate-50 last:border-0 dark:border-slate-800/50"
                  >
                    <td className="px-4 py-3 font-medium">{r.org.name}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      {r.org.rut ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      {typeof r.org.employees === "number" ? (
                        <span>
                          {r.org.employees}
                          {obligada && (
                            <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              obligada
                            </span>
                          )}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {r.value === 0 ? (
                        <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                          No cumple
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                          Parcial
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      {fmt(r.at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-500">
        Los datos provienen de la autoevaluación declarada por cada empresa
        (pregunta «¿Cumples la cuota del 1%?»). La etiqueta «obligada» indica una
        dotación de 100 o más trabajadores.
      </p>
    </div>
  );
}
