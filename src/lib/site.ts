/**
 * URL base del sitio, usada para metadatos absolutos (Open Graph, sitemap, canónicos).
 *
 * Prioridad:
 *  1. NEXT_PUBLIC_SITE_URL  → defínela en Vercel con tu dominio real (ej. https://incluye.cl)
 *  2. VERCEL_PROJECT_PRODUCTION_URL → dominio de producción que Vercel inyecta solo
 *  3. localhost en desarrollo
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

export const siteName = "Incluye";

export const siteDescription =
  "Autoevalúa el cumplimiento de la Ley 21.015, publica empleos realmente inclusivos y da transparencia a la comunidad sorda con experiencias reales y glosario en Lengua de Señas Chilena.";
