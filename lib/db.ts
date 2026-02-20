import 'server-only'
import { supabaseServer } from '@/lib/supabase/server'
import { cents } from '@/lib/money'
import {
  appointmentSchema,
  clientSchema,
  petSchema,
  productSchema,
  saleItemSchema,
  saleSchema,
  serviceSchema,
} from '@/lib/validations'

async function requireUser() {
  const supabase = await supabaseServer()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    throw new Error('Nao autenticado')
  }

  return { supabase, user: data.user }
}

export async function ensurePetshopForUser() {
  const { supabase, user } = await requireUser()

  const { data: membership } = await supabase
    .from('petshop_members')
    .select('petshop_id')
    .eq('user_id', user.id)
    .limit(1)

  if (membership && membership.length > 0) {
    return membership[0].petshop_id as string
  }

  const petshopId = crypto.randomUUID()

  const { error: petshopError } = await supabase.from('petshops').insert({
    id: petshopId,
    name: 'Meu Petshop',
  })

  if (petshopError) throw petshopError

  const { error: memberError } = await supabase
    .from('petshop_members')
    .insert({ petshop_id: petshopId, user_id: user.id, role: 'admin' })

  if (memberError) throw memberError

  return petshopId
}

export async function getMyPetshopId() {
  const { supabase, user } = await requireUser()

  const { data, error } = await supabase
    .from('petshop_members')
    .select('petshop_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (error) throw error
  return data.petshop_id as string
}

export async function listClients() {
  const { supabase } = await requireUser()
  const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createClient(input: unknown) {
  const parsed = clientSchema.parse(input)
  const { supabase } = await requireUser()
  const petshop_id = await getMyPetshopId()
  const { error } = await supabase.from('clients').insert({ ...parsed, petshop_id })
  if (error) throw error
}

export async function listPets() {
  const { supabase } = await requireUser()
  const { data, error } = await supabase
    .from('pets')
    .select('*, clients(name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createPet(input: unknown) {
  const parsed = petSchema.parse(input)
  const { supabase } = await requireUser()
  const petshop_id = await getMyPetshopId()
  const { error } = await supabase.from('pets').insert({ ...parsed, petshop_id })
  if (error) throw error
}

export async function listServices() {
  const { supabase } = await requireUser()
  const { data, error } = await supabase.from('services').select('*').eq('is_active', true).order('name')
  if (error) throw error
  return data
}

export async function createService(input: unknown) {
  const parsed = serviceSchema.parse(input)
  const { supabase } = await requireUser()
  const petshop_id = await getMyPetshopId()

  const { error } = await supabase.from('services').insert({
    petshop_id,
    name: parsed.name,
    price_cents: cents(parsed.price),
    duration_min: parsed.duration_min,
    description: parsed.description,
  })

  if (error) throw error
}

export async function listProducts() {
  const { supabase } = await requireUser()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createProduct(input: unknown) {
  const parsed = productSchema.parse(input)
  const { supabase } = await requireUser()
  const petshop_id = await getMyPetshopId()

  const { error } = await supabase.from('products').insert({
    petshop_id,
    name: parsed.name,
    category: parsed.category,
    barcode: parsed.barcode,
    cost_cents: cents(parsed.cost),
    price_cents: cents(parsed.price),
    stock_qty: parsed.stock_qty,
    min_stock_qty: parsed.min_stock_qty,
  })

  if (error) throw error
}

export async function listAgenda(fromISO: string, toISO: string) {
  const { supabase } = await requireUser()
  const { data, error } = await supabase
    .from('appointments')
    .select('*, clients(name), pets(name), services(name)')
    .gte('starts_at', fromISO)
    .lt('starts_at', toISO)
    .order('starts_at')

  if (error) throw error
  return data
}

export async function createAppointment(input: unknown) {
  const parsed = appointmentSchema.parse(input)
  const { supabase } = await requireUser()
  const petshop_id = await getMyPetshopId()

  const { error } = await supabase.from('appointments').insert({
    petshop_id,
    ...parsed,
    status: 'scheduled',
  })

  if (error) throw error
}

export async function createSale(input: unknown) {
  const parsed = saleSchema.parse(input)
  const { supabase } = await requireUser()
  const petshop_id = await getMyPetshopId()

  const { data, error } = await supabase.from('sales').insert({ petshop_id, ...parsed }).select('id').single()

  if (error) throw error
  return data.id as string
}

export async function addSaleItem(input: unknown) {
  const parsed = saleItemSchema.parse(input)
  const { supabase } = await requireUser()

  const { error } = await supabase.from('sale_items').insert({
    sale_id: parsed.sale_id,
    product_id: parsed.product_id ?? null,
    description: parsed.description,
    qty: parsed.qty,
    unit_cents: cents(parsed.unit),
  })

  if (error) throw error
}

export async function listSales(limit = 30) {
  const { supabase } = await requireUser()

  const { data, error } = await supabase
    .from('sales')
    .select('id, sold_at, payment, total_cents, clients(name)')
    .order('sold_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function listLedger(fromDate: string, toDate: string) {
  const { supabase } = await requireUser()

  const { data, error } = await supabase
    .from('ledger_entries')
    .select('*')
    .gte('occurred_on', fromDate)
    .lte('occurred_on', toDate)
    .order('occurred_on', { ascending: false })

  if (error) throw error
  return data
}

export async function createLedgerEntry(input: {
  type: 'income' | 'expense'
  category?: string | null
  description?: string | null
  amount: number
  occurred_on: string
}) {
  const { supabase } = await requireUser()
  const petshop_id = await getMyPetshopId()

  const { error } = await supabase.from('ledger_entries').insert({
    petshop_id,
    type: input.type,
    category: input.category ?? null,
    description: input.description ?? null,
    amount_cents: cents(input.amount),
    occurred_on: input.occurred_on,
    source: 'manual',
  })

  if (error) throw error
}

export async function getDashboard(dayISO: string) {
  const { supabase } = await requireUser()

  const start = new Date(dayISO)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)

  const monthStart = new Date(start.getFullYear(), start.getMonth(), 1)
  const monthEnd = new Date(start.getFullYear(), start.getMonth() + 1, 1)

  const { data: salesToday, error: salesTodayErr } = await supabase
    .from('sales')
    .select('total_cents')
    .gte('sold_at', start.toISOString())
    .lt('sold_at', end.toISOString())

  if (salesTodayErr) throw salesTodayErr

  const { data: salesMonth, error: salesMonthErr } = await supabase
    .from('sales')
    .select('total_cents')
    .gte('sold_at', monthStart.toISOString())
    .lt('sold_at', monthEnd.toISOString())

  if (salesMonthErr) throw salesMonthErr

  const { data: appointments, error: appointmentsErr } = await supabase
    .from('appointments')
    .select('id, status, starts_at, clients(name), pets(name), services(name)')
    .gte('starts_at', start.toISOString())
    .lt('starts_at', end.toISOString())
    .order('starts_at')

  if (appointmentsErr) throw appointmentsErr

  const { data: products, error: productsErr } = await supabase
    .from('products')
    .select('id, name, stock_qty, min_stock_qty')
    .eq('is_active', true)
    .order('stock_qty', { ascending: true })
    .limit(50)

  if (productsErr) throw productsErr

  const todaySalesCents = (salesToday ?? []).reduce((acc, row) => acc + (row.total_cents ?? 0), 0)
  const monthSalesCents = (salesMonth ?? []).reduce((acc, row) => acc + (row.total_cents ?? 0), 0)
  const lowStock = (products ?? []).filter((p) => p.stock_qty <= p.min_stock_qty).slice(0, 8)

  return {
    todaySalesCents,
    monthSalesCents,
    todayAppointments: appointments?.length ?? 0,
    doneAppointments: appointments?.filter((a) => a.status === 'done').length ?? 0,
    nextAppointments: (appointments ?? []).slice(0, 5),
    lowStock,
  }
}
