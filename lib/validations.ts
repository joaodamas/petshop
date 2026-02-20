import { z } from 'zod'

export const clientSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  cpf: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export const petSchema = z.object({
  client_id: z.string().uuid(),
  name: z.string().min(1),
  species: z.string().optional().nullable(),
  breed: z.string().optional().nullable(),
  sex: z.string().optional().nullable(),
  weight_kg: z.coerce.number().optional().nullable(),
  birth_date: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
})

export const serviceSchema = z.object({
  name: z.string().min(2),
  price: z.coerce.number().min(0),
  duration_min: z.coerce.number().int().min(5).max(480),
  description: z.string().optional().nullable(),
})

export const productSchema = z.object({
  name: z.string().min(2),
  category: z.string().optional().nullable(),
  barcode: z.string().optional().nullable(),
  cost: z.coerce.number().min(0),
  price: z.coerce.number().min(0),
  stock_qty: z.coerce.number().int().min(0),
  min_stock_qty: z.coerce.number().int().min(0),
})

export const appointmentSchema = z.object({
  client_id: z.string().uuid(),
  pet_id: z.string().uuid(),
  service_id: z.string().uuid(),
  starts_at: z.string(),
  ends_at: z.string(),
  notes: z.string().optional().nullable(),
})

export const saleSchema = z.object({
  client_id: z.string().uuid().optional().nullable(),
  payment: z.enum(['cash', 'pix', 'debit', 'credit', 'transfer', 'other']).default('pix'),
  notes: z.string().optional().nullable(),
})

export const saleItemSchema = z.object({
  sale_id: z.string().uuid(),
  product_id: z.string().uuid().optional().nullable(),
  description: z.string().min(1),
  qty: z.coerce.number().int().min(1),
  unit: z.coerce.number().min(0),
})
