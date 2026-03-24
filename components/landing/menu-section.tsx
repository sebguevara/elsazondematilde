'use client'

import { useState } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCart } from '@/contexts/cart-context'
import { formatPriceShort } from '@/lib/whatsapp'
import type { MenuItem, MenuCategory } from '@/types/content'
import { SectionWave } from '@/components/landing/section-wave'
import { landingButtonClass } from '@/components/landing/landing-button'

interface MenuSectionProps {
  categories: MenuCategory[]
  menu: MenuItem[]
}

export function MenuSection({ categories, menu }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || '')
  const [previewItem, setPreviewItem] = useState<MenuItem | null>(null)
  const { addItem, removeItem, getItemQuantity } = useCart()

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order)
  const filteredItems = menu.filter(
    (item) => item.category === activeCategory && item.available
  )

  return (
    <section
      id="menu"
      className="relative overflow-hidden bg-matilde-cream pt-12 pb-20 md:pt-16 md:pb-24"
    >
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="font-serif text-3xl md:text-4xl text-matilde-red text-center mb-8">
          Nuestro Menú
        </h2>

        {/* Category Tabs */}
        <div className="flex justify-center gap-2 mb-8 overflow-x-auto pb-2">
          {sortedCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`inline-flex items-center justify-center ${landingButtonClass} whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-matilde-red text-white shadow-md'
                  : 'bg-white text-matilde-brown hover:bg-matilde-yellow-light'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 xl:gap-5">
          {filteredItems.map((item) => (
            <MenuItemCard 
              key={item.id} 
              item={item}
              quantity={getItemQuantity(item.id)}
              onAdd={() => addItem(item)}
              onRemove={() => removeItem(item.id)}
              onPreview={() => setPreviewItem(item)}
            />
          ))}
        </div>
      </div>

      {/* Wave transition into the (white) gallery section */}
      <SectionWave position="bottom" colorClassName="text-white" />

      <Dialog open={Boolean(previewItem)} onOpenChange={(open) => !open && setPreviewItem(null)}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[92vh] max-w-4xl overflow-hidden border-matilde-yellow bg-matilde-cream p-0"
        >
          {previewItem && (
            <div className="grid max-h-[92vh] grid-cols-1 md:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-[18rem] bg-white md:min-h-[34rem]">
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-matilde-red shadow-md transition-colors hover:bg-white"
                >
                  <X className="h-4 w-4" />
                </button>
                <img
                  src={previewItem.image || ''}
                  alt={previewItem.name}
                  className="h-full w-full object-contain object-center"
                  loading="eager"
                />
              </div>

              <div className="flex flex-col justify-between p-5 sm:p-6">
                <DialogHeader className="text-left">
                  <DialogTitle className="font-serif text-3xl text-matilde-red">
                    {previewItem.name}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-6">
                  <p className="text-base leading-relaxed text-matilde-brown">
                    {previewItem.description}
                  </p>
                  <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <span className="text-sm uppercase tracking-[0.18em] text-matilde-brown/55">
                      Precio
                    </span>
                    <span className="font-serif text-2xl text-matilde-red">
                      {formatPriceShort(previewItem.price)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setPreviewItem(null)}
                  className="w-full bg-matilde-red text-white hover:bg-matilde-red-dark"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

interface MenuItemCardProps {
  item: MenuItem
  quantity: number
  onAdd: () => void
  onRemove: () => void
  onPreview: () => void
}

function MenuItemCard({ item, quantity, onAdd, onRemove, onPreview }: MenuItemCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-[1.35rem] border-2 border-matilde-yellow-light bg-white transition-colors hover:border-matilde-yellow">
      {item.image && (
        <button
          type="button"
          onClick={onPreview}
          className="group relative aspect-[4/5] max-h-[13.5rem] overflow-hidden bg-matilde-cream text-left sm:aspect-[4/5] sm:max-h-[14rem]"
          aria-label={`Abrir imagen de ${item.name}`}
        >
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover object-top transition-transform duration-300 hover:scale-[1.01]"
            loading="lazy"
          />
        </button>
      )}
      <CardContent className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-serif text-lg text-matilde-red sm:text-xl">{item.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-matilde-brown">
              {item.description}
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-serif text-xl text-matilde-red sm:text-2xl">
            {formatPriceShort(item.price)}
          </span>
          <QuantityControl quantity={quantity} onAdd={onAdd} onRemove={onRemove} />
        </div>
      </CardContent>
    </Card>
  )
}

interface QuantityControlProps {
  quantity: number
  onAdd: () => void
  onRemove: () => void
  small?: boolean
}

function QuantityControl({ quantity, onAdd, onRemove, small }: QuantityControlProps) {
  const buttonSize = small ? 'w-7 h-7' : 'h-8 w-8 sm:h-9 sm:w-9'
  const iconSize = small ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'

  if (quantity === 0) {
    return (
      <Button
        onClick={onAdd}
        size="sm"
        className={`${buttonSize} p-0 rounded-full bg-matilde-red hover:bg-matilde-red-dark text-white`}
      >
        <Plus className={iconSize} />
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={onRemove}
        size="sm"
        variant="outline"
        className={`${buttonSize} p-0 rounded-full border-matilde-red text-matilde-red hover:bg-matilde-red hover:text-white`}
      >
        <Minus className={iconSize} />
      </Button>
      <span className={`${small ? 'w-5 text-sm' : 'w-6'} text-center font-bold text-matilde-brown`}>
        {quantity}
      </span>
      <Button
        onClick={onAdd}
        size="sm"
        className={`${buttonSize} p-0 rounded-full bg-matilde-red hover:bg-matilde-red-dark text-white`}
      >
        <Plus className={iconSize} />
      </Button>
    </div>
  )
}
