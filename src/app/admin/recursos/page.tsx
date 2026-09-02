import { createClient } from "@/lib/supabase/server";
import RecursosEditor, {
  type CatRow,
  type ResourceRow,
} from "./recursos-editor";

export default async function AdminRecursosPage() {
  const supabase = await createClient();

  const { data: cats } = await supabase
    .from("resource_categories")
    .select("id, key, title, icon, sort_order, active")
    .order("sort_order", { ascending: true });

  const { data: resources } = await supabase
    .from("resources")
    .select(
      "id, category_id, title, description, type, url, source, external, sort_order, active",
    )
    .order("sort_order", { ascending: true });

  const tree: CatRow[] = (cats ?? []).map((c) => ({
    ...c,
    resources: (resources as ResourceRow[] | null ?? []).filter(
      (r) => r.category_id === c.id,
    ),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Biblioteca de recursos</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Edita categorías y recursos que se muestran en /recursos.
        </p>
      </div>

      {tree.length === 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
          No hay categorías en la base todavía. Aplica la migración{" "}
          <code>0007_recursos.sql</code> (incluye la semilla).
          <div className="mt-4">
            <RecursosEditor tree={tree} />
          </div>
        </div>
      ) : (
        <RecursosEditor tree={tree} />
      )}
    </div>
  );
}
