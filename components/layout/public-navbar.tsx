'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { 
  Menu, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Phone, 
  Mail, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  ShoppingBag, 
  Compass, 
  Wrench, 
  Utensils, 
  ArrowRight,
  X,
  FileText,
  Briefcase,
  Users,
  Building2,
  Package,
  Layers,
  Coins,
  Landmark,
  Store,
  Truck,
  Sparkles,
  Target,
  History,
  CheckCircle2,
  Megaphone,
  BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { BUSINESS_UNITS, NEWS_ARTICLES } from '@/lib/data/kkusb-data'

const aboutDropdown = [
  { href: '/tentang-kami#profil', title: 'Profil Koperasi', desc: 'Identitas, legalitas, dan peran strategis KKUSB', icon: Building2 },
  { href: '/tentang-kami#visi-misi', title: 'Visi dan Misi', desc: 'Arah pandang dan komitmen jangka panjang organisasi', icon: Target },
  { href: '/tentang-kami#sejarah', title: 'Sejarah KKUSB', desc: 'Perjalanan dedikasi melayani sejak tahun 2010', icon: History },
  { href: '/tentang-kami#struktur', title: 'Struktur Organisasi', desc: 'Susunan pengurus, pengawas, dan divisi manajemen', icon: Users },
  { href: '/tentang-kami#tata-kelola', title: 'Tata Kelola & Nilai Koperasi', desc: 'Penerapan prinsip Good Corporate Governance (GCG)', icon: ShieldCheck },
]

const newsDropdown = [
  { href: '/berita?kategori=berita-terbaru', title: 'Berita Terbaru', desc: 'Informasi dan rilis resmi aktivitas terkini', icon: FileText },
  { href: '/berita?kategori=kegiatan', title: 'Kegiatan Koperasi', desc: 'Agenda anggota, gathering, dan program lapangan', icon: Users },
  { href: '/berita?kategori=pengumuman', title: 'Pengumuman', desc: 'Pemberitahuan resmi manajemen untuk anggota & mitra', icon: Megaphone },
  { href: '/berita?kategori=edukasi', title: 'Artikel & Edukasi', desc: 'Wawasan perkoperasian, literasi finansial, dan bisnis', icon: BookOpen },
]

const unitIcons: Record<string, any> = {
  TrendingUp,
  ShieldCheck,
  ShoppingBag,
  Compass,
  Wrench,
  Utensils,
  Building2,
  Package,
  Layers,
  Coins,
  Landmark,
  Store,
  Truck,
  Briefcase
}

export interface NavbarUnitItem {
  id: string
  name: string
  slug: string
  shortDescription?: string | null
  description?: string | null
  image?: string | null
  icon?: string | null
  iconName?: string | null
}

