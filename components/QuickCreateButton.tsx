'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'
import { createPortal } from 'react-dom'

type Option = { id: string; name: string; price_cents?: number }

function contextFromPath(pathname: string) {
  if (pathname.startsWith('/app/agenda')) return { entity: 'appointment', title: 'Novo Agendamento' }
  if (pathname.startsWith('/app/clients')) return { entity: 'client', title: 'Novo Cliente' }
  if (pathname.startsWith('/app/pets') && !pathname.startsWith('/app/pets/')) return { entity: 'pet', title: 'Novo Pet' }
  if (pathname.startsWith('/app/services')) return { entity: 'service', title: 'Novo Servico' }
  if (pathname.startsWith('/app/products')) return { entity: 'product', title: 'Novo Produto' }
  if (pathname.startsWith('/app/sales')) return { entity: 'sale', title: 'Nova Venda' }
  if (pathname.startsWith('/app/finance')) return { entity: 'ledger', title: 'Novo Lancamento' }
  if (pathname.startsWith('/app/onboarding')) return null
  return { entity: 'appointment', title: 'Novo Registo' }
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function QuickCreateButton() {
  const pathname = usePathname()
  const router = useRouter()
  const ctx = useMemo(() => contextFromPath(pathname), [pathname])
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [options, setOptions] = useState<{ clients: Option[]; pets: Option[]; services: Option[]; products: Option[] }>({
    clients: [],
    pets: [],
    services: [],
    products: [],
  })

  const [form, setForm] = useState<Record<string, any>>({
    date: todayISO(),
    hour: '09:00',
    duration_min: 30,
    qty: 1,
    payment: 'pix',
    occurred_on: todayISO(),
    type: 'income',
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open || !ctx) return
    const needsOptions = ['appointment', 'pet', 'sale'].includes(ctx.entity)
    if (!needsOptions) return

    let cancelled = false
    fetch(`/api/quick-create?entity=${ctx.entity}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        setOptions({
          clients: data.clients ?? [],
          pets: data.pets ?? [],
          services: data.services ?? [],
          products: data.products ?? [],
        })
      })
      .catch(() => {
        if (!cancelled) setError('Nao foi possivel carregar opcoes.')
      })

    return () => {
      cancelled = true
    }
  }, [open, ctx])

  if (!ctx) return null

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!ctx) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/quick-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: ctx.entity, data: form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Falha ao salvar')
      setOpen(false)
      router.refresh()
    } catch (err: any) {
      setError(err?.message ?? 'Falha ao salvar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-600 transition-all"
      >
        <Plus size={16} />
        Novo
      </button>

      {mounted && open
        ? createPortal(
        <div className="fixed inset-0 z-[90] bg-slate-950/40 backdrop-blur-[2px] grid place-items-center p-4">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl border border-slate-200 shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">{ctx.title}</h3>
              <button type="button" onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submit} className="p-6 space-y-4">
              {ctx.entity === 'appointment' ? (
                <>
                  <select required className="w-full premium-input px-3 py-2.5" onChange={(e) => setForm((s) => ({ ...s, client_id: e.target.value }))}>
                    <option value="">Cliente</option>
                    {options.clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select required className="w-full premium-input px-3 py-2.5" onChange={(e) => setForm((s) => ({ ...s, pet_id: e.target.value }))}>
                    <option value="">Pet</option>
                    {options.pets.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <select required className="w-full premium-input px-3 py-2.5" onChange={(e) => setForm((s) => ({ ...s, service_id: e.target.value }))}>
                    <option value="">Servico</option>
                    {options.services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="date" required value={form.date} className="premium-input px-3 py-2.5" onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))} />
                    <input type="time" required value={form.hour} className="premium-input px-3 py-2.5" onChange={(e) => setForm((s) => ({ ...s, hour: e.target.value }))} />
                  </div>
                  <input type="number" min={5} value={form.duration_min} className="w-full premium-input px-3 py-2.5" onChange={(e) => setForm((s) => ({ ...s, duration_min: Number(e.target.value) }))} placeholder="Duracao (min)" />
                  <input className="w-full premium-input px-3 py-2.5" placeholder="Observacoes" onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))} />
                </>
              ) : null}

              {ctx.entity === 'client' ? (
                <>
                  <input required className="w-full premium-input px-3 py-2.5" placeholder="Nome completo" onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
                  <input className="w-full premium-input px-3 py-2.5" placeholder="Telefone" onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} />
                  <input className="w-full premium-input px-3 py-2.5" placeholder="WhatsApp" onChange={(e) => setForm((s) => ({ ...s, whatsapp: e.target.value }))} />
                  <input type="email" className="w-full premium-input px-3 py-2.5" placeholder="Email" onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
                </>
              ) : null}

              {ctx.entity === 'pet' ? (
                <>
                  <select required className="w-full premium-input px-3 py-2.5" onChange={(e) => setForm((s) => ({ ...s, client_id: e.target.value }))}>
                    <option value="">Tutor</option>
                    {options.clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <input required className="w-full premium-input px-3 py-2.5" placeholder="Nome do pet" onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="premium-input px-3 py-2.5" placeholder="Especie" onChange={(e) => setForm((s) => ({ ...s, species: e.target.value }))} />
                    <input className="premium-input px-3 py-2.5" placeholder="Raca" onChange={(e) => setForm((s) => ({ ...s, breed: e.target.value }))} />
                  </div>
                </>
              ) : null}

              {ctx.entity === 'service' ? (
                <>
                  <input required className="w-full premium-input px-3 py-2.5" placeholder="Nome do servico" onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" step="0.01" required className="premium-input px-3 py-2.5" placeholder="Preco (R$)" onChange={(e) => setForm((s) => ({ ...s, price: Number(e.target.value) }))} />
                    <input type="number" required className="premium-input px-3 py-2.5" placeholder="Duracao (min)" onChange={(e) => setForm((s) => ({ ...s, duration_min: Number(e.target.value) }))} />
                  </div>
                  <input className="w-full premium-input px-3 py-2.5" placeholder="Descricao" onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
                </>
              ) : null}

              {ctx.entity === 'product' ? (
                <>
                  <input required className="w-full premium-input px-3 py-2.5" placeholder="Nome do produto" onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="premium-input px-3 py-2.5" placeholder="Categoria" onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} />
                    <input className="premium-input px-3 py-2.5" placeholder="Codigo de barras" onChange={(e) => setForm((s) => ({ ...s, barcode: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" step="0.01" required className="premium-input px-3 py-2.5" placeholder="Custo" onChange={(e) => setForm((s) => ({ ...s, cost: Number(e.target.value) }))} />
                    <input type="number" step="0.01" required className="premium-input px-3 py-2.5" placeholder="Preco" onChange={(e) => setForm((s) => ({ ...s, price: Number(e.target.value) }))} />
                  </div>
                </>
              ) : null}

              {ctx.entity === 'sale' ? (
                <>
                  <select required className="w-full premium-input px-3 py-2.5" onChange={(e) => setForm((s) => ({ ...s, product_id: e.target.value }))}>
                    <option value="">Produto</option>
                    {options.products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}{p.price_cents ? ` - R$ ${(p.price_cents / 100).toFixed(2)}` : ''}</option>
                    ))}
                  </select>
                  <select className="w-full premium-input px-3 py-2.5" onChange={(e) => setForm((s) => ({ ...s, client_id: e.target.value }))}>
                    <option value="">Cliente (opcional)</option>
                    {options.clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" min={1} value={form.qty} className="premium-input px-3 py-2.5" placeholder="Qtd" onChange={(e) => setForm((s) => ({ ...s, qty: Number(e.target.value) }))} />
                    <select value={form.payment} className="premium-input px-3 py-2.5" onChange={(e) => setForm((s) => ({ ...s, payment: e.target.value }))}>
                      <option value="pix">PIX</option>
                      <option value="cash">Dinheiro</option>
                      <option value="debit">Debito</option>
                      <option value="credit">Credito</option>
                      <option value="transfer">Transferencia</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>
                  <input className="w-full premium-input px-3 py-2.5" placeholder="Observacoes" onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))} />
                </>
              ) : null}

              {ctx.entity === 'ledger' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <select value={form.type} className="premium-input px-3 py-2.5" onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}>
                      <option value="income">Entrada</option>
                      <option value="expense">Saida</option>
                    </select>
                    <input type="date" value={form.occurred_on} className="premium-input px-3 py-2.5" onChange={(e) => setForm((s) => ({ ...s, occurred_on: e.target.value }))} />
                  </div>
                  <input className="w-full premium-input px-3 py-2.5" placeholder="Categoria" onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} />
                  <input className="w-full premium-input px-3 py-2.5" placeholder="Descricao" onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
                  <input type="number" step="0.01" required className="w-full premium-input px-3 py-2.5" placeholder="Valor (R$)" onChange={(e) => setForm((s) => ({ ...s, amount: Number(e.target.value) }))} />
                </>
              ) : null}

              {error ? <p className="text-sm text-rose-600">{error}</p> : null}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold disabled:opacity-60">
                  {loading ? 'Salvando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
          , document.body)
        : null}
    </>
  )
}
