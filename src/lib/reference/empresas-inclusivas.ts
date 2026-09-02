// Empresas referentes en inclusión laboral en Chile.
// Fuente: directorio de socias de la Red de Empresas Inclusivas (ReIN) de
// SOFOFA + OIT. Ser socia/reconocida por ReIN NO equivale a una certificación
// legal de cumplimiento de la Ley 21.015, pero es el mejor referente público
// disponible de empresas que trabajan activamente en inclusión.
// Datos tomados de reinchile.cl (cuenta anual 2024–2025). Verificar periódicamente.

export type EmpresaReferente = {
  nombre: string;
  // Reconocida por gestión destacada de inclusión en la Asamblea ReIN 2025.
  destacada?: boolean;
};

export const FUENTE_REIN = {
  nombre: "Red de Empresas Inclusivas (ReIN) — SOFOFA + OIT",
  url: "https://www.reinchile.cl/",
  periodo: "Cuenta anual 2024–2025",
};

// Empresas reconocidas por gestión destacada (2025).
const DESTACADAS = new Set([
  "Arcos Dorados",
  "Sodexo",
  "Buró",
  "IBM",
  "BCI",
  "SMU",
]);

const NOMBRES = [
  "Abastible",
  "Ab InBev",
  "Accenture",
  "ACHS",
  "Adecco",
  "APL Logistics",
  "Arauco",
  "Arcos Dorados",
  "Ariztía",
  "Banchile",
  "Banco de Chile",
  "Banco Estado",
  "Banco Estado Express",
  "Banco Ripley",
  "Banco Internacional",
  "DKT",
  "Bayer",
  "BCI",
  "Bechtel",
  "Blue Express",
  "Bupa",
  "Buró",
  "Caja Los Andes",
  "Cardif",
  "CFL",
  "CIAL Alimentos",
  "Claro",
  "CAS",
  "CMPC",
  "Coca Cola Andina",
  "Colbún",
  "Construmart",
  "Corona",
  "Deloitte",
  "Dimacofi",
  "Duoc UC",
  "EBCO",
  "EFE",
  "Empresas Iansa",
  "Empresas SB",
  "Enel",
  "ENGIE",
  "Enjoy",
  "Essbio",
  "EY",
  "Falabella",
  "Finning",
  "Flex",
  "Globant",
  "Grupo Saesa",
  "GTD",
  "Hatch",
  "IBM",
  "Inacap",
  "IST",
  "Kaufmann",
  "Kibernum",
  "Komatsu Cummins",
  "Limchile",
  "Metlife",
  "Metro",
  "Microsoft",
  "Mutual",
  "Nestlé",
  "NTT Data",
  "Oxiquim",
  "Pampa Norte",
  "Parque del Recuerdo",
  "PF",
  "Polpaico",
  "Provida",
  "PUCobre",
  "PWC",
  "Randstad",
  "Ripley",
  "SAAM",
  "Sacyr",
  "Salfa",
  "SAP",
  "Scotiabank",
  "Sigdo Koppers",
  "Sky",
  "Softys",
  "SMU",
  "Sodexo",
  "Soprole",
  "SQM",
  "Tánica",
  "Tattersall",
  "Teck",
  "Transbank",
  "Transelec",
  "Ultramar",
  "Unilever",
  "Verisure",
  "VSPT",
  "Vulco",
  "Walmart",
  "Watts",
  "Workmate",
  "WOM",
];

export const EMPRESAS_REFERENTES: EmpresaReferente[] = NOMBRES.map((nombre) => ({
  nombre,
  ...(DESTACADAS.has(nombre) ? { destacada: true } : {}),
})).sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

export const TOTAL_EMPRESAS = EMPRESAS_REFERENTES.length;
