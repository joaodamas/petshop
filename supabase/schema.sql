-- Extensions
create extension if not exists pgcrypto;

-- 1) TENANT (PETSHOP)
create table if not exists public.petshops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan text not null default 'free' check (plan in ('free','pro','enterprise')),
  owner_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.petshops add column if not exists plan text not null default 'free';
alter table public.petshops add column if not exists owner_id uuid references auth.users(id);

-- 2) USER MEMBERSHIP
create table if not exists public.petshop_members (
  petshop_id uuid not null references public.petshops(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin','staff')),
  created_at timestamptz not null default now(),
  primary key (petshop_id, user_id)
);

create or replace view public.v_current_petshop as
select m.user_id, m.petshop_id
from public.petshop_members m;

-- 3) CLIENTS
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  petshop_id uuid not null references public.petshops(id) on delete cascade,
  name text not null,
  cpf text,
  phone text,
  whatsapp text,
  email text,
  address text,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists clients_petshop_idx on public.clients(petshop_id);
create index if not exists clients_name_idx on public.clients using gin (to_tsvector('portuguese', name));

-- 4) PETS
create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  petshop_id uuid not null references public.petshops(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  species text,
  breed text,
  sex text,
  weight_kg numeric(6,2),
  birth_date date,
  notes text,
  allergies text,
  photo_url text,
  created_at timestamptz not null default now()
);
create index if not exists pets_petshop_idx on public.pets(petshop_id);
create index if not exists pets_client_idx on public.pets(client_id);

-- 5) SERVICES
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  petshop_id uuid not null references public.petshops(id) on delete cascade,
  name text not null,
  price_cents int not null default 0,
  duration_min int not null default 30,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (petshop_id, name)
);
create index if not exists services_petshop_idx on public.services(petshop_id);

-- 6) APPOINTMENTS (AGENDA)
do $$
begin
  create type public.appointment_status as enum ('scheduled','in_progress','done','canceled');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  petshop_id uuid not null references public.petshops(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  pet_id uuid not null references public.pets(id) on delete restrict,
  service_id uuid not null references public.services(id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.appointment_status not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists appt_petshop_starts_idx on public.appointments(petshop_id, starts_at);
create index if not exists appt_status_idx on public.appointments(status);

-- 7) PRODUCTS + STOCK
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  petshop_id uuid not null references public.petshops(id) on delete cascade,
  name text not null,
  category text,
  barcode text,
  cost_cents int not null default 0,
  price_cents int not null default 0,
  stock_qty int not null default 0,
  min_stock_qty int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (petshop_id, barcode)
);
create index if not exists products_petshop_idx on public.products(petshop_id);
create index if not exists products_name_idx on public.products using gin (to_tsvector('portuguese', name));
-- 8) SALES
do $$
begin
  create type public.payment_method as enum ('cash','pix','debit','credit','transfer','other');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  petshop_id uuid not null references public.petshops(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  sold_at timestamptz not null default now(),
  payment public.payment_method not null default 'pix',
  total_cents int not null default 0,
  notes text
);
create index if not exists sales_petshop_sold_idx on public.sales(petshop_id, sold_at);

create table if not exists public.sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  description text not null,
  qty int not null default 1,
  unit_cents int not null default 0,
  line_total_cents int not null default 0
);
create index if not exists sale_items_sale_idx on public.sale_items(sale_id);

-- 9) FINANCIAL LEDGER
do $$
begin
  create type public.ledger_type as enum ('income','expense');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  petshop_id uuid not null references public.petshops(id) on delete cascade,
  type public.ledger_type not null,
  category text,
  description text,
  amount_cents int not null,
  occurred_on date not null default current_date,
  source text,
  created_at timestamptz not null default now()
);
create index if not exists ledger_petshop_date_idx on public.ledger_entries(petshop_id, occurred_on);

-- 10) TRIGGERS: auto-calc sale totals + stock decrement
create or replace function public.fn_recalc_sale_total(p_sale_id uuid)
returns void language plpgsql as $$
declare
  v_total int;
begin
  select coalesce(sum(line_total_cents),0) into v_total
  from public.sale_items where sale_id = p_sale_id;

  update public.sales set total_cents = v_total
  where id = p_sale_id;
end $$;

create or replace function public.fn_sale_item_before_ins_upd()
returns trigger language plpgsql as $$
begin
  new.line_total_cents := new.qty * new.unit_cents;
  return new;
end $$;

drop trigger if exists trg_sale_item_before on public.sale_items;
create trigger trg_sale_item_before
before insert or update on public.sale_items
for each row execute function public.fn_sale_item_before_ins_upd();

