-- Fase — Ley 21.719: registro de consentimiento + exportación de datos (ARCO+)
-- Complementa delete_my_account (0013, supresión). Aquí:
--  1) consents: prueba de qué política aceptó cada titular, cuándo y cómo.
--  2) export_my_data: derecho de acceso y portabilidad (Art. 5).
-- El consentimiento es inmutable: revocar = insertar una fila nueva con revoked_at,
-- nunca sobrescribir (la carga de la prueba es del responsable).

-- 1) Registro de consentimiento -------------------------------------------------
create table if not exists public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  policy_version text not null,
  accepted_privacy boolean not null default false,
  accepted_terms boolean not null default false,
  user_agent text,
  method text not null default 'signup_checkbox',
  given_at timestamptz not null default now(),
  revoked_at timestamptz
);

create index if not exists consents_user_idx on public.consents (user_id, given_at desc);

alter table public.consents enable row level security;

-- El titular solo ve e inserta sus propios consentimientos; nunca se editan/borran.
drop policy if exists "consents_select_own" on public.consents;
create policy "consents_select_own" on public.consents
  for select using (user_id = auth.uid());

drop policy if exists "consents_insert_own" on public.consents;
create policy "consents_insert_own" on public.consents
  for insert with check (user_id = auth.uid());

-- El consentimiento se captura en el alta vía user_metadata y lo persiste este
-- trigger (SECURITY DEFINER). Así funciona con o sin confirmación de email,
-- sin depender de que exista sesión en el momento del registro.
create or replace function public.handle_new_user_consent()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.raw_user_meta_data ? 'consent_policy_version' then
    insert into public.consents (
      user_id, policy_version, accepted_privacy, accepted_terms, user_agent, method
    ) values (
      new.id,
      new.raw_user_meta_data->>'consent_policy_version',
      true,
      true,
      new.raw_user_meta_data->>'consent_user_agent',
      'signup_checkbox'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_consent on auth.users;
create trigger on_auth_user_created_consent
  after insert on auth.users
  for each row execute function public.handle_new_user_consent();

-- 2) Exportación de datos (derecho de acceso y portabilidad) --------------------
-- Reúne todos los datos personales del titular en un JSON estructurado.
-- No incluye hashes de contraseña ni secretos.
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

  return result;
end;
$$;

grant execute on function public.export_my_data() to authenticated;
