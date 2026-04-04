alter table public.assets
  add column if not exists role text not null default 'shared',
  add column if not exists position int not null default 0,
  add column if not exists page_number int,
  add column if not exists caption text,
  add column if not exists bucket text not null default 'assets';

alter table public.tasks
  add column if not exists payload_json jsonb not null default '{}'::jsonb;
