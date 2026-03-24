'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus, Save, Trash2, ImageIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { dashboardButtonClass } from '@/components/dashboard/dashboard-button'
import { UploadImageField } from '@/components/dashboard/upload-image-field'
import { menuItemSchema, type MenuItemFormData } from '@/lib/validations'
import { cn } from '@/lib/utils'
import { formatPriceShort } from '@/lib/whatsapp'
import type { MenuCategory, MenuItem, SiteContent } from '@/types/content'

interface MenuEditorProps {
  content: SiteContent
  onSave: (content: SiteContent) => Promise<void>
  isSaving: boolean
}

export function MenuEditor({ content, onSave, isSaving }: MenuEditorProps) {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)

  const sortedCategories = [...content.categories].sort((a, b) => a.order - b.order)

  const handleDeleteItem = async (itemId: string) => {
    await onSave({
      ...content,
      menu: content.menu.filter((item) => item.id !== itemId),
    })
  }

  const handleSaveItem = async (data: MenuItemFormData) => {
    const normalizedItem: MenuItem = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      image: data.image,
      featured: false,
      available: data.available,
    }

    const updatedMenu = editingItem
      ? content.menu.map((item) => (item.id === editingItem.id ? normalizedItem : item))
      : [...content.menu, normalizedItem]

    await onSave({ ...content, menu: updatedMenu })
    setEditingItem(null)
    setIsDialogOpen(false)
  }

  const handleSaveCategory = async (category: MenuCategory) => {
    const updatedCategories = editingCategory
      ? content.categories.map((current) => (current.id === editingCategory.id ? category : current))
      : [...content.categories, category]

    await onSave({ ...content, categories: updatedCategories })
    setEditingCategory(null)
    setIsCategoryDialogOpen(false)
  }

  const handleDeleteCategory = async (categoryId: string) => {
    await onSave({
      ...content,
      categories: content.categories.filter((category) => category.id !== categoryId),
      menu: content.menu.filter((item) => item.category !== categoryId),
    })
  }

  return (
    <div className="space-y-6">
      <Card padded>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="font-serif text-matilde-red">Categorías</CardTitle>
            <CardDescription>Organiza el menú antes de cargar productos.</CardDescription>
          </div>
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className={`${dashboardButtonClass} bg-matilde-red text-white hover:bg-matilde-red-dark`}
                onClick={() => setEditingCategory(null)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Categoría
              </Button>
            </DialogTrigger>
            <CategoryDialog
              category={editingCategory}
              existingCategories={content.categories}
              onSave={handleSaveCategory}
              isSaving={isSaving}
            />
          </Dialog>
        </CardHeader>
        <CardContent>
          {sortedCategories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-matilde-yellow bg-matilde-yellow-light/40 px-4 py-6 text-sm text-matilde-brown/70">
              Crea al menos una categoría para empezar a cargar productos.
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {sortedCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-2 rounded-full bg-matilde-yellow-light px-4 py-2 text-sm text-matilde-brown"
                >
                  <span className="font-semibold">{category.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(category)
                      setIsCategoryDialogOpen(true)
                    }}
                    className="rounded-full p-1 text-matilde-brown/70 transition-colors hover:bg-white hover:text-matilde-red"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="rounded-full p-1 text-matilde-brown/70 transition-colors hover:bg-white hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card padded>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="font-serif text-matilde-red">Productos del menú</CardTitle>
            <CardDescription>Todo con precio único e imagen subida a Cloudflare.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className={`${dashboardButtonClass} bg-matilde-red text-white hover:bg-matilde-red-dark`}
                onClick={() => setEditingItem(null)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Producto
              </Button>
            </DialogTrigger>
            <MenuItemDialog
              item={editingItem}
              categories={content.categories}
              onSave={handleSaveItem}
              isSaving={isSaving}
            />
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-5">
          {sortedCategories.map((category) => {
            const categoryItems = content.menu.filter((item) => item.category === category.id)

            if (categoryItems.length === 0) {
              return null
            }

            return (
              <section key={category.id} className="space-y-3">
                <h3 className="font-serif text-xl text-matilde-red">{category.name}</h3>
                <div className="grid gap-3">
                  {categoryItems.map((item) => (
                    <article
                      key={item.id}
                      className={cn(
                        'rounded-2xl border border-matilde-yellow/70 bg-white p-4 shadow-sm',
                        !item.available && 'opacity-60',
                      )}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <div className="relative h-24 w-full overflow-hidden rounded-2xl bg-matilde-cream sm:h-20 sm:w-20 sm:flex-none">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-matilde-brown/35">
                              <ImageIcon className="h-7 w-7" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                            <div className="min-w-0">
                              <p className="truncate text-base font-semibold text-matilde-brown">{item.name}</p>
                              <p className="text-sm leading-relaxed text-matilde-brown/70">{item.description}</p>
                            </div>
                            <div className="text-left md:text-right">
                              <p className="font-serif text-xl text-matilde-red">{formatPriceShort(item.price)}</p>
                              <p className="text-xs uppercase tracking-[0.18em] text-matilde-brown/50">
                                {item.available ? 'Disponible' : 'Oculto'}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditingItem(item)
                                setIsDialogOpen(true)
                              }}
                              className={`${dashboardButtonClass} border-matilde-yellow text-matilde-brown hover:bg-matilde-yellow-light`}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleDeleteItem(item.id)}
                              className={`${dashboardButtonClass} border-red-200 text-red-600 hover:bg-red-50`}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

interface MenuItemDialogProps {
  item: MenuItem | null
  categories: MenuCategory[]
  onSave: (data: MenuItemFormData) => Promise<void>
  isSaving: boolean
}

function MenuItemDialog({ item, categories, onSave, isSaving }: MenuItemDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      id: item?.id || `item-${Date.now()}`,
      name: item?.name || '',
      description: item?.description || '',
      price: item?.price || 0,
      category: item?.category || categories[0]?.id || '',
      image: item?.image || '',
      featured: false,
      available: item?.available ?? true,
    },
  })

  useEffect(() => {
    reset({
      id: item?.id || `item-${Date.now()}`,
      name: item?.name || '',
      description: item?.description || '',
      price: item?.price || 0,
      category: item?.category || categories[0]?.id || '',
      image: item?.image || '',
      featured: false,
      available: item?.available ?? true,
    })
  }, [item, categories, reset])

  const category = watch('category')
  const imageUrl = watch('image')
  const available = watch('available')

  return (
    <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto !px-4 sm:!px-6" aria-describedby={undefined}>
      <DialogHeader>
        <DialogTitle className="font-serif text-matilde-red">
          {item ? 'Editar producto' : 'Nuevo producto'}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSave)} className="space-y-4">
        <FieldGroup className="grid-cols-1 md:grid-cols-2">
          <Field>
            <FieldLabel>Nombre</FieldLabel>
            <Input {...register('name')} placeholder="Empanada tradicional" />
            {errors.name ? <FieldError>{errors.name.message}</FieldError> : null}
          </Field>

          <Field>
            <FieldLabel>Categoría</FieldLabel>
            <Select value={category} onValueChange={(value) => setValue('category', value, { shouldDirty: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((categoryOption) => (
                  <SelectItem key={categoryOption.id} value={categoryOption.id}>
                    {categoryOption.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category ? <FieldError>{errors.category.message}</FieldError> : null}
          </Field>
        </FieldGroup>

        <Field>
          <FieldLabel>Descripción</FieldLabel>
          <Textarea {...register('description')} rows={3} placeholder="Ingredientes o una descripción corta..." />
        </Field>

        <Field>
          <FieldLabel>Precio</FieldLabel>
          <Input type="number" {...register('price', { valueAsNumber: true })} placeholder="2000" />
          {errors.price ? <FieldError>{errors.price.message}</FieldError> : null}
        </Field>

        <UploadImageField
          label="Imagen del producto"
          value={imageUrl}
          folder="menu"
          onChange={(value) => setValue('image', value, { shouldDirty: true, shouldValidate: true })}
          error={errors.image?.message}
          helperText="Sube la foto del producto y queda guardada en Cloudflare."
          previewClassName="aspect-[5/4]"
        />

        <label className="flex items-center gap-3 rounded-2xl border border-matilde-yellow/70 bg-matilde-yellow-light/30 px-4 py-3 text-sm text-matilde-brown">
          <Switch checked={available} onCheckedChange={(value) => setValue('available', value, { shouldDirty: true })} />
          Mostrar este producto en la landing
        </label>

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
            disabled={isSaving}
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

interface CategoryDialogProps {
  category: MenuCategory | null
  existingCategories: MenuCategory[]
  onSave: (category: MenuCategory) => Promise<void>
  isSaving: boolean
}

function CategoryDialog({ category, existingCategories, onSave, isSaving }: CategoryDialogProps) {
  const [name, setName] = useState(category?.name || '')
  const [order, setOrder] = useState(category?.order || existingCategories.length + 1)

  useEffect(() => {
    setName(category?.name || '')
    setOrder(category?.order || existingCategories.length + 1)
  }, [category, existingCategories.length])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const id = category?.id || name.toLowerCase().replace(/\s+/g, '-')
    onSave({ id, name, order })
  }

  return (
    <DialogContent className="max-w-sm !px-4 sm:!px-6" aria-describedby={undefined}>
      <DialogHeader>
        <DialogTitle className="font-serif text-matilde-red">
          {category ? 'Editar categoría' : 'Nueva categoría'}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field>
          <FieldLabel>Nombre</FieldLabel>
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Empanadas" required />
        </Field>
        <Field>
          <FieldLabel>Orden</FieldLabel>
          <Input
            type="number"
            value={order}
            onChange={(event) => setOrder(parseInt(event.target.value, 10) || 1)}
            min={1}
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
            disabled={isSaving || !name.trim()}
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
