import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

// Rutas públicas estáticas, con su prioridad relativa.
const staticRoutes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/empleos", priority: 0.9, changeFrequency: "daily" },
  { path: "/experiencias", priority: 0.9, changeFrequency: "daily" },
  { path: "/empresas", priority: 0.8, changeFrequency: "weekly" },
  { path: "/glosario", priority: 0.8, changeFrequency: "weekly" },
  { path: "/recursos", priority: 0.7, changeFrequency: "monthly" },
  { path: "/gestores", priority: 0.6, changeFrequency: "monthly" },
  { path: "/interpretes", priority: 0.6, changeFrequency: "monthly" },
  { path: "/verificar", priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacidad", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Perfiles públicos de empresa (si la función existe; si no, se omite sin romper).
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("list_public_companies");
    for (const row of (data as { id: string }[] | null) ?? []) {
      entries.push({
        url: `${siteUrl}/empresa/${row.id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch {
    // La función aún no está aplicada en la base: el sitemap sigue con las rutas estáticas.
  }

  return entries;
}
