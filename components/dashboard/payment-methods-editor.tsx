'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Plus, Pencil, Trash2, Save, CreditCard, Smartphone, Banknote } from 'lucide-react'
import { dashboardButtonClass, dashboardIconButtonClass } from '@/components/dashboard/dashboard-button'
import type { SiteContent, PaymentMethod } from '@/types/content'

interface PaymentMethodsEditorProps {
  content: SiteContent
  onSave: (content: SiteContent) => Promise<void>
  isSaving: boolean
}

export function PaymentMethodsEditor({ content, onSave, isSaving }: PaymentMethodsEditorProps) {
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSaveMethod = async (method: PaymentMethod) => {
    let updatedMethods: PaymentMethod[]

    if (editingMethod) {
      updatedMethods = content.paymentMethods.map((m) =>
        m.id === editingMethod.id ? method : m
      )
    } else {
      updatedMethods = [...content.paymentMethods, method]
    }

    await onSave({ ...content, paymentMethods: updatedMethods })
    setIsDialogOpen(false)
    setEditingMethod(null)
  }

  const handleDeleteMethod = async (methodId: string) => {
    const updatedMethods = content.paymentMethods.filter((m) => m.id !== methodId)
    await onSave({ ...content, paymentMethods: updatedMethods })
  }

  const handleToggleEnabled = async (methodId: string, enabled: boolean) => {
    const updatedMethods = content.paymentMethods.map((m) =>
      m.id === methodId ? { ...m, enabled } : m
    )
    await onSave({ ...content, paymentMethods: updatedMethods })
  }

  const getIcon = (name: string) => {
    const iconClass = "w-5 h-5 text-matilde-red"
    const lowerName = name.toLowerCase()
    
    if (lowerName.includes('nequi') || lowerName.includes('daviplata')) {
      return <Smartphone className={iconClass} />
    }
    if (lowerName.includes('efectivo')) {
      return <Banknote className={iconClass} />
    }
    return <CreditCard className={iconClass} />
  }

  return (
    <Card padded>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-matilde-red font-serif flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Medios de Pago
          </CardTitle>
          <CardDescription>Configura los métodos de pago que aceptas</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className={`${dashboardButtonClass} bg-matilde-red text-white hover:bg-matilde-red-dark`}
              onClick={() => setEditingMethod(null)}
            >
              <Plus className="mr-2 h-4 w-4" /> Método
            </Button>
          </DialogTrigger>
          <PaymentMethodDialog
            method={editingMethod}
            onSave={handleSaveMethod}
            isSaving={isSaving}
          />
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {content.paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 transition-colors ${
                method.enabled ? 'border-matilde-yellow bg-white' : 'border-transparent bg-gray-50'
              }`}
            >
              <Switch
                checked={method.enabled}
                onCheckedChange={(v) => handleToggleEnabled(method.id, v)}
              />
              
              <div className={`flex items-center gap-3 flex-1 ${!method.enabled && 'opacity-50'}`}>
                {getIcon(method.name)}
                <div>
                  <p className="font-semibold text-matilde-brown">{method.name}</p>
                  {method.details && (
                    <p className="text-sm text-matilde-brown/60">{method.details}</p>
                  )}
                </div>
              </div>

              <div className="flex min-w-[110px] items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingMethod(method)
                    setIsDialogOpen(true)
                  }}
                  className={`${dashboardIconButtonClass} text-matilde-brown hover:bg-matilde-red/10 hover:text-matilde-red`}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteMethod(method.id)}
                  className={`${dashboardIconButtonClass} text-matilde-brown hover:bg-red-50 hover:text-red-500`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {content.paymentMethods.length === 0 && (
            <div className="text-center py-8 text-matilde-brown/60">
              <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No hay métodos de pago configurados</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface PaymentMethodDialogProps {
  method: PaymentMethod | null
  onSave: (method: PaymentMethod) => Promise<void>
  isSaving: boolean
}

function PaymentMethodDialog({ method, onSave, isSaving }: PaymentMethodDialogProps) {
  const [name, setName] = useState(method?.name || '')
  const [details, setDetails] = useState(method?.details || '')
  const [enabled, setEnabled] = useState(method?.enabled ?? true)

  useEffect(() => {
    setName(method?.name || '')
    setDetails(method?.details || '')
    setEnabled(method?.enabled ?? true)
  }, [method])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = method?.id || `pm-${Date.now()}`
    onSave({ id, name, details, enabled })
  }

  return (
    <DialogContent className="max-w-sm" aria-describedby={undefined}>
      <DialogHeader>
        <DialogTitle className="font-serif text-matilde-red">
          {method ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field>
          <FieldLabel>Nombre</FieldLabel>
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Nequi, Efectivo, etc." 
            required 
          />
        </Field>
        <Field>
          <FieldLabel>Detalles (opcional)</FieldLabel>
          <Input 
            value={details} 
            onChange={(e) => setDetails(e.target.value)} 
            placeholder="Número, instrucciones, etc." 
          />
        </Field>
        <label className="flex items-center gap-2 cursor-pointer">
          <Switch checked={enabled} onCheckedChange={setEnabled} />
          <span className="text-sm text-matilde-brown">Habilitado</span>
        </label>
        <DialogFooter className="flex items-center justify-between gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className={`${dashboardButtonClass} border-matilde-yellow text-matilde-brown hover:bg-matilde-yellow-light`}
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isSaving || !name}
            className={`${dashboardButtonClass} bg-matilde-red text-white hover:bg-matilde-red-dark`}
          >
            {isSaving ? <Spinner className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
