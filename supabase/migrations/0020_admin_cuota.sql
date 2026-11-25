-- Fase Admin — Lectura global para administradores de plataforma
-- Habilita reportes de cumplimiento que cruzan todas las empresas (p. ej. la
-- cuota del 1%, Ley 21.015). Los app_admins pueden LEER (solo select) empresas,
-- evaluaciones y respuestas de cualquier organización. Las políticas por
-- membresía existentes siguen vigentes; un select pasa si cualquiera aplica.

drop policy if exists "orgs_select_admin" on public.organizations;
create policy "orgs_select_admin"
  on public.organizations for select
  to authenticated
  using (public.is_app_admin());

drop policy if exists "assessments_select_admin" on public.assessments;
create policy "assessments_select_admin"
  on public.assessments for select
  to authenticated
  using (public.is_app_admin());

drop policy if exists "answers_select_admin" on public.answers;
create policy "answers_select_admin"
  on public.answers for select
  to authenticated
  using (public.is_app_admin());
