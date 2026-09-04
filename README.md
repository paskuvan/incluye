# Incluye ♿️

> **Accesibilidad que se transforma en inclusión real.**

**Incluye** es una plataforma SaaS B2B de inclusión laboral y accesibilidad diseñada para ayudar a empresas en Chile a evaluar su nivel de accesibilidad, identificar brechas y convertir los resultados en acciones concretas.

La plataforma pone especial foco en la **accesibilidad para personas sordas**, incorporando recursos de Lengua de Señas Chilena (LSCh), comunicación accesible y herramientas para construir entornos laborales más inclusivos.

Además, Incluye incorpora una **bolsa de empleos inclusivos** para acercar oportunidades laborales a personas con discapacidad y un espacio de experiencias de la comunidad para visibilizar prácticas de inclusión reales.

> ⚠️ **Nota:** Incluye es un proyecto tecnológico orientado a apoyar la gestión de inclusión y accesibilidad. Sus herramientas y contenidos no constituyen asesoría legal ni reemplazan la revisión profesional de la normativa vigente.

---

## ✨ ¿Qué problema resuelve?

Muchas organizaciones quieren avanzar en inclusión laboral, pero se enfrentan a preguntas como:

- ¿Qué tan accesibles son realmente nuestros procesos?
- ¿Cómo estamos en comunicación con personas sordas?
- ¿Qué brechas tenemos en contratación, cultura y accesibilidad?
- ¿Qué acciones deberíamos priorizar?
- ¿Cómo podemos hacer seguimiento de nuestras mejoras?
- ¿Cómo incorporamos recursos de LSCh en el entorno laboral?

**Incluye transforma estas preguntas en un proceso medible:**

**Evaluar → Detectar brechas → Recomendar → Actuar → Medir nuevamente.**

---

## 🎯 Propuesta de valor

### Para empresas

- Autoevaluación guiada de accesibilidad e inclusión.
- Puntaje global y resultados por área.
- Recomendaciones automáticas según las brechas detectadas.
- Plan de acción con responsables, fechas y estados.
- Historial para visualizar la evolución de la organización.
- Reportes y certificados descargables.
- Gestión de equipos y múltiples empresas.
- Registro de gestores de inclusión.
- Biblioteca de recursos y capacitación.
- Glosario de Lengua de Señas Chilena por rubro.
- Perfil público opcional de empresa.

### Para personas con discapacidad

- Bolsa de empleos inclusivos.
- Información sobre empresas y sus prácticas de inclusión.
- Recursos de accesibilidad.
- Información sobre comunicación accesible y LSCh.
- Espacio para compartir experiencias de forma moderada y, cuando corresponda, anónima.

---

## 🚀 Funcionalidades principales

| Módulo | Descripción |
| --- | --- |
| 🏢 Organizaciones | Registro y administración de empresas |
| 📋 Autoevaluación | Diagnóstico por áreas de inclusión y accesibilidad |
| 📊 Reportes | Resultados, puntajes, brechas y plan de acción |
| ✅ Plan de acción | Gestión de tareas, responsables, fechas y progreso |
| 📈 Historial | Evolución del nivel de inclusión a través del tiempo |
| 🏅 Certificado | Certificado de compromiso con código de verificación |
| 👥 Equipo | Invitaciones y roles por organización |
| ♿ Gestores de inclusión | Registro y seguimiento del gestor de inclusión |
| 💼 Empleos | Bolsa de empleos inclusivos y vacantes externas curadas |
| 🏷️ Perfil público | Perfil de empresa con información de inclusión |
| 🤟 Glosario LSCh | Términos y videos de señas organizados por rubro |
| 📚 Recursos | Biblioteca de contenidos y capacitación |
| 💬 Experiencias | Testimonios y experiencias moderadas de la comunidad |
| 🔎 Verificación | Verificación pública de certificados |
| 🔔 Alertas | Recordatorios sobre tareas, evaluaciones y gestión de inclusión |
| 🛠️ Administración | Gestión de preguntas, recursos, empleos y glosario |

---

## ♿ Accesibilidad como principio de diseño

La accesibilidad no es un módulo adicional de Incluye: es parte de cómo se construye el producto.

Actualmente se consideran, entre otros aspectos:

- Navegación mediante teclado.
- Foco visible en controles interactivos.
- Enlace para saltar directamente al contenido.
- Etiquetas accesibles para controles e iconos.
- `aria-label` en campos de búsqueda.
- Soporte para `prefers-reduced-motion`.
- Contenido y recursos relacionados con Lengua de Señas Chilena.
- Comunicación centrada en las necesidades de personas sordas.
- Diseño orientado a reducir barreras cognitivas y de interacción.

El objetivo es avanzar progresivamente hacia una experiencia alineada con buenas prácticas de accesibilidad web.

---

## 🧱 Arquitectura

Incluye utiliza una arquitectura basada en **Next.js + Supabase**.

```text
Incluye
│
├── Frontend
│   ├── Next.js App Router
│   ├── React
│   ├── TypeScript
│   └── Tailwind CSS
│
├── Backend / Data
│   └── Supabase
│       ├── PostgreSQL
│       ├── Authentication
│       ├── Row Level Security (RLS)
│       └── Storage
│
├── Business Logic
│   ├── Assessment & scoring
│   ├── Recommendations
│   ├── Action plans
│   ├── Reports
│   └── Reminders
│
└── Accessibility & Inclusion
    ├── LSCh glossary
    ├── Inclusive employment
    ├── Accessibility resources
    └── Community experiences
```

---

## 🛠️ Stack tecnológico

