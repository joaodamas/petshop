import { Calendar } from 'lucide-react'

type TimelineEvent = {
  id: string
  date: string
  type: string
  description: string
  status: string
}

export default function PetTimeline({ history }: { history: TimelineEvent[] }) {
  return (
    <div className="relative border-l border-slate-200 ml-3">
      {history.length === 0 ? <p className="ml-6 text-sm text-slate-500">Sem historico deste pet.</p> : null}
      {history.map((event) => (
        <div key={event.id} className="mb-8 ml-6">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-indigo-100 rounded-full -left-3 ring-8 ring-white">
            <Calendar size={14} className="text-indigo-700" />
          </span>
          <h3 className="flex items-center mb-1 text-base font-semibold text-slate-900">
            {event.type}
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded ml-3">{event.date}</span>
          </h3>
          <p className="text-sm text-slate-500">{event.description}</p>
        </div>
      ))}
    </div>
  )
}
