import Link from 'next/link'
import PetTimeline from '@/components/PetTimeline'
import { getPetTimeline } from '@/lib/db'

export default async function PetDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { pet, timeline } = await getPetTimeline(id)
  const tutorName = Array.isArray((pet as any).clients)
    ? (pet as any).clients?.[0]?.name
    : (pet as any).clients?.name

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Historico do Pet</h1>
          <p className="text-slate-500 text-sm">{pet.name} · {pet.species ?? '-'} · Tutor: {tutorName ?? '-'}</p>
        </div>
        <Link href="/app/pets" className="px-4 py-2 rounded-xl border bg-white text-sm font-medium">Voltar</Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
        <PetTimeline history={timeline} />
      </div>
    </div>
  )
}
