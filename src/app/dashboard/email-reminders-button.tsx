"use client";

import { useState, useTransition } from "react";
import { sendMyReminders } from "./send-reminders-action";

export default function EmailRemindersButton() {
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  function onClick() {
    setMsg(null);
    startTransition(async () => {
      const res = await sendMyReminders();
      setOk(res.ok);
      setMsg(res.message);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onClick}
        disabled={pending}
        className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100 disabled:opacity-60 dark:border-amber-800 dark:bg-slate-900 dark:text-amber-300"
      >
        {pending ? "Enviando…" : "Enviarme por email"}
      </button>
      {msg && (
        <span
          className={`text-xs ${ok ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
        >
          {msg}
        </span>
      )}
    </div>
  );
}
