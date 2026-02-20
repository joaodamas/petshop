import { Download, Filter, Search, Wrench } from 'lucide-react'
import { listServices } from '@/lib/db'
import { fmtBRL } from '@/lib/money'

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams
  const q = (params.q ?? '').trim()
  const services = await listServices(q)

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Catalogo de Servicos</h2>
        <p className="text-slate-500 text-sm">Defina precos, duracoes e descricoes.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <form method="get" className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input name="q" defaultValue={q} type="text" placeholder="Filtrar servicos..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none" />
          </form>
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
  )
}

