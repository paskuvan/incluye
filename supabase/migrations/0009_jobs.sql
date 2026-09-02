-- Fase — Bolsa de empleos inclusivos
-- Las empresas publican vacantes; la página /empleos las muestra públicamente.
-- La postulación es por email o enlace externo (sin cuentas de candidatos).

create table if not exists public.jobs (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  company_name    text not null,            -- desnormalizado para listado público
  title           text not null,
  description     text not null default '',
  region          text,
  modality        text,                     -- Presencial / Remoto / Hibrido
  employment_type text,                     -- Jornada completa / parcial / etc
  apply_url       text,
  apply_email     text,
  status          text not null default 'open' check (status in ('open', 'closed')),
  created_by      uuid not null references auth.users (id) on delete restrict,
  created_at      timestamptz not null default now()
);

create index if not exists jobs_org_idx on public.jobs (organization_id);
create index if not exists jobs_status_idx on public.jobs (status);

alter table public.jobs enable row level security;

-- Lectura pública: solo vacantes abiertas.
create policy "jobs_select_public_open"
  on public.jobs for select
  to anon, authenticated
  using (status = 'open');

-- Lectura para miembros: todas las vacantes de su organización (abiertas o no).
create policy "jobs_select_members"
  on public.jobs for select
  to authenticated
  using (organization_id in (select public.user_org_ids()));

-- Crear/editar/borrar: owners y admins de la organización.
create policy "jobs_insert_admins"
  on public.jobs for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and public.user_has_role(organization_id, array['owner', 'admin'])
  );

create policy "jobs_update_admins"
  on public.jobs for update
  to authenticated
  using (public.user_has_role(organization_id, array['owner', 'admin']))
  with check (public.user_has_role(organization_id, array['owner', 'admin']));

create policy "jobs_delete_admins"
  on public.jobs for delete
  to authenticated
  using (public.user_has_role(organization_id, array['owner', 'admin']));
