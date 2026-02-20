import { Calendar, Clock3 } from 'lucide-react'
import Link from 'next/link'
import { listAgenda } from '@/lib/db'

type ViewMode = 'day' | 'week' | 'month'

function startOfDay(d: Date) {
  const n = new Date(d)
  n.setHours(0, 0, 0, 0)
  return n
}

function startOfWeek(d: Date) {
  const n = startOfDay(d)
  const day = n.getDay()
  const diff = day === 0 ? -6 : 1 - day
  n.setDate(n.getDate() + diff)
  return n
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function rangeFor(view: ViewMode, dateISO: string) {
  const base = startOfDay(new Date(`${dateISO}T00:00:00`))
  if (view === 'day') {
    const end = new Date(base)
    end.setDate(end.getDate() + 1)
    return { from: base, to: end }
  }
  if (view === 'week') {
    const from = startOfWeek(base)
    const to = new Date(from)
    to.setDate(to.getDate() + 7)
    return { from, to }
  }
  const from = startOfMonth(base)
  const to = new Date(from.getFullYear(), from.getMonth() + 1, 1)
  return { from, to }
}

function dayKey(iso: string) {
  return new Date(iso).toISOString().slice(0, 10)
}

function toBr(date: Date) {
  return date.toLocaleDateString('pt-BR')
}

function fmtHour(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function addDays(d: Date, qty: number) {
  const n = new Date(d)
  n.setDate(n.getDate() + qty)
  return n
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; date?: string }>
}) {
  const params = await searchParams
  const view = (params.view === 'week' || params.view === 'month' ? params.view : 'day') as ViewMode
  const currentDate = params.date ?? new Date().toISOString().slice(0, 10)
  const { from, to } = rangeFor(view, currentDate)

  const appointments = await listAgenda(from.toISOString(), to.toISOString())
  const grouped = new Map<string, any[]>()
  for (const appt of appointments) {
    const key = dayKey(appt.starts_at)
    const arr = grouped.get(key) ?? []
    arr.push(appt)
    grouped.set(key, arr)
  }

  const weekStart = startOfWeek(new Date(`${currentDate}T00:00:00`))
  const monthStart = startOfMonth(new Date(`${currentDate}T00:00:00`))
  const monthGridStart = addDays(monthStart, -monthStart.getDay())

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Agenda</h2>
          <p className="text-slate-500 text-sm">Visualizacao diaria, semanal e mensal.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-1">
          <Link href={`/app/agenda?view=day&date=${currentDate}`} className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${view === 'day' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Dia</Link>
          <Link href={`/app/agenda?view=week&date=${currentDate}`} className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${view === 'week' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Semana</Link>
          <Link href={`/app/agenda?view=month&date=${currentDate}`} className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${view === 'month' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Mes</Link>
        </div>
      </div>

      {view === 'day' ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calendar size={16} className="text-indigo-600" />
              {toBr(new Date(`${currentDate}T00:00:00`))}
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {(grouped.get(currentDate) ?? []).length === 0 ? (
              <p className="px-5 py-10 text-sm text-slate-400 text-center">Sem agendamentos neste dia.</p>
            ) : null}
            {(grouped.get(currentDate) ?? []).map((appointment: any) => (
              <div key={appointment.id} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{appointment.pets?.name ?? 'Pet'}</p>
                  <p className="text-xs text-slate-500">{appointment.services?.name ?? '-'} • {appointment.clients?.name ?? '-'}</p>
                </div>
                <span className="text-xs text-slate-600 flex items-center gap-1">
                  <Clock3 size={14} className="text-indigo-500" />
                  {fmtHour(appointment.starts_at)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {view === 'week' ? (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, idx) => {
            const day = addDays(weekStart, idx)
            const key = day.toISOString().slice(0, 10)
            const entries = grouped.get(key) ?? []
            return (
              <div key={key} className="bg-white rounded-2xl border border-slate-100 p-3 min-h-52">
                <p className="text-xs font-bold text-slate-700 mb-2">{day.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}</p>
                <div className="space-y-2">
                  {entries.length === 0 ? <p className="text-[11px] text-slate-400">Sem horario</p> : null}
                  {entries.map((appointment: any) => (
                    <div key={appointment.id} className="rounded-xl bg-indigo-50 border border-indigo-100 px-2.5 py-2">
                      <p className="text-[11px] font-semibold text-indigo-900">{fmtHour(appointment.starts_at)} • {appointment.pets?.name ?? 'Pet'}</p>
                      <p className="text-[10px] text-indigo-700">{appointment.services?.name ?? '-'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : null}

      {view === 'month' ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((d) => (
              <div key={d} className="p-3 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: 42 }).map((_, idx) => {
              const day = addDays(monthGridStart, idx)
              const key = day.toISOString().slice(0, 10)
              const entries = grouped.get(key) ?? []
              const inMonth = day.getMonth() === monthStart.getMonth()
              return (
                <div key={key} className={`min-h-28 border-b border-r border-slate-100 p-2 ${inMonth ? 'bg-white' : 'bg-slate-50/40'}`}>
                  <p className={`text-xs font-semibold ${inMonth ? 'text-slate-700' : 'text-slate-400'}`}>{day.getDate()}</p>
                  <div className="mt-1 space-y-1">
                    {entries.slice(0, 2).map((appointment: any) => (
                      <p key={appointment.id} className="text-[10px] rounded bg-indigo-50 text-indigo-700 px-1.5 py-1 truncate">
                        {fmtHour(appointment.starts_at)} {appointment.pets?.name ?? 'Pet'}
                      </p>
                    ))}
                    {entries.length > 2 ? <p className="text-[10px] text-slate-400">+{entries.length - 2} mais</p> : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}

