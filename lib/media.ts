'use client'

export interface PreparedImage {
  file: File
  width: number
  height: number
}

export async function prepareImageForUpload(file: File): Promise<PreparedImage> {
  const quality = Number(process.env.NEXT_PUBLIC_MEDIA_IMAGE_QUALITY || 0.86)
  const maxWidth = Number(process.env.NEXT_PUBLIC_MEDIA_IMAGE_MAX_WIDTH || 2200)

  try {
    const bitmap = await createImageBitmap(file)
    const originalWidth = bitmap.width
    const originalHeight = bitmap.height
    const scale = originalWidth > maxWidth ? maxWidth / originalWidth : 1
    const width = Math.round(originalWidth * scale)
    const height = Math.round(originalHeight * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')

    if (!ctx) {
      bitmap.close()
      return { file, width: originalWidth, height: originalHeight }
    }

    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/webp', quality)
    })

    if (!blob) {
      return { file, width: originalWidth, height: originalHeight }
    }

    const optimized = new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, {
      type: 'image/webp',
    })

    return { file: optimized, width, height }
  } catch {
    return { file, width: 0, height: 0 }
  }
}
