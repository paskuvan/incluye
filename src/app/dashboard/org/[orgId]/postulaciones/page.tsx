import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ApplicantsList, { type Applicant } from "./applicants-list";

export default async function PostulacionesPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", orgId)
    .single();
  if (!org) redirect("/dashboard");

  const { data } = await supabase.rpc("org_applications", { org: orgId });
  const applicants = (data as Applicant[] | null) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Volver al panel
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Postulaciones</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Personas que postularon a las vacantes de {org.name}.
        </p>
      </div>

      <ApplicantsList initial={applicants} />
    </div>
  );
}
