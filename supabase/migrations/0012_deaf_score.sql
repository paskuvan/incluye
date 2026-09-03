-- Fase — Sello "Comunicación con personas sordas"
-- Calcula, para una empresa con perfil público, su puntaje en el área
-- "comunicacion" de su última evaluación (0..100). Se usa para el sello público.

create or replace function public.public_company_deaf_score(oid uuid)
returns integer
language sql
security definer
stable
set search_path = public
as $$
  select round(avg(a.value)::numeric / 2 * 100)::int
  from public.answers a
  where a.assessment_id = (
    select ass.id
    from public.assessments ass
    join public.organizations o on o.id = ass.organization_id
    where ass.organization_id = oid and o.public_profile = true
    order by ass.created_at desc
    limit 1
  )
  and a.question_key like 'comunicacion.%';
$$;
