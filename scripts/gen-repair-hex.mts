import { AREAS } from "../src/lib/assessment/catalog";

// Reconstruye cada campo con convert_from(decode('<hex-utf8>','hex'),'UTF8').
// Todo el SQL es ASCII (dígitos hex + palabras clave), así que es inmune a la
// corrupción de codificación que ocurre al pegar en el editor SQL.

const hx = (s: string) => Buffer.from(s, "utf8").toString("hex");
const val = (s: string) => `convert_from(decode('${hx(s)}','hex'),'UTF8')`;

const lines: string[] = [
  "-- Repair de codificacion del catalogo (solo ASCII, inmune al pegado)",
];

for (const area of AREAS) {
  lines.push(
    `update public.assessment_areas set title = ${val(area.title)}, description = ${val(area.description)}, icon = ${val(area.icon)} where key = '${area.key}';`,
  );
  for (const q of area.questions) {
    lines.push(
      `update public.assessment_questions set text = ${val(q.text)}, recommendation = ${val(q.recommendation)} where key = '${q.key}';`,
    );
  }
}

console.log(lines.join("\n"));
