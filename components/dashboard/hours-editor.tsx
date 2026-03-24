'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import { Save, Clock } from 'lucide-react'
import { dashboardButtonClass } from '@/components/dashboard/dashboard-button'
import type { SiteContent, BusinessHours } from '@/types/content'

interface HoursEditorProps {
  content: SiteContent
  onSave: (content: SiteContent) => Promise<void>
  isSaving: boolean
}

export function HoursEditor({ content, onSave, isSaving }: HoursEditorProps) {
  const [hours, setHours] = useState<BusinessHours[]>(content.hours)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setHours(content.hours)
    setHasChanges(false)
  }, [content.hours])

  const handleChange = (index: number, field: keyof BusinessHours, value: string | boolean) => {
    const updated = [...hours]
    updated[index] = { ...updated[index], [field]: value }
    setHours(updated)
    setHasChanges(true)
  }

  const handleSave = async () => {
    await onSave({ ...content, hours })
    setHasChanges(false)
  }

  const handleCopyMondayToRest = () => {
    const monday = hours.find((hour) => hour.day.toLowerCase().includes('lunes'))

    if (!monday) {
      return
    }

    const updated = hours.map((hour) =>
      hour.day === monday.day ? hour : { ...hour, open: monday.open, close: monday.close },
    )

    setHours(updated)
    setHasChanges(true)
  }

  return (
    <Card padded>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-matilde-red font-serif flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horarios de Atención
            </CardTitle>
            <CardDescription>Configura los días y horas de apertura</CardDescription>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className={`${dashboardButtonClass} bg-matilde-red text-white hover:bg-matilde-red-dark`}
          >
            {isSaving ? <Spinner className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar Cambios
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 rounded-2xl bg-matilde-yellow-light p-4">
          <p className="mb-3 text-sm text-matilde-brown">
            Define el horario del lunes y luego cópialo al resto si te sirve como base.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyMondayToRest}
            className={`${dashboardButtonClass} border-matilde-yellow bg-white text-matilde-brown hover:bg-matilde-cream`}
          >
            Copiar lunes al resto
          </Button>
        </div>

        <div className="space-y-3">
          {hours.map((hour, index) => (
            <div
              key={hour.day}
              className={`flex flex-col gap-4 rounded-2xl p-4 transition-colors md:flex-row md:items-center ${
                hour.enabled ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <div className="flex min-w-[140px] items-center gap-3">
                <Switch
                  checked={hour.enabled}
                  onCheckedChange={(v) => handleChange(index, 'enabled', v)}
                />
                <span className={`font-medium ${hour.enabled ? 'text-matilde-brown' : 'text-gray-400'}`}>
                  {hour.day}
                </span>
              </div>

              {hour.enabled && (
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                  <Input
                    type="time"
                    value={hour.open}
                    onChange={(e) => handleChange(index, 'open', e.target.value)}
                    className="w-full sm:w-36"
                  />
                  <span className="text-matilde-brown/60">a</span>
                  <Input
                    type="time"
                    value={hour.close}
                    onChange={(e) => handleChange(index, 'close', e.target.value)}
                    className="w-full sm:w-36"
                  />
                </div>
              )}

              {!hour.enabled && (
                <span className="text-gray-400 text-sm">Cerrado</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
