'use client'

import React from 'react'

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props
  return (
    <input
      {...rest}
      className={`px-3 py-2.5 rounded-xl border border-slate-300 w-full outline-none bg-white/90 focus:bg-white focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 transition ${className}`}
    />
  )
}
