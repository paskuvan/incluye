import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCatalog } from "@/lib/assessment/get-catalog";
import { computeResult, type Answers } from "@/lib/assessment/scoring";
import PlanBoard, {
  type Task,
  type Member,
  type Suggestion,
} from "./plan-board";

export default async function PlanPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("id", orgId)
    .single();
  if (!org) notFound();

  const { data: tasks } = await supabase
    .from("action_items")
    .select("id, question_key, title, area, status, assigned_to, due_date")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: true });

  const { data: members } = await supabase.rpc("get_org_members", {
    org: orgId,
  });

  // Sugerencias: recomendaciones de la última evaluación que aún no son tareas.
  const existingKeys = new Set(
    (tasks ?? []).map((t) => t.question_key).filter(Boolean),
  );
  let suggestions: Suggestion[] = [];

  const { data: last } = await supabase
    .from("assessments")
    .select("id")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (last) {
    const { data: rows } = await supabase
      .from("answers")
      .select("question_key, value")
      .eq("assessment_id", last.id);
    const answers: Answers = Object.fromEntries(
      (rows ?? []).map((r) => [r.question_key, r.value]),
    );
    const catalog = await getCatalog();
    const result = computeResult(answers, catalog);
    suggestions = result.recommendations
      .filter((r) => !existingKeys.has(r.questionKey))
      .map((r) => ({
        question_key: r.questionKey,
        title: r.text,
        area: r.areaTitle,
      }));
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
        <h1 className="mt-2 text-2xl font-bold">Plan de acción</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {org.name} · seguimiento de acciones de inclusión
        </p>
      </div>

      <PlanBoard
        orgId={orgId}
        currentUserId={user.id}
        tasks={(tasks as Task[]) ?? []}
        members={(members as Member[]) ?? []}
        suggestions={suggestions}
      />
    </div>
  );
}
