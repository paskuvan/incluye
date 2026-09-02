# Incluye — Portal de accesibilidad para empresas

SaaS B2B que ayuda a las empresas chilenas a cumplir con la **Ley 21.015 de
Inclusión Laboral** y a mejorar su accesibilidad para personas sordas y con
discapacidad, con foco en la comunidad sorda.

## Problema

Las empresas de 100+ trabajadores en Chile deben cumplir la cuota del 1% de
personas con discapacidad (Ley 21.015). Muchas no saben cómo cumplir, cómo
documentarlo, ni cómo hacer sus procesos realmente accesibles. La comunicación
con personas sordas (Lengua de Señas Chilena) es un punto ciego frecuente.

## Propuesta de valor

Un panel donde la empresa:

1. **Se autoevalúa** en accesibilidad e inclusión (checklist guiado).
2. **Genera reportes** de cumplimiento descargables (para RRHH / auditoría).
3. **Accede a recursos y capacitación** — micro-cursos, buenas prácticas.
4. **Consulta un glosario de LSCh por rubro** (señas útiles para atención al
   cliente y trabajo diario).

## Módulos (MVP)

- **Auth de empresas** (Supabase Auth) — cada empresa es una organización.
- **Autoevaluación** — cuestionario por áreas (contratación, espacio físico,
  comunicación, cultura). Puntaje y recomendaciones.
- **Reportes** — estado de cumplimiento, exportable a PDF.
- **Recursos** — biblioteca de contenidos de capacitación.
- **Glosario LSCh** — se puede conectar más adelante con el motor de
  reconocimiento de señas del proyecto LSCH.

## Stack

- Next.js (App Router, TypeScript, Tailwind)
- Supabase (Postgres, Auth, RLS)

## Estado

Scaffold inicial. Próximos pasos en `docs/ROADMAP.md`.
