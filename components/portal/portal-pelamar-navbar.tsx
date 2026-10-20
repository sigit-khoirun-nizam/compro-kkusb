'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LogOut, Briefcase, LayoutDashboard, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'

interface PortalPelamarNavbarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

export default function PortalPelamarNavbar({ user }: PortalPelamarNavbarProps) {
  const pathname = usePathname()

  const handleLogout = () => {
    signOut({ callbackUrl: '/portal-pelamar' })
  }

  const navLinks = [
    {
      href: '/portal-pelamar/dashboard',
      label: 'Lamaran Saya',
      icon: LayoutDashboard,
      active: pathname === '/portal-pelamar/dashboard'
    },
    {
      href: '/portal-pelamar/dashboard/lowongan',
      label: 'Lowongan Karir',
      icon: Briefcase,
      active: pathname.startsWith('/portal-pelamar/dashboard/lowongan') || pathname.startsWith('/portal-pelamar/dashboard/lamar')
    }
  ]

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex h-16 items-center justify-between gap-3 sm:gap-4">
          
          {/* Brand Logo & Portal Badge */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href="/portal-pelamar/dashboard" className="flex items-center gap-2.5 focus:outline-none group">
              <Image 
                src="/logo.png" 
                alt="Logo KKUSB" 
                width={36} 
                height={36} 
                className="h-8 w-8 sm:h-9 sm:w-9 object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col leading-none">
                <span className="text-base sm:text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                  KKUSB
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                  Rekrutmen
                </span>
              </div>
            </Link>

            <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden md:block" />

            <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800/80 text-[11px] font-bold text-[#079B49]">
              Portal Pelamar
            </div>
          </div>

          {/* Navigation Links: Lamaran Saya & Lowongan Karir (Visible on all devices) */}
          <nav className="flex items-center gap-1 sm:gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition-all",
                    link.active
                      ? "bg-green-50 text-[#079B49] dark:bg-green-950/50 dark:text-emerald-400 shadow-xs ring-1 ring-green-200 dark:ring-green-900"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="whitespace-nowrap">{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right Controls: User Profile, ThemeToggle, Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* User Chip */}
            <div className="flex items-center gap-2 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
              <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-[#079B49]/10 text-[#079B49] flex items-center justify-center text-xs font-bold shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-3.5 w-3.5" />}
              </div>
              <div className="flex flex-col text-left leading-tight hidden xl:block">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 max-w-[110px] truncate">
                  {user.name || user.email?.split('@')[0]}
                </span>
                <span className="text-[10px] text-zinc-400 truncate max-w-[110px]">
                  {user.email}
                </span>
              </div>
            </div>

            <ThemeToggle />

            {/* Logout button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/40 dark:hover:text-red-400 text-xs font-semibold gap-1.5 transition-colors"
              title="Keluar dari akun"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>

          </div>

        </div>
      </div>
    </header>
  )
}
