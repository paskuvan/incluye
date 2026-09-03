import Link from "next/link";
import PublicNav, { PublicFooter } from "@/components/public-nav";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const [vacantesRes, senasRes, recursosRes, expRes] = await Promise.all([
    supabase
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("status", "open"),
    supabase.from("lsch_terms").select("id", { count: "exact", head: true }),
    supabase.from("resources").select("id", { count: "exact", head: true }),
    supabase
      .from("experiences")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved"),
  ]);
  const vacantes = vacantesRes.count;
  const senas = senasRes.count;
  const recursos = recursosRes.count;
  const experiencias = expRes.count;

  const stats = [
    { value: `${vacantes ?? 0}`, label: "Vacantes inclusivas", href: "/empleos" },
    { value: `${experiencias ?? 0}`, label: "Experiencias reales", href: "/experiencias" },
    { value: `${senas ?? 0}`, label: "Señas en el glosario", href: "/glosario" },
    { value: `${recursos ?? 0}`, label: "Recursos y guías", href: "/recursos" },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNav />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-14 pt-16 text-center">
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          Ley 21.015 · Inclusión Laboral · Chile
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Inclusión laboral que se mide y se hace realidad.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          Incluye ayuda a las empresas a evaluar y mejorar su accesibilidad, y
          conecta a personas con discapacidad con empleos inclusivos.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="rounded-full bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-500"
          >
            Soy empresa
          </Link>
          <Link
            href="/empleos"
            className="rounded-full border border-slate-300 px-6 py-3 font-medium hover:border-slate-400 dark:border-slate-700"
          >
            Busco empleo inclusivo
          </Link>
        </div>
      </section>

      {/* Stats reales */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center transition-colors hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="text-3xl font-bold text-indigo-600">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {s.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Para empresas */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Para tu empresa
        </h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {empresa.map((m) => (
            <Link key={m.title} href={m.href} className="h-full">
              <div className="h-full rounded-2xl border border-slate-200 p-6 transition-colors hover:border-indigo-400 dark:border-slate-800">
                <div className="text-2xl">{m.icon}</div>
                <h3 className="mt-3 font-semibold">{m.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {m.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Público / comunidad */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Abierto a la comunidad
        </h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {comunidad.map((m) => (
            <Link key={m.title} href={m.href} className="h-full">
              <div className="h-full rounded-2xl border border-slate-200 p-6 transition-colors hover:border-indigo-400 dark:border-slate-800">
                <div className="text-2xl">{m.icon}</div>
                <h3 className="mt-3 font-semibold">{m.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {m.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-3xl bg-indigo-600 px-8 py-12 text-center text-white">
          <h2 className="text-2xl font-bold">
            Empieza a medir tu inclusión hoy
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-indigo-100">
            Crea la cuenta de tu empresa, haz la autoevaluación y obtén tu
            reporte de cumplimiento en minutos.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 font-medium text-indigo-700 hover:bg-indigo-50"
          >
            Crear cuenta
          </Link>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

const empresa = [
  {
    icon: "📋",
    title: "Autoevaluación",
    desc: "Checklist guiado con puntaje y recomendaciones automáticas.",
    href: "/login",
  },
  {
    icon: "📊",
    title: "Reportes y certificado",
    desc: "Estado de cumplimiento de la Ley 21.015 exportable a PDF.",
    href: "/login",
  },
  {
    icon: "✅",
    title: "Plan de acción",
    desc: "Convierte las recomendaciones en tareas con responsable y fecha.",
    href: "/login",
  },
  {
    icon: "💼",
    title: "Publica empleos",
    desc: "Difunde tus vacantes inclusivas y llega al 1% de la ley.",
    href: "/login",
  },
];

const comunidad = [
  {
    icon: "💼",
    title: "Empleos inclusivos",
    desc: "Vacantes de empresas comprometidas con la inclusión.",
    href: "/empleos",
  },
  {
    icon: "🤟",
    title: "Glosario LSCh",
    desc: "Señas útiles por rubro, con video, para atender a personas sordas.",
    href: "/glosario",
  },
  {
    icon: "💬",
    title: "Experiencias reales",
    desc: "Lo que vivió la comunidad: transparencia contra la falsa inclusión.",
    href: "/experiencias",
  },
  {
    icon: "🧑‍💼",
    title: "Gestores de inclusión",
    desc: "Qué exige la Ley 21.275 y cómo verificar en ChileValora.",
    href: "/gestores",
  },
];
