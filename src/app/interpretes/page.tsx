import type { Metadata } from "next";
import PublicNav, { PublicFooter } from "@/components/public-nav";

export const metadata: Metadata = {
  title: "Intérpretes de LSCh · Incluye",
  description:
    "Cómo encontrar y verificar intérpretes de Lengua de Señas Chilena certificados en Chile (ChileValora).",
};

const CHILEVALORA_URL =
  "https://certificacion.chilevalora.cl/ChileValora-publica/candidatosList.html";

export default function InterpretesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNav />

      <section className="mx-auto max-w-3xl px-6 pb-16 pt-8">
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          Lengua de Señas Chilena
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Intérpretes de Lengua de Señas Chilena
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          Un intérprete de LSCh es clave para que tu empresa se comunique con
          personas sordas en entrevistas, atención, capacitaciones y reuniones.
          Contratar a alguien <b>acreditado</b> asegura calidad y fidelidad en la
          interpretación.
        </p>

        {/* Fuente verificada */}
        <div className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-900 dark:bg-indigo-950/40">
          <h2 className="font-semibold text-indigo-900 dark:text-indigo-200">
            Verificar en ChileValora
          </h2>
          <p className="mt-2 text-sm text-indigo-900/80 dark:text-indigo-200/80">
            ChileValora certifica el perfil de <b>Intérprete de LSCh</b> como
            competencia laboral. En su registro público puedes buscar por nombre
            o RUN y comprobar si una persona está certificada.
          </p>
          <a
            href={CHILEVALORA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Ir al registro de ChileValora ↗
          </a>
        </div>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
          <strong>Nota:</strong> por privacidad, Incluye no reproduce la lista de
          intérpretes. La verificación se hace en el registro oficial de
          ChileValora, que es la fuente válida para comprobar una certificación.
        </div>

        {/* Cuándo necesitas uno */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold">
            ¿Cuándo conviene un intérprete?
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li className="flex gap-2">
              <span className="text-indigo-500">•</span>Entrevistas de selección
              y procesos de contratación.
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500">•</span>Inducción, capacitaciones
              y reuniones importantes.
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500">•</span>Atención de público en
              momentos clave.
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500">•</span>Puede ser presencial o
              remoto (videointerpretación).
            </li>
          </ul>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Para el día a día, revisa también nuestro{" "}
            <a
              href="/glosario"
              className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              glosario de señas
            </a>
            .
          </p>
        </div>

        <p className="mt-10 text-xs text-slate-400">
          Fuente: ChileValora (registro público de personas certificadas).
        </p>
      </section>

      <PublicFooter />
    </main>
  );
}
