import { createClient } from "@/lib/supabase/server";
import Moderation, { type ExpRow } from "./moderation";

export default async function AdminExperienciasPage() {
  const supabase = await createClient();

  // Pendientes primero, luego el resto.
  const { data } = await supabase
    .from("experiences")
    .select(
      "id, company_name, role, rating, had_interpreter, process_accessible, offer_real, comment, contact_email, status, created_at",
    )
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });

  const rows = (data as ExpRow[] | null) ?? [];
  const pendientes = rows.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Experiencias</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Modera las experiencias enviadas. {pendientes} pendiente
          {pendientes === 1 ? "" : "s"} de revisar.
        </p>
      </div>

      <Moderation rows={rows} />
    </div>
  );
}
