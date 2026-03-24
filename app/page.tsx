import { getSiteContent } from '@/lib/content-manager'
import { CartProvider } from '@/contexts/cart-context'
import { HeroSection } from '@/components/landing/hero-section'
import { MenuSection } from '@/components/landing/menu-section'
import { GallerySection } from '@/components/landing/gallery-section'
import { HoursPaymentSection } from '@/components/landing/hours-payment-section'
import { WhatsAppCTA } from '@/components/landing/whatsapp-cta'
import { FooterSection } from '@/components/landing/footer-section'
import { FloatingCart } from '@/components/landing/floating-cart'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const content = await getSiteContent()

  return (
    <CartProvider>
      <main className="min-h-screen pt-18">
        <HeroSection 
          brand={content.brand} 
          hero={content.hero} 
          contact={content.contact} 
        />
        
        <MenuSection 
          categories={content.categories} 
          menu={content.menu} 
        />
        
        <GallerySection images={content.gallery} />
        
        <HoursPaymentSection 
          hours={content.hours} 
          paymentMethods={content.paymentMethods} 
        />
        
        <WhatsAppCTA contact={content.contact} />
        
        <FooterSection 
          brand={content.brand}
          contact={content.contact}
          footer={content.footer}
        />

        <FloatingCart contact={content.contact} />
      </main>
    </CartProvider>
  )
}
