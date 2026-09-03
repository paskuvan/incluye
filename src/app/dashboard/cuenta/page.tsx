import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AccountForm from "./account-form";

export default async function CuentaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Volver al panel
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Mi cuenta</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Gestiona tu perfil, contraseña y datos.
        </p>
      </div>

      <AccountForm email={user.email ?? ""} />
    </div>
  );
}
