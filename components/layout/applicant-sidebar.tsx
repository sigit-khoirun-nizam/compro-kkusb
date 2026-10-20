'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  LogOut,
  GraduationCap,
  Settings,
  Briefcase
} from 'lucide-react'
import { signOut } from 'next-auth/react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const navItems = [
  { href: '/portal-pelamar/dashboard', icon: LayoutDashboard, label: 'Dashboard Pelamar' },
  { href: '/karir', icon: Briefcase, label: 'Lowongan Tersedia' },
]

export default function ApplicantSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r border-zinc-200">
      <SidebarHeader>
        <div className="flex h-14 items-center px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
          <Link href="/portal-pelamar/dashboard" className="flex items-center gap-3 font-semibold">
            <div className="h-8 w-8 shrink-0 bg-green-600 text-white rounded-lg flex items-center justify-center">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="text-zinc-900 font-bold text-lg tracking-tight truncate group-data-[collapsible=icon]:hidden">Portal Karier</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton isActive={isActive} tooltip={item.label} render={
                      <Link href={item.href} className="flex items-center gap-2 w-full" />
                    }>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => signOut({ callbackUrl: '/portal-pelamar' })}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Keluar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
