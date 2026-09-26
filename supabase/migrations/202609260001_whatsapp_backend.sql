create table if not exists public.whatsapp_instances (
  instance_name text primary key,
  state text not null default 'close',
  phone_number text,
  connected_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.whatsapp_messages (
  id bigint generated always as identity primary key,
  instance_name text not null,
  remote_jid text not null,
  message_id text unique,
  direction text not null check (direction in ('inbound', 'outbound')),
  body text not null,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

alter table public.whatsapp_instances enable row level security;
alter table public.whatsapp_messages enable row level security;
revoke all on public.whatsapp_instances from anon, authenticated;
revoke all on public.whatsapp_messages from anon, authenticated;

create index if not exists whatsapp_messages_remote_jid_created_idx
  on public.whatsapp_messages (remote_jid, created_at desc);
