-- Fase Admin de contenidos — Catálogo de evaluación gestionable + admins de plataforma
-- Mueve áreas y preguntas de la autoevaluación a la base para editarlas sin deploys.

-- =========================================================================
-- Admins de plataforma
-- =========================================================================

create table if not exists public.app_admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.app_admins enable row level security;

-- Cada quien puede saber si él mismo es admin; nadie se auto-agrega desde la app
-- (los admins se gestionan por SQL / service role).
create policy "app_admins_select_self"
  on public.app_admins for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.is_app_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.app_admins where user_id = auth.uid());
$$;

-- =========================================================================
-- Catálogo: áreas y preguntas
-- =========================================================================

create table if not exists public.assessment_areas (
  id          uuid primary key default gen_random_uuid(),
  key         text unique not null,
  title       text not null,
  icon        text not null default '',
  description text not null default '',
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.assessment_questions (
  id             uuid primary key default gen_random_uuid(),
  area_id        uuid not null references public.assessment_areas (id) on delete cascade,
  key            text unique not null,
  text           text not null,
  recommendation text not null default '',
  sort_order     integer not null default 0,
  active         boolean not null default true,
  created_at     timestamptz not null default now()
);

create index if not exists assessment_questions_area_idx
  on public.assessment_questions (area_id);

alter table public.assessment_areas enable row level security;
alter table public.assessment_questions enable row level security;

-- Lectura: cualquier usuario autenticado (la evaluación está tras login).
create policy "areas_select_authenticated"
  on public.assessment_areas for select
  to authenticated
  using (true);

create policy "questions_select_authenticated"
  on public.assessment_questions for select
  to authenticated
  using (true);

-- Escritura (crear/editar/borrar): solo admins de plataforma.
create policy "areas_write_admin"
  on public.assessment_areas for all
  to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

create policy "questions_write_admin"
  on public.assessment_questions for all
  to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

-- =========================================================================
-- Semilla del catálogo actual
-- =========================================================================
-- Semilla del catálogo (generada desde catalog.ts)
insert into public.assessment_areas (key, title, icon, description, sort_order) values ('contratacion', 'Contratación e inclusión laboral', '🧑‍💼', 'Cumplimiento de la Ley 21.015 y procesos de selección inclusivos.', 0) on conflict (key) do nothing;
insert into public.assessment_areas (key, title, icon, description, sort_order) values ('espacio', 'Espacio físico y digital', '♿', 'Accesibilidad de instalaciones, web y aplicaciones.', 1) on conflict (key) do nothing;
insert into public.assessment_areas (key, title, icon, description, sort_order) values ('comunicacion', 'Comunicación y atención', '🤟', 'Comunicación efectiva con personas sordas y usuarias de LSCh.', 2) on conflict (key) do nothing;
insert into public.assessment_areas (key, title, icon, description, sort_order) values ('cultura', 'Cultura y capacitación', '🎓', 'Sensibilización, formación y liderazgo en inclusión.', 3) on conflict (key) do nothing;

insert into public.assessment_questions (area_id, key, text, recommendation, sort_order) values ((select id from public.assessment_areas where key = 'contratacion'), 'contratacion.cuota', '¿Cumples la cuota del 1% de personas con discapacidad (Ley 21.015)?', 'Define un plan para alcanzar el 1%: reclutamiento con organizaciones de inclusión y, si aplica, medidas alternativas (donaciones o contratos con empresas inclusivas).', 0) on conflict (key) do nothing;
insert into public.assessment_questions (area_id, key, text, recommendation, sort_order) values ((select id from public.assessment_areas where key = 'contratacion'), 'contratacion.registro', '¿Registras los contratos de inclusión en la Dirección del Trabajo?', 'Registra los contratos de trabajadores con discapacidad en el portal de la Dirección del Trabajo dentro de los plazos legales.', 1) on conflict (key) do nothing;
insert into public.assessment_questions (area_id, key, text, recommendation, sort_order) values ((select id from public.assessment_areas where key = 'contratacion'), 'contratacion.procesos', '¿Tus procesos de selección son accesibles (postulación, entrevistas)?', 'Adapta avisos y entrevistas: formatos accesibles, intérprete de LSCh a pedido y ajustes razonables para postulantes con discapacidad.', 2) on conflict (key) do nothing;
insert into public.assessment_questions (area_id, key, text, recommendation, sort_order) values ((select id from public.assessment_areas where key = 'espacio'), 'espacio.instalaciones', '¿Tus instalaciones tienen accesos, baños y señalética accesibles?', 'Realiza un diagnóstico de accesibilidad física (rampas, ascensores, baños, señalética) según la normativa de accesibilidad universal.', 0) on conflict (key) do nothing;
insert into public.assessment_questions (area_id, key, text, recommendation, sort_order) values ((select id from public.assessment_areas where key = 'espacio'), 'espacio.web', '¿Tu sitio web y apps cumplen pautas de accesibilidad (WCAG)?', 'Audita tu web con las pautas WCAG 2.1 AA: contraste, navegación por teclado, textos alternativos y subtítulos en videos.', 1) on conflict (key) do nothing;
insert into public.assessment_questions (area_id, key, text, recommendation, sort_order) values ((select id from public.assessment_areas where key = 'espacio'), 'espacio.emergencia', '¿Los protocolos de emergencia contemplan a personas sordas?', 'Incorpora alertas visuales (luces) y protocolos con avisos por texto para que personas sordas reciban las alarmas.', 2) on conflict (key) do nothing;
insert into public.assessment_questions (area_id, key, text, recommendation, sort_order) values ((select id from public.assessment_areas where key = 'comunicacion'), 'comunicacion.interprete', '¿Ofreces intérprete de Lengua de Señas Chilena cuando se necesita?', 'Establece un servicio de intérprete de LSCh (presencial o remoto) para atención y reuniones clave con personas sordas.', 0) on conflict (key) do nothing;
insert into public.assessment_questions (area_id, key, text, recommendation, sort_order) values ((select id from public.assessment_areas where key = 'comunicacion'), 'comunicacion.subtitulos', '¿Subtitulas videos y reuniones importantes?', 'Activa subtítulos automáticos en reuniones y subtitula los videos institucionales y de capacitación.', 1) on conflict (key) do nothing;
insert into public.assessment_questions (area_id, key, text, recommendation, sort_order) values ((select id from public.assessment_areas where key = 'comunicacion'), 'comunicacion.canales', '¿Tienes canales de atención por texto (chat, correo, WhatsApp)?', 'Ofrece canales escritos de atención para no depender del teléfono, que excluye a personas sordas.', 2) on conflict (key) do nothing;
insert into public.assessment_questions (area_id, key, text, recommendation, sort_order) values ((select id from public.assessment_areas where key = 'cultura'), 'cultura.capacitacion', '¿Capacitas a tu equipo en inclusión y trato con personas con discapacidad?', 'Implementa capacitaciones periódicas de sensibilización e inclusión, incluyendo nociones básicas de LSCh para equipos de atención.', 0) on conflict (key) do nothing;
insert into public.assessment_questions (area_id, key, text, recommendation, sort_order) values ((select id from public.assessment_areas where key = 'cultura'), 'cultura.politica', '¿Tienes una política de inclusión y diversidad formalizada?', 'Redacta y publica una política de inclusión con objetivos, responsables y métricas de seguimiento.', 1) on conflict (key) do nothing;
insert into public.assessment_questions (area_id, key, text, recommendation, sort_order) values ((select id from public.assessment_areas where key = 'cultura'), 'cultura.responsable', '¿Hay un responsable o comité de inclusión en la empresa?', 'Designa un responsable o comité de inclusión que lidere y dé seguimiento a las acciones.', 2) on conflict (key) do nothing;
