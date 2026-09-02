// Catálogo semilla de la autoevaluación. En runtime el catálogo se lee desde la
// base (ver `get-catalog.ts`); este archivo es la semilla y el fallback si la
// base está vacía. Las respuestas se guardan por `question.key`, así que NO
// cambies un key existente (crea uno nuevo si hace falta).

export type Area = {
  key: string;
  title: string;
  icon: string;
  description: string;
  questions: Question[];
};

export type Question = {
  key: string;
  text: string;
  // Recomendación que se muestra cuando la respuesta no es "Sí".
  recommendation: string;
};

// Escala de respuesta: mismo peso para todas las preguntas.
export const OPTIONS = [
  { value: 2, label: "Sí" },
  { value: 1, label: "En parte" },
  { value: 0, label: "No" },
] as const;

export const MAX_PER_QUESTION = 2;

export const AREAS: Area[] = [
  {
    key: "contratacion",
    title: "Contratación e inclusión laboral",
    icon: "🧑‍💼",
    description: "Cumplimiento de la Ley 21.015 y procesos de selección inclusivos.",
    questions: [
      {
        key: "contratacion.cuota",
        text: "¿Cumples la cuota del 1% de personas con discapacidad (Ley 21.015)?",
        recommendation:
          "Define un plan para alcanzar el 1%: reclutamiento con organizaciones de inclusión y, si aplica, medidas alternativas (donaciones o contratos con empresas inclusivas).",
      },
      {
        key: "contratacion.registro",
        text: "¿Registras los contratos de inclusión en la Dirección del Trabajo?",
        recommendation:
          "Registra los contratos de trabajadores con discapacidad en el portal de la Dirección del Trabajo dentro de los plazos legales.",
      },
      {
        key: "contratacion.procesos",
        text: "¿Tus procesos de selección son accesibles (postulación, entrevistas)?",
        recommendation:
          "Adapta avisos y entrevistas: formatos accesibles, intérprete de LSCh a pedido y ajustes razonables para postulantes con discapacidad.",
      },
    ],
  },
  {
    key: "espacio",
    title: "Espacio físico y digital",
    icon: "♿",
    description: "Accesibilidad de instalaciones, web y aplicaciones.",
    questions: [
      {
        key: "espacio.instalaciones",
        text: "¿Tus instalaciones tienen accesos, baños y señalética accesibles?",
        recommendation:
          "Realiza un diagnóstico de accesibilidad física (rampas, ascensores, baños, señalética) según la normativa de accesibilidad universal.",
      },
      {
        key: "espacio.web",
        text: "¿Tu sitio web y apps cumplen pautas de accesibilidad (WCAG)?",
        recommendation:
          "Audita tu web con las pautas WCAG 2.1 AA: contraste, navegación por teclado, textos alternativos y subtítulos en videos.",
      },
      {
        key: "espacio.emergencia",
        text: "¿Los protocolos de emergencia contemplan a personas sordas?",
        recommendation:
          "Incorpora alertas visuales (luces) y protocolos con avisos por texto para que personas sordas reciban las alarmas.",
      },
    ],
  },
  {
    key: "comunicacion",
    title: "Comunicación y atención",
    icon: "🤟",
    description: "Comunicación efectiva con personas sordas y usuarias de LSCh.",
    questions: [
      {
        key: "comunicacion.interprete",
        text: "¿Ofreces intérprete de Lengua de Señas Chilena cuando se necesita?",
        recommendation:
          "Establece un servicio de intérprete de LSCh (presencial o remoto) para atención y reuniones clave con personas sordas.",
      },
      {
        key: "comunicacion.subtitulos",
        text: "¿Subtitulas videos y reuniones importantes?",
        recommendation:
          "Activa subtítulos automáticos en reuniones y subtitula los videos institucionales y de capacitación.",
      },
      {
        key: "comunicacion.canales",
        text: "¿Tienes canales de atención por texto (chat, correo, WhatsApp)?",
        recommendation:
          "Ofrece canales escritos de atención para no depender del teléfono, que excluye a personas sordas.",
      },
    ],
  },
  {
    key: "cultura",
    title: "Cultura y capacitación",
    icon: "🎓",
    description: "Sensibilización, formación y liderazgo en inclusión.",
    questions: [
      {
        key: "cultura.capacitacion",
        text: "¿Capacitas a tu equipo en inclusión y trato con personas con discapacidad?",
        recommendation:
          "Implementa capacitaciones periódicas de sensibilización e inclusión, incluyendo nociones básicas de LSCh para equipos de atención.",
      },
      {
        key: "cultura.politica",
        text: "¿Tienes una política de inclusión y diversidad formalizada?",
        recommendation:
          "Redacta y publica una política de inclusión con objetivos, responsables y métricas de seguimiento.",
      },
      {
        key: "cultura.responsable",
        text: "¿Hay un responsable o comité de inclusión en la empresa?",
        recommendation:
          "Designa un responsable o comité de inclusión que lidere y dé seguimiento a las acciones.",
      },
    ],
  },
];

// Índice plano de preguntas por key (útil para reconstruir resultados).
export const QUESTIONS_BY_KEY: Record<string, { area: Area; question: Question }> =
  Object.fromEntries(
    AREAS.flatMap((area) =>
      area.questions.map((question) => [question.key, { area, question }]),
    ),
  );

export const TOTAL_QUESTIONS = AREAS.reduce(
  (acc, a) => acc + a.questions.length,
  0,
);
