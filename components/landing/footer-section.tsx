import Image from 'next/image'
import Link from 'next/link'
import { Instagram, MapPin, Phone } from 'lucide-react'
import type { BrandInfo, ContactInfo, FooterContent } from '@/types/content'
import { InstallFooterCTA } from './install-footer-cta'

interface FooterSectionProps {
  brand: BrandInfo
  contact: ContactInfo
  footer: FooterContent
}

export function FooterSection({ brand, contact, footer }: FooterSectionProps) {
  return (
    <footer id="contacto" className="bg-matilde-red py-10 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/20 shadow-lg">
            <Image
              src={brand.logoAlt || '/images/logo_blanco.png'}
              alt={brand.name}
              fill
              className="object-contain p-2"
            />
          </div>

          <h3 className="mb-2 font-serif text-2xl">{brand.name}</h3>
          <p className="mb-6 max-w-sm text-white/80">{footer.text}</p>

          <div className="mb-6 flex flex-wrap justify-center gap-6">
            {contact.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-matilde-yellow" />
                <span>{contact.phone}</span>
              </div>
            )}
            {contact.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-matilde-yellow" />
                <span>{contact.address}</span>
              </div>
            )}
            {footer.instagram && (
              <a
                href={footer.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-white transition hover:text-matilde-yellow"
              >
                <Instagram className="h-4 w-4 text-matilde-yellow" />
                <span>@elsazondematilde</span>
              </a>
            )}
          </div>

          <InstallFooterCTA />

          <div className="mb-4 h-0.5 w-24 bg-matilde-yellow/30" />
          <p className="text-sm text-white/60">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
