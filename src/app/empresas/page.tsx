import type { Metadata } from "next";
import PublicNav, { PublicFooter } from "@/components/public-nav";
import {
  EMPRESAS_REFERENTES,
  FUENTE_REIN,
  TOTAL_EMPRESAS,
} from "@/lib/reference/empresas-inclusivas";
import EmpresasGrid from "./empresas-grid";

export const metadata: Metadata = {
  title: "Empresas referentes en inclusión · Incluye",
  description:
    "Empresas chilenas que trabajan activamente en inclusión laboral de personas con discapacidad, según la Red de Empresas Inclusivas (ReIN).",
};

export default function EmpresasPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNav />

      <section className="mx-auto max-w-5xl px-6 pb-16 pt-8">
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          Referentes · {TOTAL_EMPRESAS} empresas
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Empresas referentes en inclusión
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
          Empresas chilenas que trabajan activamente en la inclusión laboral de
          personas con discapacidad, según el directorio de socias de la{" "}
          <a
            href={FUENTE_REIN.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Red de Empresas Inclusivas (ReIN)
          </a>
          .
        </p>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
          <strong>Nota:</strong> ser socia o destacada por ReIN refleja un
          compromiso con la inclusión, pero <strong>no equivale</strong> a una
          certificación legal de cumplimiento de la Ley 21.015. Es un referente,
          no un registro oficial.
        </div>

        <div className="mt-10">
          <EmpresasGrid empresas={EMPRESAS_REFERENTES} />
        </div>

        <p className="mt-10 text-xs text-slate-400">
          Fuente: {FUENTE_REIN.nombre} · {FUENTE_REIN.periodo}. Listado
          referencial, puede estar desactualizado.
        </p>
      </section>

      <PublicFooter />
    </main>
  );
}
