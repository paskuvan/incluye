"use client";

import { useMemo, useState } from "react";
import type { EmpresaReferente } from "@/lib/reference/empresas-inclusivas";

export default function EmpresasGrid({
  empresas,
}: {
  empresas: EmpresaReferente[];
}) {
  const [query, setQuery] = useState("");
  const [soloDestacadas, setSoloDestacadas] = useState(false);

  const filtradas = useMemo(() => {
    const q = query.trim().toLowerCase();
    return empresas.filter((e) => {
      if (soloDestacadas && !e.destacada) return false;
      if (q && !e.nombre.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [empresas, query, soloDestacadas]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          aria-label="Buscar empresa"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar empresa…"
          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 sm:max-w-xs dark:border-slate-700 dark:bg-slate-800"
        />
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <input
            type="checkbox"
            checked={soloDestacadas}
            onChange={(e) => setSoloDestacadas(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
          />
          Solo destacadas 2025
        </label>
        <span className="text-sm text-slate-500 sm:ml-auto dark:text-slate-400">
          {filtradas.length} empresa{filtradas.length === 1 ? "" : "s"}
        </span>
      </div>

      {filtradas.length === 0 ? (
        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No se encontraron empresas para “{query}”.
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtradas.map((e) => (
            <li
              key={e.nombre}
              className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="font-medium">{e.nombre}</span>
              {e.destacada && (
                <span
                  title="Reconocida por gestión destacada de inclusión (ReIN 2025)"
                  className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                >
                  ★ Destacada
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
