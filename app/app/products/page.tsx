import { revalidatePath } from 'next/cache'
import { Download, Filter, Package, Plus, Save, Search } from 'lucide-react'
import { createProduct, listProducts } from '@/lib/db'
import { fmtBRL } from '@/lib/money'

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams
  const q = (params.q ?? '').trim()
  const products = await listProducts(q)

  async function createProductAction(formData: FormData) {
    'use server'

    await createProduct({
      name: String(formData.get('name') ?? ''),
      category: String(formData.get('category') ?? '') || null,
      barcode: String(formData.get('barcode') ?? '') || null,
      cost: Number(formData.get('cost') ?? 0),
      price: Number(formData.get('price') ?? 0),
      stock_qty: Number(formData.get('stock_qty') ?? 0),
      min_stock_qty: Number(formData.get('min_stock_qty') ?? 0),
    })

    revalidatePath('/app/products')
    revalidatePath('/app/dashboard')
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Catalogo de Produtos</h2>
        <p className="text-slate-500 text-sm">Gestao de inventario, custo e venda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Plus className="text-indigo-600" size={18} /> Novo Produto
          </h3>
          <form action={createProductAction} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Nome</label>
              <input name="name" required className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Categoria</label>
              <input name="category" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Codigo de Barras</label>
              <input name="barcode" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Custo (R$)</label>
                <input name="cost" type="number" step="0.01" defaultValue="10" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Venda (R$)</label>
                <input name="price" type="number" step="0.01" defaultValue="20" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Estoque</label>
                <input name="stock_qty" type="number" defaultValue="0" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Minimo</label>
                <input name="min_stock_qty" type="number" defaultValue="0" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
              </div>
            </div>
            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95 mt-4">
              <Save size={18} /> Guardar Dados
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <form method="get" className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input name="q" defaultValue={q} type="text" placeholder="Filtrar produtos..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none" />
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
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Preco</th>
                  <th className="px-6 py-4">Estoque</th>
                  <th className="px-6 py-4">Min.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-sm text-slate-400 text-center">Nenhum produto registado.</td>
                  </tr>
                ) : null}
                {products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800 flex items-center gap-2">
                      <Package size={14} className="text-indigo-500" />
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{fmtBRL(product.price_cents)}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{product.stock_qty}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{product.min_stock_qty}</td>
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
