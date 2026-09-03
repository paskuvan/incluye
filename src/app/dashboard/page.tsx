import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getReminders } from "@/lib/reminders";
import { scoreLevel } from "@/lib/assessment/scoring";
import CreateOrgForm from "./create-org-form";
import Alerts from "./alerts";
import PortfolioTable, { type PortfolioRow } from "./portfolio-table";
import PendingInvitations, {
  type PendingInvite,
} from "./pending-invitations";

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </span>
        <span className="text-lg">{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {hint && (
        <p className="mt-0.5 text-xs text-slate-400">{hint}</p>
      )}
    </div>
  );
}

const toneBar: Record<string, string> = {
  green: "bg-green-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
};
const toneBadge: Record<string, string> = {
  green: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  red: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

type Membership = {
  role: string;
  organizations: {
    id: string;
    name: string;
    rut: string | null;
    employees: number | null;
    logo_url: string | null;
  } | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: memberships } = await supabase
    .from("members")
    .select("role, organizations(id, name, rut, employees, logo_url)")
    .returns<Membership[]>();

  const orgs = (memberships ?? []).filter((m) => m.organizations);

  // Invitaciones pendientes para el email del usuario actual.
  const { data: invites } = await supabase.rpc("my_pending_invitations");
  const pending = (invites as PendingInvite[]) ?? [];

  if (orgs.length === 0) {
    return (
      <div className="space-y-6">
        <PendingInvitations invites={pending} />
        <CreateOrgForm />
      </div>
    );
  }

  // Último puntaje por organización.
  const orgIds = orgs.map((m) => m.organizations!.id);
  const { data: assessments } = await supabase
    .from("assessments")
    .select("organization_id, score, created_at")
    .in("organization_id", orgIds)
    .order("created_at", { ascending: false });

  const latestScore = new Map<string, number | null>();
  const latestDate = new Map<string, string | undefined>();
  for (const a of assessments ?? []) {
    if (!latestScore.has(a.organization_id)) {
      latestScore.set(a.organization_id, a.score);
      latestDate.set(a.organization_id, a.created_at);
    }
  }

  const reminders = await getReminders(
    supabase,
    orgs.map((m) => ({
      id: m.organizations!.id,
      name: m.organizations!.name,
      employees: m.organizations!.employees,
    })),
    latestDate,
  );

  // KPIs
  const scored = orgs.filter((m) => latestScore.get(m.organizations!.id) != null);
  const avg =
    scored.length > 0
      ? Math.round(
          scored.reduce(
            (a, m) => a + (latestScore.get(m.organizations!.id) ?? 0),
            0,
          ) / scored.length,
        )
      : null;

  return (
    <div className="space-y-6">
      <PendingInvitations invites={pending} />

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Panel</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Resumen de tus empresas en Incluye.
          </p>
        </div>
        <Link
          href="/dashboard/empresas/nueva"
          className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          + Agregar empresa
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Empresas" value={String(orgs.length)} icon="🏢" />
        <StatCard
          label="Accesibilidad prom."
          value={avg != null ? `${avg}%` : "—"}
          hint={avg != null ? scoreLevel(avg).label : "sin datos"}
          icon="📊"
        />
        <StatCard
          label="Evaluadas"
          value={`${scored.length}/${orgs.length}`}
          icon="✅"
        />
        <StatCard
          label="Recordatorios"
          value={String(reminders.total)}
          hint={reminders.total > 0 ? "requieren atención" : "al día"}
          icon="🔔"
        />
      </div>

      <Alerts reminders={reminders} />

      {orgs.length > 1 && (
        <PortfolioTable
          rows={orgs.map((m): PortfolioRow => {
            const o = m.organizations!;
            return {
              id: o.id,
              name: o.name,
              employees: o.employees,
              score: latestScore.get(o.id) ?? null,
              lastDate: latestDate.get(o.id) ?? null,
            };
          })}
        />
      )}

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Empresas
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {orgs.map((m) => {
            const org = m.organizations!;
            const quota =
              org.employees && org.employees >= 100
                ? Math.ceil(org.employees * 0.01)
                : null;
            const score = latestScore.get(org.id) ?? null;
            const level = score != null ? scoreLevel(score) : null;

            const secondary = [
              { href: `/dashboard/org/${org.id}/plan`, label: "Plan de acción" },
              ...(score != null
                ? [
                    { href: `/dashboard/org/${org.id}/historial`, label: "Historial" },
                    { href: `/dashboard/org/${org.id}/certificado`, label: "Certificado" },
                  ]
                : []),
              { href: `/dashboard/org/${org.id}/gestor`, label: "Gestor" },
              { href: `/dashboard/org/${org.id}/empleos`, label: "Empleos" },
              { href: `/dashboard/org/${org.id}/perfil`, label: "Perfil público" },
              { href: `/dashboard/org/${org.id}/equipo`, label: "Equipo" },
            ];

            return (
              <div
                key={org.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-3">
                    {org.logo_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={org.logo_url}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 object-contain dark:border-slate-700"
                      />
                    )}
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold">
                        {org.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {org.rut ? `RUT ${org.rut} · ` : ""}
                        {org.employees ?? "—"} trabajadores
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href={`/dashboard/org/${org.id}/editar`}
                      aria-label={`Editar ${org.name}`}
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <span className="text-sm" aria-hidden="true">
                        ✎
                      </span>
                    </Link>
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {m.role}
                    </span>
                  </div>
                </div>

                {/* Accesibilidad */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Accesibilidad
                    </span>
                    {score != null && level ? (
                      <span className="flex items-center gap-2">
                        <span className="font-semibold">{score}%</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${toneBadge[level.tone]}`}
                        >
                          {level.label}
                        </span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">sin evaluar</span>
                    )}
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full ${level ? toneBar[level.tone] : "bg-slate-300"}`}
                      style={{ width: `${score ?? 0}%` }}
                    />
                  </div>
                </div>

                {quota !== null && (
                  <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Ley 21.015: al menos <b>{quota}</b>{" "}
                    {quota === 1 ? "persona" : "personas"} con discapacidad (1%).
                  </p>
                )}

                {/* Acciones principales */}
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/dashboard/org/${org.id}/evaluacion`}
                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-indigo-500"
                  >
                    {score != null ? "Actualizar" : "Evaluar"}
                  </Link>
                  {score != null && (
                    <Link
                      href={`/dashboard/org/${org.id}/reporte`}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-medium hover:border-slate-400 dark:border-slate-700"
                    >
                      Reporte
                    </Link>
                  )}
                </div>

                {/* Acciones secundarias */}
                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  {secondary.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
