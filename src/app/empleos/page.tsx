import type { Metadata } from "next";
import PublicNav, { PublicFooter } from "@/components/public-nav";
import { createClient } from "@/lib/supabase/server";
import EmpleosView, { type Job } from "./empleos-view";

export const metadata: Metadata = {
  title: "Empleos inclusivos · Incluye",
  description:
    "Vacantes de empresas comprometidas con la inclusión laboral de personas con discapacidad en Chile.",
};

export default async function EmpleosPage() {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from("jobs")
    .select(
      "id, company_name, title, description, region, modality, employment_type, apply_url, apply_email, source, source_name",
    )
    .eq("status", "open")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNav />

      <section className="mx-auto max-w-4xl px-6 pb-16 pt-8">
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          Empleo inclusivo
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Empleos inclusivos
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
          Vacantes de empresas comprometidas con la inclusión laboral de personas
          con discapacidad. Postula directamente con la empresa.
        </p>

        <div className="mt-10">
          <EmpleosView jobs={(jobs as Job[]) ?? []} />
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
