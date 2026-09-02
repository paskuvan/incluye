import { MAX_PER_QUESTION, type Area, type Question } from "./catalog";

// Índice plano de preguntas por key, a partir de un catálogo dado.
function indexByKey(areas: Area[]): Record<string, { area: Area; question: Question }> {
  return Object.fromEntries(
    areas.flatMap((area) =>
      area.questions.map((question) => [question.key, { area, question }]),
    ),
  );
}

export type Answers = Record<string, number>; // question.key -> value (0..2)

export type AreaResult = {
  area: Area;
  score: number; // 0..100
  answered: number;
  total: number;
};

export type Recommendation = {
  questionKey: string;
  areaTitle: string;
  questionText: string;
  text: string;
};

export type AssessmentResult = {
  overall: number; // 0..100
  areas: AreaResult[];
  recommendations: Recommendation[];
  answeredCount: number;
  totalCount: number;
};

function pct(sum: number, max: number): number {
  if (max === 0) return 0;
  return Math.round((sum / max) * 100);
}

// Nivel cualitativo a partir del puntaje global.
export function scoreLevel(overall: number): {
  label: string;
  tone: "red" | "amber" | "green";
} {
  if (overall >= 80) return { label: "Avanzado", tone: "green" };
  if (overall >= 50) return { label: "En camino", tone: "amber" };
  return { label: "Inicial", tone: "red" };
}

export function computeResult(
  answers: Answers,
  catalog: Area[],
): AssessmentResult {
  const questionsByKey = indexByKey(catalog);

  const areas: AreaResult[] = catalog.map((area) => {
    const answered = area.questions.filter((q) => q.key in answers);
    const sum = answered.reduce((acc, q) => acc + (answers[q.key] ?? 0), 0);
    const max = answered.length * MAX_PER_QUESTION;
    return {
      area,
      score: pct(sum, max),
      answered: answered.length,
      total: area.questions.length,
    };
  });

  const answeredKeys = Object.keys(answers).filter((k) => k in questionsByKey);
  const totalSum = answeredKeys.reduce((acc, k) => acc + (answers[k] ?? 0), 0);
  const totalMax = answeredKeys.length * MAX_PER_QUESTION;

  // Recomendaciones: toda pregunta respondida por debajo del máximo.
  const recommendations: Recommendation[] = answeredKeys
    .filter((k) => (answers[k] ?? 0) < MAX_PER_QUESTION)
    .map((k) => {
      const { area, question } = questionsByKey[k];
      return {
        questionKey: k,
        areaTitle: area.title,
        questionText: question.text,
        text: question.recommendation,
      };
    });

  return {
    overall: pct(totalSum, totalMax),
    areas,
    recommendations,
    answeredCount: answeredKeys.length,
    totalCount: catalog.reduce((acc, a) => acc + a.questions.length, 0),
  };
}
