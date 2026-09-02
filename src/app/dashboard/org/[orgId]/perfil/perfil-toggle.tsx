"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PerfilToggle({
  orgId,
  initial,
  publicUrl,
}: {
  orgId: string;
  initial: boolean;
  publicUrl: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [on, setOn] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function toggle() {
    setBusy(true);
    const next = !on;
    const { error } = await supabase
      .from("organizations")
      .update({ public_profile: next })
      .eq("id", orgId);
    if (!error) {
      setOn(next);
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <p className="font-medium">Perfil público</p>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {on
              ? "Tu empresa tiene una página pública visible para cualquiera."
              : "Tu perfil está oculto. Actívalo para compartirlo."}
          </p>
        </div>
        <button
          onClick={toggle}
          disabled={busy}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"} disabled:opacity-60`}
          role="switch"
          aria-checked={on}
          aria-label="Perfil público"
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? "left-[22px]" : "left-0.5"}`}
          />
        </button>
      </div>

      {on && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium">Enlace público</p>
          <div className="mt-2 flex gap-2">
            <input
              readOnly
              value={publicUrl}
              className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
            <button
              onClick={() => {
                navigator.clipboard?.writeText(publicUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:border-slate-400 dark:border-slate-700"
            >
              {copied ? "Copiado" : "Copiar"}
            </button>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Ver
            </a>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Muestra tu nivel de accesibilidad, si tienes gestor certificado y tus
            vacantes abiertas. No se muestran datos internos ni respuestas.
          </p>
        </div>
      )}
    </div>
  );
}
