"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type ResourceRow = {
  id: string;
  category_id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  source: string;
  external: boolean;
  sort_order: number;
  active: boolean;
};
export type CatRow = {
  id: string;
  key: string;
  title: string;
  icon: string;
  sort_order: number;
  active: boolean;
  resources: ResourceRow[];
};

const TIPOS = ["Ley", "Guía", "Artículo", "Herramienta"];
const rid = () => Math.random().toString(36).slice(2, 8);

export default function RecursosEditor({ tree }: { tree: CatRow[] }) {
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

  const addCat = () =>
    run(
      supabase.from("resource_categories").insert({
        key: `cat-${rid()}`,
        title: "Nueva categoría",
        icon: "📁",
        sort_order: tree.length,
      }),
      "Categoría creada",
    );
  const saveCat = (c: CatRow) =>
    run(
      supabase
        .from("resource_categories")
        .update({ title: c.title, icon: c.icon, active: c.active })
        .eq("id", c.id),
      "Categoría guardada",
    );
  const delCat = (id: string) =>
    run(
      supabase.from("resource_categories").delete().eq("id", id),
      "Categoría eliminada",
    );

  const addRes = (c: CatRow) =>
    run(
      supabase.from("resources").insert({
        category_id: c.id,
        title: "Nuevo recurso",
        type: "Guía",
        url: "",
        external: true,
        sort_order: c.resources.length,
      }),
      "Recurso creado",
    );
  const saveRes = (r: ResourceRow) =>
    run(
      supabase
        .from("resources")
        .update({
          title: r.title,
          description: r.description,
          type: r.type,
          url: r.url,
          source: r.source,
          external: r.external,
          active: r.active,
        })
        .eq("id", r.id),
      "Recurso guardado",
    );
  const delRes = (id: string) =>
    run(supabase.from("resources").delete().eq("id", id), "Recurso eliminado");

  return (
    <div className="space-y-5">
      {(msg || err) && (
        <div
          className={`sticky top-2 z-10 rounded-lg px-4 py-2 text-sm ${err ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
        >
          {err ?? msg}
        </div>
      )}

      {tree.map((c) => (
        <CatCard
          key={c.id}
          cat={c}
          onSave={saveCat}
          onDelete={delCat}
          onAddRes={addRes}
          onSaveRes={saveRes}
          onDeleteRes={delRes}
        />
      ))}

      <button
        onClick={addCat}
        className="w-full rounded-2xl border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700"
      >
        + Agregar categoría
      </button>
    </div>
  );
}

function CatCard({
  cat,
  onSave,
  onDelete,
  onAddRes,
  onSaveRes,
  onDeleteRes,
}: {
  cat: CatRow;
  onSave: (c: CatRow) => void;
  onDelete: (id: string) => void;
  onAddRes: (c: CatRow) => void;
  onSaveRes: (r: ResourceRow) => void;
  onDeleteRes: (id: string) => void;
}) {
  const [c, setC] = useState(cat);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={c.icon}
          onChange={(e) => setC({ ...c, icon: e.target.value })}
          className="w-14 rounded-lg border border-slate-300 px-2 py-1.5 text-center text-sm dark:border-slate-700 dark:bg-slate-800"
        />
        <input
          value={c.title}
          onChange={(e) => setC({ ...c, title: e.target.value })}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800"
        />
        <label className="flex items-center gap-1 text-xs text-slate-500">
          <input
            type="checkbox"
            checked={c.active}
            onChange={(e) => setC({ ...c, active: e.target.checked })}
            className="accent-indigo-600"
          />
          Activa
        </label>
        <button
          onClick={() => onSave(c)}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
        >
          Guardar
        </button>
        <button
          onClick={() => onDelete(c.id)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-red-600 hover:border-red-300 dark:border-slate-700"
        >
          Eliminar
        </button>
      </div>

      <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        {cat.resources.map((r) => (
          <ResCard
            key={r.id}
            resource={r}
            onSave={onSaveRes}
            onDelete={onDeleteRes}
          />
        ))}
      </div>
      <button
        onClick={() => onAddRes(cat)}
        className="mt-3 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
      >
        + Agregar recurso
      </button>
    </div>
  );
}

function ResCard({
  resource,
  onSave,
  onDelete,
}: {
  resource: ResourceRow;
  onSave: (r: ResourceRow) => void;
  onDelete: (id: string) => void;
}) {
  const [r, setR] = useState(resource);
  const field =
    "w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800";

  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <div className="flex gap-2">
        <input
          value={r.title}
          onChange={(e) => setR({ ...r, title: e.target.value })}
          className={`${field} font-medium`}
          placeholder="Título"
        />
        <select
          value={r.type}
          onChange={(e) => setR({ ...r, type: e.target.value })}
          className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
        >
          {TIPOS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <input
        value={r.description}
        onChange={(e) => setR({ ...r, description: e.target.value })}
        className={`${field} mt-2`}
        placeholder="Descripción"
      />
      <div className="mt-2 flex gap-2">
        <input
          value={r.url}
          onChange={(e) => setR({ ...r, url: e.target.value })}
          className={field}
          placeholder="URL (https://… o /ruta interna)"
        />
        <input
          value={r.source}
          onChange={(e) => setR({ ...r, source: e.target.value })}
          className="w-40 rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
          placeholder="Fuente"
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-1 text-xs text-slate-500">
          <input
            type="checkbox"
            checked={r.external}
            onChange={(e) => setR({ ...r, external: e.target.checked })}
            className="accent-indigo-600"
          />
          Externo
        </label>
        <label className="flex items-center gap-1 text-xs text-slate-500">
          <input
            type="checkbox"
            checked={r.active}
            onChange={(e) => setR({ ...r, active: e.target.checked })}
            className="accent-indigo-600"
          />
          Activo
        </label>
        <button
          onClick={() => onSave(r)}
          className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-500"
        >
          Guardar
        </button>
        <button
          onClick={() => onDelete(r.id)}
          className="ml-auto rounded-lg border border-slate-300 px-3 py-1 text-xs text-red-600 hover:border-red-300 dark:border-slate-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
