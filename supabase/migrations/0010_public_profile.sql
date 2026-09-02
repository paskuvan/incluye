-- Fase — Perfil público de empresa + verificación de certificado
-- La empresa decide (opt-in) si su perfil es público. La verificación de
-- certificado funciona por código para probar su autenticidad.

alter table public.organizations
  add column if not exists public_profile boolean not null default false;

-- Datos públicos de una empresa, solo si activó su perfil público.
create or replace function public.get_public_company(oid uuid)
returns table (
  name text,
  employees integer,
  score integer,
  assessed_at timestamptz,
  certified_gestores integer
)
language sql
security definer
stable
set search_path = public
as $$
  select
    o.name,
    o.employees,
    (select a.score from public.assessments a
       where a.organization_id = o.id order by a.created_at desc limit 1),
    (select a.created_at from public.assessments a
       where a.organization_id = o.id order by a.created_at desc limit 1),
    (select count(*)::int from public.inclusion_managers m
       where m.organization_id = o.id and m.certified)
  from public.organizations o
  where o.id = oid and o.public_profile = true;
$$;

-- Verifica un certificado por su código (primeros 8 caracteres del id de la
-- evaluación). Funciona aunque el perfil no sea público: el código prueba
-- autenticidad de un certificado que la empresa decidió compartir.
create or replace function public.verify_certificate(code text)
returns table (name text, score integer, issued_at timestamptz)
language sql
security definer
stable
set search_path = public
as $$
  select o.name, a.score, a.created_at
  from public.assessments a
  join public.organizations o on o.id = a.organization_id
  where upper(left(a.id::text, 8)) = upper(trim(code))
  order by a.created_at desc
  limit 1;
$$;
