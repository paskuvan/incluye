import Link from "next/link";
import type { Metadata } from "next";
import PublicNav, { PublicFooter } from "@/components/public-nav";
import { getRecursos } from "@/lib/reference/get-recursos";

export const metadata: Metadata = {
  title: "Recursos de inclusión · Incluye",
  description:
    "Biblioteca de guías y recursos para la inclusión laboral y la accesibilidad en tu empresa.",
};

const tipoColor: Record<string, string> = {
  Ley: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  Guía: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
  Artículo: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  Herramienta:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
};

export default async function RecursosPage() {
  const recursos = await getRecursos();
  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNav />

      <section className="mx-auto max-w-5xl px-6 pb-16 pt-8">
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          Biblioteca
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Recursos de inclusión
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
          Guías, marco legal y herramientas para avanzar en accesibilidad e
          inclusión laboral en tu empresa.
        </p>

        <div className="mt-10 space-y-10">
          {recursos.map((cat) => (
            <div key={cat.key}>
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <span>{cat.icon}</span> {cat.titulo}
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {cat.recursos.map((r) => {
                  const card = (
                    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-center justify-between">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tipoColor[r.tipo]}`}
                        >
                          {r.tipo}
                        </span>
                        {r.externo && (
                          <span className="text-xs text-slate-400">↗ externo</span>
                        )}
                      </div>
                      <h3 className="mt-3 font-semibold">{r.titulo}</h3>
                      <p className="mt-1 flex-1 text-sm text-slate-600 dark:text-slate-400">
                        {r.descripcion}
                      </p>
                      <p className="mt-3 text-xs text-slate-400">{r.fuente}</p>
                    </div>
                  );
                  return r.externo ? (
                    <a
                      key={r.titulo}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {card}
                    </a>
                  ) : (
                    <Link key={r.titulo} href={r.url}>
                      {card}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
