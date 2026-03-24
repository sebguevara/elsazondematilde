import type { CartItem } from '@/types/content'

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatPriceShort(price: number): string {
  if (price >= 1000) {
    return `$${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k`
  }
  return `$${price}`
}

export function buildWhatsAppMessage(items: CartItem[], baseMessage: string): string {
  if (items.length === 0) return baseMessage

  const itemLines = items.map((item) => {
    const sizeLabel =
      item.size === 'small' ? ' (Pequeño)' : item.size === 'large' ? ' (Grande)' : ''
    return `• ${item.quantity}x ${item.menuItem.name}${sizeLabel}`
  })

  return `${baseMessage}

${itemLines.join('\n')}
`
}

export function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.menuItem.price * item.quantity, 0)
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
}
