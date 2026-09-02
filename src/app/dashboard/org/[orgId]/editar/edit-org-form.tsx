"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EditOrgForm({
  orgId,
  isOwner,
  initial,
}: {
  orgId: string;
  isOwner: boolean;
  initial: { name: string; rut: string | null; employees: number | null };
}) {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState(initial.name);
  const [rut, setRut] = useState(initial.rut ?? "");
  const [employees, setEmployees] = useState(
    initial.employees != null ? String(initial.employees) : "",
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMsg(null);
    const { error } = await supabase
      .from("organizations")
      .update({
        name: name.trim(),
        rut: rut.trim() || null,
        employees: employees ? Number(employees) : null,
      })
      .eq("id", orgId);
    if (error) setError(error.message);
    else {
      setMsg("Cambios guardados.");
      router.refresh();
    }
    setSaving(false);
  }

  async function remove() {
    setDeleting(true);
    setError(null);
    const { error } = await supabase
      .from("organizations")
      .delete()
      .eq("id", orgId);
    if (error) {
      setError(error.message);
      setDeleting(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  const field =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800";

  return (
    <div className="space-y-8">
      {/* Datos */}
      <form
        onSubmit={save}
        className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <h2 className="font-semibold">Datos de la empresa</h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${field} mt-1`}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">RUT</label>
              <input
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                className={`${field} mt-1`}
                placeholder="76.123.456-7"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                N.º trabajadores
              </label>
              <input
                type="number"
                min={1}
                value={employees}
                onChange={(e) => setEmployees(e.target.value)}
                className={`${field} mt-1`}
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {msg && <p className="text-sm text-green-600">{msg}</p>}
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </form>

      {/* Zona de peligro */}
      {isOwner && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/40">
          <h2 className="font-semibold text-red-700 dark:text-red-300">
            Eliminar empresa
          </h2>
          <p className="mt-1 text-sm text-red-700/80 dark:text-red-300/80">
            Esta acción es permanente y borra evaluaciones, tareas, vacantes y
            miembros de esta empresa. Escribe{" "}
            <b>ELIMINAR</b> para confirmar.
          </p>
          <div className="mt-3 flex gap-2">
            <input
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              placeholder="ELIMINAR"
              className="rounded-lg border border-red-300 px-3 py-2 text-sm dark:border-red-800 dark:bg-slate-900"
            />
            <button
              onClick={remove}
              disabled={confirmDelete !== "ELIMINAR" || deleting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
            >
              {deleting ? "Eliminando…" : "Eliminar definitivamente"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
