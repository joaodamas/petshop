import { ensurePetshopForUser } from '@/lib/db'
import { supabaseServer } from '@/lib/supabase/server'
import { AppSidebarNav } from '@/components/AppSidebarNav'
import { MobileAppTabs } from '@/components/MobileAppTabs'
import { QuickCreateButton } from '@/components/QuickCreateButton'
import {
  Bell,
  LogOut,
  PawPrint,
  Search,
} from 'lucide-react'
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
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1680px]">
        <div className="flex min-h-[calc(100vh-3rem)]">
          <aside className="w-72 surface-glass border-r border-slate-200/60 flex-col hidden lg:flex">
            <div className="p-8 flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-600 to-blue-500 p-2.5 rounded-2xl shadow-lg shadow-indigo-200">
                <PawPrint className="text-white h-6 w-6" />
              </div>
              <span className="brand-wordmark text-2xl">
                PetHub
              </span>
            </div>

            <AppSidebarNav />

            <div className="p-6">
              <div className="premium-panel rounded-[28px] p-5">
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
            <header className="h-20 surface-glass border-b border-slate-100/80 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40 shrink-0 gap-3">
              <div className="lg:hidden flex items-center gap-2 shrink-0">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-500 p-1.5 rounded-xl shadow-md shadow-indigo-200">
                  <PawPrint className="text-white h-4 w-4" />
                </div>
                <span className="brand-wordmark text-lg">PetHub</span>
              </div>

              <div className="flex items-center gap-4 bg-white/70 border border-slate-200 px-4 sm:px-5 py-2.5 rounded-2xl w-full max-w-none sm:max-w-md group transition-all duration-300">
                <Search size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Pesquise..."
                  className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="flex items-center gap-5">
                <QuickCreateButton />
                <button className="relative p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                  <Bell size={22} />
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white shadow-sm" />
                </button>
              </div>
            </header>

            <MobileAppTabs />

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12">{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}
