"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { OPTIONS, type Area } from "@/lib/assessment/catalog";
import {
  computeResult,
  scoreLevel,
  type Answers,
} from "@/lib/assessment/scoring";
import Results from "./results";

export default function Questionnaire({
  orgId,
  initialAnswers,
  areas,
}: {
  orgId: string;
  initialAnswers: Answers;
  areas: Area[];
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(
    Object.keys(initialAnswers).length > 0,
  );

  const totalQuestions = areas.reduce((acc, a) => acc + a.questions.length, 0);
  const answeredCount = Object.keys(answers).length;
  const result = useMemo(() => computeResult(answers, areas), [answers, areas]);
  const level = scoreLevel(result.overall);

  function setAnswer(key: string, value: number) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: assessment, error: aErr } = await supabase
      .from("assessments")
      .insert({
        organization_id: orgId,
        status: "completed",
        score: result.overall,
        created_by: user.id,
        completed_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (aErr || !assessment) {
      setError(aErr?.message ?? "No se pudo guardar la evaluación.");
      setSaving(false);
      return;
    }

    const rows = Object.entries(answers).map(([question_key, value]) => ({
      assessment_id: assessment.id,
      question_key,
      value,
    }));
    const { error: ansErr } = await supabase.from("answers").insert(rows);

    if (ansErr) {
      setError(ansErr.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setShowResults(true);
    router.refresh();
  }

  if (showResults) {
    return (
      <Results
        result={result}
        orgId={orgId}
        onEdit={() => setShowResults(false)}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Progreso */}
      <div className="sticky top-0 z-10 -mx-6 border-b border-slate-200 bg-slate-50/90 px-6 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            {answeredCount}/{totalQuestions} respondidas
          </span>
          <span className="font-medium">Avance: {result.overall}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {areas.map((area) => (
        <section key={area.key}>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <span>{area.icon}</span> {area.title}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {area.description}
          </p>

          <div className="mt-4 space-y-3">
            {area.questions.map((q) => (
              <div
                key={q.key}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <p className="text-sm font-medium">{q.text}</p>
                <div className="mt-3 flex gap-2">
                  {OPTIONS.map((opt) => {
                    const selected = answers[q.key] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAnswer(q.key, opt.value)}
                        className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors ${
                          selected
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-300 hover:border-indigo-400 dark:border-slate-700"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || answeredCount === 0}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Guardar y ver resultado"}
        </button>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Nivel estimado: {level.label}
        </span>
      </div>
    </div>
  );
}
