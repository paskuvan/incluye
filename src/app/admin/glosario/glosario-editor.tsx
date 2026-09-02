"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type TermRow = {
  id: string;
  rubro_id: string;
  palabra: string;
  contexto: string;
  video_url: string | null;
  sort_order: number;
  active: boolean;
};
export type RubroRow = {
  id: string;
  key: string;
  title: string;
  icon: string;
  description: string;
  sort_order: number;
  active: boolean;
  terms: TermRow[];
};

const rid = () => Math.random().toString(36).slice(2, 8);
const BUCKET = "lsch-videos";

export default function GlosarioEditor({ tree }: { tree: RubroRow[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function flash(setter: (v: string | null) => void, text: string) {
    setter(text);
    setTimeout(() => setter(null), 3000);
  }
  async function run(p: PromiseLike<{ error: unknown }>, ok: string) {
    const { error } = await p;
    if (error) flash(setErr, (error as { message?: string }).message ?? "Error");
    else {
      flash(setMsg, ok);
      router.refresh();
    }
  }

  const addRubro = () =>
    run(
      supabase.from("lsch_rubros").insert({
        key: `rubro-${rid()}`,
        title: "Nuevo rubro",
        icon: "📌",
        sort_order: tree.length,
      }),
      "Rubro creado",
    );
  const saveRubro = (r: RubroRow) =>
    run(
      supabase
        .from("lsch_rubros")
        .update({
          title: r.title,
          icon: r.icon,
          description: r.description,
          active: r.active,
        })
        .eq("id", r.id),
      "Rubro guardado",
    );
  const delRubro = (id: string) =>
    run(supabase.from("lsch_rubros").delete().eq("id", id), "Rubro eliminado");

  const addTerm = (r: RubroRow) =>
    run(
      supabase.from("lsch_terms").insert({
        rubro_id: r.id,
        palabra: "Nueva palabra",
        contexto: "",
        sort_order: r.terms.length,
      }),
      "Término creado",
    );
  const saveTerm = (t: TermRow) =>
    run(
      supabase
        .from("lsch_terms")
        .update({
          palabra: t.palabra,
          contexto: t.contexto,
          active: t.active,
        })
        .eq("id", t.id),
      "Término guardado",
    );
  const delTerm = (id: string) =>
    run(supabase.from("lsch_terms").delete().eq("id", id), "Término eliminado");

  async function uploadVideo(term: TermRow, file: File) {
    setErr(null);
    const ext = file.name.split(".").pop() || "mp4";
    const path = `${term.id}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) {
      flash(setErr, upErr.message);
      return;
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    await run(
      supabase
        .from("lsch_terms")
        .update({ video_url: data.publicUrl })
        .eq("id", term.id),
      "Video subido",
    );
  }
  const removeVideo = (t: TermRow) =>
    run(
      supabase.from("lsch_terms").update({ video_url: null }).eq("id", t.id),
      "Video quitado",
    );

  return (
    <div className="space-y-5">
      {(msg || err) && (
        <div
          className={`sticky top-2 z-10 rounded-lg px-4 py-2 text-sm ${err ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
        >
          {err ?? msg}
        </div>
      )}

      {tree.map((r) => (
        <RubroCard
          key={r.id}
          rubro={r}
          onSave={saveRubro}
          onDelete={delRubro}
          onAddTerm={addTerm}
          onSaveTerm={saveTerm}
          onDeleteTerm={delTerm}
          onUpload={uploadVideo}
          onRemoveVideo={removeVideo}
        />
      ))}

      <button
        onClick={addRubro}
        className="w-full rounded-2xl border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700"
      >
        + Agregar rubro
      </button>
    </div>
  );
}

function RubroCard({
  rubro,
  onSave,
  onDelete,
  onAddTerm,
  onSaveTerm,
  onDeleteTerm,
  onUpload,
  onRemoveVideo,
}: {
  rubro: RubroRow;
  onSave: (r: RubroRow) => void;
  onDelete: (id: string) => void;
  onAddTerm: (r: RubroRow) => void;
  onSaveTerm: (t: TermRow) => void;
  onDeleteTerm: (id: string) => void;
  onUpload: (t: TermRow, f: File) => void;
  onRemoveVideo: (t: TermRow) => void;
}) {
  const [r, setR] = useState(rubro);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={r.icon}
          onChange={(e) => setR({ ...r, icon: e.target.value })}
          className="w-14 rounded-lg border border-slate-300 px-2 py-1.5 text-center text-sm dark:border-slate-700 dark:bg-slate-800"
        />
        <input
          value={r.title}
          onChange={(e) => setR({ ...r, title: e.target.value })}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800"
        />
        <label className="flex items-center gap-1 text-xs text-slate-500">
          <input
            type="checkbox"
            checked={r.active}
            onChange={(e) => setR({ ...r, active: e.target.checked })}
            className="accent-indigo-600"
          />
          Activo
        </label>
      </div>
      <input
        value={r.description}
        onChange={(e) => setR({ ...r, description: e.target.value })}
        placeholder="Descripción del rubro"
        className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
      />
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => onSave(r)}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
        >
          Guardar rubro
        </button>
        <button
          onClick={() => onDelete(r.id)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-red-600 hover:border-red-300 dark:border-slate-700"
        >
          Eliminar rubro
        </button>
      </div>

      <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2 dark:border-slate-800">
        {rubro.terms.map((t) => (
          <TermCard
            key={t.id}
            term={t}
            onSave={onSaveTerm}
            onDelete={onDeleteTerm}
            onUpload={onUpload}
            onRemoveVideo={onRemoveVideo}
          />
        ))}
      </div>
      <button
        onClick={() => onAddTerm(rubro)}
        className="mt-3 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
      >
        + Agregar término
      </button>
    </div>
  );
}

function TermCard({
  term,
  onSave,
  onDelete,
  onUpload,
  onRemoveVideo,
}: {
  term: TermRow;
  onSave: (t: TermRow) => void;
  onDelete: (id: string) => void;
  onUpload: (t: TermRow, f: File) => void;
  onRemoveVideo: (t: TermRow) => void;
}) {
  const [t, setT] = useState(term);
  const [uploading, setUploading] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <input
        value={t.palabra}
        onChange={(e) => setT({ ...t, palabra: e.target.value })}
        className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium dark:border-slate-700 dark:bg-slate-800"
        placeholder="Palabra"
      />
      <input
        value={t.contexto}
        onChange={(e) => setT({ ...t, contexto: e.target.value })}
        className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
        placeholder="Contexto de uso"
      />

      {term.video_url ? (
        <video
          src={term.video_url}
          controls
          preload="metadata"
          className="mt-2 aspect-video w-full rounded-lg bg-black"
        />
      ) : (
        <p className="mt-2 text-xs text-slate-400">Sin video</p>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <label className="cursor-pointer rounded-lg border border-slate-300 px-2 py-1 text-xs hover:border-indigo-400 dark:border-slate-700">
          {uploading ? "Subiendo…" : term.video_url ? "Reemplazar video" : "Subir video"}
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setUploading(true);
              await onUpload(term, f);
              setUploading(false);
            }}
          />
        </label>
        {term.video_url && (
          <button
            onClick={() => onRemoveVideo(term)}
            className="rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-700"
          >
            Quitar video
          </button>
        )}
        <button
          onClick={() => onSave(t)}
          className="rounded-lg bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-500"
        >
          Guardar
        </button>
        <button
          onClick={() => onDelete(t.id)}
          className="ml-auto rounded-lg border border-slate-300 px-2 py-1 text-xs text-red-600 hover:border-red-300 dark:border-slate-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
