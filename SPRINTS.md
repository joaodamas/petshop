# Roadmap Executado (3 Sprints)

## Sprint 1 - Base Operacional (Concluida)
- CRUD funcional de `clientes`, `pets`, `servicos`, `agenda`, `produtos`, `vendas` e `financeiro`.
- Dashboard conectado com dados reais do Supabase.
- Fluxo principal ativo: cliente -> pet -> agendamento -> venda -> financeiro.
- Acoes operacionais na agenda: concluir/cancelar atendimento.
- Busca funcional nas telas principais (clientes, pets, servicos, produtos, vendas e financeiro).

## Sprint 2 - Inteligencia e Conversao (Concluida)
- KPI estrategico no dashboard:
  - ticket medio
  - recorrencia
  - clientes inativos
  - agendamentos/concluidos do dia
  - estoque critico
  - resultado mensal
  - servico mais recorrente
- WhatsApp operacional:
  - lembrete de agendamento em `agenda`
  - contato rapido por cliente em `clientes`

## Sprint 3 - SaaS e Comercial (Concluida)
- Planos comerciais com ciclos:
  - mensal
  - trimestral
  - semestral
- Banco de dados atualizado para ciclo de cobranca do tenant (`billing_cycle`).
- Onboarding atualizado para configurar plano e ciclo.
- Pagina de planos revisada com proposta premium clean e foco comercial.

## Deploy
- Ambiente alvo: Render.
- SQL para aplicar:
  - `supabase/schema.sql`
  - `supabase/fix_bootstrap_rls.sql` (quando necessario)
  - `supabase/add_plan_owner.sql` (upgrade de base legada)
