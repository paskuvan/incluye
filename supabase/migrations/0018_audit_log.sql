-- Fase — Registro de auditoría (Ley 21.719, Art. 14 sexies: trazabilidad).
-- Guarda quién hizo qué y cuándo sobre entidades clave. Solo lo leen los
-- administradores de la plataforma. Los eventos se escriben server-side
-- (triggers + funciones SECURITY DEFINER), nunca desde el cliente directamente.

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,                 -- auth.uid() del que ejecuta (null si sistema)
  actor_email text,
  action text not null,          -- ej. 'org_create', 'data_export', 'account_delete'
  entity text,                   -- ej. 'organization', 'job', 'account'
  entity_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_created_idx on public.audit_log (created_at desc);
create index if not exists audit_log_actor_idx on public.audit_log (actor_id);

alter table public.audit_log enable row level security;

-- Solo administradores de la plataforma pueden leer el registro.
drop policy if exists "audit_select_admin" on public.audit_log;
create policy "audit_select_admin" on public.audit_log
  for select using (public.is_app_admin());

-- Escritor central: registra un evento con el actor actual. SECURITY DEFINER
-- para poder insertar aunque el titular no tenga permiso de escritura directa.
create or replace function public.log_audit(
  p_action text,
  p_entity text,
  p_entity_id text,
  p_metadata jsonb default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_log (actor_id, actor_email, action, entity, entity_id, metadata)
  values (
    auth.uid(),
    (select email from auth.users where id = auth.uid()),
    p_action, p_entity, p_entity_id, p_metadata
  );
end;
$$;

-- Trigger genérico para altas/bajas de entidades. Deriva acción y entidad
-- desde el nombre de la tabla y la operación.
create or replace function public.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  ent text := tg_table_name;         -- 'organizations' | 'jobs'
  singular text := left(ent, length(ent) - 1);  -- 'organization' | 'job'
  act text := lower(tg_op);           -- 'insert' | 'delete'
  rid text;
begin
  if tg_op = 'DELETE' then
    rid := old.id::text;
    perform public.log_audit(singular || '_delete', singular, rid, null);
    return old;
  else
    rid := new.id::text;
    perform public.log_audit(singular || '_create', singular, rid, null);
    return new;
  end if;
end;
$$;

-- Auditar creación/eliminación de empresas y publicación de vacantes.
drop trigger if exists audit_organizations on public.organizations;
create trigger audit_organizations
  after insert or delete on public.organizations
  for each row execute function public.audit_row_change();

drop trigger if exists audit_jobs on public.jobs;
create trigger audit_jobs
  after insert or delete on public.jobs
  for each row execute function public.audit_row_change();

-- Registrar los derechos ARCO ejercidos, dentro de las funciones existentes.
create or replace function public.export_my_data()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  result jsonb;
begin
  if uid is null then
    raise exception 'No hay sesión activa';
  end if;

  select jsonb_build_object(
    'exportado_el', now(),
    'cuenta', (
      select jsonb_build_object('id', u.id, 'email', u.email, 'creada_el', u.created_at)
      from auth.users u where u.id = uid
    ),
    'consentimientos', coalesce((
      select jsonb_agg(to_jsonb(c) order by c.given_at desc)
      from public.consents c where c.user_id = uid
    ), '[]'::jsonb),
    'empresas', coalesce((
      select jsonb_agg(to_jsonb(o) order by o.created_at)
      from public.organizations o where o.created_by = uid
    ), '[]'::jsonb),
    'membresias', coalesce((
      select jsonb_agg(to_jsonb(m))
      from public.members m where m.user_id = uid
    ), '[]'::jsonb),
    'vacantes_creadas', coalesce((
      select jsonb_agg(to_jsonb(j) order by j.created_at)
      from public.jobs j where j.created_by = uid
    ), '[]'::jsonb)
  ) into result;

  perform public.log_audit('data_export', 'account', uid::text, null);
  return result;
end;
$$;

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'No hay sesión activa';
  end if;

  -- Se registra ANTES de borrar (después el actor deja de existir).
  perform public.log_audit('account_delete', 'account', uid::text, null);

  delete from public.jobs where created_by = uid and organization_id is null;
  delete from public.organizations where created_by = uid;
  delete from auth.users where id = uid;
end;
$$;
