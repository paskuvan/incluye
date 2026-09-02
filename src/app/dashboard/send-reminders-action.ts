"use server";

import { createClient } from "@/lib/supabase/server";
import { getReminders, type Reminders } from "@/lib/reminders";
import { sendEmail } from "@/lib/email/resend";

type OrgRow = {
  role: string;
  organizations: { id: string; name: string; employees: number | null } | null;
};

function buildHtml(reminders: Reminders): string {
  const { overdue, dueSoon, needsReview, needsGestor } = reminders;
  const item = (s: string) => `<li style="margin:4px 0">${s}</li>`;

  const section = (title: string, color: string, rows: string[]) =>
    rows.length
      ? `<h3 style="color:${color};margin:16px 0 4px">${title}</h3><ul style="padding-left:18px;margin:0">${rows.join("")}</ul>`
      : "";

  const body =
    section(
      "Tareas vencidas",
      "#dc2626",
      overdue.map((t) => item(`<b>${t.title}</b> — ${t.orgName} (venció ${t.dueDate})`)),
    ) +
    section(
      "Por vencer (7 días)",
      "#d97706",
      dueSoon.map((t) => item(`<b>${t.title}</b> — ${t.orgName} (vence ${t.dueDate})`)),
    ) +
    section(
      "Falta gestor de inclusión (Ley 21.275)",
      "#dc2626",
      needsGestor.map((g) =>
        item(`<b>${g.orgName}</b> — ${g.employees} trabajadores`),
      ),
    ) +
    section(
      "Toca (re)evaluar",
      "#334155",
      needsReview.map((r) =>
        item(
          `<b>${r.orgName}</b> — ${r.lastDate ? `última hace ${r.days} días` : "sin evaluar aún"}`,
        ),
      ),
    );

  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#0f172a">
    <p style="font-weight:bold;color:#6366f1;letter-spacing:1px">INCLUYE</p>
    <h2>Tus recordatorios de inclusión</h2>
    ${body || "<p>No tienes recordatorios pendientes. ¡Buen trabajo!</p>"}
    <p style="margin-top:24px;font-size:12px;color:#94a3b8">Enviado por Incluye · Portal de accesibilidad para empresas.</p>
  </div>`;
}

export async function sendMyReminders(): Promise<{
  ok: boolean;
  message: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { ok: false, message: "No hay sesión válida." };

  const { data: memberships } = await supabase
    .from("members")
    .select("role, organizations(id, name, employees)")
    .returns<OrgRow[]>();
  const orgs = (memberships ?? [])
    .map((m) => m.organizations)
    .filter(
      (o): o is { id: string; name: string; employees: number | null } => !!o,
    );

  const { data: assessments } = await supabase
    .from("assessments")
    .select("organization_id, created_at")
    .in(
      "organization_id",
      orgs.map((o) => o.id),
    )
    .order("created_at", { ascending: false });

  const latestDate = new Map<string, string | undefined>();
  for (const a of assessments ?? []) {
    if (!latestDate.has(a.organization_id)) {
      latestDate.set(a.organization_id, a.created_at);
    }
  }

  const reminders = await getReminders(supabase, orgs, latestDate);

  // En modo prueba de Resend solo se puede enviar a tu propio correo. Si está
  // seteado RESEND_TEST_TO, se usa como destino (útil hasta verificar dominio).
  const to = process.env.RESEND_TEST_TO || user.email;

  const result = await sendEmail({
    to,
    subject: `Incluye — ${reminders.total} recordatorio${reminders.total === 1 ? "" : "s"}`,
    html: buildHtml(reminders),
  });

  return result.ok
    ? { ok: true, message: `Enviado a ${to}.` }
    : { ok: false, message: result.error ?? "No se pudo enviar." };
}
