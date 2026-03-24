-- Habit-level support system
-- Run this in your Supabase SQL editor.

alter table public.profiles
  add column if not exists display_name text,
  add column if not exists username text;

create unique index if not exists profiles_username_unique_idx
  on public.profiles (lower(username))
  where username is not null;

create table if not exists public.habit_support_invites (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  inviter_user_id uuid not null references auth.users(id) on delete cascade,
  invitee_email text not null,
  role text not null check (role in ('supporter', 'participant')),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  responded_at timestamptz
);

create unique index if not exists habit_support_invites_pending_unique_idx
  on public.habit_support_invites (habit_id, lower(invitee_email), role)
  where status = 'pending';

create table if not exists public.habit_support_members (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  invited_by_user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('supporter', 'participant')),
  created_at timestamptz not null default now(),
  unique (habit_id, user_id, role)
);

create table if not exists public.habit_support_events (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  actor_user_id uuid not null references auth.users(id) on delete cascade,
  target_user_id uuid references auth.users(id) on delete set null,
  event_type text not null check (event_type in ('invite_sent', 'invite_accepted', 'invite_declined', 'cheer', 'nudge', 'done_with_you', 'habit_completed')),
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.habit_support_invites enable row level security;
alter table public.habit_support_members enable row level security;
alter table public.habit_support_events enable row level security;

-- Policies for habit_support_invites

drop policy if exists "habit owners can create invites" on public.habit_support_invites;

create policy "habit owners can create invites"
  on public.habit_support_invites
  for insert
  to authenticated
  with check (
    inviter_user_id = auth.uid()
    and exists (
      select 1
      from public.habits
      where habits.id = habit_support_invites.habit_id
        and habits.user_id = auth.uid()
    )
  );

drop policy if exists "habit owners and invitees can read invites" on public.habit_support_invites;

create policy "habit owners and invitees can read invites"
  on public.habit_support_invites
  for select
  to authenticated
  using (
    inviter_user_id = auth.uid()
    or lower(invitee_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

drop policy if exists "invitees can update their invites" on public.habit_support_invites;

create policy "invitees can update their invites"
  on public.habit_support_invites
  for update
  to authenticated
  using (
    lower(invitee_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
  with check (
    lower(invitee_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- Policies for habit_support_members

drop policy if exists "members and habit owners can read members" on public.habit_support_members;

create policy "members and habit owners can read members"
  on public.habit_support_members
  for select
  to authenticated
  using (
    user_id = auth.uid()
    or invited_by_user_id = auth.uid()
    or exists (
      select 1
      from public.habits
      where 