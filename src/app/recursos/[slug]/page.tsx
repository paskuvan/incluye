import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PublicNav, { PublicFooter } from "@/components/public-nav";
import { GUIAS } from "@/lib/reference/guias";

export function generateStaticParams() {
  return Object.keys(GUIAS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guia = GUIAS[slug];
  return {
    title: guia ? `${guia.titulo} · Incluye` : "Recurso · Incluye",
    description: guia?.resumen,
  };
}

export default async function GuiaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guia = GUIAS[slug];
  if (!guia) notFound();

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNav />

      <article className="mx-auto max-w-2xl px-6 pb-16 pt-8">
        <Link
          href="/recursos"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Volver a recursos
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">{guia.titulo}</h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
          {guia.resumen}
        </p>

        <div className="mt-8 space-y-8">
          {guia.secciones.map((sec) => (
            <section key={sec.titulo}>
              <h2 className="text-lg font-semibold">{sec.titulo}</h2>
              <ul className="mt-3 space-y-2">
                {sec.puntos.map((p, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <span className="mt-0.5 text-indigo-500">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </article>

      <PublicFooter />
    </main>
  );
}
