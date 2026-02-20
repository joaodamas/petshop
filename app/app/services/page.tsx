import { revalidatePath } from 'next/cache'
import { Download, Filter, Plus, Save, Search, Wrench } from 'lucide-react'
import { createService, listServices } from '@/lib/db'
import { fmtBRL } from '@/lib/money'

export default async function ServicesPage() {
  const services = await listServices()

  async function createServiceAction(formData: FormData) {
    'use server'

    await createService({
      name: String(formData.get('name') ?? ''),
      price: Number(formData.get('price') ?? 0),
      duration_min: Number(formData.get('duration_min') ?? 30),
      description: String(formData.get('description') ?? '') || null,
    })

    revalidatePath('/app/services')
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Catalogo de Servicos</h2>
        <p className="text-slate-500 text-sm">Defina precos, duracoes e descricoes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Plus className="text-indigo-600" size={18} /> Novo Servico
          </h3>
          <form action={createServiceAction} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Nome do Servico</label>
              <input name="name" required className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Preco (R$)</label>
              <input name="price" type="number" step="0.01" defaultValue="50" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Duracao (min)</label>
              <input name="duration_min" type="number" defaultValue="30" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Descricao</label>
              <input name="description" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
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
              <input type="text" placeholder="Filtrar servicos..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none" />
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
                  <th className="px-6 py-4">Servico</th>
                  <th className="px-6 py-4">Preco</th>
                  <th className="px-6 py-4">Duracao</th>
                  <th className="px-6 py-4">Descricao</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {services.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-sm text-slate-400 text-center">Nenhum servico registado.</td>
                  </tr>
                ) : null}
                {services.map((service: any) => (
                  <tr key={service.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800 flex items-center gap-2">
                      <Wrench size={14} className="text-indigo-500" />
                      {service.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{fmtBRL(service.price_cents)}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{service.duration_min} min</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{service.description ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
