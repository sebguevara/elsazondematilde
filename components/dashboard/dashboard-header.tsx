'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import type { BrandInfo } from '@/types/content'

interface DashboardHeaderProps {
  brand: BrandInfo
  isSaving: boolean
}

export function DashboardHeader({ brand, isSaving }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-matilde-yellow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="font-serif text-xl text-matilde-red">Dashboard</h1>
              <p className="text-xs text-matilde-brown/60">{brand.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isSaving && (
              <div className="flex items-center gap-2 text-matilde-brown text-sm">
                <Spinner className="w-4 h-4" />
                <span className="hidden sm:inline">Guardando...</span>
              </div>
            )}
            <Button asChild variant="outline" size="sm" className="border-matilde-red text-matilde-red hover:bg-matilde-red hover:text-white">
              <Link href="/" target="_blank">
                <ExternalLink className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Ver Sitio</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
