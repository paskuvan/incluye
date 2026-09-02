// Biblioteca de recursos de capacitación e inclusión.
// Incluye enlaces a fuentes oficiales/reconocidas (externas) y guías internas.
// Revisar los enlaces periódicamente por si cambian.

export type TipoRecurso = "Ley" | "Guía" | "Artículo" | "Herramienta";

export type Recurso = {
  titulo: string;
  descripcion: string;
  tipo: TipoRecurso;
  url: string;
  fuente: string;
  externo: boolean;
};

export type CategoriaRecurso = {
  key: string;
  titulo: string;
  icon: string;
  recursos: Recurso[];
};

export const RECURSOS: CategoriaRecurso[] = [
  {
    key: "marco-legal",
    titulo: "Marco legal",
    icon: "⚖️",
    recursos: [
      {
        titulo: "Ley 21.015 de Inclusión Laboral",
        descripcion:
          "Qué exige la ley, la cuota del 1% y las obligaciones para empresas de 100+ trabajadores.",
        tipo: "Ley",
        url: "https://www.senadis.gob.cl/pag/421/1694/ley_de_inclusion_laboral",
        fuente: "SENADIS",
        externo: true,
      },
      {
        titulo: "Inclusión Laboral — Dirección del Trabajo",
        descripcion:
          "Preguntas frecuentes, fiscalización y registro de contratos ante la DT.",
        tipo: "Artículo",
        url: "https://www.dt.gob.cl/portal/1627/w3-propertyvalue-167780.html",
        fuente: "Dirección del Trabajo",
        externo: true,
      },
      {
        titulo: "Guía resumen de la Ley 21.015",
        descripcion:
          "Resumen práctico para empresas: obligaciones, plazos y medidas alternativas.",
        tipo: "Guía",
        url: "https://fundacioncontrabajo.cl/blog/guias-para-la-empresa/guia-resumen-ley-21015/",
        fuente: "Fundación ConTrabajo",
        externo: true,
      },
    ],
  },
  {
    key: "buenas-practicas",
    titulo: "Buenas prácticas",
    icon: "🌱",
    recursos: [
      {
        titulo: "Red de Empresas Inclusivas (ReIN)",
        descripcion:
          "Comunidad de empresas que comparten buenas prácticas de inclusión laboral.",
        tipo: "Herramienta",
        url: "https://www.reinchile.cl/",
        fuente: "SOFOFA + OIT",
        externo: true,
      },
      {
        titulo: "Cómo implementar ajustes razonables",
        descripcion:
          "Guía interna: adaptaciones de puesto, horarios y entorno para personas con discapacidad.",
        tipo: "Guía",
        url: "/recursos/ajustes-razonables",
        fuente: "Incluye",
        externo: false,
      },
    ],
  },
  {
    key: "comunicacion-sordos",
    titulo: "Comunicación con personas sordas",
    icon: "🤟",
    recursos: [
      {
        titulo: "Buenas prácticas de atención a personas sordas",
        descripcion:
          "Cómo comunicarte, cuándo usar intérprete de LSCh y qué evitar en la atención.",
        tipo: "Guía",
        url: "/recursos/atencion-personas-sordas",
        fuente: "Incluye",
        externo: false,
      },
      {
        titulo: "Glosario de Lengua de Señas Chilena",
        descripcion:
          "Señas útiles por rubro para tu equipo de atención y trabajo diario.",
        tipo: "Herramienta",
        url: "/glosario",
        fuente: "Incluye",
        externo: false,
      },
    ],
  },
  {
    key: "accesibilidad-digital",
    titulo: "Accesibilidad digital",
    icon: "💻",
    recursos: [
      {
        titulo: "Pautas WCAG 2.1",
        descripcion:
          "Estándar internacional de accesibilidad web: contraste, teclado, subtítulos y más.",
        tipo: "Artículo",
        url: "https://www.w3.org/WAI/standards-guidelines/wcag/",
        fuente: "W3C — WAI",
        externo: true,
      },
    ],
  },
];
