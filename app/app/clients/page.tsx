import { Download, Filter, Search } from 'lucide-react'
import { listClients } from '@/lib/db'
import { generateWhatsAppLink } from '@/lib/whatsapp'

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams
  const q = (params.q ?? '').trim()
  const clients = await listClients(q)

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Base de Clientes</h2>
        <p className="text-slate-500 text-sm">Gestao e historico de proprietarios.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <form method="get" className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input name="q" defaultValue={q} type="text" placeholder="Filtrar resultados..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none" />
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
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Telefone</th>
                <th className="px-6 py-4">WhatsApp</th>
                <th className="px-6 py-4">E-mail</th>
                <th className="px-6 py-4">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-sm text-slate-400 text-center">Nenhum registo encontrado.</td>
                </tr>
              ) : null}
              {clients.map((client: any) => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{client.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{client.phone ?? '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{client.whatsapp ?? '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{client.email ?? '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {(client.whatsapp || client.phone) ? (
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={generateWhatsAppLink(client.whatsapp || client.phone, 'seu pet', 'o proximo agendamento')}
                        className="text-indigo-600 hover:underline"
                      >
                        WhatsApp
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

