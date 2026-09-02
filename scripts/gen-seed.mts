import { AREAS } from "../src/lib/assessment/catalog";

const q = (s: string) => `'${s.replace(/'/g, "''")}'`;

const lines: string[] = ["-- Semilla del catálogo (generada desde catalog.ts)"];

AREAS.forEach((area, ai) => {
  lines.push(
    `insert into public.assessment_areas (key, title, icon, description, sort_order) values (${q(area.key)}, ${q(area.title)}, ${q(area.icon)}, ${q(area.description)}, ${ai}) on conflict (key) do nothing;`,
  );
});

lines.push("");

AREAS.forEach((area) => {
  area.questions.forEach((question, qi) => {
    lines.push(
      `insert into public.assessment_questions (area_id, key, text, recommendation, sort_order) values ((select id from public.assessment_areas where key = ${q(area.key)}), ${q(question.key)}, ${q(question.text)}, ${q(question.recommendation)}, ${qi}) on conflict (key) do nothing;`,
    );
  });
});

console.log(lines.join("\n"));
