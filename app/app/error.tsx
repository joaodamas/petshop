'use client'

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-[60vh] grid place-items-center p-4">
      <div className="w-full max-w-xl rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Erro ao carregar o painel</h2>
        <p className="mt-2 text-sm text-slate-600">
          Verifique se o SQL foi aplicado no Supabase. Se for primeiro acesso, rode `supabase/fix_bootstrap_rls.sql`.
        </p>
        <pre className="mt-4 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
          {error.message}
        </pre>
        <button
          type="button"
          onClick={reset}
          className="mt-4 px-4 py-2 rounded-xl border bg-slate-900 text-white"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  )
}
