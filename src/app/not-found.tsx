import Link from "next/link";
import type { Metadata } from "next";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import PublicNav, { PublicFooter } from "@/components/public-nav";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNav />

      <section className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50">
          <MagnifyingGlassIcon
            className="h-8 w-8 text-indigo-500"
            aria-hidden="true"
          />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-indigo-500">
          Error 404
        </p>
        <h1 className="mt-2 text-3xl font-bold">No encontramos esta página</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          El enlace puede estar roto o la página fue movida. Revisa la dirección
          o vuelve al inicio.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Volver al inicio
          </Link>
          <Link
            href="/empleos"
            className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium hover:border-indigo-400 dark:border-slate-700"
          >
            Ver empleos inclusivos
          </Link>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