create or replace function public.fn_sale_item_after_change()
returns trigger language plpgsql as $$
begin
  perform public.fn_recalc_sale_total(coalesce(new.sale_id, old.sale_id));
  return null;
end $$;

drop trigger if exists trg_sale_item_after on public.sale_items;
create trigger trg_sale_item_after
after insert or update or delete on public.sale_items
for each row execute function public.fn_sale_item_after_change();

create or replace function public.fn_decrement_stock_on_sale_item()
returns trigger language plpgsql as $$
begin
  if new.product_id is not null then
    update public.products
    set stock_qty = stock_qty - new.qty
    where id = new.product_id;
  end if;
  return new;
end $$;

drop trigger if exists trg_decrement_stock on public.sale_items;
create trigger trg_decrement_stock
after insert on public.sale_items
for each row execute function public.fn_decrement_stock_on_sale_item();
-- 11) SECURITY: RLS
alter table public.petshops enable row level security;
alter table public.petshop_members enable row level security;
alter table public.clients enable row level security;
alter table public.pets enable row level security;
alter table public.services enable row level security;
alter table public.appointments enable row level security;
alter table public.products enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;
alter table public.ledger_entries enable row level security;

create or replace function public.fn_is_member(p_petshop_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.petshop_members m
    where m.petshop_id = p_petshop_id and m.user_id = auth.uid()
  );
$$;

drop policy if exists petshops_select on public.petshops;
create policy petshops_select on public.petshops
for select using (public.fn_is_member(id));

drop policy if exists petshops_insert on public.petshops;
create policy petshops_insert on public.petshops
for insert to authenticated
with check (true);

drop policy if exists petshops_update on public.petshops;
create policy petshops_update on public.petshops
for update using (public.fn_is_member(id))
with check (public.fn_is_member(id));

drop policy if exists petshops_delete on public.petshops;
create policy petshops_delete on public.petshops
for delete using (public.fn_is_member(id));

drop policy if exists members_select on public.petshop_members;
create policy members_select on public.petshop_members
for select using (public.fn_is_member(petshop_id));

drop policy if exists members_write on public.petshop_members;
drop policy if exists members_insert_bootstrap on public.petshop_members;
create policy members_insert_bootstrap on public.petshop_members
for insert to authenticated
with check (
  user_id = auth.uid()
  and not exists (
    select 1
    from public.petshop_members m
    where m.petshop_id = petshop_members.petshop_id
  )
);

do $$
declare
  t text;
begin
  foreach t in array array['clients','pets','services','appointments','products','sales','ledger_entries']
  loop
    execute format('drop policy if exists "%s_select" on public.%I;', t, t);
    execute format('create policy "%s_select" on public.%I for select using (public.fn_is_member(petshop_id));', t, t);

    execute format('drop policy if exists "%s_ins" on public.%I;', t, t);
    execute format('create policy "%s_ins" on public.%I for insert with check (public.fn_is_member(petshop_id));', t, t);

    execute format('drop policy if exists "%s_upd" on public.%I;', t, t);
    execute format('create policy "%s_upd" on public.%I for update using (public.fn_is_member(petshop_id)) with check (public.fn_is_member(petshop_id));', t, t);

    execute format('drop policy if exists "%s_del" on public.%I;', t, t);
    execute format('create policy "%s_del" on public.%I for delete using (public.fn_is_member(petshop_id));', t, t);
  end loop;
end $$;

drop policy if exists sale_items_select on public.sale_items;
create policy sale_items_select on public.sale_items
for select using (
  exists (
    select 1 from public.sales s
    where s.id = sale_id and public.fn_is_member(s.petshop_id)
  )
);

drop policy if exists sale_items_ins on public.sale_items;
create policy sale_items_ins on public.sale_items
for insert with check (
  exists (
    select 1 from public.sales s
    where s.id = sale_id and public.fn_is_member(s.petshop_id)
  )
);

drop policy if exists sale_items_upd on public.sale_items;
create policy sale_items_upd on public.sale_items
for update using (
  exists (select 1 from public.sales s where s.id = sale_id and public.fn_is_member(s.petshop_id))
) with check (
  exists (select 1 from public.sales s where s.id = sale_id and public.fn_is_member(s.petshop_id))
);

drop policy if exists sale_items_del on public.sale_items;
create policy sale_items_del on public.sale_items
for delete using (
  exists (select 1 from public.sales s where s.id = sale_id and public.fn_is_member(s.petshop_id))
);
