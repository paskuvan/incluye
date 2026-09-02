-- Fase Plan de acción — Tareas de seguimiento
-- Convierte las recomendaciones del diagnóstico (y tareas propias) en un plan
-- con estado, responsable y fecha límite.

create table if not exists public.action_items (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  question_key    text,                       -- recomendación de origen (null = tarea propia)
  title           text not null,
  area            text,
  status          text not null default 'pendiente'
                    check (status in ('pendiente', 'en_curso', 'hecho')),
  assigned_to     uuid references auth.users (id) on delete set null,
  due_date        date,
  created_by      uuid not null references auth.users (id) on delete restrict,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  completed_at    timestamptz
);

create index if not exists action_items_org_idx on public.action_items (organization_id);
-- Evita duplicar una tarea generada por la misma recomendación.
create unique index if not exists action_items_unique_question
  on public.action_items (organization_id, question_key)
  where question_key is not null;

-- Mantiene updated_at y completed_at al cambiar de estado.
create or replace function public.touch_action_item()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  if new.status = 'hecho' and old.status is distinct from 'hecho' then
    new.completed_at = now();
  elsif new.status <> 'hecho' then
    new.completed_at = null;
  end if;
  return new;
end;
$$;

drop trigger if exists action_items_touch on public.action_items;
create trigger action_items_touch
  before update on public.action_items
  for each row execute function public.touch_action_item();

-- =========================================================================
-- RLS
-- =========================================================================

alter table public.action_items enable row level security;

-- Ver: miembros de la organización.
create policy "action_items_select_members"
  on public.action_items for select
  to authenticated
  using (organization_id in (select public.user_org_ids()));

-- Crear: cualquier miembro (siendo él mismo el creador).
create policy "action_items_insert_members"
  on public.action_items for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and organization_id in (select public.user_org_ids())
  );

-- Actualizar: cualquier miembro (estado, responsable, fecha).
create policy "action_items_update_members"
  on public.action_items for update
  to authenticated
  using (organization_id in (select public.user_org_ids()))
  with check (organization_id in (select public.user_org_ids()));

-- Borrar: admins/owners, o quien la creó.
create policy "action_items_delete"
  on public.action_items for delete
  to authenticated
  using (
    public.user_has_role(organization_id, array['owner', 'admin'])
    or created_by = auth.uid()
  );
