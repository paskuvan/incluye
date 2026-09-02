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

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-semibold">Registra tu empresa</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Todavía no tienes una empresa cargada. Crea una para empezar.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Nombre de la empresa</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
            placeholder="Mi Empresa SpA"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">RUT</label>
            <input
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
              placeholder="76.123.456-7"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">N.º trabajadores</label>
            <input
              type="number"
              min={1}
              value={employees}
              onChange={(e) => setEmployees(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
              placeholder="100"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? "Creando…" : "Crear empresa"}
        </button>
      </form>
    </div>
  );
}
