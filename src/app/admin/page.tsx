import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Administración</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Gestiona el contenido de la plataforma sin necesidad de un deploy.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/preguntas"
          className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="text-2xl">📋</div>
          <h2 className="mt-3 font-semibold">Preguntas de la evaluación</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Edita áreas, preguntas y recomendaciones del autodiagnóstico.
          </p>
        </Link>

        <Link
          href="/admin/glosario"
          className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="text-2xl">🤟</div>
          <h2 className="mt-3 font-semibold">Glosario LSCh</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Edita rubros y términos, y sube el video de cada seña.
          </p>
        </Link>

        <Link
          href="/admin/empleos"
          className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="text-2xl">💼</div>
          <h2 className="mt-3 font-semibold">Empleos externos</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Cura vacantes inclusivas de otras empresas para la bolsa pública.
          </p>
        </Link>

        <Link
          href="/admin/recursos"
          className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="text-2xl">📚</div>
          <h2 className="mt-3 font-semibold">Biblioteca de recursos</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Edita categorías, guías y enlaces de la sección de recursos.
          </p>
        </Link>
      </div>
    </div>
  );
}
