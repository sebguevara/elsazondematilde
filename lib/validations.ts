import { z } from 'zod'

export const menuItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string(),
  price: z.number().min(0, 'El precio debe ser mayor a 0'),
  category: z.string().min(1, 'La categoría es requerida'),
  image: z.string().url().optional().or(z.literal('')),
  featured: z.boolean(),
  available: z.boolean(),
})

export const categorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'El nombre es requerido'),
  order: z.number().min(0),
})

export const galleryImageSchema = z.object({
  id: z.string().min(1),
  url: z.string().url('URL inválida'),
  alt: z.string().min(1, 'El texto alternativo es requerido'),
  order: z.number().min(0),
  fit: z.enum(['cover', 'contain']).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
})

export const businessHoursSchema = z.object({
  day: z.string().min(1),
  open: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
  close: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
  enabled: z.boolean(),
})

export const paymentMethodSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'El nombre es requerido'),
  details: z.string().optional(),
  enabled: z.boolean(),
})

export const brandInfoSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  tagline: z.string(),
  logo: z.string().url('URL de logo inválida'),
  logoAlt: z.string().url().optional().or(z.literal('')),
})

export const heroContentSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  subtitle: z.string(),
  ctaText: z.string().min(1, 'El texto del botón es requerido'),
  badge: z.string().optional(),
  backgroundImage: z.string().url().optional().or(z.literal('')),
})

export const contactInfoSchema = z.object({
  whatsappNumber: z.string().min(10, 'Número de WhatsApp inválido'),
  whatsappMessage: z.string().min(1, 'El mensaje es requerido'),
  phone: z.string().optional(),
  address: z.string().optional(),
  nequiNumber: z.string().optional(),
})

export const footerContentSchema = z.object({
  text: z.string(),
  copyright: z.string(),
  instagram: z.string().url('URL inválida').optional().or(z.literal('')),
})

export const siteContentSchema = z.object({
  brand: brandInfoSchema,
  hero: heroContentSchema,
  contact: contactInfoSchema,
  categories: z.array(categorySchema),
  menu: z.array(menuItemSchema),
  gallery: z.array(galleryImageSchema),
  hours: z.array(businessHoursSchema),
  paymentMethods: z.array(paymentMethodSchema),
  footer: footerContentSchema,
})

export type MenuItemFormData = z.infer<typeof menuItemSchema>
export type CategoryFormData = z.infer<typeof categorySchema>
export type GalleryImageFormData = z.infer<typeof galleryImageSchema>
