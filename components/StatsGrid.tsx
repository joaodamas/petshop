import { AlertTriangle, Calendar, CheckCircle2, DollarSign, RefreshCw, ShieldAlert } from 'lucide-react'
import { fmtBRL } from '@/lib/money'
import type { ReactNode } from 'react'

export interface DashboardStats {
  ticketMedio: number
  taxaRecorrencia: number
  clientesInativos: number
  agendamentosHoje: number
  concluidosHoje: number
  estoqueCritico: number
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: ReactNode; color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <span className={`inline-flex items-center justify-center rounded-xl p-2 ${color}`}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  )
}

export function StatsGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <StatCard
        title="Ticket Medio"
        value={fmtBRL(stats.ticketMedio)}
        icon={<DollarSign size={18} />}
        color="text-emerald-600 bg-emerald-50"
      />
      <StatCard
        title="Recorrencia"
        value={`${stats.taxaRecorrencia}%`}
        icon={<RefreshCw size={18} />}
        color="text-blue-600 bg-blue-50"
      />
      <StatCard
        title="Clientes Sumidos"
        value={String(stats.clientesInativos)}
        icon={<AlertTriangle size={18} />}
        color="text-rose-600 bg-rose-50"
      />
      <StatCard
        title="Agendamentos Hoje"
        value={String(stats.agendamentosHoje)}
        icon={<Calendar size={18} />}
        color="text-indigo-600 bg-indigo-50"
      />
      <StatCard
        title="Concluidos Hoje"
        value={String(stats.concluidosHoje)}
        icon={<CheckCircle2 size={18} />}
        color="text-emerald-600 bg-emerald-50"
      />
      <StatCard
        title="Estoque Critico"
        value={String(stats.estoqueCritico)}
        icon={<ShieldAlert size={18} />}
        color="text-amber-600 bg-amber-50"
      />
    </div>
  )
}
