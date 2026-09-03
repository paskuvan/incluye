import type { Metadata } from "next";
import PublicNav, { PublicFooter } from "@/components/public-nav";
import { createClient } from "@/lib/supabase/server";
import ExperienceForm from "./experience-form";

export const metadata: Metadata = {
  title: "Experiencias · Incluye",
  description:
    "Experiencias reales de personas con discapacidad en procesos de inclusión laboral. Transparencia contra la falsa inclusión.",
};

type Experience = {
  id: string;
  company_name: string;
  role: string | null;
  rating: number | null;
  had_interpreter: boolean | null;
  process_accessible: boolean | null;
  offer_real: boolean | null;
  comment: string;
  created_at: string;
};

function Chip({ label, value }: { label: string; value: boolean | null }) {
  if (value === null) return null;
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
        value
          ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
      }`}
    >
      {value ? "✓" : "✕"} {label}
    </span>
  );
}

export default async function ExperienciasPage() {
  const supabase = await createClient();
  const { data: experiences } = await supabase
    .from("experiences")
    .select(
      "id, company_name, role, rating, had_interpreter, process_accessible, offer_real, comment, created_at",
    )
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  const list = (experiences as Experience[] | null) ?? [];

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNav />

      <section className="mx-auto max-w-3xl px-6 pb-16 pt-8">
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          Transparencia
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Experiencias reales
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          Un espacio para que las personas con discapacidad cuenten cómo fue
          realmente un proceso de inclusión laboral. Sirve para reconocer a las
          empresas que sí incluyen y para prevenir la <b>falsa inclusión</b>.
        </p>

        {/* Compartir */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Comparte tu experiencia</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Es anónima y se revisa antes de publicarse.
          </p>
          <div className="mt-4">
            <ExperienceForm />
          </div>
        </div>

        {/* Listado */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold">
            Experiencias compartidas ({list.length})
          </h2>
          {list.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Todavía no hay experiencias publicadas. Sé la primera voz.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {list.map((e) => (
                <article
                  key={e.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold">
                      {e.company_name}
                      {e.role && (
                        <span className="ml-2 text-sm font-normal text-slate-400">
                          · {e.role}
                        </span>
                      )}
                    </h3>
                    {e.rating != null && (
                      <span className="text-sm text-amber-500">
                        {"★".repeat(e.rating)}
                        <span className="text-slate-300 dark:text-slate-700">
                          {"★".repeat(5 - e.rating)}
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Chip label="Comunicación accesible" value={e.had_interpreter} />
                    <Chip label="Proceso accesible" value={e.process_accessible} />
                    <Chip label="Inclusión real" value={e.offer_real} />
                  </div>
                  <p className="mt-3 whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">
                    {e.comment}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(e.created_at).toLocaleDateString("es-CL")}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
