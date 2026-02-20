'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, DollarSign, LayoutDashboard, Package, PawPrint, ShoppingCart, Users, Wrench } from 'lucide-react'

export function AppSidebarNav() {
  const pathname = usePathname()
  const items = [
    { href: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/app/clients', label: 'Clientes', icon: Users },
    { href: '/app/pets', label: 'Pets', icon: PawPrint },
    { href: '/app/services', label: 'Servicos', icon: Wrench },
    { href: '/app/agenda', label: 'Agenda', icon: Calendar },
    { href: '/app/products', label: 'Produtos', icon: Package },
    { href: '/app/sales', label: 'Vendas', icon: ShoppingCart },
    { href: '/app/finance', label: 'Financeiro', icon: DollarSign },
  ]

  return (
    <nav className="flex-1 px-6 space-y-1.5 mt-4 overflow-y-auto">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all ${
              active
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-200/80'
                : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-700'
            }`}
          >
            <item.icon size={18} />
            <span className="text-sm font-semibold">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
