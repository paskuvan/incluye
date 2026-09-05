import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Registro de auditoría" };

type AuditRow = {
  id: string;
  actor_email: string | null;
  action: string;
  entity: string | null;
  entity_id: string | null;
  created_at: string;
};

const ACTION_LABEL: Record<string, { label: string; icon: string }> = {
  organization_create: { label: "Creó una empresa", icon: "🏢" },
  organization_delete: { label: "Eliminó una empresa", icon: "🗑️" },
  job_create: { label: "Publicó una vacante", icon: "💼" },
  job_delete: { label: "Eliminó una vacante", icon: "🗑️" },
  data_export: { label: "Descargó sus datos", icon: "📥" },
  account_delete: { label: "Eliminó su cuenta", icon: "⚠️" },
};

function fmt(iso: string): string {
  return new Date(iso).toLocaleString("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AuditoriaPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_log")
    .select("id, actor_email, action, entity, entity_id, created_at")
    .order("created_at", { ascending: false })
    .limit(200)
    .returns<AuditRow[]>();

  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Administración
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Registro de auditoría</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Trazabilidad de acciones sensibles sobre datos (Ley 21.719, Art. 14
          sexies). Se muestran los últimos 200 eventos.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Todavía no hay eventos registrados. Aparecerán a medida que se creen o
          eliminen empresas y vacantes, y cuando alguien exporte o elimine su
          cuenta.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                <th className="px-4 py-3 font-medium">Acción</th>
                <th className="px-4 py-3 font-medium">Usuario</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const meta = ACTION_LABEL[r.action] ?? {
                  label: r.action,
                  icon: "•",
                };
                return (
                  <tr
                    key={r.id}
                    className="border-b border-slate-50 last:border-0 dark:border-slate-800/50"
                  >
                    <td className="px-4 py-3">
                      <span className="mr-2" aria-hidden="true">
                        {meta.icon}
                      </span>
                      {meta.label}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      {r.actor_email ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      {fmt(r.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
