'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowDown, ArrowUp, ImageIcon, Pencil, Plus, Save, Trash2, XIcon } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { dashboardButtonClass, dashboardIconButtonClass } from '@/components/dashboard/dashboard-button'
import { UploadImageField } from '@/components/dashboard/upload-image-field'
import { cn } from '@/lib/utils'
import type { GalleryImage, SiteContent } from '@/types/content'

interface GalleryEditorProps {
  content: SiteContent
  onSave: (content: SiteContent) => Promise<void>
  isSaving: boolean
}

export function GalleryEditor({ content, onSave, isSaving }: GalleryEditorProps) {
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const sortedImages = [...content.gallery].sort((a, b) => a.order - b.order)

  const handleSaveImage = async (image: GalleryImage) => {
    const updatedGallery = editingImage
      ? content.gallery.map((currentImage) => (currentImage.id === editingImage.id ? image : currentImage))
      : [...content.gallery, image]

    await onSave({ ...content, gallery: updatedGallery })
    setEditingImage(null)
    setIsDialogOpen(false)
  }

  const handleDeleteImage = async (imageId: string) => {
    await onSave({
      ...content,
      gallery: content.gallery.filter((image) => image.id !== imageId),
    })
  }

  const handleReorder = async (imageId: string, direction: 'up' | 'down') => {
    const currentIndex = sortedImages.findIndex((image) => image.id === imageId)

    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sortedImages.length - 1)
    ) {
      return
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const reordered = [...sortedImages]
    const [moved] = reordered.splice(currentIndex, 1)
    reordered.splice(targetIndex, 0, moved)

    await onSave({
      ...content,
      gallery: reordered.map((image, index) => ({ ...image, order: index + 1 })),
    })
  }

  return (
    <Card padded>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="font-serif text-matilde-red">Galería de imágenes</CardTitle>
          <CardDescription>
            Sube tus archivos. La grilla se adapta a las fotos verticales, horizontales y mixtas.
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className={`${dashboardButtonClass} bg-matilde-red text-white hover:bg-matilde-red-dark`}
              onClick={() => setEditingImage(null)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Imagen
            </Button>
          </DialogTrigger>
          <ImageDialog
            image={editingImage}
            existingImages={content.gallery}
            onSave={handleSaveImage}
            isSaving={isSaving}
          />
        </Dialog>
      </CardHeader>
      <CardContent>
        {sortedImages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-matilde-yellow bg-matilde-yellow-light/40 py-12 text-center text-matilde-brown/60">
            <ImageIcon className="mx-auto mb-3 h-12 w-12 opacity-40" />
            <p>No hay imágenes en la galería</p>
            <p className="text-sm">Carga la primera imagen desde el botón superior.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sortedImages.map((image, index) => {
              const isPortrait = (image.height || 0) > (image.width || 0)

              return (
                <article
                  key={image.id}
                  className="overflow-hidden rounded-[1.5rem] border border-matilde-yellow/70 bg-white shadow-sm"
                >
                  <div
                    className={cn(
                      'relative w-full overflow-hidden bg-matilde-cream',
                      isPortrait ? 'aspect-[4/5]' : 'aspect-[16/11]',
                    )}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className={cn(image.fit === 'contain' ? 'object-contain p-4' : 'object-cover')}
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-matilde-red px-2.5 py-1 text-xs font-semibold text-white">
                      {index + 1}
                    </div>
                  </div>

                  <div className="space-y-3 p-4">
                    <p className="line-clamp-2 text-sm text-matilde-brown">{image.alt}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingImage(image)
                          setIsDialogOpen(true)
                        }}
                        className={`${dashboardButtonClass} border-matilde-yellow text-matilde-brown hover:bg-matilde-yellow-light`}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteImage(image.id)}
                        className={`${dashboardButtonClass} border-red-200 text-red-600 hover:bg-red-50`}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </Button>
                      <div className="ml-auto flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleReorder(image.id, 'up')}
                          disabled={index === 0}
                          className={`${dashboardIconButtonClass} border-matilde-yellow text-matilde-brown hover:bg-matilde-yellow-light`}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReorder(image.id, 'down')}
                          disabled={index === sortedImages.length - 1}
                          className={`${dashboardIconButtonClass} border-matilde-yellow text-matilde-brown hover:bg-matilde-yellow-light`}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ImageDialogProps {
  image: GalleryImage | null
  existingImages: GalleryImage[]
  onSave: (image: GalleryImage) => Promise<void>
  isSaving: boolean
}

function ImageDialog({ image, existingImages, onSave, isSaving }: ImageDialogProps) {
  const [url, setUrl] = useState(image?.url || '')
  const [alt, setAlt] = useState(image?.alt || '')
  const [order, setOrder] = useState(image?.order || existingImages.length + 1)
  const [width, setWidth] = useState<number | undefined>(image?.width)
  const [height, setHeight] = useState<number | undefined>(image?.height)

  useEffect(() => {
    setUrl(image?.url || '')
    setAlt(image?.alt || '')
    setOrder(image?.order || existingImages.length + 1)
    setWidth(image?.width)
    setHeight(image?.height)
  }, [image, existingImages.length])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    await onSave({
      id: image?.id || `gal-${Date.now()}`,
      url,
      alt,
      order,
      fit: image?.fit || 'cover',
      width,
      height,
    })
  }

  return (
    <DialogContent
      showCloseButton={false}
      className="max-w-md max-h-[90vh] overflow-y-auto !px-4 sm:!px-6"
      aria-describedby={undefined}
    >
      <div className="sticky top-0 z-10 -mx-4 border-b border-matilde-yellow bg-background/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <DialogHeader className="text-left">
            <DialogTitle className="font-serif text-matilde-red">
              {image ? 'Editar imagen' : 'Nueva imagen'}
            </DialogTitle>
          </DialogHeader>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0 border-matilde-yellow text-matilde-brown hover:bg-matilde-yellow-light"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pb-4 pt-4">
        <UploadImageField
          label="Archivo de imagen"
          value={url}
          folder="gallery"
          onChange={setUrl}
          onUploadComplete={(payload) => {
            setWidth(payload.width)
            setHeight(payload.height)
          }}
          helperText="Acepta JPG, PNG, WebP, AVIF y también HEIC/HEIF cuando el navegador lo permita."
          previewClassName="aspect-[16/11]"
        />

        <Field>
          <FieldLabel>Texto alternativo</FieldLabel>
          <Input
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            placeholder="Describe la imagen para la galería"
            required
          />
        </Field>

        <Field>
          <FieldLabel>Orden</FieldLabel>
          <Input
            type="number"
            value={order}
            min={1}
            onChange={(event) => setOrder(parseInt(event.target.value, 10) || 1)}
          />
        </Field>

        <DialogFooter className="flex flex-wrap justify-end gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className={`${dashboardButtonClass} w-auto min-w-[8rem] border-matilde-yellow text-matilde-brown hover:bg-matilde-yellow-light`}
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isSaving || !alt.trim() || !url}
            className={`${dashboardButtonClass} w-auto min-w-[8rem] bg-matilde-red text-white hover:bg-matilde-red-dark`}
          >
            {isSaving ? <Spinner className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
