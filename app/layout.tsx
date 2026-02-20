import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Sora } from 'next/font/google'
import './globals.css'

const uiFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-ui',
})

const titleFont = Sora({
  subsets: ['latin'],
  variable: '--font-title',
})

export const metadata: Metadata = {
  title: 'Petshop MVP',
  description: 'Sistema de gestao de petshop com Supabase',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${uiFont.variable} ${titleFont.variable}`}>{children}</body>
    </html>
  )
}
