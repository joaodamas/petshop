import { revalidatePath } from 'next/cache'
import { Download, Filter, PawPrint, Plus, Save, Search } from 'lucide-react'
import { createPet, listClients, listPets } from '@/lib/db'

export default async function PetsPage() {
  const [pets, clients] = await Promise.all([listPets(), listClients()])

  async function createPetAction(formData: FormData) {
    'use server'

    await createPet({
      client_id: String(formData.get('client_id')),
      name: String(formData.get('name')),
      species: String(formData.get('species') ?? '') || null,
      breed: String(formData.get('breed') ?? '') || null,
      sex: String(formData.get('sex') ?? '') || null,
    })

    revalidatePath('/app/pets')
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Base de Pets</h2>
        <p className="text-slate-500 text-sm">Cadastro e historico basico dos pacientes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Plus className="text-indigo-600" size={18} /> Novo Pet
          </h3>
          <form action={createPetAction} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Tutor</label>
              <select name="client_id" required className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none">
                {clients.map((client: any) => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Nome do Pet</label>
              <input name="name" required className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Especie</label>
              <input name="species" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" placeholder="Ex: Cachorro" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Raca</label>
              <input name="breed" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Sexo</label>
              <input name="sex" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-sm outline-none" placeholder="M/F" />
            </div>
            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95 mt-4">
              <Save size={18} /> Guardar Dados
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Filtrar pets..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none" />
            </div>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pets.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-sm text-slate-400 text-center">Nenhum pet registado.</td>
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
