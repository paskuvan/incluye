import type { Metadata } from "next";
import PublicNav, { PublicFooter } from "@/components/public-nav";
import { getGlosario } from "@/lib/reference/get-glosario";
import GlosarioView from "./glosario-view";

export const metadata: Metadata = {
  title: "Glosario de Lengua de Señas Chilena",
  description:
    "Señas útiles de Lengua de Señas Chilena (LSCh) por rubro para equipos de atención.",
};

export default async function GlosarioPage() {
  const rubros = await getGlosario();
  const total = rubros.reduce((acc, r) => acc + r.terminos.length, 0);
  const conVideo = rubros.reduce(
    (acc, r) => acc + r.terminos.filter((t) => t.videoUrl).length,
    0,
  );

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNav />

      <section className="mx-auto max-w-5xl px-6 pb-16 pt-8">
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          LSCh · {total} términos
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Glosario de Lengua de Señas Chilena
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
          Vocabulario útil por rubro para que tu equipo de atención se comunique
          mejor con personas sordas.
        </p>

        {conVideo < total && (
          <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200">
            <strong>En construcción:</strong> {conVideo} de {total} señas ya
            tienen video. El resto se irá sumando, y a futuro se integrará el
            motor de reconocimiento de LSCh.
          </div>
        )}

        <div className="mt-10">
          <GlosarioView rubros={rubros} />
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
