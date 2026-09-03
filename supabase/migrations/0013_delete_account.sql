-- Fase — Perfil de cuenta: eliminar la propia cuenta (derecho ARCO / Ley 21.719)
-- El usuario puede borrar su cuenta y sus datos. Se eliminan sus empresas
-- (cascada a evaluaciones, tareas, vacantes, miembros) y su usuario de auth.

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

  -- Vacantes externas que haya creado (sin organización) — no caen por cascada.
  delete from public.jobs where created_by = uid and organization_id is null;

  -- Empresas creadas por el usuario: la cascada elimina evaluaciones, respuestas,
  -- tareas, vacantes, gestores, invitaciones y membresías asociadas.
  delete from public.organizations where created_by = uid;

  -- Finalmente, la cuenta de autenticación (membresías propias caen por cascada).
  delete from auth.users where id = uid;
end;
$$;
