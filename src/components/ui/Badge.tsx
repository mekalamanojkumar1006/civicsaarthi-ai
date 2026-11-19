import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'muted'

interface BadgeProps {
  variant?: Variant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

const variants: Record<Variant, string> = {
  primary:   'badge badge-primary',
  secondary: 'badge badge-secondary',
  accent:    'badge badge-accent',
  success:   'badge badge-success',
  warning:   'badge badge-warning',
  danger:    'badge badge-danger',
  info:      'badge badge-info',
  muted:     'badge badge-muted',
}

export function Badge({ variant = 'muted', children, className, dot }: BadgeProps) {
  return (
    <span className={cn(variants[variant], className)}>
      {dot && <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  )
}
