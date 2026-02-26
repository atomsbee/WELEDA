'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Context ───────────────────────────────────────────────────────────────────

interface SelectCtx {
  value: string
  onSelect: (v: string) => void
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  displayLabel: string
  register: (v: string, label: string) => void
}

const SelectContext = React.createContext<SelectCtx | null>(null)

function useSelectCtx() {
  const ctx = React.useContext(SelectContext)
  if (!ctx) throw new Error('Select sub-components must be inside <Select>')
  return ctx
}

// ─── Select ────────────────────────────────────────────────────────────────────

export function Select({
  value,
  onValueChange,
  children,
}: {
  value: string
  onValueChange: (v: string) => void
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const [displayLabel, setDisplayLabel] = React.useState('')
  const rootRef = React.useRef<HTMLDivElement>(null)

  // Called by each SelectItem to register its label
  const register = React.useCallback(
    (v: string, label: string) => {
      if (v === value) setDisplayLabel(label)
    },
    [value]
  )

  const onSelect = React.useCallback(
    (v: string) => {
      onValueChange(v)
      setOpen(false)
    },
    [onValueChange]
  )

  // Close when clicking outside
  React.useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <SelectContext.Provider value={{ value, onSelect, open, setOpen, displayLabel, register }}>
      <div ref={rootRef} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

// ─── SelectTrigger ─────────────────────────────────────────────────────────────

export function SelectTrigger({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const { open, setOpen } = useSelectCtx()
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      className={cn(
        'flex items-center justify-between gap-2 rounded-full border border-gray-200 bg-white',
        'px-4 py-2.5 text-sm font-medium text-gray-700 min-h-[44px] cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-[#0b4535]/20 focus:border-[#0b4535] transition-all',
        className
      )}
    >
      <span className="flex-1 text-left truncate">{children}</span>
      <ChevronDown
        className={cn(
          'h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200',
          open && 'rotate-180'
        )}
      />
    </button>
  )
}

// ─── SelectValue ───────────────────────────────────────────────────────────────

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { displayLabel } = useSelectCtx()
  return <>{displayLabel || placeholder || ''}</>
}

// ─── SelectContent ─────────────────────────────────────────────────────────────

export function SelectContent({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const { open } = useSelectCtx()
  if (!open) return null
  return (
    <div
      className={cn(
        'absolute left-0 top-[calc(100%+4px)] z-50 min-w-full max-h-60 overflow-y-auto',
        'rounded-xl border border-gray-200 bg-white shadow-lg py-1',
        className
      )}
    >
      {children}
    </div>
  )
}

// ─── SelectItem ────────────────────────────────────────────────────────────────

export function SelectItem({
  value,
  textValue,
  children,
  className,
}: {
  value: string
  textValue?: string
  children: React.ReactNode
  className?: string
}) {
  const { value: selectedValue, onSelect, register } = useSelectCtx()
  const isSelected = selectedValue === value
  const label = textValue ?? (typeof children === 'string' ? children : value)

  // Register label before paint so SelectValue has it on first render
  React.useLayoutEffect(() => {
    register(value, label)
  }, [value, label, register])

  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        'flex items-center w-full px-4 py-2.5 text-sm text-left transition-colors cursor-pointer',
        isSelected
          ? 'text-[#0b4535] font-medium bg-[#0b4535]/5'
          : 'text-gray-700 hover:bg-gray-50',
        className
      )}
    >
      <span className="flex-1">{children}</span>
      {isSelected && (
        <svg
          className="w-4 h-4 text-[#0b4535] flex-shrink-0 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </button>
  )
}
