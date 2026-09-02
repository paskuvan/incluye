import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  RECURSOS as SEED,
  type CategoriaRecurso,
  type TipoRecurso,
} from "./recursos";

// Trae los recursos desde la base (categorías + recursos activos). Si la base
// está vacía o falla, cae a los recursos semilla del código.
export async function getRecursos(): Promise<CategoriaRecurso[]> {
  const supabase = await createClient();

  const { data: cats } = await supabase
    .from("resource_categories")
    .select("id, key, title, icon, sort_order")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (!cats || cats.length === 0) return SEED;

  const { data: recursos } = await supabase
    .from("resources")
    .select("category_id, title, description, type, url, source, external, sort_order")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  return cats.map((c) => ({
    key: c.key,
    titulo: c.title,
    icon: c.icon,
    recursos: (recursos ?? [])
      .filter((r) => r.category_id === c.id)
      .map((r) => ({
        titulo: r.title,
        descripcion: r.description,
        tipo: r.type as TipoRecurso,
        url: r.url,
        fuente: r.source,
        externo: r.external,
      })),
  }));
}
