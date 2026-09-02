import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ExternalJobs, { type ExtJob } from "./external-jobs";

export default async function AdminEmpleosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: jobs } = await supabase
    .from("jobs")
    .select(
      "id, company_name, title, region, modality, employment_type, apply_url, source_name, status",
    )
    .eq("source", "externa")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Empleos externos</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Vacantes inclusivas de otras empresas (no registradas). Aparecen en{" "}
          <Link
            href="/empleos"
            className="text-indigo-600 hover:underline dark:text-indigo-400"
          >
            /empleos
          </Link>{" "}
          con la etiqueta “Externa”.
        </p>
      </div>

      <ExternalJobs currentUserId={user.id} jobs={(jobs as ExtJob[]) ?? []} />
    </div>
  );
}
