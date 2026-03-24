'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'
import { UserButton } from '@clerk/nextjs'
import { CreditCard, ExternalLink, GalleryVertical, MenuSquare, Save, Settings, TimerReset } from 'lucide-react'
import { toast } from 'sonner'
import { GeneralSettingsForm } from '@/components/dashboard/general-settings-form'
import { GalleryEditor } from '@/components/dashboard/gallery-editor'
import { HoursEditor } from '@/components/dashboard/hours-editor'
import { MenuEditor } from '@/components/dashboard/menu-editor'
import { PaymentMethodsEditor } from '@/components/dashboard/payment-methods-editor'
import { dashboardButtonClass, dashboardIconButtonClass } from '@/components/dashboard/dashboard-button'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import type { SiteContent } from '@/types/content'

const fetcher = (url: string) =>
  fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error('No se pudo cargar el contenido')
    }

    return response.json()
  })

const sections = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'menu', label: 'Menu', icon: MenuSquare },
  { id: 'gallery', label: 'Galeria', icon: GalleryVertical },
  { id: 'hours', label: 'Horarios', icon: TimerReset },
  { id: 'payments', label: 'Pagos', icon: CreditCard },
] as const

type SectionId = (typeof sections)[number]['id']

interface DashboardShellProps {
  initialContent: SiteContent
}

export function DashboardShell({ initialContent }: DashboardShellProps) {
  const [activeSection, setActiveSection] = useState<SectionId>('general')
  const [isSaving, setIsSaving] = useState(false)
  const { data, error, isLoading, mutate } = useSWR<SiteContent>('/api/content', fetcher, {
    fallbackData: initialContent,
  })

  const handleSave = async (updatedContent: SiteContent) => {
    setIsSaving(true)

    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent),
      })

      if (!response.ok) {
        throw new Error('Error al guardar')
      }

      await mutate(updatedContent, false)
      toast.success('Cambios guardados correctamente')
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('Error al guardar los cambios')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-matilde-cream">
        <div className="text-center">
          <Spinner className="mx-auto mb-4 h-8 w-8 text-matilde-red" />
          <p className="text-matilde-brown">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-matilde-cream">
        <div className="text-center text-matilde-red">
          <p className="text-lg font-semibold">Error al cargar el contenido</p>
          <p className="mt-2 text-sm text-matilde-brown">Por favor, recarga la pagina.</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider defaultOpen>
      <DashboardShellContent
        data={data}
        activeSection={activeSection}
        isSaving={isSaving}
        onSave={handleSave}
        setActiveSection={setActiveSection}
      />
    </SidebarProvider>
  )
}

interface DashboardShellContentProps {
  data: SiteContent
  activeSection: SectionId
  isSaving: boolean
  onSave: (content: SiteContent) => Promise<void>
  setActiveSection: React.Dispatch<React.SetStateAction<SectionId>>
}

function DashboardShellContent({
  data,
  activeSection,
  isSaving,
  onSave,
  setActiveSection,
}: DashboardShellContentProps) {
  const { isMobile, setOpenMobile } = useSidebar()

  const handleSectionChange = (sectionId: SectionId) => {
    setActiveSection(sectionId)
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <>
      <Sidebar collapsible="icon" variant="inset" className="border-r border-sidebar-border">
        <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-matilde-red shadow-sm">
              <Image
                src={data.brand.logo}
                alt={data.brand.name}
                fill
                className="object-contain p-1.5"
                sizes="36px"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate font-serif text-lg leading-none text-matilde-red">Administracion</p>
              <p className="truncate text-[11px] text-matilde-brown/65">{data.brand.name}</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-3">
          <SidebarGroup>
            <SidebarMenu>
              {sections.map((section) => {
                const Icon = section.icon

                return (
                  <SidebarMenuItem key={section.id}>
                    <SidebarMenuButton
                      isActive={activeSection === section.id}
                      tooltip={section.label}
                      onClick={() => handleSectionChange(section.id)}
                      className="rounded-xl"
                    >
                      <Icon />
                      <span>{section.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-2xl bg-matilde-yellow-light/70 p-3">
            <UserButton />
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-semibold text-matilde-brown">Sesion activa</p>
              <p className="truncate text-xs text-matilde-brown/70">Panel privado</p>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            className={`${dashboardButtonClass} w-full justify-start border-matilde-yellow text-matilde-brown hover:bg-matilde-yellow-light`}
          >
            <Link href="/" target="_blank">
              <ExternalLink className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">Ver sitio</span>
            </Link>
          </Button>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-h-screen bg-matilde-cream">
        <header className="sticky top-0 z-40 border-b border-matilde-yellow/70 bg-matilde-cream/95 px-4 py-4 backdrop-blur md:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <SidebarTrigger
              className={`${dashboardIconButtonClass} border border-matilde-yellow bg-white text-matilde-red hover:bg-matilde-yellow-light`}
            />
            <div className="min-w-0 flex-1">
              <h1 className="font-serif text-2xl leading-none text-matilde-red md:text-3xl">
                {sections.find((section) => section.id === activeSection)?.label}
              </h1>
            </div>
            {isSaving && (
              <div className="flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm text-matilde-brown shadow-sm">
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Guardando cambios</span>
              </div>
            )}
          </div>
        </header>

        <main className="px-4 py-6 pb-10 md:px-6">
          {activeSection === 'general' && (
            <GeneralSettingsForm content={data} onSave={onSave} isSaving={isSaving} />
          )}
          {activeSection === 'menu' && (
            <MenuEditor content={data} onSave={onSave} isSaving={isSaving} />
          )}
          {activeSection === 'gallery' && (
            <GalleryEditor content={data} onSave={onSave} isSaving={isSaving} />
          )}
          {activeSection === 'hours' && (
            <HoursEditor content={data} onSave={onSave} isSaving={isSaving} />
          )}
          {activeSection === 'payments' && (
            <PaymentMethodsEditor content={data} onSave={onSave} isSaving={isSaving} />
          )}
        </main>
      </SidebarInset>
    </>
  )
}
