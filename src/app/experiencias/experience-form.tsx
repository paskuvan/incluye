"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const YESNO = [
  { v: "", label: "Prefiero no decir" },
  { v: "si", label: "Sí" },
  { v: "no", label: "No" },
];

function toBool(v: string): boolean | null {
  if (v === "si") return true;
  if (v === "no") return false;
  return null;
}

export default function ExperienceForm() {
  const supabase = createClient();
  const [f, setF] = useState({
    company_name: "",
    role: "",
    rating: "",
    had_interpreter: "",
    process_accessible: "",
    offer_real: "",
    comment: "",
    contact_email: "",
  });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof f, v: string) => setF({ ...f, [k]: v });
  const field =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.from("experiences").insert({
      company_name: f.company_name.trim(),
      role: f.role.trim() || null,
      rating: f.rating ? Number(f.rating) : null,
      had_interpreter: toBool(f.had_interpreter),
      process_accessible: toBool(f.process_accessible),
      offer_real: toBool(f.offer_real),
      comment: f.comment.trim(),
      contact_email: f.contact_email.trim() || null,
      status: "pending",
    });
    if (error) setError(error.message);
    else setSent(true);
    setBusy(false);
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-green-300 bg-green-50 p-6 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-200">
        <p className="font-semibold">¡Gracias por compartir tu experiencia!</p>
        <p className="mt-1">
          La revisaremos antes de publicarla (para cuidar a todas las partes).
          Tu voz ayuda a que la inclusión sea real.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          required
          value={f.company_name}
          onChange={(e) => set("company_name", e.target.value)}
          placeholder="Empresa"
          aria-label="Empresa"
          className={field}
        />
        <input
          value={f.role}
          onChange={(e) => set("role", e.target.value)}
          placeholder="Cargo al que postulaste (opcional)"
          aria-label="Cargo"
          className={field}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            ¿Hubo intérprete / comunicación accesible?
          </span>
          <select
            value={f.had_interpreter}
            onChange={(e) => set("had_interpreter", e.target.value)}
            className={`${field} mt-1`}
          >
            {YESNO.map((o) => (
              <option key={o.v} value={o.v}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            ¿El proceso fue accesible?
          </span>
          <select
            value={f.process_accessible}
            onChange={(e) => set("process_accessible", e.target.value)}
            className={`${field} mt-1`}
          >
            {YESNO.map((o) => (
              <option key={o.v} value={o.v}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            ¿La inclusión fue real (no fachada)?
          </span>
          <select
            value={f.offer_real}
            onChange={(e) => set("offer_real", e.target.value)}
            className={`${field} mt-1`}
          >
            {YESNO.map((o) => (
              <option key={o.v} value={o.v}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm">
        <span className="text-slate-500 dark:text-slate-400">
          Valoración general
        </span>
        <select
          value={f.rating}
          onChange={(e) => set("rating", e.target.value)}
          className={`${field} mt-1 sm:max-w-xs`}
          aria-label="Valoración general"
        >
          <option value="">Sin valoración</option>
          <option value="1">★ (1)</option>
          <option value="2">★★ (2)</option>
          <option value="3">★★★ (3)</option>
          <option value="4">★★★★ (4)</option>
          <option value="5">★★★★★ (5)</option>
        </select>
      </label>

      <textarea
        required
        value={f.comment}
        onChange={(e) => set("comment", e.target.value)}
        rows={4}
        placeholder="Cuenta tu experiencia: qué te ofrecieron, qué pasó realmente, cómo te trataron…"
        aria-label="Tu experiencia"
        className={`${field} resize-y`}
      />

      <input
        type="email"
        value={f.contact_email}
        onChange={(e) => set("contact_email", e.target.value)}
        placeholder="Tu email (opcional, privado — solo para verificar, no se publica)"
        aria-label="Email de contacto opcional"
        className={field}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Tu experiencia se revisa antes de publicarse. Sé respetuoso y cuenta lo
        que viviste; no incluyas datos personales de terceros.
      </p>
      <button
        type="submit"
        disabled={busy || !f.company_name.trim() || !f.comment.trim()}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        {busy ? "Enviando…" : "Compartir experiencia"}
      </button>
    </form>
  );
}
