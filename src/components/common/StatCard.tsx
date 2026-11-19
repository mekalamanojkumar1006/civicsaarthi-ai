import { ReactNode } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  subtext?: string
  trend?: {
    value: string
    isPositive?: boolean
  }
  icon?: ReactNode
  accentColor?: 'primary' | 'secondary' | 'accent' | 'success'
  className?: string
}

export function StatCard({
  label,
  value,
  subtext,
  trend,
  icon,
  accentColor = 'primary',
  className,
}: StatCardProps) {
  const barClass = {
    primary: 'stat-bar-primary',
    secondary: 'stat-bar-secondary',
    accent: 'stat-bar-accent',
    success: 'stat-bar-success',
  }[accentColor]

  const iconBg = {
    primary: 'bg-[var(--color-primary-50)] text-[var(--color-primary-800)]',
    secondary: 'bg-[var(--color-secondary-50)] text-[var(--color-secondary-700)]',
    accent: 'bg-[var(--color-accent-50)] text-[var(--color-accent-800)]',
    success: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
  }[accentColor]

  return (
    <div className={cn('card relative overflow-hidden p-5 flex flex-col justify-between group', className)}>
      <div className={cn('absolute top-0 left-0 right-0 h-1', barClass)} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)] mt-1 tracking-tight">
            {value}
          </p>
        </div>
        {icon && (
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105', iconBg)}>
            {icon}
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--color-border-subtle)] text-xs">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center font-bold',
                trend.isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
              )}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {trend.value}
            </span>
          )}
          {subtext && <span className="text-[var(--color-muted-foreground)] truncate">{subtext}</span>}
        </div>
      )}
    </div>
  )
}
