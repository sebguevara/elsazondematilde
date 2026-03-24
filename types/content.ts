// Tipos para el contenido del sitio - El Sazón de Matilde's

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  featured: boolean
  available: boolean
}

export interface MenuCategory {
  id: string
  name: string
  order: number
}

export interface GalleryImage {
  id: string
  url: string
  alt: string
  order: number
  /**
   * How the media should be fit in its tile.
   * - cover: fills the tile, may crop.
   * - contain: shows full image, may letterbox.
   */
  fit?: 'cover' | 'contain'
  width?: number
  height?: number
}

export interface BusinessHours {
  day: string
  open: string
  close: string
  enabled: boolean
}

export interface PaymentMethod {
  id: string
  name: string
  details?: string // Ej: número de Nequi
  enabled: boolean
}

export interface HeroContent {
  title: string
  subtitle: string
  ctaText: string
  badge?: string
  backgroundImage?: string
}

export interface ContactInfo {
  whatsappNumber: string
  whatsappMessage: string
  phone?: string
  address?: string
  nequiNumber?: string
}

export interface FooterContent {
  text: string
  copyright: string
  instagram?: string
}

export interface BrandInfo {
  name: string
  tagline: string
  logo: string
  logoAlt: string
}

export interface SiteContent {
  brand: BrandInfo
  hero: HeroContent
  contact: ContactInfo
  categories: MenuCategory[]
  menu: MenuItem[]
  gallery: GalleryImage[]
  hours: BusinessHours[]
  paymentMethods: PaymentMethod[]
  footer: FooterContent
}

// Tipo para items del carrito
export interface CartItem {
  menuItem: MenuItem
  quantity: number
  size?: 'small' | 'large' // Para bebidas
}
