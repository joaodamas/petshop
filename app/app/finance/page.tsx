import { revalidatePath } from 'next/cache'
import { DollarSign, Download, Filter, Plus, Save, Search, TrendingDown, TrendingUp } from 'lucide-react'
import { createLedgerEntry, listLedger } from '@/lib/db'
import { fmtBRL } from '@/lib/money'

function monthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return {
    from: start.toISOString().slice(0, 10),
    to: end.toISOString().slice(0, 10),
  }
}

export default async function FinancePage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string; from?: string; to?: string }> }) {
  const params = await searchParams
  const range = monthRange()
  const q = (params.q ?? '').trim().toLowerCase()
  const filterType = params.type ?? 'all'
  const from = params.from ?? range.from
  const to = params.to ?? range.to
  const rawLedger = await listLedger(from, to)
  const ledger = rawLedger.filter((entry: any) => {
    const typePass = filterType === 'all' ? true : entry.type === filterType
    const searchPass = q
      ? `${entry.category ?? ''} ${entry.description ?? ''}`.toLowerCase().includes(q)
      : true
    return typePass && searchPass
  })

  async function createLedgerAction(formData: FormData) {
    'use server'

    await createLedgerEntry({
      type: String(formData.get('type')) as 'income' | 'expense',
      category: String(formData.get('category') ?? '') || null,
      description: String(formData.get('description') ?? '') || null,
      amount: Number(formData.get('amount') ?? 0),
      occurred_on: String(formData.get('occurred_on')),
    })

    revalidatePath('/app/finance')
    revalidatePath('/app/dashboard')
  }

  const income = ledger.filter((entry: any) => entry.type === 'income').reduce((a: number, b: any) => a + b.amount_cents, 0)
  const expense = ledger.filter((entry: any) => entry.type === 'expense').reduce((a: number, b: any) => a + b.amount_cents, 0)
  const profit = income - expense

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Financeiro</h2>
        <p className="text-slate-500 text-sm">Entradas, saidas e margem de lucro.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Entradas</p>
          <p className="text-2xl font-bold text-slate-800 mt-2 flex items-center gap-2"><TrendingUp className="text-emerald-600" size={20} />{fmtBRL(income)}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Saidas</p>
          <p className="text-2xl font-bold text-slate-800 mt-2 flex items-center gap-2"><TrendingDown className="text-rose-600" size={20} />{fmtBRL(expense)}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Lucro</p>
          <p className="text-2xl font-bold text-slate-800 mt-2 flex items-center gap-2"><DollarSign className="text-indigo-600" size={20} />{fmtBRL(profit)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Plus className="text-indigo-600" size={18} /> Novo Lancamento
          </h3>
          <form action={createLedgerAction} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Tipo</label>
              <select name="type" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none">
                <option value="income">Entrada</option>
                <option value="expense">Saida</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Categoria</label>
              <input name="category" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Descricao</label>
              <input name="description" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Valor (R$)</label>
              <input name="amount" type="number" step="0.01" required className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Data</label>
              <input name="occurred_on" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
            </div>
            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95 mt-4">
              <Save size={18} /> Guardar Dados
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <form method="get" className="flex items-center gap-2">
              <input name="from" type="date" defaultValue={from} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none" />
              <input name="to" type="date" defaultValue={to} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none" />
              <select name="type" defaultValue={filterType} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none">
                <option value="all">Todos</option>
                <option value="income">Entradas</option>
                <option value="expense">Saidas</option>
              </select>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input name="q" defaultValue={q} type="text" placeholder="Filtrar lancamentos..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none" />
              </div>
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
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {ledger.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-sm text-slate-400 text-center">Nenhum lancamento no periodo.</td>
                  </tr>
                ) : null}
                {ledger.map((entry: any) => (
                  <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{entry.occurred_on}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 uppercase">{entry.type}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{entry.category ?? '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{fmtBRL(entry.amount_cents)}</td>
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
