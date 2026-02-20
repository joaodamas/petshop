import Link from 'next/link'

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

export default function Nav() {
  return (
    <nav className="flex flex-wrap gap-2 rounded-2xl border bg-white p-2 shadow-sm">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="px-3 py-2 rounded-xl border hover:bg-slate-50">
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
