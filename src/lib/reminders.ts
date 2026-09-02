import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export type TaskAlert = {
  id: string;
  orgId: string;
  orgName: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
};
export type ReviewAlert = {
  orgId: string;
  orgName: string;
  lastDate: string | null; // ISO o null si nunca
  days: number | null;
};
export type GestorAlert = {
  orgId: string;
  orgName: string;
  employees: number;
};

export type Reminders = {
  overdue: TaskAlert[];
  dueSoon: TaskAlert[];
  needsReview: ReviewAlert[];
  needsGestor: GestorAlert[];
  total: number;
};

// Cada cuántos días sugerimos re-evaluar.
const REVIEW_DAYS = 90;

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function getReminders(
  supabase: SupabaseClient,
  orgs: { id: string; name: string; employees?: number | null }[],
  latestDate: Map<string, string | undefined>,
): Promise<Reminders> {
  const today = isoDate(new Date());
  const soonLimit = isoDate(new Date(Date.now() + 7 * 86400000));
  const orgName = new Map(orgs.map((o) => [o.id, o.name]));

  // Empresas que necesitan (re)evaluación.
  const needsReview: ReviewAlert[] = [];
  for (const o of orgs) {
    const last = latestDate.get(o.id);
    if (!last) {
      needsReview.push({ orgId: o.id, orgName: o.name, lastDate: null, days: null });
    } else {
      const days = Math.floor(
        (Date.now() - new Date(last).getTime()) / 86400000,
      );
      if (days >= REVIEW_DAYS) {
        needsReview.push({ orgId: o.id, orgName: o.name, lastDate: last, days });
      }
    }
  }

  // Tareas del plan de acción con fecha, sin completar.
  const overdue: TaskAlert[] = [];
  const dueSoon: TaskAlert[] = [];
  const { data: tasks, error } = await supabase
    .from("action_items")
    .select("id, organization_id, title, due_date, status")
    .in(
      "organization_id",
      orgs.map((o) => o.id),
    )
    .neq("status", "hecho")
    .not("due_date", "is", null)
    .order("due_date", { ascending: true });

  // Si la tabla no existe todavía (migración 0004 sin aplicar), lo ignoramos.
  if (!error) {
    for (const t of tasks ?? []) {
      const alert: TaskAlert = {
        id: t.id,
        orgId: t.organization_id,
        orgName: orgName.get(t.organization_id) ?? "",
        title: t.title,
        dueDate: t.due_date,
      };
      if (t.due_date < today) overdue.push(alert);
      else if (t.due_date <= soonLimit) dueSoon.push(alert);
    }
  }

  // Empresas de 100+ trabajadores sin gestor(a) de inclusión (Ley 21.275).
  const needsGestor: GestorAlert[] = [];
  const big = orgs.filter((o) => (o.employees ?? 0) >= 100);
  if (big.length > 0) {
    const { data: mgrs, error: gErr } = await supabase
      .from("inclusion_managers")
      .select("organization_id")
      .in(
        "organization_id",
        big.map((o) => o.id),
      );
    if (!gErr) {
      const withGestor = new Set((mgrs ?? []).map((m) => m.organization_id));
      for (const o of big) {
        if (!withGestor.has(o.id)) {
          needsGestor.push({
            orgId: o.id,
            orgName: o.name,
            employees: o.employees ?? 0,
          });
        }
      }
    }
  }

  return {
    overdue,
    dueSoon,
    needsReview,
    needsGestor,
    total:
      overdue.length +
      dueSoon.length +
      needsReview.length +
      needsGestor.length,
  };
}
