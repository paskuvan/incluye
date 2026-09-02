-- Fase D — Glosario LSCh gestionable + videos
-- Mueve el glosario a la base (editable desde admin) y agrega soporte de video
-- por seña, con un bucket de Storage público para los archivos.

-- =========================================================================
-- Tablas
-- =========================================================================

create table if not exists public.lsch_rubros (
  id          uuid primary key default gen_random_uuid(),
  key         text unique not null,
  title       text not null,
  icon        text not null default '',
  description text not null default '',
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.lsch_terms (
  id         uuid primary key default gen_random_uuid(),
  rubro_id   uuid not null references public.lsch_rubros (id) on delete cascade,
  palabra    text not null,
  contexto   text not null default '',
  video_url  text,
  sort_order integer not null default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists lsch_terms_rubro_idx on public.lsch_terms (rubro_id);

alter table public.lsch_rubros enable row level security;
alter table public.lsch_terms enable row level security;

-- Lectura: pública (el glosario es una página abierta).
create policy "lsch_rubros_select_public"
  on public.lsch_rubros for select
  to anon, authenticated
  using (true);

create policy "lsch_terms_select_public"
  on public.lsch_terms for select
  to anon, authenticated
  using (true);

-- Escritura: solo admins de plataforma.
create policy "lsch_rubros_write_admin"
  on public.lsch_rubros for all
  to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

create policy "lsch_terms_write_admin"
  on public.lsch_terms for all
  to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

-- =========================================================================
-- Storage: bucket público para los videos de señas
-- =========================================================================

insert into storage.buckets (id, name, public)
values ('lsch-videos', 'lsch-videos', true)
on conflict (id) do nothing;

-- Lectura pública de los videos.
create policy "lsch_videos_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'lsch-videos');

-- Subir/editar/borrar videos: solo admins.
create policy "lsch_videos_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'lsch-videos' and public.is_app_admin());

create policy "lsch_videos_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'lsch-videos' and public.is_app_admin());

create policy "lsch_videos_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'lsch-videos' and public.is_app_admin());

-- =========================================================================
-- Semilla del glosario actual
-- =========================================================================
-- Semilla del glosario LSCh (ASCII, inmune al pegado)
insert into public.lsch_rubros (key, title, icon, description, sort_order) values ('general', convert_from(decode('47656e6572616c202f20636f74696469616e6f','hex'),'UTF8'), convert_from(decode('f09f918b','hex'),'UTF8'), convert_from(decode('5365c3b161732062c3a173696361732070617261206375616c717569657220696e74657261636369c3b36e2e','hex'),'UTF8'), 0) on conflict (key) do nothing;
insert into public.lsch_rubros (key, title, icon, description, sort_order) values ('atencion', convert_from(decode('4174656e6369c3b36e20616c20636c69656e7465','hex'),'UTF8'), convert_from(decode('f09f9b8eefb88f','hex'),'UTF8'), convert_from(decode('5365c3b16173206672656375656e74657320656e206d6573c3b36e2c2072656365706369c3b36e2079206174656e6369c3b36e2064652070c3ba626c69636f2e','hex'),'UTF8'), 1) on conflict (key) do nothing;
insert into public.lsch_rubros (key, title, icon, description, sort_order) values ('salud', convert_from(decode('53616c7564','hex'),'UTF8'), convert_from(decode('f09f8fa5','hex'),'UTF8'), convert_from(decode('5365c3b161732070617261206174656e6369c3b36e20656e2073616c75642079206269656e65737461722e','hex'),'UTF8'), 2) on conflict (key) do nothing;
insert into public.lsch_rubros (key, title, icon, description, sort_order) values ('banca', convert_from(decode('42616e6361207920736572766963696f73','hex'),'UTF8'), convert_from(decode('f09f8fa6','hex'),'UTF8'), convert_from(decode('5365c3b161732070617261207472c3a16d697465732066696e616e636965726f73207920646520736572766963696f732e','hex'),'UTF8'), 3) on conflict (key) do nothing;
insert into public.lsch_rubros (key, title, icon, description, sort_order) values ('emergencias', convert_from(decode('456d657267656e63696173','hex'),'UTF8'), convert_from(decode('f09f9aa8','hex'),'UTF8'), convert_from(decode('5365c3b1617320636c617665207061726120736974756163696f6e65732064652072696573676f2e','hex'),'UTF8'), 4) on conflict (key) do nothing;

insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'general'), convert_from(decode('486f6c61','hex'),'UTF8'), convert_from(decode('53616c75646f20696e696369616c2e','hex'),'UTF8'), 0);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'general'), convert_from(decode('47726163696173','hex'),'UTF8'), convert_from(decode('41677261646563657220756e61206174656e6369c3b36e2e','hex'),'UTF8'), 1);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'general'), convert_from(decode('506f72206661766f72','hex'),'UTF8'), convert_from(decode('506564697220616c676f20636f6e20636f72746573c3ad612e','hex'),'UTF8'), 2);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'general'), convert_from(decode('53c3ad','hex'),'UTF8'), convert_from(decode('436f6e6669726d616369c3b36e2e','hex'),'UTF8'), 3);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'general'), convert_from(decode('4e6f','hex'),'UTF8'), convert_from(decode('4e6567616369c3b36e2e','hex'),'UTF8'), 4);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'general'), convert_from(decode('50657264c3b36e202f2064697363756c7061','hex'),'UTF8'), convert_from(decode('50656469722064697363756c706173206f207065726d69736f2e','hex'),'UTF8'), 5);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'general'), convert_from(decode('4179756461','hex'),'UTF8'), convert_from(decode('4f667265636572206f2070656469722061797564612e','hex'),'UTF8'), 6);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'general'), convert_from(decode('45737065726172','hex'),'UTF8'), convert_from(decode('50656469722061206c6120706572736f6e6120717565206167756172646520756e206d6f6d656e746f2e','hex'),'UTF8'), 7);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'atencion'), convert_from(decode('4269656e76656e69646f2f61','hex'),'UTF8'), convert_from(decode('526563696269722061206c6120706572736f6e612e','hex'),'UTF8'), 0);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'atencion'), convert_from(decode('4e6f6d627265','hex'),'UTF8'), convert_from(decode('506564697220656c206e6f6d627265206465206c6120706572736f6e612e','hex'),'UTF8'), 1);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'atencion'), convert_from(decode('446f63756d656e746f202f206361726e6574','hex'),'UTF8'), convert_from(decode('536f6c696369746172206964656e7469666963616369c3b36e2e','hex'),'UTF8'), 2);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'atencion'), convert_from(decode('50726563696f','hex'),'UTF8'), convert_from(decode('496e6469636172206f2070726567756e74617220656c2076616c6f722e','hex'),'UTF8'), 3);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'atencion'), convert_from(decode('5061676172','hex'),'UTF8'), convert_from(decode('5265666572697220616c207061676f2e','hex'),'UTF8'), 4);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'atencion'), convert_from(decode('426f6c657461202f2066616374757261','hex'),'UTF8'), convert_from(decode('456e74726567617220636f6d70726f62616e74652e','hex'),'UTF8'), 5);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'atencion'), convert_from(decode('5475726e6f202f206ec3ba6d65726f','hex'),'UTF8'), convert_from(decode('53697374656d61206465206174656e6369c3b36e20706f72207475726e6f732e','hex'),'UTF8'), 6);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'salud'), convert_from(decode('446f6c6f72','hex'),'UTF8'), convert_from(decode('496e6469636172206d6f6c6573746961206f20646f6c6f722e','hex'),'UTF8'), 0);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'salud'), convert_from(decode('4dc3a96469636f2f61','hex'),'UTF8'), convert_from(decode('5265666572697220616c2070726f666573696f6e616c2e','hex'),'UTF8'), 1);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'salud'), convert_from(decode('486f7261202f2063697461','hex'),'UTF8'), convert_from(decode('4167656e646172206f20636f6e6669726d617220756e6120686f72612e','hex'),'UTF8'), 2);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'salud'), convert_from(decode('4d65646963616d656e746f','hex'),'UTF8'), convert_from(decode('52656665726972206120756e2072656d6564696f2e','hex'),'UTF8'), 3);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'salud'), convert_from(decode('557267656e636961','hex'),'UTF8'), convert_from(decode('53697475616369c3b36e20717565207265717569657265206174656e6369c3b36e20696e6d6564696174612e','hex'),'UTF8'), 4);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'salud'), convert_from(decode('4578616d656e','hex'),'UTF8'), convert_from(decode('496e646963617220756e206578616d656e206f2070726f636564696d69656e746f2e','hex'),'UTF8'), 5);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'banca'), convert_from(decode('4375656e7461','hex'),'UTF8'), convert_from(decode('4375656e74612062616e6361726961206f20646520736572766963696f2e','hex'),'UTF8'), 0);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'banca'), convert_from(decode('44696e65726f','hex'),'UTF8'), convert_from(decode('526566657269722061206d6f6e746f73206f20656665637469766f2e','hex'),'UTF8'), 1);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'banca'), convert_from(decode('5461726a657461','hex'),'UTF8'), convert_from(decode('5461726a6574612064652064c3a96269746f2f6372c3a96469746f2e','hex'),'UTF8'), 2);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'banca'), convert_from(decode('436c617665','hex'),'UTF8'), convert_from(decode('436f6e7472617365c3b161206f2050494e2e','hex'),'UTF8'), 3);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'banca'), convert_from(decode('4669726d6172','hex'),'UTF8'), convert_from(decode('536f6c69636974617220756e61206669726d612e','hex'),'UTF8'), 4);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'banca'), convert_from(decode('436f6e747261746f','hex'),'UTF8'), convert_from(decode('446f63756d656e746f206465206163756572646f2e','hex'),'UTF8'), 5);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'emergencias'), convert_from(decode('456d657267656e636961','hex'),'UTF8'), convert_from(decode('416c657274617220756e612073697475616369c3b36e2067726176652e','hex'),'UTF8'), 0);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'emergencias'), convert_from(decode('53616c696461202f2065766163756172','hex'),'UTF8'), convert_from(decode('496e6469636172206c612076c3ad61206465206573636170652e','hex'),'UTF8'), 1);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'emergencias'), convert_from(decode('467565676f','hex'),'UTF8'), convert_from(decode('416c657274617220696e63656e64696f2e','hex'),'UTF8'), 2);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'emergencias'), convert_from(decode('50656c6967726f','hex'),'UTF8'), convert_from(decode('416476657274697220756e2072696573676f2e','hex'),'UTF8'), 3);
insert into public.lsch_terms (rubro_id, palabra, contexto, sort_order) values ((select id from public.lsch_rubros where key = 'emergencias'), convert_from(decode('43616c6d61202f207472616e7175696c6f','hex'),'UTF8'), convert_from(decode('5065646972206d616e74656e6572206c612063616c6d612e','hex'),'UTF8'), 4);
