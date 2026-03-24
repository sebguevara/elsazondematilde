import { cn } from '@/lib/utils'

interface SectionWaveProps {
  position: 'top' | 'bottom'
  fillClassName?: string
  colorClassName?: string
  heightClassName?: string
  className?: string
}

export function SectionWave({
  position,
  fillClassName,
  colorClassName,
  heightClassName,
  className,
}: SectionWaveProps) {
  const waveColorClass = fillClassName ?? colorClassName ?? 'text-matilde-cream'

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-x-0 z-0 overflow-hidden',
        heightClassName ?? 'h-12 md:h-16',
        position === 'top' ? 'top-0 rotate-180' : 'bottom-0',
        className,
      )}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={cn('block h-full w-full fill-current', waveColorClass)}
      >
        <path d="M0,64L60,58.7C120,53,240,43,360,48C480,53,600,75,720,80C840,85,960,75,1080,64C1200,53,1320,43,1380,37.3L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" />
      </svg>
    </div>
  )
}
