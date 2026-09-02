"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type PendingInvite = {
  id: string;
  org_name: string;
  role: string;
};

const roleLabel: Record<string, string> = {
  admin: "Administrador",
  member: "Miembro",
};

export default function PendingInvitations({
  invites,
}: {
  invites: PendingInvite[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [busy, setBusy] = useState<string | null>(null);

  if (invites.length === 0) return null;

  async function accept(id: string) {
    setBusy(id);
    await supabase.rpc("accept_invitation", { invitation_id: id });
    router.refresh();
    setBusy(null);
  }

  async function decline(id: string) {
    setBusy(id);
    await supabase.rpc("decline_invitation", { invitation_id: id });
    router.refresh();
    setBusy(null);
  }

  return (
    <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-900 dark:bg-indigo-950/50">
      <h2 className="font-semibold text-indigo-900 dark:text-indigo-200">
        Invitaciones pendientes
      </h2>
      <div className="mt-3 space-y-2">
        {invites.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 dark:bg-slate-900"
          >
            <p className="text-sm">
              Te invitaron a <b>{inv.org_name}</b> como{" "}
              {roleLabel[inv.role] ?? inv.role}.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => decline(inv.id)}
                disabled={busy === inv.id}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:border-slate-400 disabled:opacity-60 dark:border-slate-700"
              >
                Rechazar
              </button>
              <button
                onClick={() => accept(inv.id)}
                disabled={busy === inv.id}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                Aceptar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
