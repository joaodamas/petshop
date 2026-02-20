import { redirect } from 'next/navigation'
import { getMyPetshop, updateMyPetshopProfile } from '@/lib/db'

export default async function OnboardingPage() {
  const petshop = await getMyPetshop()

  async function saveCompany(formData: FormData) {
    'use server'

    await updateMyPetshopProfile({
      name: String(formData.get('name') ?? 'Meu Petshop'),
      plan: String(formData.get('plan') ?? 'free') as 'free' | 'pro' | 'enterprise',
    })

    redirect('/app/dashboard')
  }

  return (
    <div className="max-w-3xl mx-auto py-10 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-10">
        <h1 className="text-2xl font-bold text-slate-800">Onboarding da Empresa</h1>
        <p className="text-slate-500 text-sm mt-1">
          Configure os dados da sua empresa para concluir a ativacao do sistema.
        </p>

        <form action={saveCompany} className="mt-8 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Nome da Empresa</label>
            <input
              name="name"
              required
              defaultValue={petshop.name}
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Plano</label>
            <select
              name="plan"
              defaultValue={petshop.plan ?? 'free'}
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none"
            >
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">
            Concluir Onboarding
          </button>
        </form>
      </div>
    </div>
  )
}
