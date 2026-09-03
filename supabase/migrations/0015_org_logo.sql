-- Fase — Logo de la empresa (avatar)
-- Agrega logo_url a organizations, un bucket público para los logos, y expone
-- el logo en el perfil público.

alter table public.organizations
  add column if not exists logo_url text;

-- Bucket público para los logos.
insert into storage.buckets (id, name, public)
values ('org-logos', 'org-logos', true)
on conflict (id) do nothing;

-- Lectura pública de los logos.
create policy "org_logos_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'org-logos');

-- Subir/editar/borrar: owners/admins de la organización (la carpeta = orgId).
create policy "org_logos_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'org-logos'
    and (storage.foldername(name))[1] in (
      select organization_id::text from public.members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

create policy "org_logos_admin_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'org-logos'
    and (storage.foldername(name))[1] in (
      select organization_id::text from public.members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

create policy "org_logos_admin_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'org-logos'
    and (storage.foldername(name))[1] in (
      select organization_id::text from public.members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

-- Exponer el logo en el perfil público (recrear la función con la columna).
drop function if exists public.get_public_company(uuid);
create function public.get_public_company(oid uuid)
returns table (
  name text,
  employees integer,
  score integer,
  assessed_at timestamptz,
  certified_gestores integer,
  logo_url text
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
       where m.organization_id = o.id and m.certified),
    o.logo_url
  from public.organizations o
  where o.id = oid and o.public_profile = true;
$$;
