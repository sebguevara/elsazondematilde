'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Clock, Download, GalleryVertical, Home, MapPin, Menu, PhoneCall } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BrandInfo } from '@/types/content'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const sectionLinks = [
  { href: '#inicio', label: 'Inicio', Icon: Home },
  { href: '#menu', label: 'Menu', Icon: Menu },
  { href: '#galeria', label: 'Galeria', Icon: GalleryVertical },
  { href: '#horario', label: 'Horarios', Icon: Clock },
  { href: '#contacto', label: 'Contacto', Icon: MapPin },
]

interface SiteShellHeaderProps {
  brand: BrandInfo
}

export function SiteShellHeader({ brand }: SiteShellHeaderProps) {
  const pathname = usePathname()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/sign-in')
  ) {
    return null
  }

  const isHome = pathname === '/'

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const detect = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true
      setIsStandalone(standalone)
    }

    const handleAppInstalled = () => setIsStandalone(true)
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
    }

    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    detect()

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return
    }

    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

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
                <span className="inline-flex items-center gap-2">
                  <item.Icon className="h-3.5 w-3.5 text-matilde-red" />
                  {item.label}
                </span>
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

        {!isStandalone && deferredPrompt && (
          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <Button
              type="button"
              onClick={handleInstall}
              className="inline-flex items-center gap-2 rounded-full border border-matilde-red/80 bg-matilde-red px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-matilde-red-dark"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Descargar app</span>
            </Button>
          </div>
        )}
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
                  <span className="inline-flex items-center gap-2">
                    <item.Icon className="h-4 w-4 text-matilde-red" />
                    {item.label}
                  </span>
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
            {!isStandalone && deferredPrompt && (
              <button
                type="button"
                onClick={() => {
                  handleInstall()
                  setIsMobileNavOpen(false)
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-matilde-yellow bg-white px-3 py-2.5 text-sm font-semibold text-matilde-red shadow-sm transition-colors hover:bg-matilde-yellow-light"
              >
                <Download className="h-4 w-4" />
                Descargar app
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
