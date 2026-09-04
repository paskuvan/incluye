# Roadmap — Incluye

## Fase 0 — Scaffold (hecho)
- [x] Next.js + TypeScript + Tailwind
- [x] Cliente Supabase (browser + server)
- [x] Landing inicial
- [ ] Proyecto Supabase creado y `.env.local` completado

## Fase 1 — Auth y organizaciones (hecho)
- [x] Login / registro de empresas con Supabase Auth
- [x] Tabla `organizations` + `members` con RLS (`supabase/migrations/0001_init_organizations.sql`)
- [x] Layout de dashboard protegido (middleware + guarda en layout)
- [x] Onboarding: crear empresa + cálculo de cuota Ley 21.015
- [ ] Aplicar la migración en un proyecto Supabase propio y completar `.env.local`

## Fase 2 — Autoevaluación (hecho)
- [x] Modelo de datos: `assessments` + `answers` con RLS (`supabase/migrations/0002_assessments.sql`)
- [x] Catálogo de preguntas por áreas en código (`src/lib/assessment/catalog.ts`)
- [x] Cuestionario interactivo con progreso y puntaje por área (`/dashboard/org/[orgId]/evaluacion`)
- [x] Recomendaciones automáticas según respuestas (`src/lib/assessment/scoring.ts`)
- [x] Puntaje visible en el panel + CTA por empresa

## Fase 3 — Reportes (hecho)
- [x] Vista de estado de cumplimiento (`/dashboard/org/[orgId]/reporte`)
- [x] Reporte con puntaje global, por área, cuota Ley 21.015 y plan de acción
- [x] Exportar a PDF vía impresión del navegador (estilos `@media print`)
- [x] Accesos al reporte desde el panel y desde los resultados

## Fase 4 — Recursos y glosario (hecho)
- [x] Biblioteca de capacitación (`/recursos`) con enlaces oficiales + guías internas (`/recursos/[slug]`)
- [x] Glosario LSCh por rubro con búsqueda y filtros (`/glosario`)
- [x] Nav público reutilizable enlazando todas las secciones
- [ ] (Futuro) videos de señas + integración con el motor de reconocimiento LSCH

## Fase 5 — Equipo y roles (hecho)
- [x] Invitaciones por email (`supabase/migrations/0003_invitations.sql`)
- [x] Gestión de equipo: invitar, cambiar rol, quitar miembros (`/dashboard/org/[orgId]/equipo`)
- [x] Aceptar/rechazar invitaciones desde el panel
- [x] Funciones RLS-safe: `get_org_members`, `my_pending_invitations`, `accept_invitation`, `decline_invitation`

## Fase 6 — Plan de acción (hecho)
- [x] Tabla `action_items` con estado, responsable y fecha (`supabase/migrations/0004_action_items.sql`)
- [x] Tablero por estado (Pendiente / En curso / Hecho) en `/dashboard/org/[orgId]/plan`
- [x] Generar tareas desde las recomendaciones del diagnóstico (sin duplicar)
- [x] Agregar tareas propias, asignar responsable, fecha límite y progreso

## Fase 7 — Historial y evolución (hecho)
- [x] Gráfico SVG (sin dependencias) del puntaje global en el tiempo (`/dashboard/org/[orgId]/historial`)
- [x] Comparación por área vs. evaluación anterior (deltas)
- [x] Lista de evaluaciones con fecha, puntaje y nivel
- [x] Acceso desde el panel

## Fase 8 — Certificado / sello (hecho)
- [x] Certificado de compromiso con la inclusión (`/dashboard/org/[orgId]/certificado`)
- [x] Sello SVG con nivel, puntaje, fecha y código de verificación
- [x] Descarga a PDF vía impresión + acceso desde el panel

## Fase 9 — Admin de contenidos (hecho)
- [x] Catálogo de evaluación movido a la base (`assessment_areas`, `assessment_questions`) con semilla (`supabase/migrations/0005_content_admin.sql`)
- [x] Admins de plataforma (`app_admins` + `is_app_admin()`)
- [x] `getCatalog()` con fallback al catálogo de código si la base está vacía
- [x] Panel `/admin/preguntas`: CRUD de áreas, preguntas y recomendaciones
- [x] Enlace "Admin" en el panel solo para administradores

