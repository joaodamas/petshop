import { revalidatePath } from 'next/cache'
import { Download, Filter, Plus, Save, Search, ShoppingCart } from 'lucide-react'
import { addSaleItem, createSale, listClients, listProducts, listSales } from '@/lib/db'
import { fmtBRL } from '@/lib/money'

export default async function SalesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams
  const q = (params.q ?? '').trim()
  const [products, sales, clients] = await Promise.all([listProducts(), listSales(50, q), listClients()])

  async function createSaleAction(formData: FormData) {
    'use server'

    const productId = String(formData.get('product_id'))
    const qty = Number(formData.get('qty') ?? 1)
    const product = products.find((item: any) => item.id === productId)
    if (!product) throw new Error('Produto nao encontrado')

    const saleId = await createSale({
      client_id: String(formData.get('client_id') ?? '') || null,
      payment: String(formData.get('payment') ?? 'pix'),
      notes: String(formData.get('notes') ?? '') || null,
    })

    await addSaleItem({
      sale_id: saleId,
      product_id: product.id,
      description: product.name,
      qty,
      unit: product.price_cents / 100,
    })

    revalidatePath('/app/sales')
    revalidatePath('/app/dashboard')
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Registo de Vendas</h2>
        <p className="text-slate-500 text-sm">Venda rapida e historico comercial.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Plus className="text-indigo-600" size={18} /> Nova Venda
          </h3>
          <form action={createSaleAction} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Produto</label>
              <select name="product_id" required className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none">
                {products.map((product: any) => (
                  <option key={product.id} value={product.id}>{product.name} - {fmtBRL(product.price_cents)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Cliente (opcional)</label>
              <select name="client_id" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none">
                <option value="">Sem cliente</option>
                {clients.map((client: any) => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Quantidade</label>
              <input name="qty" type="number" min={1} defaultValue={1} className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Pagamento</label>
              <select name="payment" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none">
                <option value="pix">PIX</option>
                <option value="cash">Dinheiro</option>
                <option value="debit">Debito</option>
                <option value="credit">Credito</option>
                <option value="transfer">Transferencia</option>
                <option value="other">Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Observacoes</label>
              <input name="notes" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
            </div>
            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95 mt-4">
              <Save size={18} /> Guardar Venda
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
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
    </div>
  )
}
