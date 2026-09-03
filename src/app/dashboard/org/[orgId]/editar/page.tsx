import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import EditOrgForm from "./edit-org-form";

export default async function EditarEmpresaPage({
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
    .select("id, name, rut, employees, logo_url")
    .eq("id", orgId)
    .single();
  if (!org) notFound();

  const { data: me } = await supabase
    .from("members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .single();

  // Solo owners/admins pueden entrar a editar.
  if (me?.role !== "owner" && me?.role !== "admin") redirect("/dashboard");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Volver al panel
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Editar empresa</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {org.name}
        </p>
      </div>

      <EditOrgForm
        orgId={orgId}
        isOwner={me?.role === "owner"}
        initial={{
          name: org.name,
          rut: org.rut,
          employees: org.employees,
          logo_url: org.logo_url,
        }}
      />
    </div>
  );
}
