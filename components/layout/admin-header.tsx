'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Search, 
  User, 
  ExternalLink, 
  Globe, 
  Bell, 
  ChevronRight, 
  Settings, 
  LogOut,
  ShieldCheck
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { useSession, signOut } from 'next-auth/react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const pathLabels: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/tentang': 'Tentang KKUSB',
  '/admin/unit-usaha': 'Unit Usaha',
  '/admin/berita': 'Berita & Artikel',
  '/admin/klien': 'Klien & Mitra',
  '/admin/galeri': 'Galeri Foto',
  '/admin/dokumen': 'Dokumen Publik',
  '/admin/karir': 'Karir & Lowongan',
  '/admin/karir/pelamar': 'Data Pelamar',
  '/admin/karir/tes': 'Bank Soal Tes',
  '/admin/pesan': 'Pesan Masuk',
  '/admin/settings': 'Pengaturan Web',
}

export default function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  // Generate breadcrumb items
  const currentTitle = pathLabels[pathname] || 
    (pathname.includes('/create') ? 'Tambah Data' : 
     pathname.includes('/edit') ? 'Edit Data' : 'Panel Admin')

  return (
    <header className="flex h-14 lg:h-[60px] items-center justify-between gap-4 border-b border-[#E4E9E5] dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur px-4 lg:px-6 sticky top-0 z-30">
      
      {/* Left: Sidebar trigger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" />
        
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400">
          <Link href="/admin" className="hover:text-[#079B49] transition-colors font-medium text-zinc-500">
            Admin
          </Link>
          <ChevronRight className="h-3 w-3 text-zinc-300 dark:text-zinc-600" />
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{currentTitle}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        
        {/* Quick Link to Public Website */}
        <Button 
          variant="ghost" 
          size="sm" 
          asChild 
          className="hidden md:inline-flex h-8 px-2.5 text-xs text-zinc-600 hover:text-[#079B49] hover:bg-emerald-50/60 dark:hover:bg-zinc-800"
        >
          <a href="/" target="_blank" rel="noopener noreferrer">
            <Globe className="h-3.5 w-3.5 mr-1.5 text-[#079B49]" />
            Lihat Website
            <ExternalLink className="h-3 w-3 ml-1 text-zinc-400" />
          </a>
        </Button>

        {/* Quick Link to Pesan */}
        <Button 
          variant="ghost" 
          size="icon" 
          asChild
          className="h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <Link href="/admin/pesan" title="Kotak Masuk Pesan">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifikasi Pesan</span>
          </Link>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ 
            variant: 'ghost', 
            size: 'sm', 
            className: 'h-9 px-2 gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800' 
          })}>
            <div className="h-6 w-6 rounded-full bg-[#079B49]/10 text-[#075C35] dark:text-emerald-400 font-bold text-xs flex items-center justify-center">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="text-xs font-semibold max-w-[100px] truncate hidden sm:inline-block">
              {session?.user?.name || 'Administrator'}
            </span>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56 p-1.5">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none text-zinc-900 dark:text-zinc-100">{session?.user?.name || 'Administrator'}</p>
                  <p className="text-xs leading-none text-zinc-500 truncate">{session?.user?.email || 'admin@kkusb.co.id'}</p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 w-fit px-1.5 py-0.5 rounded">
                    <ShieldCheck className="h-3 w-3" />
                    Super Admin
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => router.push('/admin/settings')} className="text-xs cursor-pointer flex items-center">
              <Settings className="h-3.5 w-3.5 mr-2 text-zinc-500" />
              Pengaturan Website
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => window.open('/', '_blank')} className="text-xs cursor-pointer flex items-center">
              <Globe className="h-3.5 w-3.5 mr-2 text-zinc-500" />
              Buka Website Publik
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem 
              onClick={() => signOut({ callbackUrl: '/' })} 
              className="text-xs text-red-600 focus:text-red-700 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 mr-2" />
              Keluar (Logout)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}
