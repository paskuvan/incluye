"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type YesNo = "" | "si" | "no";

function toBool(v: YesNo): boolean | null {
  if (v === "si") return true;
  if (v === "no") return false;
  return null;
}

/** Grupo de opciones Sí / No / Prefiero no decir, accesible (radiogroup). */
function Segmented({
  label,
  value,
  onChange,
}: {
  label: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
}) {
  const options: { v: YesNo; label: string }[] = [
    { v: "si", label: "Sí" },
    { v: "no", label: "No" },
    { v: "", label: "Prefiero no decir" },
  ];
  return (
    <div>
      <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-label={label}
        className="mt-2 inline-flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
      >
        {options.map((o) => {
          const active = value === o.v;
          return (
            <button
              key={o.v || "na"}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.v)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Valoración con estrellas clickeables. */
function Stars({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div>
      <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
        Valoración general
      </span>
      <div className="mt-2 flex items-center gap-1" role="radiogroup" aria-label="Valoración general">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = (hover || value) >= n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={`${n} de 5`}
              onClick={() => onChange(value === n ? 0 : n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="rounded p-0.5 text-2xl leading-none transition-transform hover:scale-110"
            >
              <span className={filled ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}>
                ★
              </span>
            </button>
          );
        })}
        {value > 0 && (
          <button
            type="button"
            onClick={() => onChange(0)}
            className="ml-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}

export default function ExperienceForm() {
  const supabase = createClient();
  const [f, setF] = useState({
    company_name: "",
    role: "",
    rating: 0,
    had_interpreter: "" as YesNo,
    process_accessible: "" as YesNo,
    offer_real: "" as YesNo,
    comment: "",
    contact_email: "",
  });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((prev) => ({ ...prev, [k]: v }));

  const field =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800";
  const labelCls =
    "block text-sm font-medium text-slate-700 dark:text-slate-200";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.from("experiences").insert({
      company_name: f.company_name.trim(),
      role: f.role.trim() || null,
      rating: f.rating || null,
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
        <p className="text-base font-semibold">
          🙌 ¡Gracias por compartir tu experiencia!
        </p>
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
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Empresa y cargo */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="exp-company" className={labelCls}>
            Empresa <span className="text-red-500">*</span>
          </label>
          <input
            id="exp-company"
            required
            value={f.company_name}
            onChange={(e) => set("company_name", e.target.value)}
            placeholder="Nombre de la empresa"
            className={`${field} mt-1.5`}
          />
        </div>
        <div>
          <label htmlFor="exp-role" className={labelCls}>
            Cargo{" "}
            <span className="font-normal text-slate-400">(opcional)</span>
          </label>
          <input
            id="exp-role"
            value={f.role}
            onChange={(e) => set("role", e.target.value)}
            placeholder="Cargo al que postulaste"
            className={`${field} mt-1.5`}
          />
        </div>
      </div>

      {/* Señales de inclusión real */}
      <fieldset className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Señales de inclusión
        </legend>
        <Segmented
          label="¿Hubo intérprete o comunicación accesible?"
          value={f.had_interpreter}
          onChange={(v) => set("had_interpreter", v)}
        />
        <Segmented
          label="¿El proceso fue accesible?"
          value={f.process_accessible}
          onChange={(v) => set("process_accessible", v)}
        />
        <Segmented
          label="¿La inclusión fue real (no una fachada)?"
          value={f.offer_real}
          onChange={(v) => set("offer_real", v)}
        />
      </fieldset>

      {/* Valoración */}
      <Stars value={f.rating} onChange={(v) => set("rating", v)} />

      {/* Relato */}
      <div>
        <label htmlFor="exp-comment" className={labelCls}>
          Tu experiencia <span className="text-red-500">*</span>
        </label>
        <textarea
          id="exp-comment"
          required
          value={f.comment}
          onChange={(e) => set("comment", e.target.value)}
          rows={5}
          maxLength={2000}
          placeholder="Cuenta qué te ofrecieron, qué pasó realmente y cómo te trataron…"
          className={`${field} mt-1.5 resize-y`}
        />
        <p className="mt-1 text-right text-xs text-slate-400">
          {f.comment.length}/2000
        </p>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="exp-email" className={labelCls}>
          Tu email{" "}
          <span className="font-normal text-slate-400">
            (opcional y privado)
          </span>
        </label>
        <input
          id="exp-email"
          type="email"
          value={f.contact_email}
          onChange={(e) => set("contact_email", e.target.value)}
          placeholder="tucorreo@ejemplo.cl"
          className={`${field} mt-1.5`}
        />
        <p className="mt-1 text-xs text-slate-400">
          Solo lo usamos para verificar tu experiencia. Nunca se publica.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Es anónima y se revisa antes de publicarse. No incluyas datos
          personales de terceros.
        </p>
        <button
          type="submit"
          disabled={busy || !f.company_name.trim() || !f.comment.trim()}
          className="shrink-0 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Enviando…" : "Compartir experiencia"}
        </button>
      </div>
    </form>
  );
}
