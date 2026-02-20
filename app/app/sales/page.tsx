import { Download, Filter, Search, ShoppingCart } from 'lucide-react'
import { listSales } from '@/lib/db'
import { fmtBRL } from '@/lib/money'

export default async function SalesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams
  const q = (params.q ?? '').trim()
  const sales = await listSales(50, q)

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Registo de Vendas</h2>
        <p className="text-slate-500 text-sm">Venda rapida e historico comercial.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <form method="get" className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input name="q" defaultValue={q} type="text" placeholder="Filtrar vendas..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none" />
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
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Pagamento</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Cliente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-sm text-slate-400 text-center">Nenhuma venda registada.</td>
                </tr>
              ) : null}
              {sales.map((sale: any) => (
                <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-800 flex items-center gap-2">
                    <ShoppingCart size={14} className="text-indigo-500" />
                    {new Date(sale.sold_at).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 uppercase">{sale.payment}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{fmtBRL(sale.total_cents)}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{sale.clients?.name ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

