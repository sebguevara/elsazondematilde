'use client'

import type { ChangeEvent } from 'react'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { ImageIcon, Loader2, UploadCloud } from 'lucide-react'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { prepareImageForUpload } from '@/lib/media'
import { dashboardButtonClass } from '@/components/dashboard/dashboard-button'

interface UploadImageFieldProps {
  label: string
  value?: string
  folder: string
  onChange: (value: string) => void
  onUploadComplete?: (payload: { url: string; width?: number; height?: number }) => void
  error?: string
  previewClassName?: string
  helperText?: string
}

export function UploadImageField({
  label,
  value,
  folder,
  onChange,
  onUploadComplete,
  error,
  previewClassName,
  helperText,
}: UploadImageFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      setIsUploading(true)

      const prepared = await prepareImageForUpload(file)
      const formData = new FormData()
      formData.append('file', prepared.file)
      formData.append('folder', folder)
      formData.append('width', String(prepared.width))
      formData.append('height', String(prepared.height))

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('No se pudo subir la imagen')
      }

      const uploaded = await response.json()
      onChange(uploaded.url)
      onUploadComplete?.({
        url: uploaded.url,
        width: uploaded.width,
        height: uploaded.height,
      })
    } catch (uploadError) {
      console.error('Upload error:', uploadError)
    } finally {
      setIsUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <div className="space-y-3">
        <div
          className={cn(
            'relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-matilde-yellow bg-matilde-cream/70',
            previewClassName,
          )}
        >
          {value ? (
            <Image src={value} alt={label} fill className="object-contain p-4" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-matilde-brown/55">
              <ImageIcon className="h-8 w-8" />
              <p className="text-sm">Todavia no cargaste una imagen</p>
            </div>
          )}
        </div>

        <Input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif,image/heic,image/heif"
          className="hidden"
          onChange={handleFileChange}
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className={cn(
            dashboardButtonClass,
            'w-full border-matilde-yellow bg-white text-matilde-brown hover:bg-matilde-yellow-light',
          )}
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="mr-2 h-4 w-4" />
          )}
          {isUploading ? 'Subiendo imagen...' : 'Cargar imagen'}
        </Button>

        {helperText ? <p className="text-xs text-matilde-brown/70">{helperText}</p> : null}
        {error ? <FieldError>{error}</FieldError> : null}
      </div>
    </Field>
  )
}
