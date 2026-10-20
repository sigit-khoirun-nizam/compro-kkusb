'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Info,
  Briefcase,
  Newspaper,
  Building2,
  Image as ImageIcon,
  FileText,
  Mail,
  Settings,
  LogOut,
  GraduationCap,
  BookOpen,
  UserCheck,
  ExternalLink,
  ShieldCheck
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

interface NavGroup {
  label: string
  items: {
    href: string
    icon: any
    label: string
    exact?: boolean
  }[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Dashboard',
    items: [
      { href: '/admin', icon: LayoutDashboard, label: 'Ringkasan Dashboard', exact: true },
    ]
  },
  {
    label: 'Konten Website',
    items: [
      { href: '/admin/tentang', icon: Info, label: 'Tentang KKUSB' },
      { href: '/admin/unit-usaha', icon: Briefcase, label: 'Unit Usaha' },
      { href: '/admin/berita', icon: Newspaper, label: 'Berita & Artikel' },
      { href: '/admin/klien', icon: Building2, label: 'Klien & Mitra' },
      { href: '/admin/galeri', icon: ImageIcon, label: 'Galeri Foto' },
      { href: '/admin/dokumen', icon: FileText, label: 'Dokumen Publik' },
    ]
  },
  {
    label: 'Rekrutmen & SDM',
    items: [
      { href: '/admin/karir', icon: GraduationCap, label: 'Karir & Lowongan', exact: true },
      { href: '/admin/karir/pelamar', icon: UserCheck, label: 'Data Pelamar' },
      { href: '/admin/karir/tes', icon: BookOpen, label: 'Bank Soal Tes' },
    ]
  },
  {
    label: 'Komunikasi',
    items: [
      { href: '/admin/pesan', icon: Mail, label: 'Pesan Masuk' },
    ]
  },
  {
    label: 'Sistem',
    items: [
      { href: '/admin/settings', icon: Settings, label: 'Pengaturan Web' },
    ]
  }
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r border-[#E4E9E5] dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <SidebarHeader className="border-b border-[#E4E9E5]/60 dark:border-zinc-800/80 pb-3">
        <div className="flex h-14 items-center px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
          <Link href="/admin" className="flex items-center gap-3 font-semibold group-data-[collapsible=icon]:justify-center w-full">
            <div className="h-9 w-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0 p-1">
              <Image 
                src="/logo.png" 
                alt="KKUSB Logo" 
                width={28} 
                height={28} 
                className="h-7 w-auto object-contain" 
                style={{ width: 'auto', height: 'auto' }}
                priority 
              />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden leading-tight overflow-hidden">
              <span className="text-[#075C35] dark:text-emerald-400 font-bold text-base tracking-tight truncate">KKUSB CMS</span>
              <span className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase">Corporate Admin</span>
            </div>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-1 py-2">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-1.5">
            <SidebarGroupLabel className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase px-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = item.exact 
                    ? pathname === item.href 
                    : (pathname === item.href || (pathname.startsWith(item.href) && pathname !== '/admin'))

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        isActive={isActive} 
                        tooltip={item.label}
                        className={`h-9 text-xs transition-colors rounded-lg font-medium ${
                          isActive 
                            ? 'bg-[#079B49]/10 text-[#075C35] dark:text-emerald-400 font-semibold border-l-2 border-[#079B49]' 
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                        }`}
                        render={
                          <Link href={item.href} className="flex items-center gap-2.5 w-full" />
                        }
                      >
                        <item.icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#079B49]' : 'text-zinc-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-[#E4E9E5]/60 dark:border-zinc-800/80 pt-2 pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Lihat Website Publik"
              className="h-8 text-xs text-zinc-500 hover:text-[#079B49] hover:bg-emerald-50/50 dark:hover:bg-zinc-800/60"
              render={
                <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 w-full" />
              }
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              <span>Lihat Website</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5"
              tooltip="Keluar dari CMS"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              <span>Keluar (Logout)</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
