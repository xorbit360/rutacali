create table if not exists public.whatsapp_contacts (
  id bigint generated always as identity primary key,
  remote_jid text not null unique,
  phone_number text not null unique,
  display_name text,
  business_name text,
  neighborhood text,
  commune text,
  consent_status text not null default 'pending'
    check (consent_status in ('pending', 'granted', 'denied')),
  consent_at timestamptz,
  current_route smallint check (current_route between 1 and 4),
  barrier_summary text,
  assigned_entity text,
  conversation_stage text not null default 'intake'
    check (conversation_stage in ('intake', 'awaiting_consent', 'triaged', 'case_created', 'human_handoff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rac_cases (
  id bigint generated always as identity primary key,
  case_code text not null unique,
  contact_id bigint not null references public.whatsapp_contacts(id) on delete restrict,
  source text not null default 'whatsapp' check (source in ('whatsapp', 'web', 'field_agent')),
  summary text not null,
  barrier text,
  route smallint not null check (route between 1 and 4),
  assigned_entity text not null,
  status text not null default 'received'
    check (status in ('received', 'in_review', 'assigned', 'resolved', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.automation_events (
  id bigint generated always as identity primary key,
  inbound_message_id text not null,
  contact_id bigint references public.whatsapp_contacts(id) on delete set null,
  action text not null,
  status text not null check (status in ('completed', 'rejected', 'failed')),
  payload jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  unique (inbound_message_id, action)
);

alter table public.whatsapp_messages
  add column if not exists processed_at timestamptz,
  add column if not exists processing_error text,
  add column if not exists llm_model text,
  add column if not exists prompt_tokens integer,
  add column if not exists completion_tokens integer;

create index if not exists rac_cases_contact_created_idx
  on public.rac_cases (contact_id, created_at desc);

create index if not exists automation_events_contact_created_idx
  on public.automation_events (contact_id, created_at desc);

alter table public.whatsapp_contacts enable row level security;
alter table public.rac_cases enable row level security;
alter table public.automation_events enable row level security;

revoke all on public.whatsapp_contacts from anon, authenticated;
revoke all on public.rac_cases from anon, authenticated;
revoke all on public.automation_events from anon, authenticated;
