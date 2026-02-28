'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// ── Native accordion (no @radix-ui/react-accordion dependency) ───────────────

interface AccordionContextValue {
  type: 'single' | 'multiple'
  openItems: string[]
  toggle: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue>({
  type: 'multiple',
  openItems: [],
  toggle: () => {},
})

interface AccordionProps {
  type: 'single' | 'multiple'
  defaultValue?: string | string[]
  className?: string
  children: React.ReactNode
}

function Accordion({ type, defaultValue, className, children }: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(() => {
    if (!defaultValue) return []
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
  })

  const toggle = React.useCallback(
    (value: string) => {
      setOpenItems((prev) => {
        if (type === 'single') {
          return prev.includes(value) ? [] : [value]
        }
        return prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      })
    },
    [type]
  )

  return (
    <AccordionContext.Provider value={{ type, openItems, toggle }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  value: string
  className?: string
  children: React.ReactNode
}

const AccordionItemContext = React.createContext<{ value: string; open: boolean }>({
  value: '',
  open: false,
})

function AccordionItem({ value, className, children }: AccordionItemProps) {
  const { openItems } = React.useContext(AccordionContext)
  const open = openItems.includes(value)

  return (
    <AccordionItemContext.Provider value={{ value, open }}>
      <div className={cn('border-b', className)}>{children}</div>
    </AccordionItemContext.Provider>
  )
}

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

function AccordionTrigger({ children, className, ...props }: AccordionTriggerProps) {
  const { toggle } = React.useContext(AccordionContext)
  const { value, open } = React.useContext(AccordionItemContext)

  return (
    <div className="flex">
      <button
        type="button"
        onClick={() => toggle(value)}
        aria-expanded={open}
        className={cn(
          'flex flex-1 items-center justify-between py-4 font-medium transition-all text-left',
          className
        )}
        {...props}
      >
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn('h-4 w-4 shrink-0 transition-transform duration-200', open && 'rotate-180')}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </div>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

function AccordionContent({ children, className }: AccordionContentProps) {
  const { open } = React.useContext(AccordionItemContext)
  const contentRef = React.useRef<HTMLDivElement>(null)

  return (
    <div
      style={{
        overflow: 'hidden',
        maxHeight: open ? (contentRef.current?.scrollHeight ?? 1000) + 'px' : '0px',
        transition: 'max-height 0.25s ease',
      }}
    >
      <div ref={contentRef} className={cn('pb-4 pt-0 text-sm', className)}>
        {children}
      </div>
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
