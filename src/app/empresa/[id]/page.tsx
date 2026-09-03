import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PublicNav, { PublicFooter } from "@/components/public-nav";
import { createClient } from "@/lib/supabase/server";
import { scoreLevel } from "@/lib/assessment/scoring";

type PublicCompany = {
  name: string;
  employees: number | null;
  score: number | null;
  assessed_at: string | null;
  certified_gestores: number;
  logo_url: string | null;
};
type PublicJob = {
  id: string;
  title: string;
  region: string | null;
  modality: string | null;
  apply_url: string | null;
  apply_email: string | null;
};

const toneBadge: Record<string, string> = {
  green: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  red: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_public_company", { oid: id });
  const c = (data as PublicCompany[] | null)?.[0];
  return {
    title: c ? `${c.name} · Incluye` : "Empresa · Incluye",
    description: c
      ? `Perfil de inclusión de ${c.name} en Incluye.`
      : undefined,
  };
}

export default async function EmpresaPublicaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.rpc("get_public_company", { oid: id });
  const company = (data as PublicCompany[] | null)?.[0];
  if (!company) notFound();

  // Sello "Comunicación con personas sordas": puntaje del área comunicación.
  const { data: deafScore } = await supabase.rpc(
    "public_company_deaf_score",
    { oid: id },
  );
  const esReferenteSordos =
    typeof deafScore === "number" && deafScore >= 67;

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title, region, modality, apply_url, apply_email")
    .eq("organization_id", id)
    .eq("status", "open")
    .order("created_at", { ascending: false });

  const level = company.score != null ? scoreLevel(company.score) : null;
  const openJobs = (jobs as PublicJob[] | null) ?? [];

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNav />

      <section className="mx-auto max-w-3xl px-6 pb-16 pt-8">
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          Perfil de inclusión
        </span>
        <div className="mt-4 flex items-center gap-4">
          {company.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={company.logo_url}
              alt={`Logo de ${company.name}`}
              className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 object-contain dark:border-slate-800"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {company.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {company.employees != null
                ? `${company.employees} trabajadores`
                : ""}
            </p>
          </div>
        </div>

        {/* Sello: comunicación con personas sordas */}
        {esReferenteSordos && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-800 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200">
            <span aria-hidden="true">🤟</span>
            Referente en comunicación con personas sordas
          </div>
        )}

        {/* Métricas */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Accesibilidad
            </p>
            {company.score != null && level ? (
              <p className="mt-2 flex items-center gap-2">
                <span className="text-2xl font-bold">{company.score}%</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${toneBadge[level.tone]}`}
                >
                  {level.label}
                </span>
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-400">Sin evaluación</p>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Gestor certificado
            </p>
            <p className="mt-2 text-2xl font-bold">
              {company.certified_gestores > 0 ? "Sí" : "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Vacantes abiertas
            </p>
            <p className="mt-2 text-2xl font-bold">{openJobs.length}</p>
          </div>
        </div>

        {/* Vacantes */}
        {openJobs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold">Vacantes inclusivas</h2>
            <div className="mt-3 space-y-2">
              {openJobs.map((j) => {
                const href = j.apply_url
                  ? j.apply_url
                  : j.apply_email
                    ? `mailto:${j.apply_email}`
                    : null;
                return (
                  <div
                    key={j.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div>
                      <p className="text-sm font-medium">{j.title}</p>
                      <p className="text-xs text-slate-400">
                        {[j.region, j.modality].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    {href && (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
                      >
                        Postular
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="mt-10 text-xs text-slate-400">
          Datos declarados por la empresa en Incluye (autodiagnóstico). No
          constituye certificación legal.
        </p>
      </section>

      <PublicFooter />
    </main>
  );
}
