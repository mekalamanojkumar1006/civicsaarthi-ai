import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  interactive?: boolean
  flat?: boolean
  onClick?: () => void
}

export function Card({ children, className, interactive, flat, onClick }: CardProps) {
  const base = interactive ? 'card-interactive' : flat ? 'card-flat' : 'card'
  return (
    <div className={cn(base, className)} onClick={onClick}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-5 pb-0', className)}>{children}</div>
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-5', className)}>{children}</div>
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-5 pb-5 pt-0 flex items-center gap-3', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('font-semibold text-[var(--color-foreground)] leading-snug', className)}>{children}</h3>
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-sm text-[var(--color-muted-foreground)] mt-1 leading-relaxed', className)}>{children}</p>
}
