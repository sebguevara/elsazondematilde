'use client'

import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import type { ContactInfo } from '@/types/content'
import { SectionWave } from '@/components/landing/section-wave'
import { landingButtonClass } from '@/components/landing/landing-button'

interface WhatsAppCTAProps {
  contact: ContactInfo
}

export function WhatsAppCTA({ contact }: WhatsAppCTAProps) {
  const whatsappUrl = buildWhatsAppUrl(contact.whatsappNumber, contact.whatsappMessage)

  return (
    <section className="relative overflow-hidden bg-matilde-cream pt-12 pb-20 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="bg-matilde-red rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-white/5" />
          <div className="absolute bottom-4 right-4 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/4 w-12 h-12 rounded-full bg-white/5" />

          <div className="relative z-10">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
              ¿Listo para probar el sazón de la abuela?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
              Haz tu pedido ahora y disfruta de nuestras deliciosas empanadas caseras
            </p>
            <Button
              asChild
              size="lg"
              className={`${landingButtonClass} bg-white px-6 text-matilde-red shadow-lg hover:scale-105 hover:bg-matilde-cream hover:shadow-xl`}
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                Pedí por WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Wave transition into the red footer */}
      <SectionWave position="bottom" colorClassName="text-matilde-red" />
    </section>
  )
}
