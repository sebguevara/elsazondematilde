'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import type { BrandInfo } from '@/types/content'

const sectionLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#menu', label: 'Menu' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#horario', label: 'Horarios' },
  { href: '#contacto', label: 'Contacto' },
]

interface SiteShellHeaderProps {
  brand: BrandInfo
}

export function SiteShellHeader({ brand }: SiteShellHeaderProps) {
  const pathname = usePathname()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/sign-in')
  ) {
    return null
  }

  const isHome = pathname === '/'

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-matilde-yellow/50 bg-matilde-cream/95 backdrop-blur">
      <div className="container mx-auto flex min-h-18 items-center gap-3 px-4 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-3 font-serif text-lg leading-none text-matilde-red transition-colors hover:text-matilde-red-dark lg:justify-self-start"
        >
          <span className="relative h-10 w-10 shrink-0 overflow-hidden sm:h-11 sm:w-11">
            <Image
              src="/images/logo_rojo.png"
              alt={brand.name}
              fill
              className="object-contain"
              priority
            />
          </span>
          <span className="truncate text-xl sm:text-2xl">{brand.name}</span>
        </Link>

        <nav className="hidden items-center justify-center gap-1 lg:flex lg:justify-self-center">
          {isHome ? (
            sectionLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm font-semibold text-matilde-brown transition-colors hover:bg-matilde-yellow-light hover:text-matilde-red"
              >
                {item.label}
              </Link>
            ))
          ) : (
            <Link
              href="/"
              className="rounded-full px-3 py-2 text-sm font-semibold text-matilde-brown transition-colors hover:bg-matilde-yellow-light hover:text-matilde-red"
            >
              Volver al inicio
            </Link>
          )}
        </nav>

        <div className="ml-auto sm:hidden">
          <button
            type="button"
            aria-label={isMobileNavOpen ? 'Cerrar menu' : 'Abrir menu'}
            aria-expanded={isMobileNavOpen}
            onClick={() => setIsMobileNavOpen((current) => !current)}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-matilde-yellow bg-white/80 text-matilde-red transition-colors hover:bg-matilde-yellow-light"
          >
            <span
              className={`absolute h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
                isMobileNavOpen ? 'translate-y-0 rotate-45' : '-translate-y-1.5'
              }`}
            />
            <span
              className={`absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                isMobileNavOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
                isMobileNavOpen ? 'translate-y-0 -rotate-45' : 'translate-y-1.5'
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-matilde-yellow/50 bg-matilde-cream transition-[max-height,opacity] duration-300 sm:hidden ${
          isMobileNavOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="w-screen px-4 pb-4 pt-3">
          <div className="flex flex-col gap-2">
            {isHome ? (
              sectionLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className="rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-matilde-brown shadow-sm transition-colors hover:bg-matilde-yellow-light hover:text-matilde-red"
                >
                  {item.label}
                </Link>
              ))
            ) : (
              <Link
                href="/"
                onClick={() => setIsMobileNavOpen(false)}
                className="rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-matilde-brown shadow-sm transition-colors hover:bg-matilde-yellow-light hover:text-matilde-red"
              >
                Volver al inicio
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
