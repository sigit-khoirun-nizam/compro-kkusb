import Link from 'next/link'
import { 
  Briefcase, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  ShoppingBag, 
  Compass, 
  Wrench, 
  Utensils, 
  MapPin, 
  ChevronRight,
  CheckCircle2,
  Phone,
  Layers,
  HeartHandshake
} from 'lucide-react'
import prisma from '@/lib/prisma'
import { Metadata } from 'next'
import { BUSINESS_UNITS, MEMBER_SERVICES, BusinessUnitItem } from '@/lib/data/kkusb-data'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Unit Usaha & Layanan Anggota — Portofolio Bisnis KKUSB',
  description: 'Portofolio lengkap 6 unit usaha mandiri KKUSB: Pemasaran & Penjualan, USPPS Simpan Pinjam Syariah, Retail USB Mart, Tour & Travel, Bengkel Simetris, dan Kantin Fabrikasi.',
}

const unitIcons: Record<string, any> = {
  TrendingUp,
  ShieldCheck,
  ShoppingBag,
  Compass,
  Wrench,
  Utensils
}

export default async function PublicUnitUsahaPage() {
  let units: BusinessUnitItem[] = BUSINESS_UNITS

  try {
    const dbUnits = await prisma.unitUsaha.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' }
    })

    if (dbUnits && dbUnits.length > 0) {
      units = dbUnits.map(dbU => {
        const fallback = BUSINESS_UNITS.find(b => b.slug === dbU.slug) || BUSINESS_UNITS[0]
        return {
          id: dbU.id,
          name: dbU.name,
          slug: dbU.slug,
          category: fallback.category,
          shortDescription: dbU.shortDescription || fallback.shortDescription,
          description: dbU.description || fallback.description,
          services: fallback.services,
          features: fallback.features,
          image: dbU.image || fallback.image,
          iconName: fallback.iconName,
          location: fallback.location,
          contactPhone: fallback.contactPhone
        }
      })
    }
  } catch (e) {
    // Graceful fallback to verified data
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-[#079B49]/20 selection:text-[#075C35]">
      
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-zinc-200 dark:border-zinc-800 bg-[#F6F8F6]/80 dark:bg-zinc-900/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
            <Link href="/" className="hover:text-[#079B49] transition-colors">Beranda</Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">Unit Usaha</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">
              Portofolio Bisnis Terpadu
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
              Unit Usaha Mandiri & Komersial KKUSB
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-light">
              Membangun kemandirian finansial dan menopang ekonomi gotong royong melalui 6 pilar unit usaha yang dikelola secara profesional di Gresik, Tuban, dan Rembang.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2 text-xs font-semibold">
            <a href="#daftar-unit" className="px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-[#079B49] hover:text-[#079B49] transition-colors shadow-sm">
              6 Unit Usaha Strategis
            </a>
            <a href="#layanan-anggota" className="px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-[#079B49] hover:text-[#079B49] transition-colors shadow-sm">
              Layanan Khusus Anggota (USPPS)
            </a>
            <a href="#infrastruktur" className="px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-[#079B49] hover:text-[#079B49] transition-colors shadow-sm">
              Infrastruktur Kota (Gresik, Tuban, Rembang)
            </a>
          </div>

        </div>
      </section>

      {/* 2. DAFTAR 6 UNIT USAHA */}
      <section id="daftar-unit" className="py-20 lg:py-28 scroll-mt-24 border-b border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">Portofolio Aktif</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                Pilar Bisnis yang Dikelola KKUSB
              </h2>
            </div>
            <p className="text-xs text-zinc-500">Menampilkan 6 unit usaha terverifikasi</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {units.map((unit) => {
              const IconComp = unitIcons[unit.iconName] || TrendingUp
              return (
                <div 
                  key={unit.id}
                  className="group bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
                >
                  {/* Image with overlay badge */}
                  <div className="relative h-52 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <img 
                      src={unit.image} 
                      alt={unit.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    <span className="absolute bottom-3 left-4 text-[11px] font-bold bg-[#079B49] text-white px-2.5 py-1 rounded-md shadow-sm">
                      {unit.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-green-50 dark:bg-green-950/60 text-[#079B49] flex items-center justify-center shrink-0 mt-0.5">
                          <IconComp className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#079B49] transition-colors leading-snug">
                          {unit.name}
                        </h3>
                      </div>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed font-light">
                        {unit.shortDescription}
                      </p>

                      {/* Services bullet previews */}
                      <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500">
                        {unit.services.slice(0, 3).map((serv, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-[#079B49] shrink-0" />
                            <span className="line-clamp-1">{serv}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold">
                      <span className="text-zinc-400 font-normal flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#079B49]" />
                        {unit.location}
                      </span>

                      <Button asChild size="sm" variant="outline" className="rounded-full text-xs hover:border-[#079B49] hover:text-[#079B49]">
                        <Link href={`/unit-usaha/${unit.slug}`}>
                          Detail Unit &rarr;
                        </Link>
                      </Button>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* 3. LAYANAN ANGGOTA (#layanan-anggota - PixelSpoke Inspired) */}
      <section id="layanan-anggota" className="py-20 lg:py-28 scroll-mt-24 bg-[#F6F8F6]/80 dark:bg-zinc-900/30 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#079B49] bg-green-100/70 dark:bg-green-950/70 px-3 py-1 rounded-full">
              <HeartHandshake className="h-3.5 w-3.5" />
              <span>Khusus Anggota Koperasi</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Layanan Finansial & Kesejahteraan Anggota
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Layanan simpan pinjam dan pembiayaan ini diperuntukkan secara khusus bagi karyawan anggota aktif KKUSB dengan prinsip kekeluargaan dan syariah.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MEMBER_SERVICES.map((m, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#079B49] bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded">
                    {m.badge}
                  </span>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {m.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                    {m.desc}
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500">
                  {m.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-1.5">
                      <div className="h-1 w-1 rounded-full bg-[#079B49]" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="p-6 rounded-2xl bg-[#075C35] text-white flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#F4C430] uppercase tracking-wider">USPPS Mandiri</span>
                <h3 className="text-lg font-bold">Konsultasi Simpan Pinjam</h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Ajukan simpanan berjangka atau pembiayaan syariah melalui tim customer service USPPS kami.
                </p>
              </div>

              <Button asChild size="sm" className="bg-white hover:bg-zinc-100 text-[#075C35] font-bold rounded-xl w-full">
                <Link href="/kontak">
                  Hubungi Kantor Pusat
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. INFRASTRUKTUR WILAYAH (#infrastruktur - Gresik, Tuban, Rembang) */}
      <section id="infrastruktur" className="py-20 lg:py-28 scroll-mt-24 border-b border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">Sebaran Fasilitas</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Jaringan Infrastruktur Multi-Kota
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Titik layanan gerai, minimarket, bengkel, dan unit logistik KKUSB yang beroperasi aktif setiap hari.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Gresik */}
            <div className="p-6 rounded-2xl bg-[#F6F8F6] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Kota Gresik</h3>
                <span className="text-xs font-semibold text-[#079B49] bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                  Pusat Operasional
                </span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2">&bull; Kantor Pusat (Ruko Kartini Megah Blok A3)</li>
                <li className="flex items-center gap-2">&bull; USB Mart Kartini</li>
                <li className="flex items-center gap-2">&bull; USB Mart Veteran</li>
                <li className="flex items-center gap-2">&bull; KKUSB Tour and Travel</li>
                <li className="flex items-center gap-2">&bull; Kantin Fabrikasi Kawasan Industri</li>
                <li className="flex items-center gap-2">&bull; Bengkel Simetris Otomotif</li>
              </ul>
            </div>

            {/* Tuban */}
            <div className="p-6 rounded-2xl bg-[#F6F8F6] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Kabupaten Tuban</h3>
                <span className="text-xs font-semibold text-[#079B49] bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                  Cabang Operasional
                </span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2">&bull; USB Mart Tuban (Penyedia Sembako Karyawan)</li>
                <li className="flex items-center gap-2">&bull; USB Part Tuban (Suku Cadang & Peralatan)</li>
                <li className="flex items-center gap-2">&bull; Layanan Logistik Kawasan Pabrik Tuban</li>
              </ul>
            </div>

            {/* Rembang */}
            <div className="p-6 rounded-2xl bg-[#F6F8F6] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Kabupaten Rembang</h3>
                <span className="text-xs font-semibold text-[#079B49] bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                  Cabang Operasional
                </span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2">&bull; USB Mart Rembang (Retail Karyawan)</li>
                <li className="flex items-center gap-2">&bull; USB Part Rembang (Perkakas & Suku Cadang)</li>
                <li className="flex items-center gap-2">&bull; Kemitraan Program Komunitas Pabrik Rembang</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 5. INQUIRY CTA */}
      <section className="py-16 bg-[#075C35] text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Butuh Layanan Pengadaan atau Kemitraan Komersial?
          </h2>
          <p className="text-sm text-white/80 max-w-xl mx-auto">
            Tim profesional kami siap melayani pesanan korporasi, kebutuhan perjalanan dinas, serta pengadaan material industri Anda.
          </p>
          <div className="pt-2">
            <Button asChild size="lg" className="bg-white hover:bg-zinc-100 text-[#075C35] font-bold rounded-full">
              <Link href="/kontak">
                Hubungi Divisi Pemasaran KKUSB &rarr;
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}
