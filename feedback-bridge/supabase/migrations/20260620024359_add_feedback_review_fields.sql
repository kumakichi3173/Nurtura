alter table feedback
add column if not exists owner text,
add column if not exists updated_at timestamp with time zone default now();