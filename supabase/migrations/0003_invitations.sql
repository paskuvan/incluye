-- Fase Equipo — Invitaciones y gestión de miembros
-- Un owner/admin invita por email. La persona invitada, al registrarse con ese
-- email, ve la invitación pendiente en su panel y la acepta (sin necesidad de
-- enviar correos ni exponer la tabla auth.users).

create table if not exists public.invitations (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  email           text not null,
  role            text not null default 'member' check (role in ('admin', 'member')),
  status          text not null default 'pending'
                    check (status in ('pending', 'accepted', 'declined', 'revoked')),
  token           uuid not null default gen_random_uuid(), -- para links futuros
  invited_by      uuid not null references auth.users (id) on delete restrict,
  created_at      timestamptz not null default now(),
  accepted_at     timestamptz
);

create index if not exists invitations_org_idx on public.invitations (organization_id);
create index if not exists invitations_email_idx on public.invitations (lower(email));
-- Una sola invitación pendiente por email y organización.
create unique index if not exists invitations_unique_pending
  on public.invitations (organization_id, lower(email))
  where status = 'pending';

-- =========================================================================
-- RLS
-- =========================================================================

alter table public.invitations enable row level security;

-- Ver: admins/owners de la org, o la persona invitada (por su email).
create policy "invitations_select"
  on public.invitations for select
  to authenticated
  using (
    public.user_has_role(organization_id, array['owner', 'admin'])
    or lower(email) = lower(auth.jwt() ->> 'email')
  );

-- Crear: solo owners/admins de la org.
create policy "invitations_insert_admins"
  on public.invitations for insert
  to authenticated
  with check (
    public.user_has_role(organization_id, array['owner', 'admin'])
    and invited_by = auth.uid()
  );

-- Revocar/actualizar: solo owners/admins.
create policy "invitations_update_admins"
  on public.invitations for update
  to authenticated
  using (public.user_has_role(organization_id, array['owner', 'admin']))
  with check (public.user_has_role(organization_id, array['owner', 'admin']));

create policy "invitations_delete_admins"
  on public.invitations for delete
  to authenticated
  using (public.user_has_role(organization_id, array['owner', 'admin']));

-- =========================================================================
-- Funciones
-- =========================================================================

-- Miembros de una org con su email (solo para miembros de esa org).
create or replace function public.get_org_members(org uuid)
returns table (user_id uuid, email text, role text, created_at timestamptz)
language sql
security definer
stable
set search_path = public
as $$
  select m.user_id, u.email::text, m.role, m.created_at
  from public.members m
  join auth.users u on u.id = m.user_id
  where m.organization_id = org
    and exists (
      select 1 from public.members me
      where me.organization_id = org and me.user_id = auth.uid()
    )
  order by m.created_at;
$$;

-- Invitaciones pendientes para el usuario actual (por su email).
create or replace function public.my_pending_invitations()
returns table (id uuid, organization_id uuid, org_name text, role text, created_at timestamptz)
language sql
security definer
stable
set search_path = public
as $$
  select i.id, i.organization_id, o.name, i.role, i.created_at
  from public.invitations i
  join public.organizations o on o.id = i.organization_id
  where i.status = 'pending'
    and lower(i.email) = lower(auth.jwt() ->> 'email')
  order by i.created_at desc;
$$;

-- Aceptar una invitación: crea la membresía y marca la invitación aceptada.
create or replace function public.accept_invitation(invitation_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  inv public.invitations;
begin
  select * into inv from public.invitations
  where id = invitation_id and status = 'pending';

  if not found then
    raise exception 'Invitación no encontrada o ya procesada';
  end if;

  if lower(inv.email) <> lower(auth.jwt() ->> 'email') then
    raise exception 'La invitación no corresponde a tu cuenta';
  end if;

  insert into public.members (organization_id, user_id, role)
  values (inv.organization_id, auth.uid(), inv.role)
  on conflict (organization_id, user_id) do nothing;

  update public.invitations
  set status = 'accepted', accepted_at = now()
  where id = invitation_id;

  return inv.organization_id;
end;
$$;

-- Rechazar una invitación propia.
create or replace function public.decline_invitation(invitation_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.invitations
  set status = 'declined'
  where id = invitation_id
    and status = 'pending'
    and lower(email) = lower(auth.jwt() ->> 'email');
$$;
