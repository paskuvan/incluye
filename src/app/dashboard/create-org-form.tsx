"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CreateOrgForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [rut, setRut] = useState("");
  const [employees, setEmployees] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("organizations").insert({
      name: name.trim(),
      rut: rut.trim() || null,
      employees: employees ? Number(employees) : null,
      created_by: user.id,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (redirectTo) {
      router.push(redirectTo);
      router.refresh();
    } else {
      router.refresh();
    }
  }

  const field =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";
  const labelCls =
    "block text-sm font-medium text-slate-700 dark:text-slate-200";

  const emp = employees ? Number(employees) : null;

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-semibold">Registra tu empresa</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Todavía no tienes una empresa cargada. Crea una para empezar.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="org-name" className={labelCls}>
            Nombre de la empresa <span className="text-red-500">*</span>
          </label>
          <input
            id="org-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${field} mt-1.5`}
            placeholder="Mi Empresa SpA"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="org-rut" className={labelCls}>
              RUT{" "}
              <span className="font-normal text-slate-400">(opcional)</span>
            </label>
            <input
              id="org-rut"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              className={`${field} mt-1.5`}
              placeholder="76.123.456-7"
            />
          </div>
          <div>
            <label htmlFor="org-employees" className={labelCls}>
              N.º trabajadores
            </label>
            <input
              id="org-employees"
              type="number"
              min={1}
              value={employees}
              onChange={(e) => setEmployees(e.target.value)}
              className={`${field} mt-1.5`}
              placeholder="100"
            />
          </div>
        </div>

        {/* Pista contextual sobre la cuota Ley 21.015 */}
        {emp !== null && emp >= 100 ? (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            Con {emp} trabajadores aplica la <b>Ley 21.015</b>: al menos{" "}
            {Math.ceil(emp * 0.01)}{" "}
            {Math.ceil(emp * 0.01) === 1 ? "persona" : "personas"} con
            discapacidad (1%).
          </p>
        ) : (
          <p className="text-xs text-slate-400">
            Desde 100 trabajadores aplica la cuota del 1% (Ley 21.015).
          </p>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creando…" : "Crear empresa"}
        </button>
      </form>
    </div>
  );
}
