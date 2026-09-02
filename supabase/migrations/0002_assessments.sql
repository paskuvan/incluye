-- Fase 2 — Autoevaluación de accesibilidad
-- Cada empresa puede hacer varias evaluaciones a lo largo del tiempo.
-- Las preguntas viven en el código (src/lib/assessment/catalog.ts); acá solo
-- se guardan las respuestas por "question_key" y el puntaje resultante.

create table if not exists public.assessments (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  status          text not null default 'completed'
                    check (status in ('in_progress', 'completed')),
  score           integer check (score between 0 and 100), -- puntaje global %
  created_by      uuid not null references auth.users (id) on delete restrict,
  created_at      timestamptz not null default now(),
  completed_at    timestamptz
);

create table if not exists public.answers (
  id            uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  question_key  text not null,
  value         integer not null check (value between 0 and 2), -- 0=No, 1=Parcial, 2=Sí
  created_at    timestamptz not null default now(),
  unique (assessment_id, question_key)
);

create index if not exists assessments_org_idx on public.assessments (organization_id);
create index if not exists answers_assessment_idx on public.answers (assessment_id);

-- Helper SECURITY DEFINER: ¿la evaluación pertenece a una org del usuario?
create or replace function public.assessment_in_user_orgs(aid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.assessments a
    join public.members m on m.organization_id = a.organization_id
    where a.id = aid and m.user_id = auth.uid()
  );
$$;

-- =========================================================================
-- RLS
-- =========================================================================

alter table public.assessments enable row level security;
alter table public.answers enable row level security;

-- assessments: acceso a los miembros de la organización.
create policy "assessments_select_members"
  on public.assessments for select
  to authenticated
  using (organization_id in (select public.user_org_ids()));

create policy "assessments_insert_members"
  on public.assessments for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and organization_id in (select public.user_org_ids())
  );

create policy "assessments_update_members"
  on public.assessments for update
  to authenticated
  using (organization_id in (select public.user_org_ids()))
  with check (organization_id in (select public.user_org_ids()));

create policy "assessments_delete_admins"
  on public.assessments for delete
  to authenticated
  using (public.user_has_role(organization_id, array['owner', 'admin']));

-- answers: acceso si la evaluación es de una org del usuario.
create policy "answers_select_members"
  on public.answers for select
  to authenticated
  using (public.assessment_in_user_orgs(assessment_id));

create policy "answers_insert_members"
  on public.answers for insert
  to authenticated
  with check (public.assessment_in_user_orgs(assessment_id));

create policy "answers_update_members"
  on public.answers for update
  to authenticated
  using (public.assessment_in_user_orgs(assessment_id))
  with check (public.assessment_in_user_orgs(assessment_id));

create policy "answers_delete_members"
  on public.answers for delete
  to authenticated
  using (public.assessment_in_user_orgs(assessment_id));
