create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  exam_year int,
  school_type text,
  weekly_study_capacity_hours int,
  target_score numeric(5,2),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin',
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.is_admin(check_user_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = check_user_id
  );
$$;

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  active boolean not null default true
);

create table if not exists public.exam_components (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  code text not null,
  name text not null,
  level text,
  active boolean not null default true,
  unique (subject_id, code)
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  parent_topic_id uuid references public.topics(id) on delete set null,
  code text not null,
  name text not null,
  description text,
  active boolean not null default true,
  unique (subject_id, code)
);

create table if not exists public.concepts (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete cascade,
  code text not null,
  name text not null,
  concept_type text not null,
  description text,
  prerequisite_concept_ids uuid[] default '{}',
  active boolean not null default true,
  unique (subject_id, code)
);

create table if not exists public.requirements (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  exam_component_id uuid references public.exam_components(id) on delete set null,
  code text not null,
  name text not null,
  description text,
  active boolean not null default true,
  unique (subject_id, code)
);

create table if not exists public.task_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  answer_mode text not null
);

create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  source_type text not null,
  title text not null,
  url text,
  license_notes text,
  year int,
  imported_at timestamptz not null default timezone('utc', now()),
  hash text
);

create table if not exists public.asset_groups (
  id uuid primary key default gen_random_uuid(),
  label text not null
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  asset_group_id uuid not null references public.asset_groups(id) on delete cascade,
  storage_path text not null,
  mime_type text not null,
  alt_text text,
  width int,
  height int
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  exam_component_id uuid references public.exam_components(id) on delete set null,
  primary_topic_id uuid not null references public.topics(id) on delete restrict,
  task_type_id uuid not null references public.task_types(id) on delete restrict,
  source_id uuid references public.sources(id) on delete set null,
  external_source_ref text,
  title text not null,
  prompt_md text not null,
  stimulus_md text,
  asset_group_id uuid references public.asset_groups(id) on delete set null,
  difficulty_base int not null check (difficulty_base between 1 and 10),
  cognitive_load text not null check (cognitive_load in ('low', 'medium', 'high')),
  estimated_time_sec int not null default 90,
  year int,
  official boolean not null default false,
  published boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.task_concepts (
  task_id uuid not null references public.tasks(id) on delete cascade,
  concept_id uuid not null references public.concepts(id) on delete cascade,
  weight numeric not null default 1.0,
  is_primary boolean not null default false,
  primary key (task_id, concept_id)
);

create table if not exists public.task_requirements (
  task_id uuid not null references public.tasks(id) on delete cascade,
  requirement_id uuid not null references public.requirements(id) on delete cascade,
  weight numeric not null default 1.0,
  primary key (task_id, requirement_id)
);

create table if not exists public.task_options (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  option_key text not null,
  option_text text not null,
  is_correct boolean not null default false,
  position int not null
);

create table if not exists public.solutions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null unique references public.tasks(id) on delete cascade,
  final_answer_text text,
  solution_md text not null,
  official_scoring_md text,
  answer_key_json jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.hints (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  hint_level int not null check (hint_level between 1 and 5),
  hint_md text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.worked_examples (
  id uuid primary key default gen_random_uuid(),
  concept_id uuid not null references public.concepts(id) on delete cascade,
  title text not null,
  example_md text not null,
  asset_group_id uuid references public.asset_groups(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.error_tags (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  code text not null,
  name text not null,
  description text,
  unique (subject_id, code)
);

create table if not exists public.user_concept_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  concept_id uuid not null references public.concepts(id) on delete cascade,
  mastery_score numeric not null default 0,
  stability_score numeric not null default 0,
  difficulty_score numeric not null default 0,
  consecutive_successes int not null default 0,
  last_seen_at timestamptz,
  next_due_at timestamptz,
  last_result text,
  lifetime_attempts int not null default 0,
  lifetime_successes int not null default 0,
  avg_response_time_sec numeric,
  hint_dependency_score numeric not null default 0,
  confidence_calibration_score numeric not null default 0,
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, concept_id)
);

create table if not exists public.user_requirement_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  requirement_id uuid not null references public.requirements(id) on delete cascade,
  readiness_score numeric not null default 0,
  last_seen_at timestamptz,
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, requirement_id)
);

