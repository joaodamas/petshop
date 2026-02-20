export default function PricingPage() {
  const plans = [
    { name: 'Mensal', price: 'R$ 189', desc: 'Flexibilidade total para operar mes a mes.', cta: 'Assinar Mensal', badge: 'Sem fidelidade' },
    { name: 'Trimestral', price: 'R$ 499', desc: 'Ideal para ganhar previsibilidade com desconto.', cta: 'Assinar Trimestral', badge: 'Economize 12%' },
    { name: 'Semestral', price: 'R$ 949', desc: 'Melhor custo-beneficio para crescimento acelerado.', cta: 'Assinar Semestral', badge: 'Economize 16%' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto py-10">
        <h1 className="text-4xl font-semibold">Planos de Assinatura</h1>
        <p className="text-slate-300 mt-2">Mensal, trimestral e semestral para acompanhar o ritmo da sua operacao.</p>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div key={p.name} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <span className="inline-flex rounded-full border border-indigo-300/30 bg-indigo-500/20 text-indigo-200 px-3 py-1 text-xs font-semibold">
                {p.badge}
              </span>
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <p className="text-2xl font-bold mt-3">{p.price}<span className="text-base font-medium text-slate-300"> / ciclo</span></p>
              <p className="text-slate-300 mt-2">{p.desc}</p>
              <ul className="mt-5 space-y-2 text-sm text-slate-200">
                <li>• Agenda e prontuario operacional</li>
                <li>• Vendas, estoque e financeiro</li>
                <li>• Dashboard com KPIs e alertas</li>
                <li>• Lembretes via WhatsApp</li>
              </ul>
              <a href="/signup" className="mt-6 inline-block rounded-xl bg-white text-slate-900 px-4 py-2 text-sm font-medium">{p.cta}</a>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
