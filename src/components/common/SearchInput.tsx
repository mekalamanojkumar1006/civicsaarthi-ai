import { forwardRef } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
  sizeVariant?: 'sm' | 'md' | 'lg'
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onClear, sizeVariant = 'md', ...props }, ref) => {
    const heightClass = {
      sm: 'h-8 text-xs',
      md: 'h-10 text-sm',
      lg: 'h-12 text-base',
    }[sizeVariant]

    return (
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)] pointer-events-none" />
        <input
          ref={ref}
          type="text"
          value={value}
          className={cn(
            'input-base pl-10 pr-9',
            heightClass,
            className
          )}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    )
  }
)
SearchInput.displayName = 'SearchInput'
