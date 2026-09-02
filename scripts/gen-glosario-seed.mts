import { RUBROS } from "../src/lib/reference/glosario-lsch";

// Semilla del glosario en ASCII puro (convert_from(decode(hex,'hex'),'UTF8')),
// inmune a la corrupción de acentos al pegar en el editor SQL de Supabase.

const hx = (s: string) => Buffer.from(s, "utf8").toString("hex");
const v = (s: string) => `convert_from(decode('${hx(s)}','hex'),'UTF8')`;

const lines: string[] = [
  "-- Semilla del glosario LSCh (ASCII, inmune al pegado)",
];

RUBROS.forEach((r, ri) => {
  lines.push(
    `insert into public.lsch_rubros (key, title, icon, description, sort_order) values ('${r.key}', ${v(r.titulo)}, ${v(r.icon)}, ${v(r.descripcion)}, ${ri}) on conflict (key) do nothing;`,
  );
});

lines.push("");

RUBROS.forEach((r) => {
  r.terminos.forEach((t, ti) => {
    lines.push(
      `insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = '${r.key}'), ${v(t.palabra)}, ${v(t.contexto)}, ${ti});`,
    );
  });
});

console.log(lines.join("\n"));
