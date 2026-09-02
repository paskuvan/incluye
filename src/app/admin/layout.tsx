import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: isAdmin } = await supabase.rpc("is_app_admin");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Saltar al contenido
      </a>
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="font-bold tracking-tight">
            incluye<span className="text-indigo-500">.</span>{" "}
            <span className="text-sm font-normal text-slate-400">admin</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
          >
            ← Al panel
          </Link>
        </div>
      </header>
      <main id="contenido" className="mx-auto max-w-4xl px-6 py-10">
        {isAdmin ? (
          children
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
            <h1 className="text-lg font-semibold">Acceso restringido</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Esta sección es solo para administradores de la plataforma. Si
              deberías tener acceso, agrega tu usuario a la tabla{" "}
              <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                app_admins
              </code>
              .
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
