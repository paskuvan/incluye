import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PerfilToggle from "./perfil-toggle";

export default async function PerfilPage({
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
    .select("id, name, public_profile")
    .eq("id", orgId)
    .single();
  if (!org) notFound();

  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") ? "http" : "https";
  const publicUrl = `${proto}://${host}/empresa/${orgId}`;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Volver al panel
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Perfil público</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {org.name}
        </p>
      </div>

      <PerfilToggle
        orgId={orgId}
        initial={org.public_profile ?? false}
        publicUrl={publicUrl}
      />
    </div>
  );
}
