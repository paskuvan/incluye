// Contenido de las guías internas de la biblioteca (Fase 4).
// Texto propio, factual y breve. Ampliar con el tiempo.

export type Guia = {
  slug: string;
  titulo: string;
  resumen: string;
  secciones: { titulo: string; puntos: string[] }[];
};

export const GUIAS: Record<string, Guia> = {
  "atencion-personas-sordas": {
    slug: "atencion-personas-sordas",
    titulo: "Buenas prácticas de atención a personas sordas",
    resumen:
      "Pautas simples para que tu equipo atienda de forma respetuosa y efectiva a personas sordas.",
    secciones: [
      {
        titulo: "Antes de comunicarte",
        puntos: [
          "Llama la atención con un gesto suave o tocando el hombro; no grites.",
          "Ubícate de frente, a la misma altura y con buena luz sobre tu rostro.",
          "Pregunta cómo prefiere comunicarse: LSCh, lectura labial, escritura.",
        ],
      },
      {
        titulo: "Durante la conversación",
        puntos: [
          "Habla claro y a ritmo natural; no exageres la vocalización.",
          "No tapes tu boca ni mires hacia otro lado mientras hablas.",
          "Usa apoyos: texto, papel, celular o pictogramas cuando ayude.",
          "Si hay intérprete de LSCh, dirígete a la persona, no al intérprete.",
        ],
      },
      {
        titulo: "Errores comunes a evitar",
        puntos: [
          "Asumir que todas las personas sordas leen los labios.",
          "Dar información importante solo por audio (llamados, alarmas).",
          "Apurar o responder por la persona.",
        ],
      },
    ],
  },
  "ajustes-razonables": {
    slug: "ajustes-razonables",
    titulo: "Cómo implementar ajustes razonables",
    resumen:
      "Adaptaciones del puesto y del entorno para que una persona con discapacidad trabaje en igualdad de condiciones.",
    secciones: [
      {
        titulo: "Qué son",
        puntos: [
          "Modificaciones necesarias y adecuadas que no impongan una carga desproporcionada a la empresa.",
          "Se definen caso a caso, conversando con la persona trabajadora.",
        ],
      },
      {
        titulo: "Ejemplos frecuentes",
        puntos: [
          "Flexibilidad horaria para controles médicos o terapias.",
          "Tecnología de apoyo: lectores de pantalla, software de subtitulado.",
          "Adaptación del espacio físico: accesos, mobiliario, señalética.",
          "Comunicación accesible: intérprete de LSCh, información por texto.",
        ],
      },
      {
        titulo: "Cómo gestionarlos",
        puntos: [
          "Consulta a la persona qué necesita; es la que mejor conoce su situación.",
          "Documenta el ajuste acordado y revisa su efectividad en el tiempo.",
          "Designa un responsable de inclusión que dé seguimiento.",
        ],
      },
    ],
  },
};
