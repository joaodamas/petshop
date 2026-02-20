import { redirect } from 'next/navigation'
import { ensurePetshopForUser } from '@/lib/db'

export default async function AppRoot() {
  await ensurePetshopForUser()
  redirect('/app/dashboard')
}
