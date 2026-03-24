'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface GalleryMediaProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  imageClassName?: string
  priority?: boolean
  unoptimized?: boolean
}

const INLINE_IMAGE_RE = /\.(gif|svg)(\?|#|$)/i

export function GalleryMedia({
  src,
  alt,
  width,
  height,
  className,
  imageClassName,
  priority,
  unoptimized,
}: GalleryMediaProps) {
  const ratio = width && height ? `${width} / ${height}` : '1 / 1'
  const shouldUseNativeImage = INLINE_IMAGE_RE.test(src)

  return (
    <div
      className={cn('relative w-full overflow-hidden bg-matilde-cream', className)}
      style={{ aspectRatio: ratio }}
    >
      {shouldUseNativeImage ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={cn('h-full w-full object-contain', imageClassName)}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          unoptimized={unoptimized}
          className={cn('h-full w-full object-cover', imageClassName)}
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
        />
      )}
    </div>
  )
}
