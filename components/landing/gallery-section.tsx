'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState, type TouchEvent } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { GalleryImage } from '@/types/content'

interface GallerySectionProps {
  images: GalleryImage[]
}

export function GallerySection({ images }: GallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const sortedImages = useMemo(() => [...images].sort((a, b) => a.order - b.order), [images])
  const touchStartRef = useRef<{ x: number; y: number; t: number } | null>(null)

  if (images.length === 0) return null

  const openLightbox = (index: number) => setSelectedIndex(index)
  const closeLightbox = () => setSelectedIndex(null)

  const isSvgUrl = (url: string) => /\.svg(\?|#|$)/i.test(url)

  const getAspectRatio = (img: GalleryImage) => {
    if (img.width && img.height && img.width > 0 && img.height > 0) return `${img.width} / ${img.height}`
    // Safe fallback when dimensions aren't provided yet.
    return '1 / 1'
  }

  const goToPrevious = () => {
    const len = sortedImages.length
    setSelectedIndex((idx) => {
      if (idx === null) return null
      return idx === 0 ? len - 1 : idx - 1
    })
  }

  const goToNext = () => {
    const len = sortedImages.length
    setSelectedIndex((idx) => {
      if (idx === null) return null
      return idx === len - 1 ? 0 : idx + 1
    })
  }

  useEffect(() => {
    if (selectedIndex === null) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, sortedImages.length])

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0]
    touchStartRef.current = { x: t.clientX, y: t.clientY, t: Date.now() }
  }

  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current
    if (!start) return
    touchStartRef.current = null

    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    const dt = Date.now() - start.t

    // Horizontal swipe: avoid hijacking vertical scroll and taps.
    if (dt > 650) return
    if (Math.abs(dx) < 40) return
    if (Math.abs(dx) < Math.abs(dy) * 1.2) return

    if (dx > 0) goToPrevious()
    else goToNext()
  }

  const selected = selectedIndex !== null ? sortedImages[selectedIndex] : null

  return (
    <section id="galeria" className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-3xl md:text-4xl text-matilde-red text-center mb-8">
          Galería
        </h2>

        {/* Masonry Gallery (mobile-first) */}
        <div className="columns-2 md:columns-3 lg:columns-4 [column-gap:0.75rem] md:[column-gap:1rem]">
          {sortedImages.map((image, index) => {
            const fit = image.fit ?? 'cover'
            const aspectRatio = getAspectRatio(image)

            return (
              <button
                key={image.id}
                onClick={() => openLightbox(index)}
                className="group relative mb-3 md:mb-4 w-full break-inside-avoid rounded-2xl overflow-hidden bg-matilde-cream shadow-sm ring-1 ring-matilde-yellow-light/70 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matilde-red/50"
                style={{ aspectRatio }}
                aria-label={`Abrir imagen: ${image.alt}`}
              >
                <div className={fit === 'contain' ? 'absolute inset-0 bg-white' : 'absolute inset-0'} />

                {isSvgUrl(image.url) ? (
                  // next/image may reject SVG depending on config; keep this resilient.
                  <img
                    src={image.url}
                    alt={image.alt}
                    className={[
                      'absolute inset-0 h-full w-full',
                      fit === 'contain' ? 'object-contain p-3' : 'object-cover',
                      'transition-transform duration-300 group-hover:scale-[1.04]',
                    ].join(' ')}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className={[
                      fit === 'contain' ? 'object-contain p-3' : 'object-cover',
                      'transition-transform duration-300 group-hover:scale-[1.04]',
                    ].join(' ')}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                )}

                <div className="absolute inset-0 bg-matilde-red/0 group-hover:bg-matilde-red/10 transition-colors" />
              </button>
            )
          })}
        </div>

        {/* Lightbox */}
        {selected && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Galería"
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-3 md:left-4 text-white hover:bg-white/20 z-10"
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>

            <div
              className="relative w-full h-full max-w-5xl max-h-[78vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {isSvgUrl(selected.url) ? (
                <img
                  src={selected.url}
                  alt={selected.alt}
                  className="absolute inset-0 h-full w-full object-contain"
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <Image
                  src={selected.url}
                  alt={selected.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              )}

              <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-3 py-2">
                <div className="rounded-full bg-black/35 text-white text-xs px-3 py-1">
                  {(selectedIndex ?? 0) + 1} / {sortedImages.length}
                </div>
                <div className="hidden sm:block max-w-[60%] truncate rounded-full bg-black/35 text-white text-xs px-3 py-1">
                  {selected.alt}
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 md:right-4 text-white hover:bg-white/20 z-10"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>

            {/* Thumbnails strip */}
            <div
              className="absolute bottom-3 left-0 right-0 flex justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-2 overflow-x-auto px-4 pb-1 max-w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {sortedImages.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedIndex(index)}
                    className={[
                      'relative w-12 h-12 shrink-0 rounded-xl overflow-hidden ring-2 transition',
                      index === selectedIndex ? 'ring-white' : 'ring-white/20 hover:ring-white/50',
                    ].join(' ')}
                    aria-label={`Ver imagen ${index + 1}`}
                  >
                    {isSvgUrl(img.url) ? (
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="48px" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

