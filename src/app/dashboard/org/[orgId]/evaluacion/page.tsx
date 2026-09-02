import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCatalog } from "@/lib/assessment/get-catalog";
import Questionnaire from "./questionnaire";
import type { Answers } from "@/lib/assessment/scoring";

export default async function EvaluacionPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const supabase = await createClient();

  // RLS asegura que solo devuelva la org si el usuario es miembro.
  const { data: org } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("id", orgId)
    .single();

  if (!org) notFound();

  const catalog = await getCatalog();

  // Última evaluación (si existe) para prellenar respuestas.
  const { data: last } = await supabase
    .from("assessments")
    .select("id, created_at, score")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let initialAnswers: Answers = {};
  if (last) {
    const { data: rows } = await supabase
      .from("answers")
      .select("question_key, value")
      .eq("assessment_id", last.id);
    initialAnswers = Object.fromEntries(
      (rows ?? []).map((r) => [r.question_key, r.value]),
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Volver al panel
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Autoevaluación</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {org.name}
          {last?.created_at && (
            <>
              {" · "}última:{" "}
              {new Date(last.created_at).toLocaleDateString("es-CL")} (
              {last.score ?? "—"}%)
            </>
          )}
        </p>
      </div>

      <Questionnaire
        orgId={orgId}
        initialAnswers={initialAnswers}
        areas={catalog}
      />
    </div>
  );
}
