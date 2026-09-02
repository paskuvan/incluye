import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import GestorManager, { type Gestor } from "./gestor-manager";

export default async function GestorPage({
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
    .select("id, name, employees")
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

  const { data: gestores } = await supabase
    .from("inclusion_managers")
    .select("id, name, role, email, certified")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: true });

  const obligatorio = (org.employees ?? 0) >= 100;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Volver al panel
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Gestor(a) de inclusión</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {org.name}
        </p>
      </div>

      {obligatorio && (gestores ?? []).length === 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
          Con {org.employees} trabajadores, la <b>Ley 21.275</b> exige contar con
          al menos un gestor(a) de inclusión certificado(a) por ChileValora.
        </div>
      )}

      <GestorManager
        orgId={orgId}
        currentUserId={user.id}
        isAdmin={isAdmin}
        gestores={(gestores as Gestor[]) ?? []}
      />
    </div>
  );
}