create table if not exists public.user_task_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  last_seen_at timestamptz,
  times_seen int not null default 0,
  last_result text,
  last_response_time_sec int,
  last_confidence text,
  last_hint_level_used int default 0,
  suspended_until timestamptz,
  unique (user_id, task_id)
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mode text not null,
  subject_id uuid not null references public.subjects(id) on delete restrict,
  exam_component_id uuid references public.exam_components(id) on delete set null,
  planned_task_count int not null,
  completed_task_count int not null default 0,
  started_at timestamptz not null default timezone('utc', now()),
  ended_at timestamptz,
  config_json jsonb not null default '{}'::jsonb
);

create table if not exists public.session_tasks (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.study_sessions(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete restrict,
  order_index int not null,
  chosen_priority_score numeric,
  chosen_reason_json jsonb not null default '{}'::jsonb
);

create table if not exists public.task_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid references public.study_sessions(id) on delete set null,
  task_id uuid not null references public.tasks(id) on delete restrict,
  submitted_answer_json jsonb not null default '{}'::jsonb,
  result text not null,
  auto_score numeric,
  response_time_sec int,
  confidence text,
  hint_level_used int not null default 0,
  attempt_index int not null default 1,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.attempt_error_tags (
  attempt_id uuid not null references public.task_attempts(id) on delete cascade,
  error_tag_id uuid not null references public.error_tags(id) on delete cascade,
  primary key (attempt_id, error_tag_id)
);

create table if not exists public.saved_tasks (
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, task_id)
);

create table if not exists public.flagged_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.sources(id) on delete set null,
  status text not null,
  input_type text not null,
  payload_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz
);

create table if not exists public.import_job_items (
  id uuid primary key default gen_random_uuid(),
  import_job_id uuid not null references public.import_jobs(id) on delete cascade,
  raw_item_json jsonb not null,
  parsed_item_json jsonb,
  review_status text not null default 'pending',
  created_task_id uuid references public.tasks(id) on delete set null
);

create table if not exists public.content_change_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  diff_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

drop trigger if exists solutions_set_updated_at on public.solutions;
create trigger solutions_set_updated_at
before update on public.solutions
for each row execute function public.set_updated_at();

drop trigger if exists user_concept_progress_set_updated_at on public.user_concept_progress;
create trigger user_concept_progress_set_updated_at
before update on public.user_concept_progress
for each row execute function public.set_updated_at();

drop trigger if exists user_requirement_progress_set_updated_at on public.user_requirement_progress;
create trigger user_requirement_progress_set_updated_at
before update on public.user_requirement_progress
for each row execute function public.set_updated_at();

create index if not exists tasks_subject_published_idx
  on public.tasks(subject_id, published, active, difficulty_base);

create index if not exists tasks_exam_component_idx
  on public.tasks(exam_component_id, published, active);

create index if not exists task_concepts_concept_idx
  on public.task_concepts(concept_id, task_id);

create index if not exists user_concept_progress_due_idx
  on public.user_concept_progress(user_id, next_due_at);

create index if not exists user_task_progress_user_task_idx
  on public.user_task_progress(user_id, task_id);

create index if not exists study_sessions_user_started_idx
  on public.study_sessions(user_id, started_at desc);

create index if not exists task_attempts_user_created_idx
  on public.task_attempts(user_id, created_at desc);

create index if not exists import_jobs_status_idx
  on public.import_jobs(status, created_at desc);

alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.subjects enable row level security;
alter table public.exam_components enable row level security;
alter table public.topics enable row level security;
alter table public.concepts enable row level security;
alter table public.requirements enable row level security;
alter table public.task_types enable row level security;
alter table public.sources enable row level security;
alter table public.asset_groups enable row level security;
alter table public.assets enable row level security;
alter table public.tasks enable row level security;
alter table public.task_concepts enable row level security;
alter table public.task_requirements enable row level security;
alter table public.task_options enable row level security;
alter table public.solutions enable row level security;
alter table public.hints enable row level security;
alter table public.worked_examples enable row level security;
alter table public.error_tags enable row level security;
alter table public.user_concept_progress enable row level security;
alter table public.user_requirement_progress enable row level security;
alter table public.user_task_progress enable row level security;
alter table public.study_sessions enable row level security;
alter table public.session_tasks enable row level security;
alter table public.task_attempts enable row level security;
alter table public.attempt_error_tags enable row level security;
alter table public.saved_tasks enable row level security;
alter table public.flagged_tasks enable row level security;
alter table public.import_jobs enable row level security;
alter table public.import_job_items enable row level security;
alter table public.content_change_log enable row level security;

create policy "profiles own select"
on public.profiles for select
using ((select auth.uid()) = id);

