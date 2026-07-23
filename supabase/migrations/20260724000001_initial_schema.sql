-- Initial schema for the SUIIT student portal.
-- Catalog (departments/branches/subjects), user profiles, resources with
-- moderation workflow, per-user votes, and a private PDF storage bucket.

-- ═══════════════════════════════════════════════════
-- Catalog tables
-- ═══════════════════════════════════════════════════

create table public.departments (
  id text primary key,
  name text not null
);

create table public.branches (
  id text primary key,
  department_id text not null references public.departments (id) on delete cascade,
  name text not null
);

create table public.subjects (
  id text primary key,
  name text not null,
  code text not null,
  branch_id text not null references public.branches (id) on delete cascade,
  year int not null check (year between 1 and 4),
  semester int not null check (semester between 1 and 8),
  credits int not null check (credits >= 0),
  type text not null check (type in ('theory', 'lab', 'project', 'seminar', 'viva'))
);

create index subjects_branch_year_semester_idx on public.subjects (branch_id, year, semester);
create index subjects_search_idx on public.subjects using gin (to_tsvector('english', name || ' ' || code));

-- ═══════════════════════════════════════════════════
-- Profiles (one row per auth user)
-- ═══════════════════════════════════════════════════

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  batch text,
  branch_id text references public.branches (id) on delete set null,
  role text not null default 'student' check (role in ('student', 'moderator', 'admin')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile when a user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$;

-- Trigger-only function: make sure API roles cannot call it directly.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Users may edit their own profile, but never their own role.
create function public.prevent_role_self_change()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role
     and not exists (
       select 1 from public.profiles
       where id = (select auth.uid()) and role = 'admin'
     )
  then
    raise exception 'only admins can change roles';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_role
  before update on public.profiles
  for each row execute function public.prevent_role_self_change();

-- Role lookup used inside RLS policies. SECURITY DEFINER is required to avoid
-- recursive RLS on profiles; it lives in a private (non-exposed) schema and
-- only ever reads the calling user's own row.
create schema if not exists private;

create function private.current_user_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = auth.uid()
$$;

revoke execute on function private.current_user_role() from public, anon;
grant execute on function private.current_user_role() to authenticated;

-- ═══════════════════════════════════════════════════
-- Resources (notes, PYQs, videos, lab manuals)
-- ═══════════════════════════════════════════════════

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  subject_id text not null references public.subjects (id) on delete cascade,
  type text not null check (type in ('note', 'pyq', 'video', 'lab')),
  title text not null check (char_length(title) between 3 and 200),
  uploader_id uuid references public.profiles (id) on delete set null,
  author_name text not null,
  batch text,
  unit text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  is_verified boolean not null default false,
  badges text[] not null default '{}',
  -- type-specific fields
  file_path text,        -- storage object path for note/pyq/lab PDFs
  video_url text,        -- external link for videos (YouTube etc.)
  exam_type text check (exam_type in ('mid-sem', 'end-sem')),
  exam_year text,
  code_snippet text,
  viva_questions text[],
  created_at timestamptz not null default now(),
  check (type <> 'video' or video_url is not null),
  check (type = 'video' or file_path is not null)
);

create index resources_subject_status_idx on public.resources (subject_id, status);
create index resources_uploader_idx on public.resources (uploader_id);
create index resources_search_idx on public.resources using gin (to_tsvector('english', title));

-- ═══════════════════════════════════════════════════
-- Votes (one upvote per user per resource)
-- ═══════════════════════════════════════════════════

create table public.votes (
  user_id uuid not null references public.profiles (id) on delete cascade,
  resource_id uuid not null references public.resources (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, resource_id)
);

create index votes_resource_idx on public.votes (resource_id);

-- ═══════════════════════════════════════════════════
-- Row Level Security
-- ═══════════════════════════════════════════════════

alter table public.departments enable row level security;
alter table public.branches enable row level security;
alter table public.subjects enable row level security;
alter table public.profiles enable row level security;
alter table public.resources enable row level security;
alter table public.votes enable row level security;

-- Catalog: world-readable, admin-managed (writes happen via dashboard/migrations).
create policy "catalog readable by everyone" on public.departments
  for select to anon, authenticated using (true);
create policy "catalog readable by everyone" on public.branches
  for select to anon, authenticated using (true);
create policy "catalog readable by everyone" on public.subjects
  for select to anon, authenticated using (true);

-- Profiles: users see and edit their own row; moderators can read all
-- (needed to attribute pending uploads).
create policy "read own profile" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id or private.current_user_role() in ('moderator', 'admin'));

create policy "update own profile" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Resources: approved ones are public; uploaders see their own submissions;
-- moderators see everything.
create policy "approved resources are public" on public.resources
  for select to anon, authenticated
  using (status = 'approved');

create policy "uploaders see own submissions" on public.resources
  for select to authenticated
  using ((select auth.uid()) = uploader_id);

create policy "moderators see all resources" on public.resources
  for select to authenticated
  using (private.current_user_role() in ('moderator', 'admin'));

create policy "authenticated users can submit" on public.resources
  for insert to authenticated
  with check (
    (select auth.uid()) = uploader_id
    and status = 'pending'
    and is_verified = false
  );

create policy "moderators can moderate" on public.resources
  for update to authenticated
  using (private.current_user_role() in ('moderator', 'admin'))
  with check (private.current_user_role() in ('moderator', 'admin'));

create policy "uploaders can withdraw pending submissions" on public.resources
  for delete to authenticated
  using ((select auth.uid()) = uploader_id and status = 'pending');

create policy "admins can delete any resource" on public.resources
  for delete to authenticated
  using (private.current_user_role() = 'admin');

-- Votes: counts are public; users manage only their own vote.
create policy "vote counts are public" on public.votes
  for select to anon, authenticated using (true);

create policy "users can vote" on public.votes
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "users can unvote" on public.votes
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ═══════════════════════════════════════════════════
-- Data API grants
-- New Supabase projects no longer expose public tables automatically;
-- grant access explicitly (RLS above still controls row visibility).
-- ═══════════════════════════════════════════════════

grant usage on schema public to anon, authenticated;
grant select on public.departments, public.branches, public.subjects to anon, authenticated;
grant select on public.profiles to authenticated;
grant update (name, batch, branch_id) on public.profiles to authenticated;
grant select on public.resources, public.votes to anon, authenticated;
grant insert, update, delete on public.resources to authenticated;
grant insert, delete on public.votes to authenticated;

-- ═══════════════════════════════════════════════════
-- Storage: private bucket for PDFs (served via signed URLs)
-- ═══════════════════════════════════════════════════

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resources', 'resources', false, 20971520, array['application/pdf'])
on conflict (id) do nothing;

-- Uploads go to resources/<uid>/<filename>; users manage only their own folder.
create policy "users upload to own folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'resources'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users read own files, moderators read all" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'resources'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or private.current_user_role() in ('moderator', 'admin')
    )
  );

-- Once a resource is approved, its file becomes readable by everyone
-- (viewers download via signed URLs generated with this permission).
create policy "approved resource files are readable" on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'resources'
    and exists (
      select 1 from public.resources r
      where r.file_path = name and r.status = 'approved'
    )
  );

create policy "users delete own files" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'resources'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
