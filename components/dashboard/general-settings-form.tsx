'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldGroup, FieldError } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Save } from 'lucide-react'
import { dashboardButtonClass } from '@/components/dashboard/dashboard-button'
import { UploadImageField } from '@/components/dashboard/upload-image-field'
import type { SiteContent } from '@/types/content'

const generalSchema = z.object({
  brandName: z.string().min(1, 'Requerido'),
  tagline: z.string(),
  logo: z.string().url('URL invalida'),
  logoAlt: z.string(),
  heroTitle: z.string().min(1, 'Requerido'),
  heroSubtitle: z.string(),
  heroBadge: z.string(),
  ctaText: z.string().min(1, 'Requerido'),
  whatsappNumber: z.string().min(10, 'Numero invalido'),
  whatsappMessage: z.string().min(1, 'Requerido'),
  phone: z.string(),
  address: z.string(),
  footerText: z.string(),
  footerCopyright: z.string(),
  footerInstagram: z.string().url('URL invalida').optional().or(z.literal('')),
})

type GeneralFormData = z.infer<typeof generalSchema>

interface GeneralSettingsFormProps {
  content: SiteContent
  onSave: (content: SiteContent) => Promise<void>
  isSaving: boolean
}

export function GeneralSettingsForm({ content, onSave, isSaving }: GeneralSettingsFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<GeneralFormData>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      brandName: content.brand.name,
      tagline: content.brand.tagline,
      logo: content.brand.logo,
      logoAlt: content.brand.logoAlt || '',
      heroTitle: content.hero.title,
      heroSubtitle: content.hero.subtitle,
      heroBadge: content.hero.badge || '',
      ctaText: content.hero.ctaText,
      whatsappNumber: content.contact.whatsappNumber,
      whatsappMessage: content.contact.whatsappMessage,
      phone: content.contact.phone || '',
      address: content.contact.address || '',
      footerText: content.footer.text,
      footerCopyright: content.footer.copyright,
      footerInstagram: content.footer.instagram || '',
    },
  })

  const logoUrl = watch('logo')
  const logoAltUrl = watch('logoAlt')

  const onSubmit = async (data: GeneralFormData) => {
    const updatedContent: SiteContent = {
      ...content,
      brand: {
        name: data.brandName,
        tagline: data.tagline,
        logo: data.logo,
        logoAlt: data.logoAlt,
      },
      hero: {
        ...content.hero,
        title: data.heroTitle,
        subtitle: data.heroSubtitle,
        badge: data.heroBadge,
        ctaText: data.ctaText,
      },
      contact: {
        whatsappNumber: data.whatsappNumber,
        whatsappMessage: data.whatsappMessage,
        phone: data.phone,
        address: data.address,
        nequiNumber: content.contact.nequiNumber,
      },
      footer: {
        text: data.footerText,
        copyright: data.footerCopyright,
        instagram: data.footerInstagram,
      },
    }

    await onSave(updatedContent)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card padded>
        <CardHeader>
          <CardTitle className="font-serif text-matilde-red">Informacion de la Marca</CardTitle>
          <CardDescription>Configura el nombre y logos de tu negocio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Nombre del Negocio</FieldLabel>
              <Input {...register('brandName')} placeholder="El Sazon de Matilde's" />
              {errors.brandName && <FieldError>{errors.brandName.message}</FieldError>}
            </Field>
            <Field>
              <FieldLabel>Tagline / Eslogan</FieldLabel>
              <Input {...register('tagline')} placeholder="Sazon Casero" />
            </Field>
          </FieldGroup>

          <div className="grid gap-4 md:grid-cols-2">
            <UploadImageField
              label="Logo principal"
              value={logoUrl}
              folder="brand"
              onChange={(value) => setValue('logo', value, { shouldDirty: true, shouldValidate: true })}
              error={errors.logo?.message}
              helperText="Carga el logo principal desde tu teléfono o tu compu."
              previewClassName="bg-white"
            />
            <UploadImageField
              label="Logo alternativo"
              value={logoAltUrl}
              folder="brand"
              onChange={(value) => setValue('logoAlt', value, { shouldDirty: true, shouldValidate: true })}
              helperText="Usa esta versión para fondos oscuros o rojos."
              previewClassName="bg-matilde-red"
            />
          </div>
        </CardContent>
      </Card>

      <Card padded>
        <CardHeader>
          <CardTitle className="font-serif text-matilde-red">Seccion Principal</CardTitle>
          <CardDescription>Configura el contenido que aparece arriba de todo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel>Titulo Principal</FieldLabel>
            <Input {...register('heroTitle')} placeholder="Empanadas con el sazon de la abuela" />
            {errors.heroTitle && <FieldError>{errors.heroTitle.message}</FieldError>}
          </Field>
          <Field>
            <FieldLabel>Subtitulo</FieldLabel>
            <Textarea {...register('heroSubtitle')} rows={3} placeholder="Recetas tradicionales colombianas..." />
          </Field>
          <FieldGroup>
            <Field>
              <FieldLabel>Texto del Boton CTA</FieldLabel>
              <Input {...register('ctaText')} placeholder="Pedi por WhatsApp" />
              {errors.ctaText && <FieldError>{errors.ctaText.message}</FieldError>}
            </Field>
            <Field>
              <FieldLabel>Badge / Etiqueta</FieldLabel>
              <Input {...register('heroBadge')} placeholder="Hechas con sazon casero" />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card padded>
        <CardHeader>
          <CardTitle className="font-serif text-matilde-red">Informacion de Contacto</CardTitle>
          <CardDescription>Configura WhatsApp y otros medios de contacto.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Numero de WhatsApp</FieldLabel>
              <Input {...register('whatsappNumber')} placeholder="573204583723" />
              {errors.whatsappNumber && <FieldError>{errors.whatsappNumber.message}</FieldError>}
            </Field>
            <Field>
              <FieldLabel>Telefono visible</FieldLabel>
              <Input {...register('phone')} placeholder="320 4583723" />
            </Field>
          </FieldGroup>
          <Field>
            <FieldLabel>Mensaje predeterminado de WhatsApp</FieldLabel>
            <Textarea {...register('whatsappMessage')} rows={2} placeholder="Hola! Quiero hacer un pedido:" />
            {errors.whatsappMessage && <FieldError>{errors.whatsappMessage.message}</FieldError>}
          </Field>
          <Field>
            <FieldLabel>Direccion (opcional)</FieldLabel>
            <Input {...register('address')} placeholder="Calle 123 #45-67" />
          </Field>
        </CardContent>
      </Card>

      <Card padded>
        <CardHeader>
          <CardTitle className="font-serif text-matilde-red">Pie de Pagina</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel>Texto del Footer</FieldLabel>
            <Input {...register('footerText')} placeholder="El mejor sabor casero..." />
          </Field>
          <Field>
            <FieldLabel>Copyright</FieldLabel>
            <Input {...register('footerCopyright')} placeholder="© 2024 El Sazon de Matilde's..." />
          </Field>
          <Field>
            <FieldLabel>Instagram (URL)</FieldLabel>
            <Input
              {...register('footerInstagram')}
              placeholder="https://www.instagram.com/elsazondematilde/"
            />
            {errors.footerInstagram && <FieldError>{errors.footerInstagram.message}</FieldError>}
          </Field>
        </CardContent>
      </Card>

      <div className="sticky bottom-4 flex justify-end">
        <Button
          type="submit"
          disabled={isSaving || !isDirty}
          className={`${dashboardButtonClass} bg-matilde-red px-8 text-white hover:bg-matilde-red-dark`}
        >
          {isSaving ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