export default function PublicNavbar({ units, settings }: { units?: NavbarUnitItem[]; settings?: any } = {}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({})

  // Search dialog state
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Sticky navbar shadow state
  const [scrolled, setScrolled] = useState(false)

  // DB Units state
  const [dbUnits, setDbUnits] = useState<NavbarUnitItem[]>(units || [])

  useEffect(() => {
    if (units && units.length > 0) {
      setDbUnits(units)
    } else {
      fetch('/api/unit-usaha')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setDbUnits(data)
          }
        })
        .catch(() => {})
    }
  }, [units])

  const unitsToDisplay = dbUnits.length > 0 ? dbUnits : ((units && units.length > 0) ? units : BUSINESS_UNITS)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileSubmenu = (key: string) => {
    setMobileExpanded(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Filter search results
  const filteredUnits = searchQuery.trim() === '' ? [] : unitsToDisplay.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.shortDescription && u.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredNews = searchQuery.trim() === '' ? [] : NEWS_ARTICLES.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearchResultClick = (href: string) => {
    setSearchOpen(false)
    setSearchQuery('')
    router.push(href)
  }

  return (
    <>
      {/* 1. TOP UTILITY BAR (Deloitte/Slalom Enterprise Standard) */}
      <div className="hidden lg:block bg-zinc-950 text-zinc-300 text-xs border-b border-zinc-800/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
          <div className="flex items-center gap-6 text-[11.5px]">
            <span className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors">
              <MapPin className="h-3.5 w-3.5 text-[#079B49]" />
              {settings?.address ? (settings.address.length > 50 ? settings.address.slice(0, 48) + '...' : settings.address) : 'Ruko Kartini Megah Blok A3, Gresik, Jawa Timur'}
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors">
              <Phone className="h-3.5 w-3.5 text-[#079B49]" />
              {settings?.phoneNumber || '0821 1808 1681 / (031) 3971234'}
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors">
              <Mail className="h-3.5 w-3.5 text-[#079B49]" />
              {settings?.email || 'kantorpusat@kkusb.co.id'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11.5px]">
            <span className="text-zinc-400 font-medium">Badan Hukum No. 518/01/BH/437.58/2010</span>
            <span className="text-zinc-700">|</span>
            <Link 
              href="/portal-pelamar" 
              className="group inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-amber-500/40 hover:bg-zinc-850 transition-all"
            >
              <Briefcase className="h-3 w-3 text-[#F4C430] group-hover:scale-110 transition-transform" />
              <span className="font-medium">Portal Rekrutmen</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b",
        scrolled 
          ? "border-zinc-200/90 dark:border-zinc-800/90 shadow-sm py-1.5" 
          : "border-zinc-100 dark:border-zinc-900 py-2.5"
      )}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 focus:outline-none group">
              <Image 
                src="/logo.png" 
                alt="Logo KKUSB" 
                width={44} 
                height={44} 
                className="h-10 w-10 md:h-11 md:w-11 object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-xs"
                priority
              />
              <div className="flex flex-col leading-none">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 dark:text-white group-hover:text-[#079B49] transition-colors">
                    KKUSB
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/60 text-[#079B49] dark:text-emerald-400 text-[9px] font-black uppercase tracking-wider border border-emerald-500/20">
                    KOPERASI
                  </span>
                </div>
                <span className="text-[10.5px] md:text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 tracking-tight mt-0.5">
                  Usaha Sejahtera Bersama
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              
              {/* Beranda */}
              <Link
                href="/"
                className={cn(
                  "relative flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] font-semibold rounded-full transition-all duration-200 tracking-tight",
                  pathname === '/' 
                    ? "text-[#079B49] dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-xs font-bold" 
                    : "text-zinc-600 dark:text-zinc-300 hover:text-[#079B49] dark:hover:text-emerald-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 border border-transparent"
                )}
              >
                Beranda
              </Link>

              {/* Tentang Kami Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('about')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href="/tentang-kami"
                  className={cn(
                    "relative flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] font-semibold rounded-full transition-all duration-200 tracking-tight",
                    pathname.startsWith('/tentang') 
                      ? "text-[#079B49] dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-xs font-bold" 
                      : activeDropdown === 'about'
                        ? "text-[#079B49] dark:text-emerald-400 bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200/60 dark:border-zinc-800/60"
                        : "text-zinc-600 dark:text-zinc-300 hover:text-[#079B49] dark:hover:text-emerald-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 border border-transparent"
                  )}
                >
                  Tentang Kami
                  <ChevronDown className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    activeDropdown === 'about'
                      ? "rotate-180 text-[#079B49] dark:text-emerald-400"
                      : pathname.startsWith('/tentang')
                        ? "text-[#079B49] dark:text-emerald-400"
                        : "text-zinc-400"
                  )} />
                </Link>

                {activeDropdown === 'about' && (
                  <div className="absolute top-full left-0 pt-2.5 w-88 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                    <div className="bg-white/98 dark:bg-zinc-950/98 backdrop-blur-2xl border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl shadow-2xl p-3 ring-1 ring-black/5 dark:ring-white/10">
                      <div className="space-y-1">
                        {aboutDropdown.map((item) => {
                          const IconComp = item.icon
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 transition-colors group"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <div className="h-8.5 w-8.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#079B49] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#079B49] group-hover:text-white transition-colors">
                                <IconComp className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#079B49] dark:group-hover:text-emerald-400 transition-colors">
                                  {item.title}
                                </p>
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                                  {item.desc}
                                </p>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                      <div className="mt-2.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 px-2 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="text-[11px]">Badan Hukum No. 518/01/BH</span>
                        <Link href="/tentang-kami" onClick={() => setActiveDropdown(null)} className="text-[#079B49] dark:text-emerald-400 font-semibold hover:underline text-[11px] flex items-center gap-1">
                          Profil Organisasi &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Unit Usaha Mega Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('units')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href="/unit-usaha"
                  className={cn(
                    "relative flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] font-semibold rounded-full transition-all duration-200 tracking-tight",
                    pathname.startsWith('/unit-usaha') 
                      ? "text-[#079B49] dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-xs font-bold" 
                      : activeDropdown === 'units'
                        ? "text-[#079B49] dark:text-emerald-400 bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200/60 dark:border-zinc-800/60"
                        : "text-zinc-600 dark:text-zinc-300 hover:text-[#079B49] dark:hover:text-emerald-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 border border-transparent"
                  )}
                >
                  Unit Usaha
                  <ChevronDown className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    activeDropdown === 'units'
                      ? "rotate-180 text-[#079B49] dark:text-emerald-400"
                      : pathname.startsWith('/unit-usaha')
                        ? "text-[#079B49] dark:text-emerald-400"
                        : "text-zinc-400"
                  )} />
                </Link>

                {activeDropdown === 'units' && (
                  <div className="absolute top-full -left-48 pt-2.5 w-[760px] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                    <div className="bg-white/98 dark:bg-zinc-950/98 backdrop-blur-2xl border border-zinc-200/90 dark:border-zinc-800/90 rounded-3xl shadow-2xl p-5 ring-1 ring-black/5 dark:ring-white/10">
                      
                      <div className="flex gap-5">
                        {/* Left Featured Showcase Panel */}
                        <div className="w-[230px] shrink-0 rounded-2xl bg-gradient-to-br from-[#065A2C] via-[#077B3C] to-[#043E1E] text-white p-4.5 flex flex-col justify-between relative overflow-hidden shadow-lg border border-emerald-500/20">
                          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-emerald-400/20 blur-xl pointer-events-none" />
                          
                          <div className="space-y-3 relative z-10">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-emerald-100 border border-white/20">
                              <Sparkles className="h-3 w-3 text-amber-300" />
                              Portofolio Bisnis
                            </span>
                            <div>
                              <h4 className="text-base font-extrabold text-white leading-tight">
                                Ekosistem Usaha Terpadu
                              </h4>
                              <p className="text-[11px] text-emerald-100/90 mt-1.5 leading-relaxed">
                                Solusi komersial, simpan pinjam syariah, dan pengadaan profesional bagi anggota serta mitra industri KKUSB.
                              </p>
                            </div>

                            <div className="pt-1 space-y-1.5 text-[11px] text-emerald-100/90">
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
                                <span>Legalitas Terverifikasi</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
                                <span>Tata Kelola Transparan</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 relative z-10">
                            <Link
                              href="/unit-usaha"
                              onClick={() => setActiveDropdown(null)}
                              className="w-full bg-white text-[#065A2C] hover:bg-emerald-50 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-between group/btn"
                            >
                              <span>Semua Portofolio</span>
                              <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>

                        {/* Right Unit Grid Panel */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-100 dark:border-zinc-800">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#079B49] dark:text-emerald-400">
                                  Unit Mandiri
                                </span>
                                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                  Unit Usaha Aktif KKUSB
                                </h4>
                              </div>
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-[#079B49] dark:text-emerald-300 text-[11px] font-semibold">
                                {unitsToDisplay.length} Unit Terdaftar
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                              {unitsToDisplay.map((unit) => {
                                const iconKey = ('icon' in unit ? unit.icon : undefined) || unit.iconName || ''
                                const IconComp = unitIcons[iconKey] || TrendingUp
                                return (
                                  <Link
                                    key={unit.id}
                                    href={`/unit-usaha/${unit.slug}`}
                                    className="group/card flex items-start gap-2.5 p-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:shadow-xs transition-all duration-200"
                                    onClick={() => setActiveDropdown(null)}
                                  >
                                    <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0 border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs flex items-center justify-center group-hover/card:scale-105 transition-transform duration-300">
                                      {unit.image ? (
                                        <img 
                                          src={unit.image} 
                                          alt={unit.name} 
                                          className="h-full w-full object-cover" 
                                          onError={(e) => {
                                            (e.target as HTMLElement).style.display = 'none'
                                          }}
                                        />
                                      ) : (
                                        <div className="h-full w-full bg-emerald-100/70 dark:bg-emerald-950/60 text-[#079B49] flex items-center justify-center">
                                          <IconComp className="h-4 w-4" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-1">
                                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover/card:text-[#079B49] dark:group-hover/card:text-emerald-400 transition-colors truncate">
                                          {unit.name}
                                        </p>
                                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all text-[#079B49] dark:text-emerald-400 shrink-0" />
                                      </div>
                                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-0.5 leading-snug">
                                        {unit.shortDescription || unit.description || 'Layanan terpadu anggota dan mitra KKUSB'}
                                      </p>
                                    </div>
                                  </Link>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Footer Strip */}
                      <div className="mt-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800 -mx-5 -mb-5 px-5 py-2.5 bg-zinc-50/70 dark:bg-zinc-900/60 rounded-b-3xl flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                        <span className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#079B49]"></span>
                          </span>
                          <span className="font-medium text-[11px]">Infrastruktur & Jaringan: Gresik, Tuban, Rembang & Jawa Timur</span>
                        </span>
                        <Link href="/unit-usaha#layanan-anggota" onClick={() => setActiveDropdown(null)} className="text-[#079B49] dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 text-[11px]">
                          Layanan Simpan Pinjam Anggota &rarr;
                        </Link>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* Berita & Kegiatan Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('news')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href="/berita"
                  className={cn(
                    "relative flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] font-semibold rounded-full transition-all duration-200 tracking-tight",
                    pathname.startsWith('/berita') 
                      ? "text-[#079B49] dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-xs font-bold" 
                      : activeDropdown === 'news'
                        ? "text-[#079B49] dark:text-emerald-400 bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200/60 dark:border-zinc-800/60"
                        : "text-zinc-600 dark:text-zinc-300 hover:text-[#079B49] dark:hover:text-emerald-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 border border-transparent"
                  )}
                >
                  Berita & Kegiatan
                  <ChevronDown className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    activeDropdown === 'news'
                      ? "rotate-180 text-[#079B49] dark:text-emerald-400"
                      : pathname.startsWith('/berita')
                        ? "text-[#079B49] dark:text-emerald-400"
                        : "text-zinc-400"
                  )} />
                </Link>

                {activeDropdown === 'news' && (
                  <div className="absolute top-full left-0 pt-2.5 w-88 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                    <div className="bg-white/98 dark:bg-zinc-950/98 backdrop-blur-2xl border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl shadow-2xl p-3 ring-1 ring-black/5 dark:ring-white/10">
                      <div className="space-y-1">
                        {newsDropdown.map((item) => {
                          const IconComp = item.icon
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 transition-colors group"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <div className="h-8.5 w-8.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#079B49] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#079B49] group-hover:text-white transition-colors">
                                <IconComp className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#079B49] dark:group-hover:text-emerald-400 transition-colors">
                                  {item.title}
                                </p>
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                                  {item.desc}
                                </p>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                      <div className="mt-2.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 px-2 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="text-[11px]">Publikasi & Artikel Resmi</span>
                        <Link href="/berita" onClick={() => setActiveDropdown(null)} className="text-[#079B49] dark:text-emerald-400 font-semibold hover:underline text-[11px] flex items-center gap-1">
                          Semua Berita &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mitra */}
              <Link
                href="/mitra"
                className={cn(
                  "relative flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] font-semibold rounded-full transition-all duration-200 tracking-tight",
                  pathname.startsWith('/mitra') || pathname.startsWith('/klien')
                    ? "text-[#079B49] dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-xs font-bold" 
                    : "text-zinc-600 dark:text-zinc-300 hover:text-[#079B49] dark:hover:text-emerald-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 border border-transparent"
                )}
              >
                Mitra
              </Link>

              {/* Karir */}
              <Link
                href="/karir"
                className={cn(
                  "relative flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] font-semibold rounded-full transition-all duration-200 tracking-tight",
                  pathname.startsWith('/karir')
                    ? "text-[#079B49] dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-xs font-bold" 
                    : "text-zinc-600 dark:text-zinc-300 hover:text-[#079B49] dark:hover:text-emerald-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 border border-transparent"
                )}
              >
                Karir
              </Link>

              {/* Kontak */}
              <Link
                href="/kontak"
                className={cn(
                  "relative flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] font-semibold rounded-full transition-all duration-200 tracking-tight",
                  pathname.startsWith('/kontak')
                    ? "text-[#079B49] dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-xs font-bold" 
                    : "text-zinc-600 dark:text-zinc-300 hover:text-[#079B49] dark:hover:text-emerald-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 border border-transparent"
                )}
              >
                Kontak
              </Link>
            </nav>

            {/* Right Actions: Search Modal, ThemeToggle, Primary Corporate CTA */}
            <div className="flex items-center gap-2">
              
              {/* Functional Search Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                title="Pencarian Cepat"
                onClick={() => setSearchOpen(true)}
                className="h-9 w-9 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <Search className="h-4 w-4" />
              </Button>

              <ThemeToggle />

              {/* Primary CTA (Per spec: Hubungi Kami) */}
              <Button 
                asChild
                className="hidden sm:inline-flex bg-gradient-to-r from-[#079B49] to-[#05823D] hover:from-[#06843E] hover:to-[#046B32] text-white font-semibold text-xs sm:text-sm px-5 h-10 rounded-full shadow-sm hover:shadow-md transition-all ml-1"
              >
                <Link href="/kontak">
                  Hubungi Kami
                </Link>
              </Button>

              {/* Mobile Drawer Hamburger */}
              <div className="xl:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger render={
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-10 rounded-xl border-zinc-200 dark:border-zinc-800"
                      aria-label="Buka Menu Navigasi"
                    />
                  }>
                    <Menu className="h-5 w-5" />
                  </SheetTrigger>

                  <SheetContent side="right" className="w-[320px] sm:w-[380px] p-0 flex flex-col bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800">
                    <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                      <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5 focus:outline-none">
                        <Image 
                          src="/logo.png" 
                          alt="Logo KKUSB" 
                          width={40} 
                          height={40} 
                          className="h-9 w-9 object-contain drop-shadow-xs"
                        />
                        <div className="flex flex-col leading-none">
                          <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                            KKUSB
                          </span>
                          <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                            Usaha Sejahtera Bersama
                          </span>
                        </div>
                      </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
                      
                      <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                          pathname === '/' 
                            ? "bg-emerald-50 text-[#079B49] dark:bg-emerald-950/40 dark:text-emerald-400 font-bold" 
                            : "text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                        )}
                      >
                        Beranda
                      </Link>

                      {/* Mobile Tentang Kami Accordion */}
                      <div>
                        <button
                          onClick={() => toggleMobileSubmenu('about')}
                          className={cn(
                            "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                            pathname.startsWith('/tentang')
                              ? "bg-emerald-50 text-[#079B49] dark:bg-emerald-950/40 dark:text-emerald-400 font-bold"
                              : "text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                          )}
                        >
                          <span>Tentang Kami</span>
                          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", mobileExpanded['about'] ? "rotate-180 text-[#079B49]" : "text-zinc-400")} />
                        </button>

                        {mobileExpanded['about'] && (
                          <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-emerald-300 dark:border-emerald-800 ml-4 mt-1">
                            {aboutDropdown.map((sub) => {
                              const IconComp = sub.icon
                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  onClick={() => setIsOpen(false)}
                                  className="flex items-center gap-2.5 px-2.5 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:text-[#079B49] hover:bg-emerald-50/60 dark:hover:bg-zinc-900 rounded-xl transition-colors"
                                >
                                  <div className="h-6 w-6 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-[#079B49] flex items-center justify-center shrink-0">
                                    <IconComp className="h-3 w-3" />
                                  </div>
                                  <span className="font-medium flex-1 truncate">{sub.title}</span>
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {/* Mobile Unit Usaha Accordion */}
                      <div>
                        <button
                          onClick={() => toggleMobileSubmenu('units')}
                          className={cn(
                            "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                            pathname.startsWith('/unit-usaha')
                              ? "bg-emerald-50 text-[#079B49] dark:bg-emerald-950/40 dark:text-emerald-400 font-bold"
                              : "text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <span>Unit Usaha</span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100/80 dark:bg-emerald-900/50 text-[10px] text-[#079B49] dark:text-emerald-300 font-bold">
                              {unitsToDisplay.length} Unit
                            </span>
                          </span>
                          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", mobileExpanded['units'] ? "rotate-180 text-[#079B49]" : "text-zinc-400")} />
                        </button>

                        {mobileExpanded['units'] && (
                          <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-emerald-300 dark:border-emerald-800 ml-4 mt-1">
                            <Link
                              href="/unit-usaha"
                              onClick={() => setIsOpen(false)}
                              className="flex items-center justify-between px-3 py-2 text-xs font-bold text-[#079B49] bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl mb-1"
                            >
                              <span>Semua Portofolio Unit</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                            {unitsToDisplay.map((u) => {
                              const iconKey = ('icon' in u ? u.icon : undefined) || u.iconName || ''
                              const IconComp = unitIcons[iconKey] || TrendingUp
                              return (
                                <Link
                                  key={u.id}
                                  href={`/unit-usaha/${u.slug}`}
                                  onClick={() => setIsOpen(false)}
                                  className="flex items-center gap-2.5 px-2.5 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:text-[#079B49] hover:bg-emerald-50/60 dark:hover:bg-zinc-900 rounded-xl transition-colors group"
                                >
                                  <div className="h-7 w-7 rounded-lg overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center">
                                    {u.image ? (
                                      <img src={u.image} alt={u.name} className="h-full w-full object-cover" />
                                    ) : (
                                      <IconComp className="h-3.5 w-3.5 text-[#079B49]" />
                                    )}
                                  </div>
                                  <span className="font-medium group-hover:text-[#079B49] truncate flex-1">{u.name}</span>
                                  <ChevronRight className="h-3 w-3 text-zinc-400 group-hover:text-[#079B49] shrink-0" />
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {/* Mobile Berita Accordion */}
                      <div>
                        <button
                          onClick={() => toggleMobileSubmenu('news')}
                          className={cn(
                            "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                            pathname.startsWith('/berita')
                              ? "bg-emerald-50 text-[#079B49] dark:bg-emerald-950/40 dark:text-emerald-400 font-bold"
                              : "text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                          )}
                        >
                          <span>Berita & Kegiatan</span>
                          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", mobileExpanded['news'] ? "rotate-180 text-[#079B49]" : "text-zinc-400")} />
                        </button>

                        {mobileExpanded['news'] && (
                          <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-emerald-300 dark:border-emerald-800 ml-4 mt-1">
                            {newsDropdown.map((n) => {
                              const IconComp = n.icon
                              return (
                                <Link
                                  key={n.href}
                                  href={n.href}
                                  onClick={() => setIsOpen(false)}
                                  className="flex items-center gap-2.5 px-2.5 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:text-[#079B49] hover:bg-emerald-50/60 dark:hover:bg-zinc-900 rounded-xl transition-colors"
                                >
                                  <div className="h-6 w-6 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-[#079B49] flex items-center justify-center shrink-0">
                                    <IconComp className="h-3 w-3" />
                                  </div>
                                  <span className="font-medium flex-1 truncate">{n.title}</span>
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      <Link
                        href="/mitra"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                          pathname.startsWith('/mitra') || pathname.startsWith('/klien')
                            ? "bg-emerald-50 text-[#079B49] dark:bg-emerald-950/40 dark:text-emerald-400 font-bold" 
                            : "text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50"
                        )}
                      >
                        Mitra & Klien
                      </Link>

                      <Link
                        href="/karir"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                          pathname.startsWith('/karir') 
                            ? "bg-emerald-50 text-[#079B49] dark:bg-emerald-950/40 dark:text-emerald-400 font-bold" 
                            : "text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50"
                        )}
                      >
                        Karir & Rekrutmen
                      </Link>

                      <Link
                        href="/kontak"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                          pathname.startsWith('/kontak') 
                            ? "bg-emerald-50 text-[#079B49] dark:bg-emerald-950/40 dark:text-emerald-400 font-bold" 
                            : "text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50"
                        )}
                      >
                        Kontak Kami
                      </Link>
                    </div>

                    <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 space-y-2">
                      <Button asChild className="w-full bg-[#079B49] hover:bg-[#075C35] text-white rounded-xl h-11 font-semibold shadow-xs">
                        <Link href="/kontak" onClick={() => setIsOpen(false)}>
                          Hubungi Kami
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full rounded-xl h-10 text-xs border-zinc-200 dark:border-zinc-800">
                        <Link href="/portal-pelamar" onClick={() => setIsOpen(false)}>
                          Login Portal Pelamar
                        </Link>
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* 3. FUNCTIONAL GLOBAL SEARCH DIALOG (Solves "search must have actual purpose" requirement) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Input Bar */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-900/50">
              <Search className="h-5 w-5 text-[#079B49] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari unit usaha, berita, simpan pinjam, karir..."
                className="w-full bg-transparent text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
                autoFocus
              />
              <button 
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Results container */}
            <div className="max-h-96 overflow-y-auto p-4 space-y-4">
              {searchQuery.trim() === '' ? (
                <div className="text-center py-8 text-zinc-400 text-sm">
                  <p>Ketik kata kunci pencarian untuk melihat unit usaha, berita, atau informasi KKUSB.</p>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {['USB Mart', 'Simpan Pinjam', 'Bengkel', 'RAT 2026', 'Tour Travel', 'Lowongan'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSearchQuery(s)}
                        className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-full text-xs text-zinc-600 dark:text-zinc-400 hover:bg-green-100 hover:text-green-800 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Business units results */}
                  {filteredUnits.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                        Unit Usaha ({filteredUnits.length})
                      </h4>
                      <div className="space-y-1">
                        {filteredUnits.map((u) => (
                          <div
                            key={u.id}
                            onClick={() => handleSearchResultClick(`/unit-usaha/${u.slug}`)}
                            className="p-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-950/30 cursor-pointer transition-colors flex items-center justify-between"
                          >
                            <div>
                              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{u.name}</p>
                              <p className="text-xs text-zinc-500 line-clamp-1">{u.shortDescription || u.description || ''}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-[#079B49] shrink-0 ml-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* News results */}
                  {filteredNews.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                        Berita & Kegiatan ({filteredNews.length})
                      </h4>
                      <div className="space-y-1">
                        {filteredNews.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => handleSearchResultClick(`/berita/${n.slug}`)}
                            className="p-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-950/30 cursor-pointer transition-colors flex items-center justify-between"
                          >
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#079B49] bg-green-50 px-2 py-0.5 rounded-full mr-2">
                                {n.category}
                              </span>
                              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{n.title}</span>
                              <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{n.excerpt}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-[#079B49] shrink-0 ml-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredUnits.length === 0 && filteredNews.length === 0 && (
                    <div className="text-center py-8 text-zinc-400 text-sm">
                      Tidak ditemukan hasil untuk <span className="font-semibold text-zinc-700 dark:text-zinc-300">"{searchQuery}"</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 text-right">
              <Button size="sm" variant="ghost" onClick={() => setSearchOpen(false)} className="text-xs">
                Tutup (Esc)
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
