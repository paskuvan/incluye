import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import TeamManager, { type Member, type Invitation } from "./team-manager";

export default async function EquipoPage({
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

  // Rol del usuario actual en esta org.
  const { data: me } = await supabase
    .from("members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .single();
  const isAdmin = me?.role === "owner" || me?.role === "admin";

  const { data: members } = await supabase.rpc("get_org_members", {
    org: orgId,
  });

  let invitations: Invitation[] = [];
  if (isAdmin) {
    const { data } = await supabase
      .from("invitations")
      .select("id, email, role, created_at")
      .eq("organization_id", orgId)
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    invitations = data ?? [];
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Volver al panel
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Equipo</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {org.name}
        </p>
      </div>

      <TeamManager
        orgId={orgId}
        currentUserId={user.id}
        isAdmin={isAdmin}
        members={(members as Member[]) ?? []}
        invitations={invitations}
      />
    </div>
  );
}
