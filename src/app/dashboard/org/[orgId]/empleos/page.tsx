import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import JobsManager, { type Job } from "./jobs-manager";

export default async function EmpleosAdminPage({
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
    .select("id, name")
    .eq("id", orgId)
    .single();
  if (!org) notFound();

  const { data: me } = await supabase
    .from("members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .single();
  const isAdmin = me?.role === "owner" || me?.role === "admin";

  const { data: jobs } = await supabase
    .from("jobs")
    .select(
      "id, title, description, region, modality, employment_type, apply_url, apply_email, status",
    )
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Volver al panel
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Empleos inclusivos</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {org.name} · las vacantes abiertas aparecen en{" "}
          <Link href="/empleos" className="text-indigo-600 hover:underline dark:text-indigo-400">
            /empleos
          </Link>
        </p>
      </div>

      <JobsManager
        orgId={orgId}
        orgName={org.name}
        currentUserId={user.id}
        isAdmin={isAdmin}
        jobs={(jobs as Job[]) ?? []}
      />
    </div>
  );
}
