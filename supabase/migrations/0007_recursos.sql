-- Fase E — Biblioteca de recursos gestionable
-- Mueve los recursos a la base para editarlos desde el admin sin deploys.

create table if not exists public.resource_categories (
  id         uuid primary key default gen_random_uuid(),
  key        text unique not null,
  title      text not null,
  icon       text not null default '',
  sort_order integer not null default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.resources (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.resource_categories (id) on delete cascade,
  title       text not null,
  description text not null default '',
  type        text not null default 'Guía',
  url         text not null default '',
  source      text not null default '',
  external    boolean not null default true,
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists resources_category_idx on public.resources (category_id);

alter table public.resource_categories enable row level security;
alter table public.resources enable row level security;

-- Lectura: pública.
create policy "resource_categories_select_public"
  on public.resource_categories for select
  to anon, authenticated
  using (true);

create policy "resources_select_public"
  on public.resources for select
  to anon, authenticated
  using (true);

-- Escritura: solo admins de plataforma.
create policy "resource_categories_write_admin"
  on public.resource_categories for all
  to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

create policy "resources_write_admin"
  on public.resources for all
  to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

-- =========================================================================
-- Semilla de recursos actual
-- =========================================================================
-- Semilla de recursos (ASCII, inmune al pegado)
insert into public.resource_categories (key, title, icon, sort_order) values ('marco-legal', convert_from(decode('4d6172636f206c6567616c','hex'),'UTF8'), convert_from(decode('e29a96efb88f','hex'),'UTF8'), 0) on conflict (key) do nothing;
insert into public.resource_categories (key, title, icon, sort_order) values ('buenas-practicas', convert_from(decode('4275656e6173207072c3a1637469636173','hex'),'UTF8'), convert_from(decode('f09f8cb1','hex'),'UTF8'), 1) on conflict (key) do nothing;
insert into public.resource_categories (key, title, icon, sort_order) values ('comunicacion-sordos', convert_from(decode('436f6d756e6963616369c3b36e20636f6e20706572736f6e617320736f72646173','hex'),'UTF8'), convert_from(decode('f09fa49f','hex'),'UTF8'), 2) on conflict (key) do nothing;
insert into public.resource_categories (key, title, icon, sort_order) values ('accesibilidad-digital', convert_from(decode('41636365736962696c69646164206469676974616c','hex'),'UTF8'), convert_from(decode('f09f92bb','hex'),'UTF8'), 3) on conflict (key) do nothing;

insert into public.resources (category_id, title, description, type, url, source, external, sort_order) values ((select id from public.resource_categories where key = 'marco-legal'), convert_from(decode('4c65792032312e30313520646520496e636c757369c3b36e204c61626f72616c','hex'),'UTF8'), convert_from(decode('5175c3a9206578696765206c61206c65792c206c612063756f74612064656c2031252079206c6173206f626c69676163696f6e6573207061726120656d707265736173206465203130302b2074726162616a61646f7265732e','hex'),'UTF8'), convert_from(decode('4c6579','hex'),'UTF8'), convert_from(decode('68747470733a2f2f7777772e73656e616469732e676f622e636c2f7061672f3432312f313639342f6c65795f64655f696e636c7573696f6e5f6c61626f72616c','hex'),'UTF8'), convert_from(decode('53454e41444953','hex'),'UTF8'), true, 0);
insert into public.resources (category_id, title, description, type, url, source, external, sort_order) values ((select id from public.resource_categories where key = 'marco-legal'), convert_from(decode('496e636c757369c3b36e204c61626f72616c20e280942044697265636369c3b36e2064656c2054726162616a6f','hex'),'UTF8'), convert_from(decode('50726567756e746173206672656375656e7465732c2066697363616c697a616369c3b36e207920726567697374726f20646520636f6e747261746f7320616e7465206c612044542e','hex'),'UTF8'), convert_from(decode('417274c3ad63756c6f','hex'),'UTF8'), convert_from(decode('68747470733a2f2f7777772e64742e676f622e636c2f706f7274616c2f313632372f77332d70726f706572747976616c75652d3136373738302e68746d6c','hex'),'UTF8'), convert_from(decode('44697265636369c3b36e2064656c2054726162616a6f','hex'),'UTF8'), true, 1);
insert into public.resources (category_id, title, description, type, url, source, external, sort_order) values ((select id from public.resource_categories where key = 'marco-legal'), convert_from(decode('4775c3ad6120726573756d656e206465206c61204c65792032312e303135','hex'),'UTF8'), convert_from(decode('526573756d656e207072c3a1637469636f207061726120656d7072657361733a206f626c69676163696f6e65732c20706c617a6f732079206d65646964617320616c7465726e6174697661732e','hex'),'UTF8'), convert_from(decode('4775c3ad61','hex'),'UTF8'), convert_from(decode('68747470733a2f2f66756e646163696f6e636f6e74726162616a6f2e636c2f626c6f672f67756961732d706172612d6c612d656d70726573612f677569612d726573756d656e2d6c65792d32313031352f','hex'),'UTF8'), convert_from(decode('46756e64616369c3b36e20436f6e54726162616a6f','hex'),'UTF8'), true, 2);
insert into public.resources (category_id, title, description, type, url, source, external, sort_order) values ((select id from public.resource_categories where key = 'buenas-practicas'), convert_from(decode('52656420646520456d70726573617320496e636c75736976617320285265494e29','hex'),'UTF8'), convert_from(decode('436f6d756e6964616420646520656d7072657361732071756520636f6d70617274656e206275656e6173207072c3a163746963617320646520696e636c757369c3b36e206c61626f72616c2e','hex'),'UTF8'), convert_from(decode('48657272616d69656e7461','hex'),'UTF8'), convert_from(decode('68747470733a2f2f7777772e7265696e6368696c652e636c2f','hex'),'UTF8'), convert_from(decode('534f464f4641202b204f4954','hex'),'UTF8'), true, 0);
insert into public.resources (category_id, title, description, type, url, source, external, sort_order) values ((select id from public.resource_categories where key = 'buenas-practicas'), convert_from(decode('43c3b36d6f20696d706c656d656e74617220616a75737465732072617a6f6e61626c6573','hex'),'UTF8'), convert_from(decode('4775c3ad6120696e7465726e613a2061646170746163696f6e65732064652070756573746f2c20686f726172696f73207920656e746f726e6f207061726120706572736f6e617320636f6e206469736361706163696461642e','hex'),'UTF8'), convert_from(decode('4775c3ad61','hex'),'UTF8'), convert_from(decode('2f7265637572736f732f616a75737465732d72617a6f6e61626c6573','hex'),'UTF8'), convert_from(decode('496e636c757965','hex'),'UTF8'), false, 1);
insert into public.resources (category_id, title, description, type, url, source, external, sort_order) values ((select id from public.resource_categories where key = 'comunicacion-sordos'), convert_from(decode('4275656e6173207072c3a1637469636173206465206174656e6369c3b36e206120706572736f6e617320736f72646173','hex'),'UTF8'), convert_from(decode('43c3b36d6f20636f6d756e6963617274652c206375c3a16e646f207573617220696e74c3a9727072657465206465204c5343682079207175c3a92065766974617220656e206c61206174656e6369c3b36e2e','hex'),'UTF8'), convert_from(decode('4775c3ad61','hex'),'UTF8'), convert_from(decode('2f7265637572736f732f6174656e63696f6e2d706572736f6e61732d736f72646173','hex'),'UTF8'), convert_from(decode('496e636c757965','hex'),'UTF8'), false, 0);
insert into public.resources (category_id, title, description, type, url, source, external, sort_order) values ((select id from public.resource_categories where key = 'comunicacion-sordos'), convert_from(decode('476c6f736172696f206465204c656e677561206465205365c3b16173204368696c656e61','hex'),'UTF8'), convert_from(decode('5365c3b1617320c3ba74696c657320706f7220727562726f20706172612074752065717569706f206465206174656e6369c3b36e20792074726162616a6f2064696172696f2e','hex'),'UTF8'), convert_from(decode('48657272616d69656e7461','hex'),'UTF8'), convert_from(decode('2f676c6f736172696f','hex'),'UTF8'), convert_from(decode('496e636c757965','hex'),'UTF8'), false, 1);
insert into public.resources (category_id, title, description, type, url, source, external, sort_order) values ((select id from public.resource_categories where key = 'accesibilidad-digital'), convert_from(decode('506175746173205743414720322e31','hex'),'UTF8'), convert_from(decode('457374c3a16e64617220696e7465726e6163696f6e616c2064652061636365736962696c69646164207765623a20636f6e7472617374652c207465636c61646f2c2073756274c3ad74756c6f732079206dc3a1732e','hex'),'UTF8'), convert_from(decode('417274c3ad63756c6f','hex'),'UTF8'), convert_from(decode('68747470733a2f2f7777772e77332e6f72672f5741492f7374616e64617264732d67756964656c696e65732f776361672f','hex'),'UTF8'), convert_from(decode('57334320e2809420574149','hex'),'UTF8'), true, 0);
