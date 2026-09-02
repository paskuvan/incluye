import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { scoreLevel } from "@/lib/assessment/scoring";
import PrintButton from "./print-button";

// Colores del sello según el nivel.
const levelTheme: Record<string, { ring: string; text: string; label: string }> =
  {
    green: { ring: "#16a34a", text: "text-green-700", label: "Avanzado" },
    amber: { ring: "#d97706", text: "text-amber-700", label: "En camino" },
    red: { ring: "#dc2626", text: "text-red-600", label: "Inicial" },
  };

export default async function CertificadoPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("id", orgId)
    .single();
  if (!org) notFound();

  const { data: last } = await supabase
    .from("assessments")
    .select("id, created_at, score")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!last || last.score == null) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Volver al panel
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-400">
            Necesitas una autoevaluación completada para generar el certificado.
          </p>
          <Link
            href={`/dashboard/org/${orgId}/evaluacion`}
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Hacer autoevaluación
          </Link>
        </div>
      </div>
    );
  }

  const score = last.score;
  const level = scoreLevel(score);
  const theme = levelTheme[level.tone];
  const fecha = new Date(last.created_at).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const codigo = last.id.slice(0, 8).toUpperCase();

  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") ? "http" : "https";
  const verifyUrl = `${proto}://${host}/verificar/${codigo}`;

  return (
    <div className="space-y-6">
      {/* Acciones (no se imprimen) */}
      <div className="no-print flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Volver al panel
        </Link>
        <PrintButton />
      </div>

      {/* Certificado */}
      <div className="print-area mx-auto max-w-2xl">
        <div className="relative overflow-hidden rounded-2xl border-4 border-double border-indigo-300 bg-white p-10 text-center text-slate-900 shadow-sm dark:border-indigo-800 dark:bg-slate-900 dark:text-slate-100 print:shadow-none">
          {/* Marca */}
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-600">
            incluye
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-slate-400">
            Certificado de compromiso con la inclusión
          </p>

          {/* Sello */}
          <div className="mx-auto mt-6 flex h-32 w-32 items-center justify-center">
            <svg viewBox="0 0 120 120" className="h-32 w-32">
              <circle
                cx="60"
                cy="52"
                r="40"
                fill="none"
                stroke={theme.ring}
                strokeWidth="6"
              />
              <circle
                cx="60"
                cy="52"
                r="30"
                fill="none"
                stroke={theme.ring}
                strokeOpacity="0.4"
                strokeWidth="2"
              />
              <text
                x="60"
                y="50"
                textAnchor="middle"
                fontSize="26"
                fontWeight="700"
                fill={theme.ring}
              >
                {score}%
              </text>
              <text
                x="60"
                y="66"
                textAnchor="middle"
                fontSize="9"
                fill={theme.ring}
              >
                {level.label.toUpperCase()}
              </text>
              {/* Cintas */}
              <path d="M45 88 L38 112 L52 104 Z" fill={theme.ring} />
              <path d="M75 88 L82 112 L68 104 Z" fill={theme.ring} />
            </svg>
          </div>

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Se otorga a
          </p>
          <h1 className="mt-1 text-3xl font-bold">{org.name}</h1>

          <p className="mx-auto mt-5 max-w-lg text-sm text-slate-600 dark:text-slate-300">
            por completar la autoevaluación de accesibilidad e inclusión laboral
            en el marco de la <b>Ley 21.015</b>, obteniendo un nivel{" "}
            <b className={theme.text}>{level.label}</b> con un{" "}
            <b>{score}%</b> de cumplimiento.
          </p>

          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-400 dark:border-slate-700">
            <span>Emitido: {fecha}</span>
            <span>Código: {codigo}</span>
          </div>
          <p className="mt-3 text-[10px] text-slate-400">
            Verifica este certificado en {verifyUrl}
          </p>
          <p className="mt-1 text-[10px] text-slate-400">
            Autodiagnóstico realizado en Incluye. No constituye certificación
            legal de cumplimiento de la Ley 21.015.
          </p>
        </div>
      </div>
    </div>
  );
}
