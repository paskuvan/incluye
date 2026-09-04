-- Fase — Listado de empresas con perfil público (para el sitemap / SEO).
-- Devuelve solo el id de las empresas que activaron su perfil público.
-- No expone datos sensibles; los detalles siguen tras get_public_company.
create or replace function public.list_public_companies()
returns table (id uuid)
language sql
security definer
stable
set search_path = public
as $$
  select o.id
  from public.organizations o
  where o.public_profile = true
  order by o.created_at desc
  limit 5000;
$$;

grant execute on function public.list_public_companies() to anon, authenticated;
