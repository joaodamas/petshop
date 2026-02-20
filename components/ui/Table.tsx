import React from 'react'

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-auto rounded-2xl border bg-white">
      <table className="w-full text-sm">{children}</table>
    </div>
  )
}