## Fase 10 — Recordatorios (parte 1: en la app)
- [x] Centro de alertas en el panel: tareas vencidas, por vencer y empresas a re-evaluar (`src/lib/reminders.ts`, `src/app/dashboard/alerts.tsx`)
- [x] Tolerante a que `action_items` (0004) no exista todavía
- [x] Parte 2a: envío bajo demanda ("Enviarme por email") vía Resend (`src/lib/email/resend.ts`)
- [ ] Parte 2b (pendiente): envío automático diario (deploy + cron/pg_cron + service_role)

## Fase 11 — Glosario LSCh con video (parte 1)
- [x] Glosario en la base (`lsch_rubros`, `lsch_terms`) con `video_url` y bucket Storage `lsch-videos` (`supabase/migrations/0006_glosario.sql`)
- [x] `getGlosario()` con fallback al código; página pública muestra video por seña
- [x] Panel admin `/admin/glosario`: editar rubros/términos y subir video
- [ ] Parte 2 (futuro): modo "practica frente a la cámara" con el motor LSCH

## Fase 12 — Multi-empresa / consultoras (hecho)
- [x] Crear empresas adicionales desde el panel (`/dashboard/empresas/nueva`, botón "Agregar empresa")
- [x] Vista de cartera: tabla comparativa de todas las empresas (puntaje, nivel, cuota, última eval.) con promedio
- [x] Sin migración nueva (aprovecha members multi-organización)

## Fase 13 — Admin de recursos (hecho)
- [x] Recursos en la base (`resource_categories`, `resources`) con RLS (`supabase/migrations/0007_recursos.sql`)
- [x] `getRecursos()` con fallback; página pública /recursos lee de la base
- [x] Panel admin `/admin/recursos`: CRUD de categorías y recursos

## Fase 14 — Gestores de inclusión (hecho)
- [x] Página pública /gestores: explica el rol y la Ley 21.275, con enlace al registro oficial de ChileValora (buscar/verificar certificados)
- [x] Sin scrapear datos personales; se enlaza la fuente oficial

## Fase 15 — Gestor de inclusión por empresa (hecho)
- [x] Tabla `inclusion_managers` con RLS (`supabase/migrations/0008_inclusion_managers.sql`)
- [x] Página /dashboard/org/[orgId]/gestor: registrar gestor(es), cargo, email, certificado, con enlace a verificar en ChileValora
- [x] Gestor mostrado en el reporte
- [x] Alerta "falta gestor" para empresas 100+ sin gestor (panel + email)

## Fase 16 — Bolsa de empleos inclusivos (MVP)
- [x] Tabla `jobs` con RLS (público ve abiertas; admins publican) (`supabase/migrations/0009_jobs.sql`)
- [x] Página pública /empleos con búsqueda y filtro por modalidad; postular por email/URL
- [x] Panel por empresa /dashboard/org/[orgId]/empleos: publicar, cerrar/reabrir, eliminar
- [x] Enlaces en nav público y en tarjeta de empresa
- [ ] Fase 2 (futuro): perfiles de candidatos + postulación interna

## Fase 17 — Perfil público de empresa + verificación (hecho)
- [x] `organizations.public_profile` (opt-in) + funciones `get_public_company`, `verify_certificate` (`supabase/migrations/0010_public_profile.sql`)
- [x] Página pública /empresa/[id]: nivel, gestor certificado, vacantes abiertas
- [x] Verificación de certificado /verificar y /verificar/[code]
- [x] Certificado muestra la URL de verificación; toggle de perfil público en el panel

## Fase 18 — Recuperar contraseña + editar/eliminar empresa (hecho)
- [x] Recuperar contraseña: /recuperar (envía enlace) y /actualizar-password (nueva clave), link en login
- [x] Editar empresa (nombre, RUT, trabajadores) en /dashboard/org/[orgId]/editar
- [x] Eliminar empresa (solo owner, con confirmación "ELIMINAR")
- [x] Acceso ✎ Editar en la tarjeta del panel

