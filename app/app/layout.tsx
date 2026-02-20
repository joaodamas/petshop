import { ensurePetshopForUser } from '@/lib/db'
import { supabaseServer } from '@/lib/supabase/server'
import {
  Bell,
  Calendar,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Package,
  PawPrint,
  Search,
  ShoppingCart,
  Users,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await supabaseServer()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    redirect('/login')
  }

  async function signOutAction() {
    'use server'
    const sb = await supabaseServer()
    await sb.auth.signOut()
    redirect('/login')
  }

  await ensurePetshopForUser()

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1680px]">
        <div className="flex min-h-[calc(100vh-3rem)]">
          <aside className="w-72 bg-white border-r border-slate-100 flex-col hidden lg:flex">
            <div className="p-8 flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100 rotate-3">
                <PawPrint className="text-white h-6 w-6" />
              </div>
              <span className="font-black text-2xl tracking-tight text-slate-900">
                PetSystem<span className="text-indigo-600">.</span>
              </span>
            </div>

            <nav className="flex-1 px-6 space-y-1.5 mt-4 overflow-y-auto">
              <Link href="/app/dashboard" className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
                <LayoutDashboard size={18} />
                <span className="text-sm">Dashboard</span>
              </Link>
              <Link href="/app/clients" className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
                <Users size={18} />
                <span className="text-sm">Clientes</span>
              </Link>
              <Link href="/app/pets" className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
                <PawPrint size={18} />
                <span className="text-sm">Pets</span>
              </Link>
              <Link href="/app/services" className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
                <Wrench size={18} />
                <span className="text-sm">Servicos</span>
              </Link>
              <Link href="/app/agenda" className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
                <Calendar size={18} />
                <span className="text-sm">Agenda</span>
              </Link>
              <Link href="/app/products" className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
                <Package size={18} />
                <span className="text-sm">Produtos</span>
              </Link>
              <Link href="/app/sales" className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
                <ShoppingCart size={18} />
                <span className="text-sm">Vendas</span>
              </Link>
              <Link href="/app/finance" className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
                <DollarSign size={18} />
                <span className="text-sm">Financeiro</span>
              </Link>
            </nav>

            <div className="p-6">
              <div className="bg-slate-50 rounded-[28px] p-5 border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xs">
                    AD
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-xs text-slate-800 truncate">{data.user.email ?? 'Administrador'}</p>
                    <p className="text-[10px] text-slate-400 font-medium truncate">Administrador</p>
                  </div>
                </div>
                <form action={signOutAction}>
                  <button className="w-full py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center justify-center gap-1">
                    <LogOut size={12} />
                    Terminar Sessao
                  </button>
                </form>
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40 shrink-0">
              <div className="flex items-center gap-4 bg-slate-100/50 border border-slate-100 px-5 py-2.5 rounded-2xl w-full max-w-md group focus-within:bg-white focus-within:border-indigo-200 transition-all duration-300">
                <Search size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Pesquise por chips, nomes ou proprietarios..."
                  className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="flex items-center gap-5">
                <button className="relative p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                  <Bell size={22} />
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white shadow-sm" />
                </button>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-8 lg:p-12">{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}
