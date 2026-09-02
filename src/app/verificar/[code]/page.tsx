import Link from "next/link";
import type { Metadata } from "next";
import PublicNav, { PublicFooter } from "@/components/public-nav";
import { createClient } from "@/lib/supabase/server";
import { scoreLevel } from "@/lib/assessment/scoring";

export const metadata: Metadata = {
  title: "Verificar certificado · Incluye",
};

type VerifyRow = { name: string; score: number | null; issued_at: string };

export default async function VerificarCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = await createClient();
  const { data } = await supabase.rpc("verify_certificate", { code });
  const row = (data as VerifyRow[] | null)?.[0];
  const level = row?.score != null ? scoreLevel(row.score) : null;

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNav />

      <section className="mx-auto max-w-xl px-6 pb-16 pt-10">
        <h1 className="text-2xl font-bold">Verificación de certificado</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Código: <span className="font-mono">{code.toUpperCase()}</span>
        </p>

        {row ? (
          <div className="mt-6 rounded-2xl border border-green-300 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950/40">
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
              ✓ Certificado válido
            </p>
            <p className="mt-3 text-lg font-bold">{row.name}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Nivel {level?.label ?? "—"}
              {row.score != null ? ` · ${row.score}% de cumplimiento` : ""}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Emitido el{" "}
              {new Date(row.issued_at).toLocaleDateString("es-CL", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-red-300 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/40">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">
              ✕ No encontramos un certificado con ese código.
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Revisa el código e inténtalo de nuevo.
            </p>
          </div>
        )}

        <div className="mt-6">
          <Link
            href="/verificar"
            className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
          >
            ← Verificar otro código
          </Link>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
