'use client'

import { useEffect, useState } from 'react'

const Icons = {
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
  ),
  ShoppingBag: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
  ),
  Package: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  ),
  Dollar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  ),
  Bell: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  ),
}

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    { title: 'Clientes e Pets', desc: 'Prontuario clinico digital, historico vacinal e galeria de fotos integrada.', icon: <Icons.Users /> },
    { title: 'Agenda Hibrida', desc: 'Gestao de banho e tosa + consultas veterinarias em um unico fluxo.', icon: <Icons.Calendar /> },
    { title: 'PDV Inteligente', desc: 'Vendas rapidas com baixa automatica de estoque e emissao de notas.', icon: <Icons.ShoppingBag /> },
    { title: 'Estoque Dinamico', desc: 'Alertas de validade e reposicao inteligente para farmacia e petshop.', icon: <Icons.Package /> },
    { title: 'Financeiro Real', desc: 'Fluxo de caixa detalhado, DRE automatico e gestao de comissoes.', icon: <Icons.Dollar /> },
    { title: 'Automacao WhatsApp', desc: 'Lembretes automaticos de agendamento e retorno de vacinas.', icon: <Icons.Bell /> },
  ]

  const plans = [
    { name: 'Mensal', price: 'R$ 189', desc: 'Ideal para comecar sem compromisso de longo prazo.', highlight: 'Sem fidelidade' },
    { name: 'Trimestral', price: 'R$ 499', desc: 'Melhor previsibilidade com desconto operacional.', highlight: 'Economize 12%' },
    { name: 'Semestral', price: 'R$ 949', desc: 'Maior economia para operacao em escala.', highlight: 'Economize 16%' },
  ]

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <nav className="fixed w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <div className="text-white scale-75"><Icons.Package /></div>
            </div>
            <span className="text-2xl font-black tracking-tight text-white italic">PET<span className="text-blue-500">SYSTEM</span></span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <a href="#funcionalidades" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Funcionalidades</a>
            <a href="#planos" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Planos</a>
            <a href="#suporte" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Suporte</a>
            <a href="#planos" className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-50 transition-all active:scale-95 shadow-xl shadow-white/5">Comecar Agora</a>
          </div>
        </div>
      </nav>

      <section className="relative z-10 pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className={`space-y-8 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Gestao Hibrida 2.0
            </div>
            <h1 className="text-6xl lg:text-7xl font-black leading-[1.1] text-white tracking-tight">
              O futuro do seu <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">negocio pet</span> e aqui.
            </h1>
            <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-medium">
              A unica plataforma que une gestao clinica e comercial em uma interface de alta performance.
            </p>
            <div className="flex flex-wrap gap-5">
              <a href="#suporte" className="group relative flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-2xl shadow-blue-600/30 overflow-hidden">
                <span className="relative z-10">Solicitar Demonstracao</span>
                <div className="relative z-10 group-hover:translate-x-1 transition-transform"><Icons.ChevronRight /></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
              </a>
              <a href="#planos" className="px-8 py-4 rounded-2xl font-bold border border-white/10 hover:bg-white/5 transition-all text-white">
                Ver Planos
              </a>
            </div>
          </div>

          <div className={`relative transition-all duration-1000 delay-300 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[32px] blur-2xl opacity-20" />
            <div className="relative bg-[#0f172a] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl shadow-black">
              <div className="bg-white/5 border-b border-white/5 px-6 py-4 flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/30" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                  <div className="w-3 h-3 rounded-full bg-green-500/30" />
                </div>
                <div className="bg-white/5 rounded-lg px-4 py-1 text-[10px] text-slate-500 font-mono flex-1 text-center">
                  app.petsystem.com.br/dashboard
                </div>
              </div>

              <div className="p-6 grid grid-cols-12 gap-4 bg-gradient-to-b from-[#0f172a] to-[#020617]">
                <div className="col-span-4 space-y-4">
                  <div className="h-24 bg-blue-600/10 rounded-2xl border border-blue-500/20 p-4">
                    <div className="text-[10px] text-blue-400 font-bold uppercase">Receita Hoje</div>
                    <div className="text-xl font-bold text-white mt-1">R$ 4.250,00</div>
                    <div className="text-[10px] text-green-400 mt-1">+12% vs ontem</div>
                  </div>
                  <div className="h-40 bg-white/5 rounded-2xl border border-white/5 p-4 space-y-3">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Proximos Banhos</div>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-700" />
                        <div className="h-2 w-16 bg-slate-700 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-8 space-y-4">
                  <div className="h-68 bg-white/5 rounded-2xl border border-white/5 p-6 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                      <div className="h-4 w-32 bg-slate-700 rounded" />
                      <div className="h-6 w-20 bg-blue-600/20 rounded-full" />
                    </div>
                    <div className="flex items-end gap-2 h-32">
                      {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-md transition-all duration-1000" style={{ height: isVisible ? `${h}%` : '0%' }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="funcionalidades" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black text-white italic">
              A GESTAO QUE O SEU <br /> <span className="text-blue-500">NEGOCIO MERECE</span>
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="group relative p-10 rounded-[32px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-blue-500/30 transition-all duration-500 cursor-default overflow-hidden">
                <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-150 transition-all duration-700 text-white">
                  <div className="scale-[4]">{f.icon}</div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 text-white">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-y border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-12">Empresas que confiam na PetSystem</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            {['PETZ', 'COBASI', 'DOGSBARK', 'VETCLINIC', 'ANIMALIA'].map((brand) => (
              <span key={brand} className="text-2xl font-black italic text-white tracking-tighter">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="planos" className="relative z-10 py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-white">Planos para cada fase do petshop</h2>
            <p className="mt-3 text-slate-400">Escolha o ciclo que combina com sua operacao.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <article key={plan.name} className="rounded-3xl bg-white/[0.04] border border-white/10 p-8 hover:border-blue-400/40 transition-colors">
                <span className="inline-flex text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                  {plan.highlight}
                </span>
                <h3 className="mt-4 text-2xl font-bold text-white">{plan.name}</h3>
                <p className="mt-2 text-3xl font-black text-white">{plan.price}<span className="text-base text-slate-400 font-semibold">/ciclo</span></p>
                <p className="mt-4 text-sm text-slate-400">{plan.desc}</p>
                <a href="/signup" className="mt-8 inline-flex w-full justify-center rounded-xl bg-white text-slate-900 px-4 py-3 text-sm font-bold hover:bg-blue-50 transition-colors">
                  Assinar {plan.name}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto rounded-[48px] bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 p-12 lg:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-900/40">
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight">
              Nao perca mais tempo <br /> com planilhas lentas.
            </h2>
            <p className="text-blue-100/70 text-lg max-w-xl mx-auto font-medium">
              Junte-se a centenas de petshops que profissionalizaram sua operacao com a PetSystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <a href="#planos" className="bg-white text-blue-900 px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-black/10">
                Comecar Gratis
              </a>
              <a href="#suporte" className="bg-black/20 backdrop-blur-md border border-white/20 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-black/30 transition-all">
                Agendar Mentoria
              </a>
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 blur-[100px] rounded-full" />
        </div>
      </section>

      <section id="suporte" className="relative z-10 py-24 px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white">Suporte que responde rapido</h2>
          <p className="mt-4 text-slate-400 text-lg">Atendimento por WhatsApp, onboarding assistido e acompanhamento de implantacao.</p>
          <div className="mt-10 grid md:grid-cols-3 gap-6 text-left">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-white font-bold">Implantacao guiada</h3>
              <p className="mt-2 text-sm text-slate-400">Configuramos agenda, servicos, produtos e financeiro junto com sua equipe.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-white font-bold">Canal direto</h3>
              <p className="mt-2 text-sm text-slate-400">Suporte humano para duvidas de operacao e melhorias continuas.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-white font-bold">Treinamento continuo</h3>
              <p className="mt-2 text-sm text-slate-400">Material de apoio para recepcao, banho/tosa, clinica e financeiro.</p>
            </div>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a href="/signup" className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 text-sm font-bold transition-colors">
              Criar conta de teste
            </a>
            <a href="/login" className="rounded-xl border border-white/20 text-white px-6 py-3 text-sm font-bold hover:bg-white/5 transition-colors">
              Ja tenho conta
            </a>
          </div>
        </div>
      </section>

      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white scale-75">
                <Icons.Package />
              </div>
              <span className="text-xl font-black text-white italic">PETSYSTEM</span>
            </div>
            <p className="text-slate-500 max-w-xs text-sm font-medium">
              Transformando a gestao pet com tecnologia premium e design focado na experiencia do usuario.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Produto</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-medium">
              <li><a href="#funcionalidades" className="hover:text-blue-400 transition-colors">Funcionalidades</a></li>
              <li><a href="#planos" className="hover:text-blue-400 transition-colors">Precos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Suporte</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-medium">
              <li><a href="#suporte" className="hover:text-blue-400 transition-colors">Central de Ajuda</a></li>
              <li><a href="#suporte" className="hover:text-blue-400 transition-colors">Contato</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 flex justify-center items-center">
          <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">© 2026 PetSystem Software Ltda. Todos os direitos reservados.</p>
        </div>
      </footer>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
