"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type Member = {
  user_id: string;
  email: string;
  role: string;
  created_at: string;
};
export type Invitation = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

const roleLabel: Record<string, string> = {
  owner: "Dueño",
  admin: "Administrador",
  member: "Miembro",
};

export default function TeamManager({
  orgId,
  currentUserId,
  isAdmin,
  members,
  invitations,
}: {
  orgId: string;
  currentUserId: string;
  isAdmin: boolean;
  members: Member[];
  invitations: Invitation[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setOk(null);
    const { error } = await supabase.from("invitations").insert({
      organization_id: orgId,
      email: email.trim().toLowerCase(),
      role,
      invited_by: currentUserId,
    });
    if (error) {
      setError(
        error.code === "23505"
          ? "Ya existe una invitación pendiente para ese email."
          : error.message,
      );
    } else {
      setOk(`Invitación enviada a ${email.trim()}.`);
      setEmail("");
      setRole("member");
      router.refresh();
    }
    setBusy(false);
  }

  async function changeRole(userId: string, newRole: string) {
    await supabase
      .from("members")
      .update({ role: newRole })
      .eq("organization_id", orgId)
      .eq("user_id", userId);
    router.refresh();
  }

  async function removeMember(userId: string) {
    await supabase
      .from("members")
      .delete()
      .eq("organization_id", orgId)
      .eq("user_id", userId);
    router.refresh();
  }

  async function revokeInvite(id: string) {
    await supabase
      .from("invitations")
      .update({ status: "revoked" })
      .eq("id", id);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {/* Invitar */}
      {isAdmin && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold">Invitar a alguien</h2>
          <form onSubmit={invite} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="persona@empresa.cl"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="member">Miembro</option>
              <option value="admin">Administrador</option>
            </select>
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              Invitar
            </button>
          </form>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          {ok && <p className="mt-2 text-sm text-green-600">{ok}</p>}
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            La persona debe registrarse con ese email para ver y aceptar la
            invitación en su panel.
          </p>
        </section>
      )}

      {/* Miembros */}
      <section>
        <h2 className="font-semibold">Miembros ({members.length})</h2>
        <div className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {members.map((m) => {
            const isSelf = m.user_id === currentUserId;
            const isOwner = m.role === "owner";
            const canManage = isAdmin && !isOwner && !isSelf;
            return (
              <div
                key={m.user_id}
                className="flex items-center justify-between gap-3 bg-white px-4 py-3 dark:bg-slate-900"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {m.email}
                    {isSelf && (
                      <span className="ml-2 text-xs text-slate-400">(tú)</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {canManage ? (
                    <select
                      value={m.role}
                      onChange={(e) => changeRole(m.user_id, e.target.value)}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                    >
                      <option value="member">Miembro</option>
                      <option value="admin">Administrador</option>
                    </select>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {roleLabel[m.role] ?? m.role}
                    </span>
                  )}
                  {canManage && (
                    <button
                      onClick={() => removeMember(m.user_id)}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-red-600 hover:border-red-300 dark:border-slate-700"
                    >
                      Quitar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Invitaciones pendientes */}
      {isAdmin && invitations.length > 0 && (
        <section>
          <h2 className="font-semibold">
            Invitaciones pendientes ({invitations.length})
          </h2>
          <div className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between gap-3 bg-white px-4 py-3 dark:bg-slate-900"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{inv.email}</p>
                  <p className="text-xs text-slate-400">
                    {roleLabel[inv.role] ?? inv.role} · pendiente
                  </p>
                </div>
                <button
                  onClick={() => revokeInvite(inv.id)}
                  className="rounded-lg border border-slate-300 px-2 py-1 text-xs hover:border-slate-400 dark:border-slate-700"
                >
                  Revocar
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
