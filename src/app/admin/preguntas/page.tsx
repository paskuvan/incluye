import { createClient } from "@/lib/supabase/server";
import ContentEditor, { type AreaRow, type QuestionRow } from "./content-editor";

export default async function AdminPreguntasPage() {
  const supabase = await createClient();

  const { data: areas } = await supabase
    .from("assessment_areas")
    .select("id, key, title, icon, description, sort_order, active")
    .order("sort_order", { ascending: true });

  const { data: questions } = await supabase
    .from("assessment_questions")
    .select("id, area_id, key, text, recommendation, sort_order, active")
    .order("sort_order", { ascending: true });

  const tree: AreaRow[] = (areas ?? []).map((a) => ({
    ...a,
    questions: (questions as QuestionRow[] | null ?? []).filter(
      (q) => q.area_id === a.id,
    ),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Preguntas de la evaluación</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Los cambios se reflejan en el autodiagnóstico de inmediato.
        </p>
      </div>

      {tree.length === 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
          No hay áreas cargadas en la base todavía. Aplica la migración{" "}
          <code>0005_content_admin.sql</code> (incluye la semilla) o crea la
          primera área abajo.
          <div className="mt-4">
            <ContentEditor tree={tree} />
          </div>
        </div>
      ) : (
        <ContentEditor tree={tree} />
      )}
    </div>
  );
}