## Fase 19 — Accesibilidad de la app (hecho)
- [x] Foco visible por teclado en todo control interactivo (globals.css, vence a outline-none)
- [x] Respeta prefers-reduced-motion
- [x] Nombres accesibles en controles con solo íconos (✎ editar, ✕ eliminar) y en el toggle (role=switch)
- [x] aria-label en cajas de búsqueda (empresas, glosario, empleos)
- [x] Enlace "Saltar al contenido" en dashboard y admin (+ id en main)

## Fase 20 — Empleos externos curados (hecho)
- [x] `jobs.organization_id` opcional + `source`/`source_name` + política admin (`supabase/migrations/0011_jobs_externas.sql`)
- [x] Panel admin /admin/empleos: curar vacantes de otras empresas con enlace a la fuente
- [x] Badge "Externa" en la bolsa pública /empleos

## Fase 21 — Sello "Comunicación con personas sordas" (hecho)
- [x] Función `public_company_deaf_score` (puntaje del área comunicación, solo perfiles públicos) (`supabase/migrations/0012_deaf_score.sql`)
- [x] Sello en el perfil público /empresa/[id] cuando el puntaje ≥ 67%

## Fase 22 — Página de intérpretes LSCh (hecho)
- [x] /interpretes: cómo encontrar/verificar intérpretes, enlaces a ASOCH y ChileValora (sin scrapear datos personales)
- [x] Enlace en el nav público

## Fase 23 — Perfil / cuenta de usuario (hecho)
- [x] Página /dashboard/cuenta: ver email, cambiar contraseña, cambiar email
- [x] Eliminar cuenta (derecho ARCO) vía función `delete_my_account` (`supabase/migrations/0013_delete_account.sql`)
- [x] Acceso desde el email en el header del dashboard

## Fase 24 — Experiencias / transparencia contra la falsa inclusión (hecho)
- [x] Tabla `experiences` con RLS (público ve aprobadas, envío público como 'pending', admin modera) (`supabase/migrations/0014_experiencias.sql`)
- [x] Página pública /experiencias: compartir experiencia (anónima, moderada) + listado con señales (comunicación, proceso, inclusión real)
- [x] Moderación en /admin/experiencias (aprobar/rechazar/eliminar)
- [x] Enlaces en nav público y admin

## Fase 25 — "Empresas" reemplazada por voz de la comunidad (hecho)
- [x] Quitada la lista ReIN estática; /empresas ahora agrega experiencias aprobadas por empresa (sin migración)
- [x] Señales reales: "inclusión real" y "comunicación accesible" (% desde experiencias)
- [x] Home: KPI y tarjeta pasan de "Empresas referentes" a "Experiencias reales"
- [x] Eliminados archivos ReIN sin uso (empresas-inclusivas.ts, empresas-grid.tsx)

## Fase 26 — Logo / avatar de empresa (hecho)
- [x] `organizations.logo_url` + bucket Storage `org-logos` (RLS por org) + `get_public_company` con logo (`supabase/migrations/0015_org_logo.sql`)
- [x] Subir/cambiar/quitar logo en editar empresa; se muestra en el panel y el perfil público

## Fase 27 — SEO (hecho)
- [x] Metadata global: `metadataBase`, plantilla de títulos, Open Graph + Twitter Card, keywords, robots (`src/app/layout.tsx`, `src/lib/site.ts`)
- [x] `robots.txt` (bloquea panel/admin/auth) y `sitemap.xml` (rutas públicas + perfiles de empresa dinámicos) (`src/app/robots.ts`, `src/app/sitemap.ts`)
- [x] Imagen social generada con `next/og` (dark, identidad de marca) para OG y Twitter (`src/app/opengraph-image.tsx`, `src/app/twitter-image.tsx`)
- [x] `manifest.webmanifest` (PWA básica) (`src/app/manifest.ts`)
- [x] Función `list_public_companies()` para el sitemap (`supabase/migrations/0016_public_list.sql`)
- [ ] En producción: definir `NEXT_PUBLIC_SITE_URL` en Vercel con el dominio real
