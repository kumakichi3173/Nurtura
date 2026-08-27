create table if not exists public.feedback (
  id bigint primary key generated always as identity,
  feedback_id text unique not null,
  title text not null,
  description text,
  category text,
  status text not null default 'new',
  priority text not null default 'medium',
  provider_name text,
  created_at timestamptz not null default now()
);