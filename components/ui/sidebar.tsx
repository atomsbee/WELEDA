'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'admin-sidebar-collapsed'
const SIDEBAR_WIDTH = '240px'
const SIDEBAR_COLLAPSED_WIDTH = '56px'

interface SidebarContextType {
  open: boolean
  setOpen: (open: boolean) => void
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextType>({
  open: true,
  setOpen: () => {},
  toggleSidebar: () => {},
})

export function useSidebar() {
  return React.useContext(SidebarContext)
}

export function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpenState] = React.useState(defaultOpen)

  // Read persisted state from localStorage after mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored !== null) {
        // stored 'true' = collapsed → open = false
        setOpenState(stored !== 'true')
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  const setOpen = React.useCallback((value: boolean) => {
    setOpenState(value)
    try {
      localStorage.setItem(STORAGE_KEY, String(!value))
    } catch {
      // ignore storage errors
    }
  }, [])

  const toggleSidebar = React.useCallback(() => {
    setOpen(!open)
  }, [open, setOpen])

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({
  className,
  children,
  style,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { open } = useSidebar()

  return (
    <aside
      data-state={open ? 'expanded' : 'collapsed'}
      className={cn(
        'flex flex-col h-full flex-shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out',
        className
      )}
      style={{
        width: open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
        ...style,
      }}
      {...props}
    >
      {children}
    </aside>
  )
}

export function SidebarHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex-shrink-0', className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col flex-1 overflow-y-auto overflow-x-hidden', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex-shrink-0', className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarMenu({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn('flex flex-col gap-0.5', className)} {...props}>
      {children}
    </ul>
  )
}

export function SidebarMenuItem({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li className={cn('', className)} {...props}>
      {children}
    </li>
  )
}

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  isActive?: boolean
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ asChild = false, isActive, className, children, ...props }, ref) => {
    const { open } = useSidebar()
    const Comp = asChild ? (Slot as React.ElementType) : 'button'

    return (
      <Comp
        ref={ref}
        data-active={isActive}
        className={cn(
          'flex w-full items-center rounded-xl transition-all duration-200 text-sm font-medium overflow-hidden',
          open ? 'gap-3 px-3 py-2.5' : 'justify-center px-0 py-2.5 gap-0',
          isActive
            ? 'bg-white/15 text-white'
            : 'text-white/60 hover:text-white hover:bg-white/10',
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
SidebarMenuButton.displayName = 'SidebarMenuButton'

export function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar, open } = useSidebar()

  return (
    <button
      onClick={toggleSidebar}
      aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
      className={cn(
        'inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors',
        className
      )}
      {...props}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h7"
        />
      </svg>
    </button>
  )
}

export function SidebarInset({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <main
      className={cn('flex flex-col flex-1 overflow-y-auto min-w-0', className)}
      {...props}
    >
      {children}
    </main>
  )
}
