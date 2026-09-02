// Glosario de Lengua de Señas Chilena (LSCh) por rubro.
//
// IMPORTANTE: acá NO se describe cómo hacer cada seña (handshape/movimiento),
// porque una descripción textual imprecisa desinforma. Cada término guarda la
// palabra y su contexto de uso; la demostración visual (video/animación) se
// integrará más adelante con el motor de reconocimiento LSCH del usuario.

export type Termino = {
  palabra: string;
  contexto: string;
  // Se marcará true cuando exista video/animación de la seña.
  tieneVideo?: boolean;
  // URL del video de la seña (cuando existe).
  videoUrl?: string;
};

export type Rubro = {
  key: string;
  titulo: string;
  icon: string;
  descripcion: string;
  terminos: Termino[];
};

export const RUBROS: Rubro[] = [
  {
    key: "general",
    titulo: "General / cotidiano",
    icon: "👋",
    descripcion: "Señas básicas para cualquier interacción.",
    terminos: [
      { palabra: "Hola", contexto: "Saludo inicial." },
      { palabra: "Gracias", contexto: "Agradecer una atención." },
      { palabra: "Por favor", contexto: "Pedir algo con cortesía." },
      { palabra: "Sí", contexto: "Confirmación." },
      { palabra: "No", contexto: "Negación." },
      { palabra: "Perdón / disculpa", contexto: "Pedir disculpas o permiso." },
      { palabra: "Ayuda", contexto: "Ofrecer o pedir ayuda." },
      { palabra: "Esperar", contexto: "Pedir a la persona que aguarde un momento." },
    ],
  },
  {
    key: "atencion",
    titulo: "Atención al cliente",
    icon: "🛎️",
    descripcion: "Señas frecuentes en mesón, recepción y atención de público.",
    terminos: [
      { palabra: "Bienvenido/a", contexto: "Recibir a la persona." },
      { palabra: "Nombre", contexto: "Pedir el nombre de la persona." },
      { palabra: "Documento / carnet", contexto: "Solicitar identificación." },
      { palabra: "Precio", contexto: "Indicar o preguntar el valor." },
      { palabra: "Pagar", contexto: "Referir al pago." },
      { palabra: "Boleta / factura", contexto: "Entregar comprobante." },
      { palabra: "Turno / número", contexto: "Sistema de atención por turnos." },
    ],
  },
  {
    key: "salud",
    titulo: "Salud",
    icon: "🏥",
    descripcion: "Señas para atención en salud y bienestar.",
    terminos: [
      { palabra: "Dolor", contexto: "Indicar molestia o dolor." },
      { palabra: "Médico/a", contexto: "Referir al profesional." },
      { palabra: "Hora / cita", contexto: "Agendar o confirmar una hora." },
      { palabra: "Medicamento", contexto: "Referir a un remedio." },
      { palabra: "Urgencia", contexto: "Situación que requiere atención inmediata." },
      { palabra: "Examen", contexto: "Indicar un examen o procedimiento." },
    ],
  },
  {
    key: "banca",
    titulo: "Banca y servicios",
    icon: "🏦",
    descripcion: "Señas para trámites financieros y de servicios.",
    terminos: [
      { palabra: "Cuenta", contexto: "Cuenta bancaria o de servicio." },
      { palabra: "Dinero", contexto: "Referir a montos o efectivo." },
      { palabra: "Tarjeta", contexto: "Tarjeta de débito/crédito." },
      { palabra: "Clave", contexto: "Contraseña o PIN." },
      { palabra: "Firmar", contexto: "Solicitar una firma." },
      { palabra: "Contrato", contexto: "Documento de acuerdo." },
    ],
  },
  {
    key: "emergencias",
    titulo: "Emergencias",
    icon: "🚨",
    descripcion: "Señas clave para situaciones de riesgo.",
    terminos: [
      { palabra: "Emergencia", contexto: "Alertar una situación grave." },
      { palabra: "Salida / evacuar", contexto: "Indicar la vía de escape." },
      { palabra: "Fuego", contexto: "Alertar incendio." },
      { palabra: "Peligro", contexto: "Advertir un riesgo." },
      { palabra: "Calma / tranquilo", contexto: "Pedir mantener la calma." },
    ],
  },
];

export const TOTAL_TERMINOS = RUBROS.reduce(
  (acc, r) => acc + r.terminos.length,
  0,
);
