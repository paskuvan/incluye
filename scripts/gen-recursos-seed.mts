import { RECURSOS } from "../src/lib/reference/recursos";

// Semilla de recursos en ASCII (convert_from(decode(hex,'hex'),'UTF8')),
// inmune a la corrupción de acentos al pegar en el editor SQL.

const hx = (s: string) => Buffer.from(s, "utf8").toString("hex");
const v = (s: string) => `convert_from(decode('${hx(s)}','hex'),'UTF8')`;

const lines: string[] = ["-- Semilla de recursos (ASCII, inmune al pegado)"];

RECURSOS.forEach((cat, ci) => {
  lines.push(
    `insert into public.resource_categories (key, title, icon, sort_order) values ('${cat.key}', ${v(cat.titulo)}, ${v(cat.icon)}, ${ci}) on conflict (key) do nothing;`,
  );
});

lines.push("");

RECURSOS.forEach((cat) => {
  cat.recursos.forEach((r, ri) => {
    lines.push(
      `insert into public.resources (category_id, title, description, type, url, source, external, sort_order) values ((select id from public.resource_categories where key = '${cat.key}'), ${v(r.titulo)}, ${v(r.descripcion)}, ${v(r.tipo)}, ${v(r.url)}, ${v(r.fuente)}, ${r.externo}, ${ri});`,
    );
  });
});

console.log(lines.join("\n"));
