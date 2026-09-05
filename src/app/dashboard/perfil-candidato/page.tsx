import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CandidateForm, { type CandidateInitial } from "./candidate-form";

export const metadata = { title: "Mi perfil de candidato" };

type MyApplication = {
  id: string;
  status: string;
  created_at: string;
  jobs: { title: string; company_name: string } | null;
};

const STATUS_LABEL: Record<string, string> = {
  sent: "Enviada",
  reviewed: "Revisada",
  contacted: "Te contactaron",
  rejected: "No seleccionada",
};

export default async function PerfilCandidatoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("candidate_profiles")
    .select(
      "full_name, headline, bio, region, uses_lsch, skills, contact_email, is_public",
    )
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: apps } = await supabase
    .from("applications")
    .select("id, status, created_at, jobs(title, company_name)")
    .order("created_at", { ascending: false })
    .returns<MyApplication[]>();

  const applications = apps ?? [];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Volver al panel
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Mi perfil de candidato</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Crea tu perfil para postular a vacantes inclusivas dentro de Incluye.
        </p>
      </div>

      <CandidateForm
        initial={(profile as CandidateInitial) ?? null}
        userEmail={user.email ?? ""}
      />

      {/* Mis postulaciones */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Mis postulaciones
        </h2>
        {applications.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            Todavía no has postulado a ninguna vacante. Explora la{" "}
            <Link
              href="/empleos"
              className="text-indigo-600 hover:underline dark:text-indigo-400"
            >
              bolsa de empleos
            </Link>
            .
          </p>
        ) : (
          <div className="space-y-2">
            {applications.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {a.jobs?.title ?? "Vacante"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {a.jobs?.company_name ?? ""}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {STATUS_LABEL[a.status] ?? a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
