import type { Metadata } from "next";
import PublicNav, { PublicFooter } from "@/components/public-nav";

export const metadata: Metadata = {
  title: "Gestores de inclusión laboral",
  description:
    "Qué es un gestor(a) de inclusión laboral, qué exige la ley y cómo verificar su certificación en el registro oficial de ChileValora.",
};

const REGISTRO_URL =
  "https://certificacion.chilevalora.cl/ChileValora-publica/candidatosList.html";
const PERFIL_URL =
  "https://certificacion.chilevalora.cl/ChileValora-publica/home.html";

export default function GestoresPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNav />

      <section className="mx-auto max-w-3xl px-6 pb-16 pt-8">
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          Ley 21.275 · ChileValora
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Gestores de inclusión laboral
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          El gestor(a) de inclusión laboral lidera el proceso de inclusión de
          personas con discapacidad dentro de la organización. La{" "}
          <b>Ley 21.275</b> exige a las empresas de <b>100 o más trabajadores</b>{" "}
          contar con al menos un gestor(a) certificado(a) por{" "}
          <b>ChileValora</b>.
        </p>

        {/* Stat */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-2xl font-bold text-indigo-600">4.540+</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              gestores/as certificados/as por ChileValora
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-2xl font-bold text-indigo-600">75%</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              son mujeres
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-2xl font-bold text-indigo-600">100+</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              trabajadores: obligación de tener uno
            </p>
          </div>
        </div>

        {/* Registro oficial */}
        <div className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-900 dark:bg-indigo-950/40">
          <h2 className="font-semibold text-indigo-900 dark:text-indigo-200">
            Buscar o verificar un gestor certificado
          </h2>
          <p className="mt-2 text-sm text-indigo-900/80 dark:text-indigo-200/80">
            El listado de personas certificadas es público y lo mantiene
            ChileValora. Puedes buscar por nombre o RUN en su registro oficial
            para verificar la certificación de un gestor(a).
          </p>
          <a
            href={REGISTRO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Ir al registro de ChileValora ↗
          </a>
        </div>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
          <strong>Nota:</strong> por privacidad, Incluye no reproduce la lista de
          gestores. La búsqueda se hace en el registro oficial de ChileValora,
          que es la fuente válida para verificar una certificación.
        </div>

        {/* Cómo certificarse */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold">¿Cómo se certifica un gestor?</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li className="flex gap-2">
              <span className="text-indigo-500">•</span>A través de un centro de
              evaluación y certificación habilitado por ChileValora.
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500">•</span>Se evalúa el perfil
              ocupacional “Gestor(a) de Inclusión Laboral”.
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500">•</span>La certificación queda
              registrada en el registro público de ChileValora.
            </li>
          </ul>
          <a
            href={PERFIL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Ver los registros públicos de ChileValora ↗
          </a>
        </div>

        <p className="mt-10 text-xs text-slate-400">
          Fuentes: ChileValora (Registro Público de Personas Certificadas) y
          SENADIS. Cifras de referencia; verificar la actualización en las
          fuentes oficiales.
        </p>
      </section>

      <PublicFooter />
    </main>
  );
}
