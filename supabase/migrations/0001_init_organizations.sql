-- Fase 1 — Organizaciones y membresías con RLS
-- Cada empresa que usa Incluye es una "organization". Los usuarios se vinculan
-- a una organización a través de "members" con un rol.

-- =========================================================================
-- Tablas
-- =========================================================================

create table if not exists public.organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  rut         text,                       -- RUT de la empresa (Chile), opcional
  employees   integer,                    -- dotación, para la cuota Ley 21.015
  created_by  uuid not null references auth.users (id) on delete restrict,
  created_at  timestamptz not null default now()
);

create table if not exists public.members (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id         uuid not null references auth.users (id) on delete cascade,
  role            text not null default 'member'
                    check (role in ('owner', 'admin', 'member')),
  created_at      timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists members_user_id_idx on public.members (user_id);
create index if not exists members_org_id_idx on public.members (organization_id);

-- =========================================================================
-- Helpers (SECURITY DEFINER para evitar recursión en las políticas RLS)
-- =========================================================================

-- IDs de las organizaciones a las que pertenece el usuario actual.
create or replace function public.user_org_ids()
returns setof uuid
language sql
security definer
stable
set search_path = public
as $$
  select organization_id from public.members where user_id = auth.uid();
$$;

-- ¿El usuario actual tiene alguno de estos roles en la organización?
create or replace function public.user_has_role(org uuid, roles text[])
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.members
    where organization_id = org
      and user_id = auth.uid()
      and role = any (roles)
  );
$$;

-- Al crear una organización, el creador queda como 'owner'.
create or replace function public.handle_new_organization()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.members (organization_id, user_id, role)
  values (new.id, new.created_by, 'owner');
  return new;
end;
$$;

drop trigger if exists on_organization_created on public.organizations;
create trigger on_organization_created
  after insert on public.organizations
  for each row execute function public.handle_new_organization();

-- =========================================================================
-- Row Level Security
-- =========================================================================

alter table public.organizations enable row level security;
alter table public.members enable row level security;

-- organizations ---------------------------------------------------------
-- Ver: solo las organizaciones donde el usuario es miembro.
create policy "orgs_select_members"
  on public.organizations for select
  to authenticated
  using (id in (select public.user_org_ids()));

-- Crear: cualquier usuario autenticado, siendo él mismo el creador.
create policy "orgs_insert_self"
  on public.organizations for insert
  to authenticated
  with check (created_by = auth.uid());

-- Editar: solo owners/admins de la organización.
create policy "orgs_update_admins"
  on public.organizations for update
  to authenticated
  using (public.user_has_role(id, array['owner', 'admin']))
  with check (public.user_has_role(id, array['owner', 'admin']));

-- Borrar: solo owners.
create policy "orgs_delete_owner"
  on public.organizations for delete
  to authenticated
  using (public.user_has_role(id, array['owner']));

-- members ---------------------------------------------------------------
-- Ver: los miembros de las organizaciones del usuario.
create policy "members_select_same_org"
  on public.members for select
  to authenticated
  using (organization_id in (select public.user_org_ids()));

-- Agregar miembros: solo owners/admins de esa organización.
create policy "members_insert_admins"
  on public.members for insert
  to authenticated
  with check (public.user_has_role(organization_id, array['owner', 'admin']));

-- Actualizar rol: solo owners/admins.
create policy "members_update_admins"
  on public.members for update
  to authenticated
  using (public.user_has_role(organization_id, array['owner', 'admin']))
  with check (public.user_has_role(organization_id, array['owner', 'admin']));

-- Quitar miembros: owners/admins, o el propio usuario saliéndose.
create policy "members_delete_admins_or_self"
  on public.members for delete
  to authenticated
  using (
    public.user_has_role(organization_id, array['owner', 'admin'])
    or user_id = auth.uid()
  );
