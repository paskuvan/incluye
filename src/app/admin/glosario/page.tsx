import { createClient } from "@/lib/supabase/server";
import GlosarioEditor, { type RubroRow, type TermRow } from "./glosario-editor";

export default async function AdminGlosarioPage() {
  const supabase = await createClient();

  const { data: rubros } = await supabase
    .from("lsch_rubros")
    .select("id, key, title, icon, description, sort_order, active")
    .order("sort_order", { ascending: true });

  const { data: terms } = await supabase
    .from("lsch_terms")
    .select("id, rubro_id, palabra, contexto, video_url, sort_order, active")
    .order("sort_order", { ascending: true });

  const tree: RubroRow[] = (rubros ?? []).map((r) => ({
    ...r,
    terms: (terms as TermRow[] | null ?? []).filter((t) => t.rubro_id === r.id),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Glosario LSCh</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Edita rubros, términos y sube el video de cada seña.
        </p>
      </div>

      {tree.length === 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
          No hay rubros en la base todavía. Aplica la migración{" "}
          <code>0006_glosario.sql</code> (incluye la semilla).
          <div className="mt-4">
            <GlosarioEditor tree={tree} />
          </div>
        </div>
      ) : (
        <GlosarioEditor tree={tree} />
      )}
    </div>
  );
}
