import { forwardRef } from 'react'
import { Button } from '@/components/ui/Button'

interface PrimaryButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  (props, ref) => {
    return <Button ref={ref} variant="primary" {...props} />
  }
)
PrimaryButton.displayName = 'PrimaryButton'
