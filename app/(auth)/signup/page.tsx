'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const supabase = supabaseBrowser()
    setLoading(true)
    setMsg(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_name: companyName,
        },
      },
    })

    setLoading(false)

    if (error) {
      setMsg(error.message)
      return
    }

    setMsg('Conta criada! Agora faca login.')
    router.push('/login')
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl border border-slate-200 p-6 bg-white">
        <h1 className="text-xl font-semibold">Criar conta</h1>
        <p className="text-sm text-slate-500 mt-1">Comece seu teste gratis</p>

        <div className="mt-5 space-y-3">
          <div>
            <label className="text-sm">Seu nome</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm">Nome do petshop</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <label className="text-sm">Senha</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={6} required />
          </div>

          {msg ? <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-700">{msg}</div> : null}

          <button disabled={loading} className="w-full rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-medium disabled:opacity-60">
            {loading ? 'Criando...' : 'Criar conta'}
          </button>

          <div className="text-sm text-slate-600">
            Ja tem conta? <a href="/login" className="hover:underline">Entrar</a>
          </div>
        </div>
      </form>
    </main>
  )
}
