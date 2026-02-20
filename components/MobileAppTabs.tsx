'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/app/dashboard', label: 'Dashboard' },
  { href: '/app/clients', label: 'Clientes' },
  { href: '/app/pets', label: 'Pets' },
  { href: '/app/services', label: 'Servicos' },
  { href: '/app/agenda', label: 'Agenda' },
  { href: '/app/products', label: 'Produtos' },
  { href: '/app/sales', label: 'Vendas' },
  { href: '/app/finance', label: 'Financeiro' },
]

export function MobileAppTabs() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden surface-glass border-b border-slate-200/70">
      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-200/80'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

