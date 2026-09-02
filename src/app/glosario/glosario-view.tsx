"use client";

import { useMemo, useState } from "react";
import type { Rubro } from "@/lib/reference/glosario-lsch";

export default function GlosarioView({ rubros }: { rubros: Rubro[] }) {
  const [query, setQuery] = useState("");
  const [rubroKey, setRubroKey] = useState<string>("todos");

  const q = query.trim().toLowerCase();

  const rubrosFiltrados = useMemo(() => {
    return rubros
      .filter((r) => rubroKey === "todos" || r.key === rubroKey)
      .map((r) => ({
        ...r,
        terminos: r.terminos.filter(
          (t) =>
            !q ||
            t.palabra.toLowerCase().includes(q) ||
            t.contexto.toLowerCase().includes(q),
        ),
      }))
      .filter((r) => r.terminos.length > 0);
  }, [rubros, q, rubroKey]);

  const totalVisibles = rubrosFiltrados.reduce(
    (acc, r) => acc + r.terminos.length,
    0,
  );

  return (
    <div>
      {/* Controles */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          aria-label="Buscar palabra"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar palabra…"
          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 sm:max-w-xs dark:border-slate-700 dark:bg-slate-800"
        />
        <span className="text-sm text-slate-500 sm:ml-auto dark:text-slate-400">
          {totalVisibles} término{totalVisibles === 1 ? "" : "s"}
        </span>
      </div>

      {/* Tabs de rubro */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setRubroKey("todos")}
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            rubroKey === "todos"
              ? "bg-indigo-600 text-white"
              : "border border-slate-300 dark:border-slate-700"
          }`}
        >
          Todos
        </button>
        {rubros.map((r) => (
          <button
            key={r.key}
            onClick={() => setRubroKey(r.key)}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              rubroKey === r.key
                ? "bg-indigo-600 text-white"
                : "border border-slate-300 dark:border-slate-700"
            }`}
          >
            {r.icon} {r.titulo}
          </button>
        ))}
      </div>

      {/* Términos */}
      {rubrosFiltrados.length === 0 ? (
        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No se encontraron términos para “{query}”.
        </p>
      ) : (
        <div className="mt-8 space-y-8">
          {rubrosFiltrados.map((r) => (
            <section key={r.key}>
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <span>{r.icon}</span> {r.titulo}
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {r.terminos.map((t) => (
                  <div
                    key={t.palabra}
                    className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{t.palabra}</h3>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {t.tieneVideo ? "▶ video" : "video próximamente"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {t.contexto}
                    </p>
                    {t.videoUrl ? (
                      <video
                        src={t.videoUrl}
                        controls
                        preload="metadata"
                        className="mt-3 aspect-video w-full rounded-lg bg-black"
                      />
                    ) : (
                      <div className="mt-3 flex h-20 items-center justify-center rounded-lg border border-dashed border-slate-300 text-2xl text-slate-300 dark:border-slate-700">
                        🤟
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
