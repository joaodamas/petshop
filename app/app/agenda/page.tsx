import { revalidatePath } from 'next/cache'
import { Calendar, Clock3, Download, Filter, Plus, Save, Search } from 'lucide-react'
import { createAppointment, listAgenda, listClients, listPets, listServices } from '@/lib/db'

function todayRange() {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return { from: start.toISOString(), to: end.toISOString() }
}

function formatStatus(status: string) {
  if (status === 'done') return { label: 'Concluido', cls: 'bg-emerald-100 text-emerald-700' }
  if (status === 'in_progress') return { label: 'Em andamento', cls: 'bg-amber-100 text-amber-700' }
  if (status === 'canceled') return { label: 'Cancelado', cls: 'bg-rose-100 text-rose-700' }
  return { label: 'Agendado', cls: 'bg-slate-100 text-slate-600' }
}

export default async function AgendaPage() {
  const range = todayRange()
  const [appointments, clients, pets, services] = await Promise.all([
    listAgenda(range.from, range.to),
    listClients(),
    listPets(),
    listServices(),
  ])

  async function createAppointmentAction(formData: FormData) {
    'use server'

    const date = String(formData.get('date'))
    const hour = String(formData.get('hour'))
    const durationMin = Number(formData.get('duration_min') ?? 30)

    const startsAt = new Date(`${date}T${hour}:00`)
    const endsAt = new Date(startsAt)
    endsAt.setMinutes(endsAt.getMinutes() + durationMin)

    await createAppointment({
      client_id: String(formData.get('client_id')),
      pet_id: String(formData.get('pet_id')),
      service_id: String(formData.get('service_id')),
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      notes: String(formData.get('notes') ?? '') || null,
    })

    revalidatePath('/app/agenda')
    revalidatePath('/app/dashboard')
  }

  const todayDate = new Date().toISOString().slice(0, 10)

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Nova Marcacao</h2>
        <p className="text-slate-500 text-sm">Agende consultas, banhos e tosas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Plus className="text-indigo-600" size={18} /> Novo Agendamento
          </h3>
          <form action={createAppointmentAction} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Cliente</label>
              <select name="client_id" required className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none">
                {clients.map((client: any) => (
                  <option value={client.id} key={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Pet</label>
              <select name="pet_id" required className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none">
                {pets.map((pet: any) => (
                  <option value={pet.id} key={pet.id}>{pet.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Servico</label>
              <select name="service_id" required className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none">
                {services.map((service: any) => (
                  <option value={service.id} key={service.id}>{service.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Data</label>
                <input name="date" type="date" required defaultValue={todayDate} className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Hora</label>
                <input name="hour" type="time" required defaultValue="09:00" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Duracao (min)</label>
              <input name="duration_min" type="number" defaultValue="30" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Observacoes</label>
              <input name="notes" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
            </div>
            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95 mt-4">
              <Save size={18} /> Guardar Dados
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Filtrar agenda..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Filter size={18} /></button>
              <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Download size={18} /></button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Horario</th>
                  <th className="px-6 py-4">Pet</th>
                  <th className="px-6 py-4">Servico</th>
                  <th className="px-6 py-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-sm text-slate-400 text-center">Sem agendamentos hoje.</td>
                  </tr>
                ) : null}
                {appointments.map((appointment: any) => {
                  const s = formatStatus(appointment.status)
                  return (
                    <tr key={appointment.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Clock3 size={14} className="text-indigo-500" />
                        {new Date(appointment.starts_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">{appointment.pets?.name ?? '-'}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{appointment.services?.name ?? '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${s.cls}`}>{s.label}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50/30 text-center border-t border-slate-50 flex items-center justify-center gap-2 text-[11px] text-slate-400 italic">
            <Calendar size={14} /> Agenda do dia {todayDate.split('-').reverse().join('/')}
          </div>
        </div>
      </div>
    </div>
  )
}
