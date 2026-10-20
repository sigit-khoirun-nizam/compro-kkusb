import Link from 'next/link'
import { 
  Building2, 
  MapPin, 
  ExternalLink, 
  Handshake, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { Metadata } from 'next'
import { CORPORATE_PARTNERS, CLIENT_DEMOGRAPHICS, PartnerItem } from '@/lib/data/kkusb-data'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Mitra & Klien Korporasi — Jaringan Kemitraan KKUSB',
  description: 'Daftar mitra terpercaya KKUSB: Semen Indonesia Group (SIG), Semen Gresik, Semen Padang, Semen Tonasa, Isuzu Astra, Thyssenkrupp, dan jejaring klien nasional.',
}

export default async function MitraPage() {
  let partners: PartnerItem[] = CORPORATE_PARTNERS

  try {
    const dbClients = await prisma.client.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' }
    })

    if (dbClients && dbClients.length > 0) {
      partners = dbClients.map(dbC => {
        const fallback = CORPORATE_PARTNERS.find(p => p.name.toLowerCase() === dbC.name.toLowerCase()) || CORPORATE_PARTNERS[0]
        return {
          id: dbC.id,
          name: dbC.name,
          role: fallback.role,
          scope: dbC.description || fallback.scope,
          logoText: dbC.name.split(' ')[0] || fallback.logoText,
          category: fallback.category,
          website: dbC.website || fallback.website
        }
      })
    }
  } catch (e) {
    // Graceful fallback
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-[#079B49]/20 selection:text-[#075C35]">
      
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-zinc-200 dark:border-zinc-800 bg-[#F6F8F6]/80 dark:bg-zinc-900/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
            <Link href="/" className="hover:text-[#079B49] transition-colors">Beranda</Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">Mitra & Klien</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">
              Jejaring Kemitraan Korporasi
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
              Mitra & Klien Terpercaya KKUSB
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-light">
              Membangun sinergi berkelanjutan bersama korporasi terkemuka, holding industri semen, manufaktur otomotif, dan jejaring institusi di seluruh Indonesia.
            </p>
          </div>

        </div>
      </section>

      {/* 2. PARTNERS GRID */}
      <section className="py-20 lg:py-28 border-b border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-12">
          
          <div className="space-y-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">Portofolio Kemitraan</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Perusahaan & Institusi Mitra
            </h2>
            <p className="text-xs text-zinc-500">
              Kemitraan strategis dalam pengadaan material, layanan boga industri, perawatan armada, dan mobilitas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {partners.map((partner) => (
              <div 
                key={partner.id}
                className="p-7 rounded-3xl bg-[#F6F8F6]/60 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#079B49] bg-white dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
                      {partner.category}
                    </span>
                    <span className="text-lg font-black tracking-wider text-zinc-800 dark:text-zinc-200">
                      {partner.logoText}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {partner.name}
                  </h3>

                  <p className="text-xs font-semibold text-[#075C35] dark:text-emerald-400">
                    Peran: {partner.role}
                  </p>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                    {partner.scope}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#079B49]" />
                    Kerjasama Terverifikasi
                  </span>

                  {partner.website && (
                    <a 
                      href={partner.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#079B49] font-bold hover:underline flex items-center gap-1"
                    >
                      Website Mitra <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. CLIENT DEMOGRAPHICS ACROSS INDONESIA */}
      <section className="py-20 lg:py-28 bg-[#F6F8F6]/80 dark:bg-zinc-900/30 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">Sebaran Wilayah Layanan</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Demografis Klien & Jangkauan Nasional
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Portofolio pelayanan KKUSB telah menjangkau berbagai kota dan kawasan industri utama di Indonesia.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CLIENT_DEMOGRAPHICS.map((demo, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3"
              >
                <div className="flex items-center gap-2 text-[#079B49] font-bold text-sm border-b border-zinc-100 dark:border-zinc-800 pb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{demo.region}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {demo.cities.map((city, cIdx) => (
                    <span 
                      key={cIdx}
                      className="text-xs bg-[#F6F8F6] dark:bg-zinc-900 px-2.5 py-1 rounded-md text-zinc-700 dark:text-zinc-300 font-medium"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. PARTNERSHIP CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-br from-[#075C35] to-[#079B49] text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F4C430]">Kolaborasi Institusi</span>
          <h2 className="text-3xl sm:text-4xl font-black">
            Buka Peluang Kerjasama Baru Bersama KKUSB
          </h2>
          <p className="text-base text-white/80 max-w-2xl mx-auto leading-relaxed font-light">
            Kami menyambut baik sinergi bersama BUMN, korporasi swasta, serikat pekerja, serta pelaku industri untuk menciptakan ekosistem bisnis yang saling menguntungkan.
          </p>
          <div className="pt-2">
            <Button asChild size="lg" className="bg-white hover:bg-zinc-100 text-[#075C35] font-bold rounded-full px-8">
              <Link href="/kontak">
                Hubungi Kami untuk Kemitraan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}
