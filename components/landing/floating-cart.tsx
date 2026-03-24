'use client'

import { ShoppingBag, X, Plus, Minus, MessageCircle, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useCart } from '@/contexts/cart-context'
import { formatPrice, formatPriceShort, buildWhatsAppMessage, buildWhatsAppUrl, calculateTotal } from '@/lib/whatsapp'
import type { ContactInfo } from '@/types/content'
import { landingButtonClass } from '@/components/landing/landing-button'

interface FloatingCartProps {
  contact: ContactInfo
}

export function FloatingCart({ contact }: FloatingCartProps) {
  const { items, totalItems, cartPulse, updateQuantity, removeItem, clearCart, isCartOpen, setIsCartOpen } = useCart()
  const total = calculateTotal(items)
  const [isBuzzing, setIsBuzzing] = useState(false)
  const buzzTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (cartPulse === 0) return

    setIsBuzzing(true)
    if (buzzTimeoutRef.current) window.clearTimeout(buzzTimeoutRef.current)
    buzzTimeoutRef.current = window.setTimeout(() => setIsBuzzing(false), 520)

    return () => {
      if (buzzTimeoutRef.current) window.clearTimeout(buzzTimeoutRef.current)
      buzzTimeoutRef.current = null
    }
  }, [cartPulse])

  const handleOrder = () => {
    const message = buildWhatsAppMessage(items, contact.whatsappMessage)
    const url = buildWhatsAppUrl(contact.whatsappNumber, message)
    window.open(url, '_blank')
    clearCart()
    setIsCartOpen(false)
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <Button
          className={[
            'fixed bottom-6 right-6 z-40 h-13 w-13 rounded-full bg-matilde-red hover:bg-matilde-red-dark shadow-xl transition-all duration-300 hover:scale-110',
            isBuzzing ? 'cart-buzz' : '',
          ].join(' ')}
          size="icon"
          aria-label="Abrir carrito"
        >
          <ShoppingBag className="h-7.5 w-7.5 text-white" />
          {totalItems > 0 && (
            <span className={['absolute -top-1 -right-1 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-matilde-yellow text-[11px] font-bold text-matilde-red', isBuzzing ? 'cart-badge-pop' : ''].join(' ')}>
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full gap-0 border-l-0 bg-matilde-cream p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-matilde-yellow px-5 pb-4 pt-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-serif text-2xl text-matilde-red">
              Tu Pedido
            </SheetTitle>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <ShoppingBag className="w-16 h-16 text-matilde-brown/30 mb-4" />
            <p className="text-matilde-brown text-lg font-medium">Tu carrito está vacío</p>
            <p className="text-matilde-brown/60 text-sm mt-1">
              Agrega productos desde el menú
            </p>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <ScrollArea className="min-h-0 flex-1 px-4 py-4">
              <div className="space-y-3 pr-1">
                {items.map((item) => {
                  const key = item.size ? `${item.menuItem.id}-${item.size}` : item.menuItem.id
                  const price = item.menuItem.price
                  const subtotal = price * item.quantity
                  const sizeLabel = item.size === 'small' ? '(Pequeño)' : item.size === 'large' ? '(Grande)' : ''

                  return (
                    <div
                      key={key}
                      className="bg-white rounded-xl p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-matilde-brown">
                            {item.menuItem.name} {sizeLabel}
                          </h4>
                          <p className="text-sm text-matilde-brown/60">
                            {formatPriceShort(price)} c/u
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.menuItem.id, item.size)}
                          className="w-8 h-8 text-matilde-brown/40 hover:text-matilde-red hover:bg-matilde-red/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1, item.size)}
                            className="w-8 h-8 rounded-full border-matilde-red text-matilde-red hover:bg-matilde-red hover:text-white"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-bold text-matilde-brown">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1, item.size)}
                            className="w-8 h-8 rounded-full bg-matilde-red hover:bg-matilde-red-dark text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <span className="font-serif text-lg text-matilde-red">
                          {formatPrice(subtotal)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            <div className="border-t border-matilde-yellow bg-white p-5 shadow-[0_-12px_32px_rgba(93,64,55,0.08)]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-matilde-brown font-medium">Total</span>
                <span className="font-serif text-2xl text-matilde-red">
                  {formatPrice(total)}
                </span>
              </div>
              <div className="flex flex-row items-stretch gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearCart}
                  className={`${landingButtonClass} shrink-0 rounded-xl border-matilde-yellow px-4 text-matilde-brown hover:bg-matilde-yellow-light hover:text-matilde-red`}
                >
                  <Trash2 className="mr-2 h-4 w-4 shrink-0" />
                  <span>Vaciar</span>
                </Button>
                <Button
                  onClick={handleOrder}
                  className={`${landingButtonClass} min-w-0 flex-1 rounded-xl bg-[#25D366] px-5 text-white hover:bg-[#1fb855]`}
                >
                  <MessageCircle className="mr-2 h-5 w-5 shrink-0" />
                  <span className="truncate">Hacer pedido</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>

      <style jsx>{`
        .cart-buzz {
          animation: cartBuzz 520ms cubic-bezier(0.2, 0.9, 0.2, 1);
          transform-origin: 70% 90%;
          will-change: transform;
        }

        .cart-badge-pop {
          animation: badgePop 520ms cubic-bezier(0.2, 0.9, 0.2, 1);
          will-change: transform;
        }

        @keyframes cartBuzz {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
          12% {
            transform: translate3d(-1px, 0, 0) rotate(-10deg) scale(1.05);
          }
          24% {
            transform: translate3d(2px, 0, 0) rotate(12deg) scale(1.06);
          }
          38% {
            transform: translate3d(-2px, 0, 0) rotate(-12deg) scale(1.05);
          }
          52% {
            transform: translate3d(2px, 0, 0) rotate(10deg) scale(1.04);
          }
          70% {
            transform: translate3d(-1px, 0, 0) rotate(-6deg) scale(1.02);
          }
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
        }

        @keyframes badgePop {
          0% {
            transform: scale(1);
          }
          20% {
            transform: scale(1.25);
          }
          55% {
            transform: scale(0.98);
          }
          100% {
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cart-buzz,
          .cart-badge-pop {
            animation: none !important;
          }
        }
      `}</style>
    </Sheet>
  )
}
