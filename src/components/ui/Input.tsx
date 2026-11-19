import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size = 'md', error, leftIcon, rightIcon, className, ...props }, ref) => {
    const sizeClass = { sm: 'input-sm', md: '', lg: 'input-lg' }[size]
    return (
      <div className="relative w-full flex items-center">
        {leftIcon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] pointer-events-none shrink-0 flex items-center justify-center">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'input-base',
            sizeClass,
            leftIcon && 'input-with-icon-left',
            rightIcon && 'input-with-icon-right',
            error && 'input-error',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] flex items-center justify-center">
            {rightIcon}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

/* ── Textarea ── */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn('input-base', error && 'input-error', className)}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'

/* ── Select ── */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn('input-base', error && 'input-error', className)}
      {...props}
    >
      {children}
    </select>
  )
)
Select.displayName = 'Select'
