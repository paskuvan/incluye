"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type QuestionRow = {
  id: string;
  area_id: string;
  key: string;
  text: string;
  recommendation: string;
  sort_order: number;
  active: boolean;
};
export type AreaRow = {
  id: string;
  key: string;
  title: string;
  icon: string;
  description: string;
  sort_order: number;
  active: boolean;
  questions: QuestionRow[];
};

const rid = () => Math.random().toString(36).slice(2, 8);

export default function ContentEditor({ tree }: { tree: AreaRow[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function flash(setter: (v: string | null) => void, text: string) {
    setter(text);
    setTimeout(() => setter(null), 2500);
  }

  async function run(promise: PromiseLike<{ error: unknown }>, okText: string) {
    const { error } = await promise;
    if (error) {
      flash(setErr, (error as { message?: string }).message ?? "Error");
    } else {
      flash(setMsg, okText);
      router.refresh();
    }
  }

  // Áreas
  const saveArea = (a: AreaRow) =>
    run(
      supabase
        .from("assessment_areas")
        .update({
          title: a.title,
          icon: a.icon,
          description: a.description,
          active: a.active,
        })
        .eq("id", a.id),
      "Área guardada",
    );
  const addArea = () =>
    run(
      supabase.from("assessment_areas").insert({
        key: `area-${rid()}`,
        title: "Nueva área",
        icon: "📌",
        description: "",
        sort_order: tree.length,
      }),
      "Área creada",
    );
  const deleteArea = (id: string) =>
    run(supabase.from("assessment_areas").delete().eq("id", id), "Área eliminada");

  // Preguntas
  const saveQuestion = (q: QuestionRow) =>
    run(
      supabase
        .from("assessment_questions")
        .update({
          text: q.text,
          recommendation: q.recommendation,
          active: q.active,
        })
        .eq("id", q.id),
      "Pregunta guardada",
    );
  const addQuestion = (area: AreaRow) =>
    run(
      supabase.from("assessment_questions").insert({
        area_id: area.id,
        key: `${area.key}.${rid()}`,
        text: "Nueva pregunta",
        recommendation: "",
        sort_order: area.questions.length,
      }),
      "Pregunta creada",
    );
  const deleteQuestion = (id: string) =>
    run(
      supabase.from("assessment_questions").delete().eq("id", id),
      "Pregunta eliminada",
    );

  return (
    <div className="space-y-5">
      {(msg || err) && (
        <div
          className={`sticky top-2 z-10 rounded-lg px-4 py-2 text-sm ${
            err
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {err ?? msg}
        </div>
      )}

      {tree.map((area) => (
        <AreaCard
          key={area.id}
          area={area}
          onSave={saveArea}
          onDelete={deleteArea}
          onSaveQuestion={saveQuestion}
          onAddQuestion={addQuestion}
          onDeleteQuestion={deleteQuestion}
        />
      ))}

      <button
        onClick={addArea}
        className="w-full rounded-2xl border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700"
      >
        + Agregar área
      </button>
    </div>
  );
}

function AreaCard({
  area,
  onSave,
  onDelete,
  onSaveQuestion,
  onAddQuestion,
  onDeleteQuestion,
}: {
  area: AreaRow;
  onSave: (a: AreaRow) => void;
  onDelete: (id: string) => void;
  onSaveQuestion: (q: QuestionRow) => void;
  onAddQuestion: (a: AreaRow) => void;
  onDeleteQuestion: (id: string) => void;
}) {
  const [a, setA] = useState(area);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={a.icon}
          onChange={(e) => setA({ ...a, icon: e.target.value })}
          className="w-14 rounded-lg border border-slate-300 px-2 py-1.5 text-center text-sm dark:border-slate-700 dark:bg-slate-800"
        />
        <input
          value={a.title}
          onChange={(e) => setA({ ...a, title: e.target.value })}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800"
        />
        <label className="flex items-center gap-1 text-xs text-slate-500">
          <input
            type="checkbox"
            checked={a.active}
            onChange={(e) => setA({ ...a, active: e.target.checked })}
            className="accent-indigo-600"
          />
          Activa
        </label>
      </div>
      <input
        value={a.description}
        onChange={(e) => setA({ ...a, description: e.target.value })}
        placeholder="Descripción del área"
        className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
      />
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => onSave(a)}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
        >
          Guardar área
        </button>
        <button
          onClick={() => onDelete(a.id)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-red-600 hover:border-red-300 dark:border-slate-700"
        >
          Eliminar área
        </button>
        <span className="ml-auto self-center text-[11px] text-slate-400">
          {a.key}
        </span>
      </div>

      {/* Preguntas */}
      <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        {area.questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            onSave={onSaveQuestion}
            onDelete={onDeleteQuestion}
          />
        ))}
        <button
          onClick={() => onAddQuestion(area)}
          className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          + Agregar pregunta
        </button>
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  onSave,
  onDelete,
}: {
  question: QuestionRow;
  onSave: (q: QuestionRow) => void;
  onDelete: (id: string) => void;
}) {
  const [q, setQ] = useState(question);

  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <textarea
        value={q.text}
        onChange={(e) => setQ({ ...q, text: e.target.value })}
        rows={2}
        className="w-full resize-y rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
        placeholder="Pregunta"
      />
      <textarea
        value={q.recommendation}
        onChange={(e) => setQ({ ...q, recommendation: e.target.value })}
        rows={2}
        className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        placeholder="Recomendación (cuando la respuesta no es Sí)"
      />
      <div className="mt-2 flex items-center gap-2">
        <label className="flex items-center gap-1 text-xs text-slate-500">
          <input
            type="checkbox"
            checked={q.active}
            onChange={(e) => setQ({ ...q, active: e.target.checked })}
            className="accent-indigo-600"
          />
          Activa
        </label>
        <button
          onClick={() => onSave(q)}
          className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-500"
        >
          Guardar
        </button>
        <button
          onClick={() => onDelete(q.id)}
          className="rounded-lg border border-slate-300 px-3 py-1 text-xs text-red-600 hover:border-red-300 dark:border-slate-700"
        >
          Eliminar
        </button>
        <span className="ml-auto text-[11px] text-slate-400">{q.key}</span>
      </div>
    </div>
  );
}
