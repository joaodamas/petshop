import Link from 'next/link'
import { AlertTriangle, Calendar, ChevronRight, Clock, DollarSign, Package, TrendingUp } from 'lucide-react'
import { getDashboard } from '@/lib/db'
import { fmtBRL } from '@/lib/money'

type AppointmentRow = {
  id: string
  starts_at: string
  status: 'scheduled' | 'in_progress' | 'done' | 'canceled'
  pets?: { name?: string | null } | null
  services?: { name?: string | null } | null
}

function statusUi(status: AppointmentRow['status']) {
  if (status === 'done') return { label: 'Concluido', cls: 'bg-emerald-100 text-emerald-700' }
  if (status === 'in_progress') return { label: 'Em andamento', cls: 'bg-amber-100 text-amber-700' }
  if (status === 'canceled') return { label: 'Cancelado', cls: 'bg-rose-100 text-rose-700' }
  return { label: 'Agendado', cls: 'bg-slate-100 text-slate-600' }
}

export default async function DashboardPage() {
  const dayISO = new Date().toISOString().slice(0, 10)
  const data = await getDashboard(dayISO)
  const appointments = (data.nextAppointments ?? []) as AppointmentRow[]

  const stats = [
    {
      title: 'Faturamento Dia',
      value: fmtBRL(data.todaySalesCents),
      sub: undefined,
      icon: DollarSign,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Faturamento Mes',
      value: fmtBRL(data.monthSalesCents),
      sub: undefined,
      icon: TrendingUp,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      title: 'Agendamentos Hoje',
      value: String(data.todayAppointments),
      sub: `${data.doneAppointments} concluidos`,
      icon: Calendar,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Estoque Baixo',
      value: String(data.lowStock.length).padStart(2, '0'),
      sub: 'Itens criticos',
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Resumo do Dia</h1>
          <p className="text-slate-500 text-sm">Dados atualizados em tempo real.</p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calendario</p>
          <p className="text-sm font-semibold text-slate-700">{new Date().toLocaleDateString('pt-BR', { dateStyle: 'long' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${stat.color}`}>
                <stat.icon size={22} />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.title}</p>
            <h3 className="text-xl font-bold mt-1 text-slate-800 tracking-tight">{stat.value}</h3>
            {stat.sub ? <p className="text-xs text-slate-400 mt-1 font-medium">{stat.sub}</p> : null}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock className="text-indigo-500" size={18} />
              Agendamentos de Hoje
            </h2>
            <Link href="/app/agenda" className="text-indigo-600 text-xs font-bold hover:text-indigo-800 transition-colors uppercase tracking-wider">
              Ver Todos
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="px-6 py-4">Horario</th>
                  <th className="px-6 py-4">Pet</th>
                  <th className="px-6 py-4">Servico</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appointments.length === 0 ? (
                  <tr>
                    <td className="px-6 py-6 text-sm text-slate-500" colSpan={4}>
                      Sem agendamentos para hoje.
                    </td>
                  </tr>
                ) : null}
                {appointments.map((app) => {
                  const status = statusUi(app.status)
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">
                        {new Date(app.starts_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">{app.pets?.name ?? '-'}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{app.services?.name ?? '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] uppercase font-bold px-2 py-1 rounded-md ${status.cls}`}>{status.label}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/20">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Package className="text-amber-500" size={18} />
                Inventario Baixo
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {data.lowStock.length === 0 ? <p className="text-sm text-slate-500">Sem alertas de estoque baixo.</p> : null}
              {data.lowStock.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between group">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">{item.name}</span>
                    <span className="text-[10px] text-red-500 font-bold mt-1 uppercase">Restam {item.stock_qty} un</span>
                  </div>
                  <div className="bg-slate-100 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>
                </div>
              ))}
              <Link href="/app/products" className="block w-full mt-4 py-3 text-center bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">
                Gerir Estoque
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