### Frontend

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- TypeScript
- [Tailwind CSS](https://tailwindcss.com/) 4

### Backend y datos

- [Supabase](https://supabase.com/)
- PostgreSQL
- Supabase Auth
- Row Level Security (RLS)
- Supabase Storage

### Herramientas

- ESLint
- Git / GitHub
- npm

---

## 📁 Estructura del proyecto

```text
incluye/
├── docs/                 # Concepto y documentación del proyecto
├── public/               # Recursos públicos
├── scripts/              # Scripts auxiliares
├── src/
│   ├── app/              # Rutas y páginas de Next.js
│   └── lib/
│       ├── assessment/   # Preguntas, evaluación y scoring
│       ├── reference/    # Recursos y referencias
│       └── supabase/     # Clientes Supabase
├── supabase/
│   └── migrations/       # Migraciones PostgreSQL
├── middleware.ts         # Protección de rutas
├── next.config.ts
├── package.json
└── README.md
```

---

## ⚙️ Instalación local

### Requisitos

- Node.js 20+
- npm
- Una cuenta/proyecto de Supabase

### 1. Clonar el repositorio

```bash
git clone https://github.com/paskuvan/incluye.git
cd incluye
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.local.example .env.local
```

Completa las variables con las credenciales de tu proyecto Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
```

**Nunca publiques claves privadas o secretos en el repositorio.**

### 4. Configurar la base de datos

Las migraciones se encuentran en:

```text
supabase/migrations/
```

Puedes aplicarlas utilizando Supabase CLI:

```bash
supabase login
supabase link --project-ref TU_PROJECT_REF
supabase db push
```

También puedes ejecutar las migraciones manualmente desde el **SQL Editor** de Supabase, respetando el orden de los archivos.

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Luego abre:

```text
http://localhost:3000
```

---

## 📜 Base de datos

El proyecto utiliza PostgreSQL mediante Supabase y aplica **Row Level Security (RLS)** para separar y proteger los datos de las organizaciones.

Entre las entidades principales se encuentran:

- `organizations`
- `members`
- `assessments`
- `answers`
- `action_items`
- `inclusion_managers`
- `jobs`
- `experiences`
- `lsch_rubros`
- `lsch_terms`
- `resources`
- `resource_categories`
- `assessment_areas`
- `assessment_questions`

Las migraciones permiten evolucionar el modelo de datos de forma controlada.

---

## 🧪 Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Ejecutar build de producción
npm run lint     # Revisar problemas de linting
```

---

## 🗺️ Estado del proyecto

Incluye se encuentra en una etapa de **MVP avanzado / desarrollo activo**.

Actualmente están implementados módulos como:

- Autenticación y organizaciones.
- Autoevaluación y scoring.
- Recomendaciones.
- Reportes.
- Plan de acción.
- Historial de evolución.
- Certificado y verificación.
- Gestión de equipos y roles.
- Gestores de inclusión.
- Bolsa de empleos inclusivos.
- Perfiles públicos de empresas.
- Glosario LSCh con soporte para video.
- Biblioteca de recursos.
- Experiencias de la comunidad.
- Alertas y recordatorios.
- Administración de contenidos.
- Mejoras específicas de accesibilidad.
- SEO y PWA básica.

Consulta el [roadmap](docs/ROADMAP.md) para conocer el detalle de las funcionalidades implementadas y las próximas etapas.

---

## 🔭 Próximos pasos

Algunas líneas de evolución del proyecto incluyen:

- Automatización de recordatorios por email.
- Perfiles de candidatos y postulación interna.
- Mayor cantidad de contenido audiovisual en LSCh.
- Modo de práctica frente a cámara para el glosario LSCh.
- Integración futura con tecnología de reconocimiento de señas.
- Mejoras continuas de accesibilidad y experiencia de usuario.
- Preparación para despliegue productivo con dominio propio.

---

## 💡 Visión

**Incluye busca cambiar la conversación sobre inclusión laboral:** pasar de simplemente **cumplir requisitos** a construir organizaciones donde las personas con discapacidad puedan participar, comunicarse y desarrollarse en igualdad de condiciones.

La inclusión no debería comenzar cuando una persona entra a trabajar.

**Debería comenzar mucho antes: en cómo una organización diseña sus procesos, espacios, tecnología y cultura.**

---

## 🤟 Enfoque en la comunidad sorda

El proyecto nace desde una perspectiva centrada en la accesibilidad para personas sordas y busca incorporar la **Lengua de Señas Chilena (LSCh)** como parte de la experiencia digital, no como un recurso secundario.

Esto incluye:

- Comunicación accesible.
- Recursos de LSCh por contexto laboral.
- Información sobre intérpretes.
- Evaluación de prácticas de comunicación.
- Indicadores relacionados con comunicación accesible.
- Visibilización de experiencias reales de personas con discapacidad.

---

## 👩‍💻 Autora

**Majo Paskuvan**  
UX/UI Designer · Frontend Developer · Accesibilidad Digital

Incluye combina diseño de experiencia, desarrollo web y accesibilidad con el objetivo de crear tecnología que reduzca barreras y genere oportunidades.

---

## 📄 Licencia

Este proyecto se encuentra actualmente sin una licencia de código abierto definida.

Si deseas reutilizar, modificar o distribuir el código, consulta primero con la autora.

---

## ⭐ Contribuciones

Las ideas, sugerencias y mejoras relacionadas con accesibilidad e inclusión son bienvenidas.

Si encuentras un problema o tienes una propuesta, puedes abrir un **Issue** en el repositorio.

---

<p align="center">
  <strong>Incluye</strong><br>
  Tecnología para una inclusión laboral más accesible, medible y real.
</p>
