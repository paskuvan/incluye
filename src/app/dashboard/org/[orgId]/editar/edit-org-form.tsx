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
  initial: {
    name: string;
    rut: string | null;
    employees: number | null;
    logo_url: string | null;
  };
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
  const [logoUrl, setLogoUrl] = useState(initial.logo_url);
  const [uploading, setUploading] = useState(false);

  async function uploadLogo(file: File) {
    setUploading(true);
    setError(null);
    const ext = file.name.split(".").pop() || "png";
    const path = `${orgId}/logo-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("org-logos")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) {
      setError(upErr.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("org-logos").getPublicUrl(path);
    const { error: dbErr } = await supabase
      .from("organizations")
      .update({ logo_url: data.publicUrl })
      .eq("id", orgId);
    if (dbErr) setError(dbErr.message);
    else {
      setLogoUrl(data.publicUrl);
      router.refresh();
    }
    setUploading(false);
  }

  async function removeLogo() {
    await supabase
      .from("organizations")
      .update({ logo_url: null })
      .eq("id", orgId);
    setLogoUrl(null);
    router.refresh();
  }

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

        {/* Logo */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt="Logo"
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-2xl text-slate-300" aria-hidden="true">
                🏢
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium hover:border-indigo-400 dark:border-slate-700">
              {uploading ? "Subiendo…" : logoUrl ? "Cambiar logo" : "Subir logo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadLogo(f);
                }}
              />
            </label>
            {logoUrl && (
              <button
                type="button"
                onClick={removeLogo}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700"
              >
                Quitar
              </button>
            )}
          </div>
        </div>

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