create policy "profiles own insert"
on public.profiles for insert
with check ((select auth.uid()) = id);

create policy "profiles own update"
on public.profiles for update
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "admin_users admin select"
on public.admin_users for select
using (public.is_admin((select auth.uid())));

create policy "subjects authenticated read"
on public.subjects for select
using ((select auth.role()) = 'authenticated' and active = true);

create policy "exam_components authenticated read"
on public.exam_components for select
using ((select auth.role()) = 'authenticated' and active = true);

create policy "topics authenticated read"
on public.topics for select
using ((select auth.role()) = 'authenticated' and active = true);

create policy "concepts authenticated read"
on public.concepts for select
using ((select auth.role()) = 'authenticated' and active = true);

create policy "requirements authenticated read"
on public.requirements for select
using ((select auth.role()) = 'authenticated' and active = true);

create policy "task_types authenticated read"
on public.task_types for select
using ((select auth.role()) = 'authenticated');

create policy "tasks authenticated read published"
on public.tasks for select
using ((select auth.role()) = 'authenticated' and active = true and published = true);

create policy "task_concepts authenticated read"
on public.task_concepts for select
using (
  exists (
    select 1
    from public.tasks t
    where t.id = task_concepts.task_id
      and t.published = true
      and t.active = true
  )
);

create policy "task_requirements authenticated read"
on public.task_requirements for select
using (
  exists (
    select 1
    from public.tasks t
    where t.id = task_requirements.task_id
      and t.published = true
      and t.active = true
  )
);

create policy "task_options authenticated read"
on public.task_options for select
using (
  exists (
    select 1
    from public.tasks t
    where t.id = task_options.task_id
      and t.published = true
      and t.active = true
  )
);

create policy "solutions authenticated read"
on public.solutions for select
using (
  exists (
    select 1
    from public.tasks t
    where t.id = solutions.task_id
      and t.published = true
      and t.active = true
  )
);

create policy "hints authenticated read"
on public.hints for select
using (
  exists (
    select 1
    from public.tasks t
    where t.id = hints.task_id
      and t.published = true
      and t.active = true
  )
);

create policy "worked_examples authenticated read"
on public.worked_examples for select
using ((select auth.role()) = 'authenticated');

create policy "error_tags authenticated read"
on public.error_tags for select
using ((select auth.role()) = 'authenticated');

create policy "user_concept_progress own read"
on public.user_concept_progress for select
using ((select auth.uid()) = user_id);

create policy "user_concept_progress own write"
on public.user_concept_progress for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "user_requirement_progress own write"
on public.user_requirement_progress for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "user_task_progress own write"
on public.user_task_progress for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "study_sessions own write"
on public.study_sessions for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "session_tasks own read"
on public.session_tasks for select
using (
  exists (
    select 1
    from public.study_sessions s
    where s.id = session_tasks.session_id
      and s.user_id = (select auth.uid())
  )
);

create policy "session_tasks own insert"
on public.session_tasks for insert
with check (
  exists (
    select 1
    from public.study_sessions s
    where s.id = session_tasks.session_id
      and s.user_id = (select auth.uid())
  )
);

create policy "task_attempts own write"
on public.task_attempts for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "attempt_error_tags own write"
on public.attempt_error_tags for all
using (
  exists (
    select 1
    from public.task_attempts a
    where a.id = attempt_error_tags.attempt_id
      and a.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.task_attempts a
    where a.id = attempt_error_tags.attempt_id
      and a.user_id = (select auth.uid())
  )
);

create policy "saved_tasks own write"
on public.saved_tasks for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "flagged_tasks own write"
on public.flagged_tasks for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "sources admin only"
on public.sources for all
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

create policy "asset_groups admin only"
on public.asset_groups for all
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

create policy "assets admin only"
on public.assets for all
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

create policy "tasks admin manage"
on public.tasks for all
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

create policy "task_concepts admin manage"
on public.task_concepts for all
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

create policy "task_requirements admin manage"
on public.task_requirements for all
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

create policy "task_options admin manage"
on public.task_options for all
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

create policy "solutions admin manage"
on public.solutions for all
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

create policy "hints admin manage"
on public.hints for all
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

create policy "worked_examples admin manage"
on public.worked_examples for all
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

create policy "error_tags admin manage"
on public.error_tags for all
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

create policy "import_jobs admin manage"
on public.import_jobs for all
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

create policy "import_job_items admin manage"
on public.import_job_items for all
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

create policy "content_change_log admin manage"
on public.content_change_log for all
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));
