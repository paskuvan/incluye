-- Fase — Experiencias: reseñas de candidatos sobre la inclusión real de empresas
-- Da voz a personas con discapacidad para transparentar procesos y prevenir la
-- "falsa inclusión". Envío público (anónimo), moderado antes de publicarse.

create table if not exists public.experiences (
  id                 uuid primary key default gen_random_uuid(),
  company_name       text not null,
  role               text,                 -- cargo al que postuló (opcional)
  rating             integer check (rating between 1 and 5),
  had_interpreter    boolean,              -- ¿hubo intérprete / comunicación accesible?
  process_accessible boolean,              -- ¿el proceso fue accesible?
  offer_real         boolean,              -- ¿la inclusión fue real (no fachada)?
  comment            text not null,
  contact_email      text,                 -- privado, solo para verificación; no se muestra
  status             text not null default 'pending'
                       check (status in ('pending', 'approved', 'rejected')),
  created_at         timestamptz not null default now()
);

create index if not exists experiences_status_idx on public.experiences (status);

alter table public.experiences enable row level security;

-- Lectura pública: solo experiencias aprobadas.
create policy "experiences_select_approved"
  on public.experiences for select
  to anon, authenticated
  using (status = 'approved');

-- Envío público: cualquiera puede enviar, siempre como 'pending'.
create policy "experiences_insert_public"
  on public.experiences for insert
  to anon, authenticated
  with check (status = 'pending');

-- Moderación: solo admins de plataforma (ver todo, aprobar, rechazar, borrar).
create policy "experiences_admin_all"
  on public.experiences for all
  to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());
