import { Metadata } from 'next'
import Link from 'next/link'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ChevronRight, 
  Building2, 
  MessageSquareText, 
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Share2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Globe
} from 'lucide-react'
import ContactForm from '@/components/public/contact-form'
import MapClientWrapper from '@/components/public/map-client-wrapper'
import { KKUSB_PROFILE } from '@/lib/data/kkusb-data'
import prisma from '@/lib/prisma'

export async function generateMetadata(): Promise<Metadata> {
  let settings: any = null
  try {
    settings = await prisma.siteSetting.findFirst()
  } catch (e) {}

  const siteName = settings?.siteName || KKUSB_PROFILE.name
  return {
    title: `Hubungi Kami — ${siteName} Kantor Pusat & Layanan Anggota`,
    description: settings?.seoDescription || `Informasi kontak resmi ${siteName} di Gresik, Tuban, Rembang. Telepon: ${settings?.phoneNumber || '0821 1808 1681'}, email: ${settings?.email || 'kantorpusat@kkusb.co.id'}. Peta lokasi dan formulir pesan langsung.`,
  }
}

const OFFICIAL_MAPS_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d349.89700267863486!2d112.6475970074275!3d-7.168399000447001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd800411c2c35c3%3A0xa878af5169cb2240!2sKoperasi%20Karyawan%20Usaha%20Sejahtera%20Bersama!5e0!3m2!1sen!2sid!4v1791940906024!5m2!1sen!2sid"

function getGoogleMapsEmbedUrl(rawUrl: string | null | undefined): string {
  if (!rawUrl) return OFFICIAL_MAPS_EMBED

  // Extract src if admin pasted a full iframe HTML snippet
  const iframeSrcMatch = rawUrl.match(/src=["']([^"']+)["']/)
  if (iframeSrcMatch && iframeSrcMatch[1]) {
    return iframeSrcMatch[1]
  }

  // If already an embed URL
  if (rawUrl.includes('/maps/embed')) {
    return rawUrl
  }

  // Fallback to verified official Google Maps embed of KKUSB
  return OFFICIAL_MAPS_EMBED
}

function getExternalMapsUrl(rawUrl: string | null | undefined): string {
  const fallback = "https://maps.app.goo.gl/7U9268hjciRhMr9J6"
  if (!rawUrl) return fallback
  if (rawUrl.includes('<iframe')) {
    return fallback
  }
  return rawUrl
}

