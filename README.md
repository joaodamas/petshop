# Petshop MVP

Sistema de gestao para petshop com Next.js + Supabase.

## Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Supabase Auth + Postgres + RLS

## Setup

1. Crie um projeto no Supabase.
2. No SQL Editor, execute `supabase/schema.sql`.
3. Se ja estava rodando e apareceu erro de runtime no primeiro login, execute tambem `supabase/fix_bootstrap_rls.sql`.
4. Crie `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON_KEY
```

5. Execute:

```bash
npm install
npm run dev
```

## Modulos

- Dashboard
- Clientes
- Pets
- Servicos
- Agenda
- Produtos
- Vendas
- Financeiro
- Onboarding SaaS (plano + ciclo de cobranca)

## Rotas

- `/login`
- `/app/dashboard`
- `/app/clients`
- `/app/pets`
- `/app/services`
- `/app/agenda`
- `/app/products`
- `/app/sales`
- `/app/finance`

## Planejamento de entrega

Consulte `SPRINTS.md` para o detalhamento das 3 sprints executadas.
