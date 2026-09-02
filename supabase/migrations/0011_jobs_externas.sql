-- Fase — Vacantes externas curadas por admin
-- Permite publicar empleos inclusivos de empresas que NO están registradas en
-- Incluye. Estas vacantes no tienen organización asociada y las gestiona un
-- admin de plataforma.

-- La organización pasa a ser opcional (las externas no tienen).
alter table public.jobs alter column organization_id drop not null;

-- Origen de la vacante y nombre de la fuente (bolsa/portal), opcional.
alter table public.jobs
  add column if not exists source text not null default 'empresa'
    check (source in ('empresa', 'externa'));
alter table public.jobs
  add column if not exists source_name text;

-- Los admins de plataforma pueden gestionar cualquier vacante (incluidas las
-- externas sin organización). Se suma a las políticas existentes (permisivas).
create policy "jobs_admin_all"
  on public.jobs for all
  to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());
