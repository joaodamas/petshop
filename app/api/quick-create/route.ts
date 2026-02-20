import { NextResponse } from 'next/server'
import {
  addSaleItem,
  createAppointment,
  createClient,
  createLedgerEntry,
  createPet,
  createProduct,
  createSale,
  createService,
  listClients,
  listPets,
  listProducts,
  listServices,
} from '@/lib/db'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const entity = url.searchParams.get('entity')

    if (entity === 'appointment') {
      const [clients, pets, services] = await Promise.all([listClients(), listPets(), listServices()])
      return NextResponse.json({
        clients: clients.map((c: any) => ({ id: c.id, name: c.name })),
        pets: pets.map((p: any) => ({ id: p.id, name: p.name })),
        services: services.map((s: any) => ({ id: s.id, name: s.name })),
      })
    }

    if (entity === 'pet') {
      const clients = await listClients()
      return NextResponse.json({
        clients: clients.map((c: any) => ({ id: c.id, name: c.name })),
      })
    }

    if (entity === 'sale') {
      const [clients, products] = await Promise.all([listClients(), listProducts()])
      return NextResponse.json({
        clients: clients.map((c: any) => ({ id: c.id, name: c.name })),
        products: products.map((p: any) => ({ id: p.id, name: p.name, price_cents: p.price_cents })),
      })
    }

    return NextResponse.json({})
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Erro ao carregar opcoes' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const entity = String(body?.entity ?? '')
    const data = body?.data ?? {}

    if (entity === 'appointment') {
      const durationMin = Number(data.duration_min ?? 30)
      const startsAt = new Date(`${data.date}T${data.hour}:00`)
      const endsAt = new Date(startsAt)
      endsAt.setMinutes(endsAt.getMinutes() + durationMin)

      await createAppointment({
        client_id: String(data.client_id),
        pet_id: String(data.pet_id),
        service_id: String(data.service_id),
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        notes: String(data.notes ?? '') || null,
      })
      return NextResponse.json({ ok: true })
    }

    if (entity === 'client') {
      await createClient({
        name: String(data.name ?? ''),
        phone: String(data.phone ?? '') || null,
        whatsapp: String(data.whatsapp ?? '') || null,
        email: String(data.email ?? '') || null,
        cpf: String(data.cpf ?? '') || null,
        address: String(data.address ?? '') || null,
      })
      return NextResponse.json({ ok: true })
    }

    if (entity === 'pet') {
      await createPet({
        client_id: String(data.client_id),
        name: String(data.name ?? ''),
        species: String(data.species ?? '') || null,
        breed: String(data.breed ?? '') || null,
        sex: String(data.sex ?? '') || null,
      })
      return NextResponse.json({ ok: true })
    }

    if (entity === 'service') {
      await createService({
        name: String(data.name ?? ''),
        price: Number(data.price ?? 0),
        duration_min: Number(data.duration_min ?? 30),
        description: String(data.description ?? '') || null,
      })
      return NextResponse.json({ ok: true })
    }

    if (entity === 'product') {
      await createProduct({
        name: String(data.name ?? ''),
        category: String(data.category ?? '') || null,
        barcode: String(data.barcode ?? '') || null,
        cost: Number(data.cost ?? 0),
        price: Number(data.price ?? 0),
        stock_qty: Number(data.stock_qty ?? 0),
        min_stock_qty: Number(data.min_stock_qty ?? 0),
      })
      return NextResponse.json({ ok: true })
    }

    if (entity === 'sale') {
      const productId = String(data.product_id ?? '')
      const qty = Number(data.qty ?? 1)
      const allProducts = await listProducts()
      const product = allProducts.find((p: any) => p.id === productId)
      if (!product) {
        return NextResponse.json({ error: 'Produto nao encontrado' }, { status: 400 })
      }

      const saleId = await createSale({
        client_id: String(data.client_id ?? '') || null,
        payment: String(data.payment ?? 'pix'),
        notes: String(data.notes ?? '') || null,
      })

      await addSaleItem({
        sale_id: saleId,
        product_id: product.id,
        description: product.name,
        qty,
        unit: product.price_cents / 100,
      })
      return NextResponse.json({ ok: true })
    }

    if (entity === 'ledger') {
      await createLedgerEntry({
        type: String(data.type ?? 'income') as 'income' | 'expense',
        category: String(data.category ?? '') || null,
        description: String(data.description ?? '') || null,
        amount: Number(data.amount ?? 0),
        occurred_on: String(data.occurred_on),
      })
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Entidade invalida' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Falha ao criar registro' }, { status: 500 })
  }
}

