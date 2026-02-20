'use client'

import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [msg, setMsg] = useState<string | null>(null)

  async function submit() {
    const supabase = supabaseBrowser()
    setMsg(null)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      setMsg(error ? error.message : 'Conta criada. Faca login.')
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setMsg(error ? error.message : 'Login realizado')

    if (!error) {
      window.location.href = '/app'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/80 backdrop-blur-md p-6 md:p-7 flex flex-col gap-4 shadow-[0_18px_60px_rgba(20,37,63,0.20)]">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-900/10 bg-emerald-50 px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
          <span className="text-xs font-semibold tracking-[0.14em] text-emerald-800">PETSHOP OS</span>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Acessar painel</h1>
          <p className="text-sm text-slate-600">Entre para gerenciar clientes, pets, agenda e vendas.</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wide text-slate-600">E-mail</label>
          <Input placeholder="seuemail@petshop.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wide text-slate-600">Senha</label>
          <Input
            placeholder="Sua senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex gap-2 pt-1">
          <Button onClick={submit} type="button" className="flex-1">
            {mode === 'signup' ? 'Criar conta' : 'Entrar'}
          </Button>
          <button
            type="button"
            onClick={() => setMode((m) => (m === 'login' ? 'signup' : 'login'))}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white/90 text-slate-800 font-medium hover:bg-slate-100 transition"
          >
            {mode === 'signup' ? 'Ir login' : 'Cadastrar'}
          </button>
        </div>

        {msg ? (
          <p className="text-sm rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">{msg}</p>
        ) : null}
      </div>
    </div>
  )
}
