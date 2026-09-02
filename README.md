# Incluye

Portal de accesibilidad para empresas — SaaS B2B para cumplir la **Ley 21.015 de
Inclusión Laboral** en Chile y mejorar la accesibilidad para la comunidad sorda.

Ver el detalle del concepto en [`docs/CONCEPTO.md`](docs/CONCEPTO.md) y el plan en
[`docs/ROADMAP.md`](docs/ROADMAP.md).

## Stack

- Next.js 15 (App Router, TypeScript, Tailwind CSS)
- Supabase (Postgres, Auth, RLS)

## Configuración

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Crear el proyecto en [Supabase](https://supabase.com) (en tu **propia**
   cuenta) y aplicar las migraciones. Ver "Base de datos" más abajo.

3. Completar las claves (Supabase → Settings → API):

   ```bash
   cp .env.local.example .env.local
   ```

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://TU_PROJECT_REF.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
   ```

4. Levantar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abrir [http://localhost:3000](http://localhost:3000).

## Base de datos

Las migraciones están en `supabase/migrations/`
(`0001_init_organizations.sql`, `0002_assessments.sql`).

### Opción A — Supabase CLI (recomendado)

```bash
brew install supabase/tap/supabase   # instalar la CLI
cd incluye
supabase init                        # crea supabase/config.toml
supabase login
supabase link --project-ref TU_PROJECT_REF
supabase db push                     # aplica las migraciones al proyecto remoto
```

> El `project-ref` es el subdominio de la URL del proyecto
> (`https://<ref>.supabase.co`), en Supabase → Settings → General.
> Si `db push` reclama por el formato de versión, renombrá los archivos a
> `<timestamp>_nombre.sql` (ej. `20260829220000_init_organizations.sql`).

### Opción B — SQL Editor (sin CLI)

Copiá el contenido de cada archivo de `supabase/migrations/` (en orden) y
ejecutalo en el SQL Editor del dashboard de Supabase.

## Estructura

- `src/app` — rutas (App Router)
- `src/lib/supabase` — clientes de Supabase (browser y server)
- `src/lib/assessment` — catálogo de preguntas y lógica de puntaje
- `src/lib/reference` — datos de empresas referentes, recursos y glosario
- `supabase/migrations` — esquema (organizations, members, assessments, answers)
- `docs` — concepto y roadmap
