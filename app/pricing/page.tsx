export default function PricingPage() {
  const plans = [
    { name: 'Free', price: 'R$ 0', desc: 'Para comecar', cta: 'Comecar' },
    { name: 'Pro', price: 'R$ 129/mes', desc: 'Para operacao diaria', cta: 'Assinar Pro' },
    { name: 'Enterprise', price: 'Sob consulta', desc: 'Multi unidades', cta: 'Falar com vendas' },
  ]

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-semibold">Planos</h1>
        <p className="text-slate-300 mt-2">Escolha o plano ideal para o seu petshop.</p>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div key={p.name} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <p className="text-2xl font-bold mt-3">{p.price}</p>
              <p className="text-slate-300 mt-2">{p.desc}</p>
              <a href="/signup" className="mt-6 inline-block rounded-xl bg-white text-slate-900 px-4 py-2 text-sm font-medium">{p.cta}</a>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
