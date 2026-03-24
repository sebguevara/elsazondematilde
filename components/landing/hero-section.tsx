'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BrandInfo, HeroContent, ContactInfo } from '@/types/content'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { landingButtonClass } from '@/components/landing/landing-button'

interface HeroSectionProps {
  brand: BrandInfo
  hero: HeroContent
  contact: ContactInfo
}

export function HeroSection({ brand, hero, contact }: HeroSectionProps) {
  const whatsappUrl = buildWhatsAppUrl(contact.whatsappNumber, contact.whatsappMessage)

  return (
    <section
      id="inicio"
      className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden bg-matilde-yellow"
    >
      {/* Decorative circles pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-20 left-4 w-8 h-8 rounded-full bg-matilde-red-dark matilde-float-y"
          style={
            {
              ['--matilde-float-amp' as any]: '-10px',
              ['--matilde-float-dur' as any]: '6.5s',
              ['--matilde-float-delay' as any]: '-1.2s',
            } as CSSProperties
          }
        />
        <div
          className="absolute top-32 right-8 w-6 h-6 rounded-full bg-matilde-red-dark matilde-float-y"
          style={
            {
              ['--matilde-float-amp' as any]: '12px',
              ['--matilde-float-dur' as any]: '7.2s',
              ['--matilde-float-delay' as any]: '-2.6s',
            } as CSSProperties
          }
        />
        <div
          className="absolute bottom-40 left-10 w-10 h-10 rounded-full bg-matilde-red-dark matilde-float-y"
          style={
            {
              ['--matilde-float-amp' as any]: '-14px',
              ['--matilde-float-dur' as any]: '8.2s',
              ['--matilde-float-delay' as any]: '-3.1s',
            } as CSSProperties
          }
        />
        <div
          className="absolute bottom-20 right-16 w-5 h-5 rounded-full bg-matilde-red-dark matilde-float-y"
          style={
            {
              ['--matilde-float-amp' as any]: '10px',
              ['--matilde-float-dur' as any]: '6.8s',
              ['--matilde-float-delay' as any]: '-0.7s',
            } as CSSProperties
          }
        />
        <div
          className="absolute top-1/2 left-1/4 w-4 h-4 rounded-full bg-matilde-red-dark matilde-float-y"
          style={
            {
              ['--matilde-float-amp' as any]: '-9px',
              ['--matilde-float-dur' as any]: '9.2s',
              ['--matilde-float-delay' as any]: '-4.4s',
            } as CSSProperties
          }
        />
        <div
          className="absolute top-1/3 right-1/4 w-7 h-7 rounded-full bg-matilde-red-dark matilde-float-y"
          style={
            {
              ['--matilde-float-amp' as any]: '13px',
              ['--matilde-float-dur' as any]: '7.8s',
              ['--matilde-float-delay' as any]: '-1.9s',
            } as CSSProperties
          }
        />
      </div>

      <div className="relative z-10 container mx-auto flex flex-col items-center px-4 py-16 text-center md:py-20">
        {/* Logo */}
        <div
          className="relative mb-6 h-32 w-32 overflow-hidden matilde-float-y md:h-40 md:w-40"
          style={
            {
              ['--matilde-float-amp' as any]: '-8px',
              ['--matilde-float-dur' as any]: '7.5s',
              ['--matilde-float-delay' as any]: '-1.4s',
            } as CSSProperties
          }
        >
            <Image
              src="/images/logo_rojo.png"
              alt={brand.name}
              fill
              className="object-contain scale-[1.02]"
              priority
            />
          </div>

        {/* Badge */}
        {hero.badge && (
          <span className="inline-block bg-matilde-cream text-matilde-red font-semibold px-4 py-1.5 rounded-full text-sm mb-4 shadow-sm">
            {hero.badge}
          </span>
        )}

        {/* Title */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-matilde-red leading-tight mb-4 text-balance">
          {hero.title}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-matilde-brown text-pretty md:text-xl">
          {hero.subtitle}
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className={`${landingButtonClass} bg-matilde-red px-6 text-white shadow-lg hover:scale-105 hover:bg-matilde-red-dark hover:shadow-xl`}
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              {hero.ctaText}
            </a>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className={`${landingButtonClass} border-matilde-red bg-white/85 px-6 text-matilde-red hover:bg-matilde-cream`}
          >
            <a href="#menu">Explorar menu</a>
          </Button>
        </div>

        {/* Tagline */}
        <p className="mt-6 text-matilde-red-dark font-serif text-xl">
          {brand.tagline}
        </p>
      </div>

      {/* Decorative wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto fill-matilde-cream">
          <path d="M0,64L60,58.7C120,53,240,43,360,48C480,53,600,75,720,80C840,85,960,75,1080,64C1200,53,1320,43,1380,37.3L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" />
        </svg>
      </div>
    </section>
  )
}
