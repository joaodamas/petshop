'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = supabaseBrowser()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }

    router.push('/app/dashboard')
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <section className="hidden lg:flex bg-slate-950 text-white p-10 items-center">
        <div className="max-w-md">
          <div className="text-sm text-slate-300">PetSystem</div>
          <h1 className="mt-3 text-3xl font-semibold leading-tight">Simplifique a gestao do seu petshop.</h1>
          <ul className="mt-6 text-slate-300 space-y-2 text-sm">
            <li>Agenda organizada e rapida</li>
            <li>Clientes e pets com historico</li>
            <li>Financeiro e vendas em tempo real</li>
          </ul>
        </div>
      </section>

      <section className="flex items-center justify-center p-6">
        <form onSubmit={onSubmit} className="w-full max-w-sm rounded-3xl border border-slate-200 p-6 bg-white">
          <h2 className="text-xl font-semibold">Entrar</h2>
          <p className="text-sm text-slate-500 mt-1">Acesse sua conta</p>

          <div className="mt-5 space-y-3">
            <div>
              <label className="text-sm">Email</label>
              <input className="mt-1 w-full rounded-xl border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            </div>
            <div>
              <label className="text-sm">Senha</label>
              <input className="mt-1 w-full rounded-xl border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
            </div>

            {error ? <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div> : null}

            <button disabled={loading} className="w-full rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-medium disabled:opacity-60">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="flex justify-between text-sm">
              <a className="text-slate-600 hover:underline" href="/signup">Criar conta</a>
            </div>
          </div>
        </form>
      </section>
    </main>
  )
}
