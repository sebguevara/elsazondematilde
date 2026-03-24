import { Banknote, Clock, CreditCard, Smartphone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { BusinessHours, PaymentMethod } from '@/types/content'
import { SectionWave } from '@/components/landing/section-wave'

interface HoursPaymentSectionProps {
  hours: BusinessHours[]
  paymentMethods: PaymentMethod[]
}

export function HoursPaymentSection({ hours, paymentMethods }: HoursPaymentSectionProps) {
  const enabledHours = hours.filter((hour) => hour.enabled)
  const enabledPayments = paymentMethods.filter((payment) => payment.enabled)
  const groupedHours = groupConsecutiveDays(enabledHours)

  return (
    <section
      id="horario"
      className="relative overflow-hidden bg-matilde-yellow pt-16 pb-20 md:pt-20 md:pb-24"
    >
      {/* Wave transition from the (white) gallery section */}
      <SectionWave position="top" colorClassName="text-white" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <Card className="border-0 bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-matilde-yellow">
                  <Clock className="h-6 w-6 text-matilde-red" />
                </div>
                <h3 className="font-serif text-2xl text-matilde-red">Horario</h3>
              </div>
              <div className="space-y-2">
                {groupedHours.map((group, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-matilde-cream py-2 last:border-0"
                  >
                    <span className="font-medium text-matilde-brown">{group.days}</span>
                    <span className="font-semibold text-matilde-red">
                      {formatTime(group.open)} - {formatTime(group.close)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-matilde-yellow">
                  <CreditCard className="h-6 w-6 text-matilde-red" />
                </div>
                <h3 className="font-serif text-2xl text-matilde-red">Medios de Pago</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {enabledPayments.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center gap-3 rounded-lg bg-matilde-cream/50 p-3"
                  >
                    {getPaymentIcon(method.name)}
                    <div>
                      <p className="font-semibold text-matilde-brown">{method.name}</p>
                      {method.details && !method.name.toLowerCase().includes('nequi') && (
                        <p className="text-sm text-matilde-brown/70">{method.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Wave transition into the (cream) WhatsApp CTA section */}
      <SectionWave position="bottom" colorClassName="text-matilde-cream" />
    </section>
  )
}

function getPaymentIcon(name: string) {
  const iconClass = 'h-5 w-5 text-matilde-red'
  const lowerName = name.toLowerCase()

  if (lowerName.includes('nequi') || lowerName.includes('daviplata')) {
    return <Smartphone className={iconClass} />
  }

  if (lowerName.includes('efectivo')) {
    return <Banknote className={iconClass} />
  }

  return <CreditCard className={iconClass} />
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'pm' : 'am'
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return `${displayHours}:${minutes.toString().padStart(2, '0')}${period}`
}

interface GroupedHours {
  days: string
  open: string
  close: string
}

function groupConsecutiveDays(hours: BusinessHours[]): GroupedHours[] {
  if (hours.length === 0) return []

  const groups: GroupedHours[] = []
  let currentGroup: { days: string[]; open: string; close: string } = {
    days: [hours[0].day],
    open: hours[0].open,
    close: hours[0].close,
  }

  for (let index = 1; index < hours.length; index += 1) {
    if (hours[index].open === currentGroup.open && hours[index].close === currentGroup.close) {
      currentGroup.days.push(hours[index].day)
    } else {
      groups.push({
        days: formatDaysRange(currentGroup.days),
        open: currentGroup.open,
        close: currentGroup.close,
      })
      currentGroup = {
        days: [hours[index].day],
        open: hours[index].open,
        close: hours[index].close,
      }
    }
  }

  groups.push({
    days: formatDaysRange(currentGroup.days),
    open: currentGroup.open,
    close: currentGroup.close,
  })

  return groups
}

function formatDaysRange(days: string[]): string {
  if (days.length === 1) return days[0]
  if (days.length === 2) return `${days[0]} y ${days[1]}`
  return `${days[0]} - ${days[days.length - 1]}`
}
