import type { Metadata } from "next";
import PublicNav, { PublicFooter } from "@/components/public-nav";
import VerifyForm from "./verify-form";

export const metadata: Metadata = {
  title: "Verificar certificado · Incluye",
  description:
    "Verifica la autenticidad de un certificado de inclusión emitido por Incluye.",
};

export default function VerificarPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNav />

      <section className="mx-auto max-w-xl px-6 pb-16 pt-10">
        <h1 className="text-2xl font-bold">Verificar certificado</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Ingresa el código que aparece en un certificado de Incluye para
          comprobar su autenticidad.
        </p>
        <VerifyForm />
      </section>

      <PublicFooter />
    </main>
  );
}
