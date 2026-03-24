'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { CartItem, MenuItem } from '@/types/content'

interface CartContextType {
  items: CartItem[]
  addItem: (item: MenuItem, size?: 'small' | 'large') => void
  removeItem: (itemId: string, size?: 'small' | 'large') => void
  updateQuantity: (itemId: string, quantity: number, size?: 'small' | 'large') => void
  clearCart: () => void
  getItemQuantity: (itemId: string, size?: 'small' | 'large') => number
  totalItems: number
  /**
   * Monotonic token that bumps when an item is added to the cart.
   * Use it to trigger UI feedback (shake/buzz) without coupling to buttons.
   */
  cartPulse: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartPulse, setCartPulse] = useState(0)

  const getCartKey = (itemId: string, size?: 'small' | 'large') => {
    return size ? `${itemId}-${size}` : itemId
  }

  const addItem = useCallback((menuItem: MenuItem, size?: 'small' | 'large') => {
    setCartPulse((p) => p + 1)
    setItems((prev) => {
      const key = getCartKey(menuItem.id, size)
      const existing = prev.find(
        (item) => getCartKey(item.menuItem.id, item.size) === key
      )
      
      if (existing) {
        return prev.map((item) =>
          getCartKey(item.menuItem.id, item.size) === key
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      return [...prev, { menuItem, quantity: 1, size }]
    })
  }, [])

  const removeItem = useCallback((itemId: string, size?: 'small' | 'large') => {
    setItems((prev) => {
      const key = getCartKey(itemId, size)
      return prev.filter(
        (item) => getCartKey(item.menuItem.id, item.size) !== key
      )
    })
  }, [])

  const updateQuantity = useCallback(
    (itemId: string, quantity: number, size?: 'small' | 'large') => {
      if (quantity <= 0) {
        removeItem(itemId, size)
        return
      }

      setItems((prev) => {
        const key = getCartKey(itemId, size)
        return prev.map((item) =>
          getCartKey(item.menuItem.id, item.size) === key
            ? { ...item, quantity }
            : item
        )
      })
    },
    [removeItem]
  )

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const getItemQuantity = useCallback(
    (itemId: string, size?: 'small' | 'large') => {
      const key = getCartKey(itemId, size)
      const item = items.find(
        (item) => getCartKey(item.menuItem.id, item.size) === key
      )
      return item?.quantity || 0
    },
    [items]
  )

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemQuantity,
        totalItems,
        cartPulse,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
