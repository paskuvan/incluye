-- Fase — Gestor(a) de inclusión por empresa (Ley 21.275)
-- Cada empresa puede registrar uno o más gestores de inclusión laboral.

create table if not exists public.inclusion_managers (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name            text not null,
  role            text,                 -- cargo
  email           text,
  certified       boolean not null default false, -- certificado por ChileValora
  created_by      uuid not null references auth.users (id) on delete restrict,
  created_at      timestamptz not null default now()
);

create index if not exists inclusion_managers_org_idx
  on public.inclusion_managers (organization_id);

alter table public.inclusion_managers enable row level security;

-- Ver: miembros de la organización.
create policy "inclusion_managers_select_members"
  on public.inclusion_managers for select
  to authenticated
  using (organization_id in (select public.user_org_ids()));

-- Crear/editar/borrar: owners y admins de la organización.
create policy "inclusion_managers_insert_admins"
  on public.inclusion_managers for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and public.user_has_role(organization_id, array['owner', 'admin'])
  );

create policy "inclusion_managers_update_admins"
  on public.inclusion_managers for update
  to authenticated
  using (public.user_has_role(organization_id, array['owner', 'admin']))
  with check (public.user_has_role(organization_id, array['owner', 'admin']));

create policy "inclusion_managers_delete_admins"
  on public.inclusion_managers for delete
  to authenticated
  using (public.user_has_role(organization_id, array['owner', 'admin']));
