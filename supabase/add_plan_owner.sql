alter table public.petshops add column if not exists plan text not null default 'free';
alter table public.petshops add column if not exists owner_id uuid references auth.users(id);

alter table public.petshops drop constraint if exists petshops_plan_check;
alter table public.petshops add constraint petshops_plan_check check (plan in ('free','pro','enterprise'));
