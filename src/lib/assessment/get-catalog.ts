import "server-only";
import { createClient } from "@/lib/supabase/server";
import { AREAS as SEED, type Area } from "./catalog";

// Trae el catálogo de la autoevaluación desde la base (áreas + preguntas
// activas). Si la base está vacía o falla, cae al catálogo semilla del código,
// para que la app funcione igual.
export async function getCatalog(): Promise<Area[]> {
  const supabase = await createClient();

  const { data: areas } = await supabase
    .from("assessment_areas")
    .select("id, key, title, icon, description, sort_order")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (!areas || areas.length === 0) return SEED;

  const { data: questions } = await supabase
    .from("assessment_questions")
    .select("area_id, key, text, recommendation, sort_order")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  return areas.map((a) => ({
    key: a.key,
    title: a.title,
    icon: a.icon,
    description: a.description,
    questions: (questions ?? [])
      .filter((q) => q.area_id === a.id)
      .map((q) => ({
        key: q.key,
        text: q.text,
        recommendation: q.recommendation,
      })),
  }));
}
