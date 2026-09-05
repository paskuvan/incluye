"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type CandidateInitial = {
  full_name: string;
  headline: string | null;
  bio: string | null;
  region: string | null;
  uses_lsch: boolean;
  skills: string | null;
  contact_email: string | null;
  is_public: boolean;
} | null;

export default function CandidateForm({
  initial,
  userEmail,
}: {
  initial: CandidateInitial;
  userEmail: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [f, setF] = useState({
    full_name: initial?.full_name ?? "",
    headline: initial?.headline ?? "",
    bio: initial?.bio ?? "",
    region: initial?.region ?? "",
    uses_lsch: initial?.uses_lsch ?? true,
    skills: initial?.skills ?? "",
    contact_email: initial?.contact_email ?? userEmail,
    is_public: initial?.is_public ?? false,
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((p) => ({ ...p, [k]: v }));

  const field =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";
  const labelCls =
    "block text-sm font-medium text-slate-700 dark:text-slate-200";

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    const { error } = await supabase.from("candidate_profiles").upsert({
      user_id: user.id,
      full_name: f.full_name.trim(),
      headline: f.headline.trim() || null,
      bio: f.bio.trim() || null,
      region: f.region.trim() || null,
      uses_lsch: f.uses_lsch,
      skills: f.skills.trim() || null,
      contact_email: f.contact_email.trim() || null,
      is_public: f.is_public,
      updated_at: new Date().toISOString(),
    });
    setMsg(
      error
        ? { ok: false, text: error.message }
        : { ok: true, text: "Perfil guardado." },
    );
    if (!error) router.refresh();
    setBusy(false);
  }

  return (
    <form
      onSubmit={save}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className={labelCls}>
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            id="c-name"
            required
            value={f.full_name}
            onChange={(e) => set("full_name", e.target.value)}
            placeholder="Tu nombre"
            className={`${field} mt-1.5`}
          />
        </div>
        <div>
          <label htmlFor="c-region" className={labelCls}>
            Región{" "}
            <span className="font-normal text-slate-400">(opcional)</span>
          </label>
          <input
            id="c-region"
            value={f.region}
            onChange={(e) => set("region", e.target.value)}
            placeholder="Metropolitana, Valparaíso…"
            className={`${field} mt-1.5`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="c-headline" className={labelCls}>
          Titular{" "}
          <span className="font-normal text-slate-400">
            (una línea sobre ti)
          </span>
        </label>
        <input
          id="c-headline"
          value={f.headline}
          onChange={(e) => set("headline", e.target.value)}
          placeholder="Diseñador/a gráfico · usuario de LSCh"
          className={`${field} mt-1.5`}
        />
      </div>

      <div>
        <label htmlFor="c-bio" className={labelCls}>
          Sobre ti
        </label>
        <textarea
          id="c-bio"
          value={f.bio}
          onChange={(e) => set("bio", e.target.value)}
          rows={4}
          maxLength={1500}
          placeholder="Cuenta tu experiencia, qué buscas y cómo prefieres comunicarte."
          className={`${field} mt-1.5 resize-y`}
        />
      </div>

      <div>
        <label htmlFor="c-skills" className={labelCls}>
          Habilidades
        </label>
        <input
          id="c-skills"
          value={f.skills}
          onChange={(e) => set("skills", e.target.value)}
          placeholder="Ej.: Illustrator, atención al cliente, Excel"
          className={`${field} mt-1.5`}
        />
      </div>

      <div>
        <label htmlFor="c-email" className={labelCls}>
          Email de contacto
        </label>
        <input
          id="c-email"
          type="email"
          value={f.contact_email}
          onChange={(e) => set("contact_email", e.target.value)}
          placeholder="tucorreo@ejemplo.cl"
          className={`${field} mt-1.5`}
        />
      </div>

      {/* Toggles */}
      <label className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
        <input
          type="checkbox"
          checked={f.uses_lsch}
          onChange={(e) => set("uses_lsch", e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
        />
        <span>Uso Lengua de Señas Chilena (LSCh)</span>
      </label>

      <label className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
        <input
          type="checkbox"
          checked={f.is_public}
          onChange={(e) => set("is_public", e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
        />
        <span>
          Hacer mi perfil visible públicamente. Si no, solo lo verán las
          empresas a cuyas vacantes postules.
        </span>
      </label>

      {msg && (
        <p
          className={`text-sm ${msg.ok ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
        >
          {msg.text}
        </p>
      )}

      <button
        type="submit"
        disabled={busy || !f.full_name.trim()}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Guardando…" : "Guardar perfil"}
      </button>
    </form>
  );
}
