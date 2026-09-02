"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyForm() {
  const router = useRouter();
  const [code, setCode] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const c = code.trim();
        if (c) router.push(`/verificar/${encodeURIComponent(c)}`);
      }}
      className="mt-6 flex gap-2"
    >
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Código del certificado (ej. A1B2C3D4)"
        className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm uppercase outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
      />
      <button
        type="submit"
        disabled={!code.trim()}
        className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        Verificar
      </button>
    </form>
  );
}
