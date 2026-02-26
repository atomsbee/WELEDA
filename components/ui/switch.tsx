'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  id?: string
  className?: string
  'aria-label'?: string
}

function Switch({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  id,
  className,
  'aria-label': ariaLabel,
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false)

  // Use controlled or uncontrolled mode
  const isControlled = checked !== undefined
  const isChecked = isControlled ? checked : internalChecked

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalChecked(e.target.checked)
    }
    onCheckedChange?.(e.target.checked)
  }

  return (
    <label
      className={cn(
        'relative inline-flex items-center cursor-pointer select-none',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      aria-label={ariaLabel}
    >
      <input
        type="checkbox"
        id={id}
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
        className="sr-only"
      />
      {/* Track */}
      <div
        className={cn(
          'relative w-10 h-6 rounded-full transition-colors duration-200 ease-in-out',
          isChecked ? 'bg-[#0b4535]' : 'bg-gray-300'
        )}
      >
        {/* Thumb */}
        <span
          className={cn(
            'absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm',
            'transition-transform duration-200 ease-in-out',
            isChecked ? 'translate-x-5' : 'translate-x-1'
          )}
        />
      </div>
    </label>
  )
}

Switch.displayName = 'Switch'

export { Switch }
