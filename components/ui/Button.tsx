'use client'

import React from 'react'

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = '', ...rest } = props
  return (
    <button
      {...rest}
      className={`px-4 py-2 rounded-xl border border-emerald-800/20 bg-gradient-to-b from-emerald-600 to-teal-700 text-white font-semibold hover:brightness-105 active:translate-y-px transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_24px_rgba(15,118,110,0.28)] ${className}`}
    />
  )
}