export default async function KontakPage() {
  let settings: any = null
  let units: any[] = []

  try {
    const [dbSettings, dbUnits] = await Promise.all([
      prisma.siteSetting.findFirst(),
      prisma.unitUsaha.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { order: 'asc' },
      })
    ])
    settings = dbSettings
    units = dbUnits
  } catch (err) {
    // Fallback gracefully
  }

  const siteName = settings?.siteName || KKUSB_PROFILE.name
  const siteDescription = settings?.siteDescription || 'Pusat administrasi, kesekretariatan, dan layanan keanggotaan KKUSB'
  const address = settings?.address || KKUSB_PROFILE.headquarters.address
  const phone = settings?.phoneNumber || KKUSB_PROFILE.headquarters.phone
  const email = settings?.email || KKUSB_PROFILE.headquarters.email
  const rawWa = settings?.whatsapp || '6282118081681'
  const cleanWa = rawWa.replace(/[^0-9]/g, '')
  const formattedWa = cleanWa.startsWith('62')
    ? `+62 ${cleanWa.slice(2, 5)}-${cleanWa.slice(5, 9)}-${cleanWa.slice(9)}`
    : (cleanWa.startsWith('0') ? `+62 ${cleanWa.slice(1, 4)}-${cleanWa.slice(4, 8)}-${cleanWa.slice(8)}` : cleanWa)
  
  const rawMapsUrl = settings?.googleMapsUrl || KKUSB_PROFILE.headquarters.googleMapsUrl
  const embedMapsUrl = getGoogleMapsEmbedUrl(rawMapsUrl)
  const externalMapsUrl = getExternalMapsUrl(rawMapsUrl)
  const workingHours = KKUSB_PROFILE.headquarters.workingHours
  const facebookUrl = settings?.facebookUrl || KKUSB_PROFILE.social.facebook
  const instagramUrl = settings?.instagramUrl || KKUSB_PROFILE.social.instagram
  const youtubeUrl = settings?.youtubeUrl || KKUSB_PROFILE.social.youtube

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-[#079B49]/20 selection:text-[#075C35]">
      
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-zinc-200 dark:border-zinc-800 bg-[#F6F8F6]/90 dark:bg-zinc-900/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
            <Link href="/" className="hover:text-[#079B49] transition-colors">Beranda</Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">Kontak Kami</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#079B49] dark:text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              Layanan Anggota & Kemitraan Resmi
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
              Hubungi Kantor Pusat {siteName}
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-light">
              Tim pelayanan kami siap membantu kebutuhan keanggotaan, pertanyaan simpan pinjam syariah, pengadaan komersial industri, maupun kemitraan unit usaha operasional.
            </p>
          </div>

          {/* Quick Contact Action Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-zinc-200/80 dark:border-zinc-800">
            {/* Call */}
            <a 
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-[#079B49] hover:shadow-md transition-all group"
            >
              <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#079B49] flex items-center justify-center shrink-0 group-hover:bg-[#079B49] group-hover:text-white transition-colors">
                <Phone className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-medium text-zinc-500 block">Hotline Telepon</span>
                <strong className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#079B49] transition-colors truncate block">
                  {phone}
                </strong>
              </div>
            </a>

            {/* WhatsApp */}
            <a 
              href={`https://wa.me/${cleanWa}?text=Halo%20Admin%20${encodeURIComponent(siteName)},%20saya%20ingin%20berkonsultasi%20mengenai%20layanan.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-[#079B49] hover:shadow-md transition-all group"
            >
              <div className="h-11 w-11 rounded-xl bg-green-50 dark:bg-green-950/60 text-green-600 flex items-center justify-center shrink-0 group-hover:bg-[#079B49] group-hover:text-white transition-colors">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-zinc-500">WhatsApp Resmi</span>
                  <span className="px-1.5 py-0.2 rounded bg-green-100 dark:bg-green-900/60 text-[9px] font-bold text-green-700 dark:text-green-300">Fast Response</span>
                </div>
                <strong className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#079B49] transition-colors truncate block">
                  {formattedWa}
                </strong>
              </div>
            </a>

            {/* Email */}
            <a 
              href={`mailto:${email}`}
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-[#079B49] hover:shadow-md transition-all group"
            >
              <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#079B49] flex items-center justify-center shrink-0 group-hover:bg-[#079B49] group-hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-medium text-zinc-500 block">Email Resmi</span>
                <strong className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#079B49] transition-colors truncate block">
                  {email}
                </strong>
              </div>
            </a>
          </div>

        </div>
      </section>

      {/* 2. CONTACT CHANNELS & FORM */}
      <section className="py-16 lg:py-24 border-b border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Official Contact Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="p-8 rounded-3xl bg-[#F6F8F6] dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#079B49]">
                    Administrasi & Sekretariat
                  </span>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                    Kantor Pusat {siteName}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    {siteDescription}
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-start gap-3.5">
                    <MapPin className="h-5 w-5 text-[#079B49] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-zinc-900 dark:text-zinc-100 block">Alamat Kantor:</strong>
                      <p className="leading-relaxed mt-0.5">{address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Phone className="h-5 w-5 text-[#079B49] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-zinc-900 dark:text-zinc-100 block">Hotline Telepon:</strong>
                      <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="mt-0.5 text-zinc-800 dark:text-zinc-200 hover:text-[#079B49] transition-colors block">
                        {phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <MessageCircle className="h-5 w-5 text-[#079B49] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-zinc-900 dark:text-zinc-100 block">WhatsApp Customer Care:</strong>
                      <a 
                        href={`https://wa.me/${cleanWa}?text=Halo%20${encodeURIComponent(siteName)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-0.5 text-[#079B49] font-medium hover:underline block"
                      >
                        {formattedWa} &rarr;
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Mail className="h-5 w-5 text-[#079B49] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-zinc-900 dark:text-zinc-100 block">Email Resmi:</strong>
                      <a href={`mailto:${email}`} className="mt-0.5 text-zinc-800 dark:text-zinc-200 hover:text-[#079B49] transition-colors block">
                        {email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Clock className="h-5 w-5 text-[#079B49] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-zinc-900 dark:text-zinc-100 block">Jam Operasional Pelayanan:</strong>
                      <p className="mt-0.5 leading-relaxed">{workingHours}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <a
                    href={externalMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#079B49] hover:bg-[#075C35] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <MapPin className="h-4 w-4" />
                    Petunjuk Arah Google Maps
                    <ExternalLink className="h-3.5 w-3.5 ml-1" />
                  </a>
                </div>
              </div>

              {/* Kanal Media Sosial Resmi */}
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3.5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Kanal Resmi & Media Sosial
                </h4>
                
                <div className="flex flex-wrap gap-2 pt-1">
                  {facebookUrl && (
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-[#079B49] text-xs text-zinc-700 dark:text-zinc-300 hover:text-white transition-colors"
                    >
                      Facebook KKUSB
                    </a>
                  )}
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-[#079B49] text-xs text-zinc-700 dark:text-zinc-300 hover:text-white transition-colors"
                    >
                      Instagram Resmi
                    </a>
                  )}
                  {youtubeUrl && (
                    <a
                      href={youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-[#079B49] text-xs text-zinc-700 dark:text-zinc-300 hover:text-white transition-colors"
                    >
                      YouTube Channel
                    </a>
                  )}
                </div>
              </div>

              {/* Jaringan Unit Usaha Terdaftar dari Database */}
              {units.length > 0 && (
                <div className="p-6 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Jaringan Unit Usaha Aktif
                    </h4>
                    <span className="text-[11px] font-semibold text-[#079B49]">
                      {units.length} Unit
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {units.map((u) => (
                      <Link
                        key={u.id}
                        href={`/unit-usaha/${u.slug}`}
                        className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-emerald-50/70 dark:hover:bg-zinc-900 transition-colors group border border-transparent hover:border-emerald-500/20"
                      >
                        <div className="h-9 w-9 rounded-xl overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                          {u.image ? (
                            <img src={u.image} alt={u.name} className="h-full w-full object-cover" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-[#079B49]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#079B49] transition-colors truncate">
                            {u.name}
                          </p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                            {u.shortDescription || u.description || 'Layanan komersial anggota & mitra'}
                          </p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-[#079B49] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Contact Form (7 cols) */}
            <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#079B49]">
                  <MessageSquareText className="h-4 w-4" />
                  <span>Kirim Pesan Langsung</span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  Formulir Komunikasi & Pertanyaan
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Silakan isi formulir di bawah ini. Pesan Anda akan langsung diteruskan ke dashboard pengurus {siteName} dan ditindaklanjuti pada jam kerja operasional.
                </p>
              </div>

              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE MAP SECTION */}
      <section className="py-16 bg-[#F6F8F6]/80 dark:bg-zinc-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">Lokasi Geografis</span>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                Peta Lokasi Kantor Pusat {siteName}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                {address}
              </p>
            </div>
            <a 
              href={externalMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#079B49] hover:underline inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              Buka di Aplikasi Google Maps <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="h-[460px] rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md bg-zinc-100 dark:bg-zinc-900">
            <MapClientWrapper 
              embedUrl={embedMapsUrl} 
              siteName={siteName} 
            />
          </div>
        </div>
      </section>

    </div>
  )
}
