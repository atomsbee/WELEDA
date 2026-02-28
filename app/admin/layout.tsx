'use client'

import type { ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { LayoutDashboard, Users, BarChart3, LogOut, ArrowLeft } from 'lucide-react'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

const navItems = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard, exact: true },
  { href: '/admin/influencers', label: 'Influencers', Icon: Users, exact: false },
  { href: '/admin/reports', label: 'Reports', Icon: BarChart3, exact: false },
]

function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { open } = useSidebar()

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <Sidebar
      className="sidebar-admin border-r border-white/10"
      style={{ background: '#0b4535' }}
    >
      {/* Header: logo + title */}
      <SidebarHeader className="p-4 border-b border-white/10">
        <Link
          href="/admin"
          className="flex items-center gap-3 overflow-hidden min-w-0"
        >
          <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
            <Image
              src="/favicon.svg"
              alt="WELEDA"
              width={28}
              height={28}
              className="w-7 h-7 object-contain"
              priority
            />
          </div>
          {open && (
            <div className="overflow-hidden min-w-0">
              <div className="text-white font-bold text-sm leading-tight truncate">
                WELEDA
              </div>
              <div className="text-white/40 text-xs truncate tracking-wide uppercase">
                Admin Panel
              </div>
            </div>
          )}
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-2 py-3">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={isActive(item)}>
                <Link href={item.href} title={!open ? item.label : undefined}>
                  <item.Icon className="w-5 h-5 flex-shrink-0" />
                  {open && <span>{item.label}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer: back to site + sign out */}
      <SidebarFooter className="px-2 py-3 border-t border-white/10 space-y-0.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" title={!open ? 'Back to Website' : undefined}>
                <ArrowLeft className="w-5 h-5 flex-shrink-0" />
                {open && <span>Back to Website</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="hover:text-red-300 hover:bg-white/10"
              title={!open ? 'Sign Out' : undefined}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {open && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // Login page: no sidebar, no chrome
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <div className="admin-area flex h-screen overflow-hidden bg-gray-100">
        <AdminSidebar />
        <SidebarInset className="overflow-y-auto">
          {/* Top bar with trigger */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
            <SidebarTrigger />
          </div>
          <div className="p-5 sm:p-8">{children}</div>
        </SidebarInset>
      </div>
      <Toaster position="bottom-right" richColors />
    </SidebarProvider>
  )
}
