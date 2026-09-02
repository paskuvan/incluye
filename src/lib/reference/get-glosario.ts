import "server-only";
import { createClient } from "@/lib/supabase/server";
import { RUBROS as SEED, type Rubro } from "./glosario-lsch";

// Trae el glosario desde la base (rubros + términos activos). Si la base está
// vacía o falla, cae al glosario semilla del código.
export async function getGlosario(): Promise<Rubro[]> {
  const supabase = await createClient();

  const { data: rubros } = await supabase
    .from("lsch_rubros")
    .select("id, key, title, icon, description, sort_order")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (!rubros || rubros.length === 0) return SEED;

  const { data: terms } = await supabase
    .from("lsch_terms")
    .select("rubro_id, palabra, contexto, video_url, sort_order")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  return rubros.map((r) => ({
    key: r.key,
    titulo: r.title,
    icon: r.icon,
    descripcion: r.description,
    terminos: (terms ?? [])
      .filter((t) => t.rubro_id === r.id)
      .map((t) => ({
        palabra: t.palabra,
        contexto: t.contexto,
        videoUrl: t.video_url ?? undefined,
        tieneVideo: !!t.video_url,
      })),
  }));
}
