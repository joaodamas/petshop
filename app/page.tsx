export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white">
      <header className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
        <div className="font-bold tracking-tight text-lg">PetSystem</div>
        <nav className="flex gap-3">
          <a className="text-sm text-slate-300 hover:text-white" href="#features">Funcionalidades</a>
          <a className="text-sm text-slate-300 hover:text-white" href="/pricing">Planos</a>
          <a className="text-sm text-slate-300 hover:text-white" href="/login">Entrar</a>
          <a className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15" href="/signup">Teste gratis</a>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-14 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl lg:text-6xl font-semibold leading-tight">
            Gestao premium para operacao pet hibrida.
          </h1>
          <p className="mt-4 text-slate-300 text-lg">
            Agenda, atendimento, vendas, estoque e financeiro em uma interface moderna, elegante e muito funcional.
          </p>
          <div className="mt-8 flex gap-3">
            <a href="/signup" className="rounded-xl bg-white text-slate-900 px-5 py-3 text-sm font-medium hover:bg-slate-100">Teste gratis por 7 dias</a>
            <a href="/app/dashboard" className="rounded-xl bg-white/10 px-5 py-3 text-sm font-medium hover:bg-white/15">Ver sistema</a>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-indigo-900/40">
          <div className="rounded-2xl bg-slate-950/40 border border-white/10 p-6">
            <div className="text-sm text-slate-300 mb-2">Preview</div>
            <div className="h-64 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-300/10 border border-white/10" />
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-2xl font-semibold">Tudo que um petshop precisa</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ['Clientes e Pets', 'Cadastro completo com historico e observacoes.'],
            ['Agenda', 'Organizacao diaria com status e recorrencia.'],
            ['Vendas', 'Registro rapido, ticket medio e relatorios.'],
            ['Produtos e Estoque', 'Controle de entrada/saida e alertas.'],
            ['Financeiro', 'Receita, despesas e visao de lucro.'],
            ['Lembretes', 'WhatsApp para retorno e recorrencia.'],
          ].map(([t, d]) => (
            <div key={t} className="rounded-3xl bg-white/5 border border-white/10 p-6">
              <div className="font-medium">{t}</div>
              <div className="mt-2 text-sm text-slate-300">{d}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-xs text-slate-500">
        © {new Date().getFullYear()} PetSystem.
      </footer>
    </main>
  )
}
