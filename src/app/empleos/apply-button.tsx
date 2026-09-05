"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ApplyButton({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setError(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    // Debe existir un perfil de candidato antes de postular.
    const { data: profile } = await supabase
      .from("candidate_profiles")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!profile) {
      router.push("/dashboard/perfil-candidato");
      return;
    }
    setOpen(true);
  }

  async function submit() {
    setBusy(true);
    setError(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    const { error } = await supabase.from("applications").insert({
      job_id: jobId,
      candidate_id: user.id,
      cover_note: note.trim() || null,
    });
    if (error) {
      // 23505 = violación de unicidad (ya postuló a esta vacante).
      setError(
        error.code === "23505"
          ? "Ya postulaste a esta vacante."
          : error.message,
      );
      setBusy(false);
      return;
    }
    setDone(true);
    setOpen(false);
    setBusy(false);
  }

  if (done) {
    return (
      <span className="rounded-lg bg-green-100 px-3 py-2 text-sm font-medium text-green-800 dark:bg-green-950 dark:text-green-300">
        ✓ Postulación enviada
      </span>
    );
  }

  if (!open) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={start}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Postular en Incluye
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <label className="text-sm font-medium">
        Mensaje para <span className="text-slate-500">{jobTitle}</span>
      </label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        maxLength={800}
        placeholder="Cuéntale a la empresa por qué te interesa (opcional)."
        className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <div className="mt-2 flex gap-2">
        <button
          onClick={submit}
          disabled={busy}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {busy ? "Enviando…" : "Enviar postulación"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-700"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
