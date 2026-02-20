-- Execute este script no Supabase SQL Editor para corrigir erro de bootstrap (primeiro login)

alter table public.petshops enable row level security;
alter table public.petshop_members enable row level security;

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
