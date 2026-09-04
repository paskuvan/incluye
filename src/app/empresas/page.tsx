import Link from "next/link";
import type { Metadata } from "next";
import PublicNav, { PublicFooter } from "@/components/public-nav";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Empresas según la comunidad",
  description:
    "Empresas valoradas por experiencias reales de personas con discapacidad. Transparencia, no autodeclaración.",
};

type Exp = {
  company_name: string;
  rating: number | null;
  offer_real: boolean | null;
  had_interpreter: boolean | null;
  process_accessible: boolean | null;
};

type Agg = {
  name: string;
  count: number;
  ratingSum: number;
  ratingN: number;
  real: number;
  realN: number;
  interp: number;
  interpN: number;
};

function ratio(ok: number, n: number): number | null {
  return n === 0 ? null : Math.round((ok / n) * 100);
}

function Signal({ label, pct }: { label: string; pct: number | null }) {
  if (pct === null) return null;
  const good = pct >= 60;
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
        good
          ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
      }`}
    >
      {label}: {pct}%
    </span>
  );
}

export default async function EmpresasPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("experiences")
    .select("company_name, rating, offer_real, had_interpreter, process_accessible")
    .eq("status", "approved");

  const map = new Map<string, Agg>();
  for (const e of (data as Exp[] | null) ?? []) {
    const key = e.company_name.trim().toLowerCase();
    const a =
      map.get(key) ??
      {
        name: e.company_name.trim(),
        count: 0,
        ratingSum: 0,
        ratingN: 0,
        real: 0,
        realN: 0,
        interp: 0,
        interpN: 0,
      };
    a.count++;
    if (e.rating != null) {
      a.ratingSum += e.rating;
      a.ratingN++;
    }
    if (e.offer_real != null) {
      a.realN++;
      if (e.offer_real) a.real++;
    }
    if (e.had_interpreter != null) {
      a.interpN++;
      if (e.had_interpreter) a.interp++;
    }
    map.set(key, a);
  }
  const companies = [...map.values()].sort((a, b) => b.count - a.count);

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNav />

      <section className="mx-auto max-w-3xl px-6 pb-16 pt-8">
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          Voz de la comunidad
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Empresas según la comunidad
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          Estas empresas están valoradas por <b>experiencias reales</b> de
          personas con discapacidad — no por lo que ellas dicen de sí mismas. Así
          se distingue la inclusión real de la de vitrina.
        </p>

        {companies.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-slate-600 dark:text-slate-400">
              Todavía no hay empresas valoradas. Las experiencias de la comunidad
              las irán construyendo.
            </p>
            <Link
              href="/experiencias"
              className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Comparte tu experiencia
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {companies.map((c) => {
              const avg = c.ratingN ? (c.ratingSum / c.ratingN).toFixed(1) : null;
              return (
                <article
                  key={c.name}
                  className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-semibold">{c.name}</h2>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {c.count} experiencia{c.count === 1 ? "" : "s"}
                      {avg && <> · {avg}★</>}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Signal label="Inclusión real" pct={ratio(c.real, c.realN)} />
                    <Signal
                      label="Comunicación accesible"
                      pct={ratio(c.interp, c.interpN)}
                    />
                  </div>
                </article>
              );
            })}
            <p className="pt-2 text-center text-sm text-slate-500 dark:text-slate-400">
              ¿Viviste un proceso con alguna empresa?{" "}
              <Link
                href="/experiencias"
                className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Comparte tu experiencia
              </Link>
            </p>
          </div>
        )}
      </section>

      <PublicFooter />
    </main>
  );
}
