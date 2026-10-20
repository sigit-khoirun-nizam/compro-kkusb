import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, ExternalLink, ShieldCheck } from 'lucide-react'
import { KKUSB_PROFILE, BUSINESS_UNITS } from '@/lib/data/kkusb-data'

export default function PublicFooter({ units, settings }: { units?: any[]; settings?: any } = {}) {
  const unitsToDisplay = (units && units.length > 0) ? units : BUSINESS_UNITS
  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-zinc-900 selection:bg-[#079B49]/20 selection:text-white">
      
      {/* Upper Footer: Main Corporate Columns */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          
          {/* Col 1: Identity & Legal (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3.5 group focus:outline-none">
              <Image 
                src="/logo.png" 
                alt="Logo KKUSB" 
                width={48} 
                height={48} 
                className="h-12 w-auto object-contain drop-shadow-md transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-[#F4C430] transition-colors">
                  KKUSB
                </span>
                <span className="text-[11px] font-medium text-zinc-400">
                  Usaha Sejahtera Bersama
                </span>
              </div>
            </Link>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              <strong className="text-zinc-200">Koperasi Jasa Karyawan Usaha Sejahtera Bersama (KKUSB)</strong> adalah badan usaha berbadan hukum koperasi yang berkomitmen memajukan kesejahteraan anggota, mengelola unit bisnis terpadu, dan membangun kemitraan industri yang terpercaya sejak 2010.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
              <ShieldCheck className="h-4 w-4 text-[#079B49]" />
              <span>{KKUSB_PROFILE.legalNumber}</span>
            </div>

            {/* Social Links */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Kanal Resmi Organisasi</p>
              <div className="flex flex-wrap gap-3">
                <a 
                  href={settings?.facebookUrl || KKUSB_PROFILE.social.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-[#079B49] text-xs text-zinc-300 hover:text-white transition-colors"
                >
                  Facebook KKUSB
                </a>
                <a 
                  href={settings?.instagramUrl || KKUSB_PROFILE.social.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-[#079B49] text-xs text-zinc-300 hover:text-white transition-colors"
                >
                  Instagram
                </a>
                <a 
                  href={settings?.youtubeUrl || KKUSB_PROFILE.social.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-[#079B49] text-xs text-zinc-300 hover:text-white transition-colors"
                >
                  YouTube Profil
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Business Units (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-2">
              Unit Usaha Mandiri
            </h3>
            <ul className="space-y-2.5 text-sm">
              {unitsToDisplay.map((unit) => (
                <li key={unit.id}>
                  <Link 
                    href={`/unit-usaha/${unit.slug}`}
                    className="text-zinc-400 hover:text-[#079B49] transition-colors flex items-center justify-between group"
                  >
                    <span className="line-clamp-1">{unit.name}</span>
                    <span className="text-zinc-600 group-hover:text-[#079B49] transition-transform group-hover:translate-x-1 text-xs">
                      &rarr;
                    </span>
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link 
                  href="/unit-usaha" 
                  className="text-xs font-semibold text-[#079B49] hover:underline"
                >
                  Lihat Semua Portofolio Unit &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigasi & Infrastruktur (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-2">
              Tautan Cepat
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/tentang-kami" className="text-zinc-400 hover:text-[#079B49] transition-colors">
                  Tentang KKUSB
                </Link>
              </li>
              <li>
                <Link href="/unit-usaha#layanan-anggota" className="text-zinc-400 hover:text-[#079B49] transition-colors">
                  Layanan Anggota
                </Link>
              </li>
              <li>
                <Link href="/mitra" className="text-zinc-400 hover:text-[#079B49] transition-colors">
                  Mitra & Klien
                </Link>
              </li>
              <li>
                <Link href="/berita" className="text-zinc-400 hover:text-[#079B49] transition-colors">
                  Berita & Kegiatan
                </Link>
              </li>
              <li>
                <Link href="/karir" className="text-zinc-400 hover:text-[#079B49] transition-colors">
                  Karir & Rekrutmen
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="text-zinc-400 hover:text-[#079B49] transition-colors">
                  Kontak & Lokasi
                </Link>
              </li>
              <li>
                <Link href="/portal-pelamar" className="text-zinc-400 hover:text-[#F4C430] transition-colors">
                  Portal Pelamar
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contact Info & Branches (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-2">
              Kantor Pusat & Kontak
            </h3>
            
            <div className="space-y-3.5 text-sm text-zinc-400">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#079B49] shrink-0 mt-0.5" />
                <p className="leading-snug">
                  {settings?.address || KKUSB_PROFILE.headquarters.address}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#079B49] shrink-0" />
                <span>{settings?.phoneNumber || `${KKUSB_PROFILE.headquarters.phone} / ${KKUSB_PROFILE.headquarters.altPhone}`}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#079B49] shrink-0" />
                <span>{settings?.email || KKUSB_PROFILE.headquarters.email}</span>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-[#079B49] shrink-0 mt-0.5" />
                <span className="text-xs text-zinc-400 leading-snug">
                  {KKUSB_PROFILE.headquarters.workingHours}
                </span>
              </div>
            </div>

            {/* Infrastructure Branch Badges */}
            <div className="pt-2 border-t border-zinc-900">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Sebaran Operasional:</p>
              <div className="flex flex-wrap gap-1.5 text-xs">
                <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">Gresik</span>
                <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">Tuban</span>
                <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">Rembang</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-zinc-900 bg-black/60 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            {settings?.footerText || `© ${new Date().getFullYear()} ${KKUSB_PROFILE.name}. Hak Cipta Dilindungi Undang-Undang.`}
          </p>

          <div className="flex items-center gap-6">
            <span>Slogan: <em className="text-zinc-400">"{KKUSB_PROFILE.slogan}"</em></span>
            <span>&bull;</span>
            <Link href="/tentang-kami#tata-kelola" className="hover:text-zinc-300 transition-colors">
              Good Corporate Governance
            </Link>
          </div>
        </div>
      </div>

    </footer>
  )
}
