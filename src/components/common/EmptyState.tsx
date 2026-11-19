import { ReactNode } from 'react'
import { FolderSearch } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  actionIcon?: ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('card p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto', className)}>
      <div className="w-14 h-14 rounded-2xl bg-[var(--color-secondary-50)] text-[var(--color-secondary)] flex items-center justify-center mb-4">
        {icon || <FolderSearch className="w-7 h-7" />}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-[var(--color-primary)] mb-1.5">{title}</h3>
      {description && (
        <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] mb-6 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction} leftIcon={actionIcon}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
