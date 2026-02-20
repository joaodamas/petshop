import { Download, Filter, PawPrint, Search } from 'lucide-react'
import { listPets } from '@/lib/db'
import Link from 'next/link'

export default async function PetsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams
  const q = (params.q ?? '').trim()
  const pets = await listPets(q)

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Base de Pets</h2>
        <p className="text-slate-500 text-sm">Cadastro e historico basico dos pacientes.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <form method="get" className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input name="q" defaultValue={q} type="text" placeholder="Filtrar pets..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none" />
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
                <th className="px-6 py-4">Pet</th>
                <th className="px-6 py-4">Tutor</th>
                <th className="px-6 py-4">Especie</th>
                <th className="px-6 py-4">Raca</th>
                <th className="px-6 py-4">Historico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-sm text-slate-400 text-center">Nenhum pet registado.</td>
                </tr>
              ) : null}
              {pets.map((pet: any) => (
                <tr key={pet.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-800 flex items-center gap-2">
                    <PawPrint size={14} className="text-indigo-500" />
                    {pet.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{pet.clients?.name ?? '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{pet.species ?? '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{pet.breed ?? '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    <Link href={`/app/pets/${pet.id}`} className="text-indigo-600 hover:underline">Ver timeline</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

