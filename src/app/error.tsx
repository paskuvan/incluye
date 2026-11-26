"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import PublicNav, { PublicFooter } from "@/components/public-nav";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Deja traza del error en la consola del servidor/cliente para diagnóstico.
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNav />

      <section className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/40">
          <ExclamationTriangleIcon
            className="h-8 w-8 text-amber-500"
            aria-hidden="true"
          />
        </div>
        <h1 className="mt-6 text-3xl font-bold">Algo salió mal</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Tuvimos un problema al cargar esta página. Puedes intentar de nuevo o
          volver al inicio.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-slate-400">
            Código de referencia: <span className="font-mono">{error.digest}</span>
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium hover:border-indigo-400 dark:border-slate-700"
          >
            Volver al inicio
          </Link>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
