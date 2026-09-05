-- Fase — Perfil de candidato + postulaciones internas (marketplace de dos lados).
-- Hasta ahora la bolsa era solo para empresas (postular por email/enlace externo).
-- Aquí una persona (ej. sorda) crea su perfil y postula DENTRO de Incluye, y la
-- empresa ve a sus postulantes.

-- 1) Perfil de candidato --------------------------------------------------------
create table if not exists public.candidate_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  headline text,                       -- ej. "Diseñador/a gráfico · usuario LSCh"
  bio text,
  region text,
  uses_lsch boolean not null default true,
  skills text,
  contact_email text,
  is_public boolean not null default false,  -- opt-in a aparecer públicamente
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.candidate_profiles enable row level security;

-- El titular gestiona su propio perfil.
drop policy if exists "cand_all_own" on public.candidate_profiles;
create policy "cand_all_own" on public.candidate_profiles
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Lectura pública si el candidato activó su perfil público.
drop policy if exists "cand_select_public" on public.candidate_profiles;
create policy "cand_select_public" on public.candidate_profiles
  for select
  to anon, authenticated
  using (is_public = true);

-- 2) Postulaciones --------------------------------------------------------------
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  candidate_id uuid not null references auth.users(id) on delete cascade,
  cover_note text,
  status text not null default 'sent'
    check (status in ('sent', 'reviewed', 'contacted', 'rejected')),
  created_at timestamptz not null default now(),
  unique (job_id, candidate_id)
);

create index if not exists applications_job_idx on public.applications (job_id);
create index if not exists applications_cand_idx on public.applications (candidate_id);

alter table public.applications enable row level security;

-- El candidato gestiona (crea/ve/retira) sus propias postulaciones.
drop policy if exists "app_insert_own" on public.applications;
create policy "app_insert_own" on public.applications
  for insert to authenticated
  with check (candidate_id = auth.uid());

drop policy if exists "app_select_own" on public.applications;
create policy "app_select_own" on public.applications
  for select to authenticated
  using (candidate_id = auth.uid());

drop policy if exists "app_delete_own" on public.applications;
create policy "app_delete_own" on public.applications
  for delete to authenticated
  using (candidate_id = auth.uid());

-- La empresa ve las postulaciones a sus vacantes y puede cambiar su estado.
drop policy if exists "app_select_org" on public.applications;
create policy "app_select_org" on public.applications
  for select to authenticated
  using (
    job_id in (
      select j.id from public.jobs j
      where j.organization_id in (select public.user_org_ids())
    )
  );

drop policy if exists "app_update_org" on public.applications;
create policy "app_update_org" on public.applications
  for update to authenticated
  using (
    job_id in (
      select j.id from public.jobs j
      where j.organization_id in (select public.user_org_ids())
    )
  )
  with check (
    job_id in (
      select j.id from public.jobs j
      where j.organization_id in (select public.user_org_ids())
    )
  );

-- La empresa puede ver el perfil de quienes postularon a sus vacantes
-- (aunque el perfil no sea público).
drop policy if exists "cand_select_applicants" on public.candidate_profiles;
create policy "cand_select_applicants" on public.candidate_profiles
  for select to authenticated
  using (
    user_id in (
      select a.candidate_id from public.applications a
      join public.jobs j on j.id = a.job_id
      where j.organization_id in (select public.user_org_ids())
    )
  );

-- 3) Postulantes de una empresa (join perfil + vacante) para el panel ----------
create or replace function public.org_applications(org uuid)
returns table (
  application_id uuid,
  job_id uuid,
  job_title text,
  candidate_id uuid,
  full_name text,
  headline text,
  region text,
  uses_lsch boolean,
  contact_email text,
  cover_note text,
  status text,
  created_at timestamptz
)
language sql
security definer
stable
set search_path = public
as $$
  select
    a.id, a.job_id, j.title, a.candidate_id,
    p.full_name, p.headline, p.region, p.uses_lsch, p.contact_email,
    a.cover_note, a.status, a.created_at
  from public.applications a
  join public.jobs j on j.id = a.job_id
  left join public.candidate_profiles p on p.user_id = a.candidate_id
  where j.organization_id = org
    and org in (select public.user_org_ids())
  order by a.created_at desc;
$$;

grant execute on function public.org_applications(uuid) to authenticated;
