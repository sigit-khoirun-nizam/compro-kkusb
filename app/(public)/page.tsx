import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Calendar, 
  ChevronRight, 
  Building2, 
  CheckCircle2, 
  Award, 
  ShoppingBag, 
  Compass, 
  Wrench, 
  Utensils,
  MapPin,
  ExternalLink,
  Sparkles,
  HeartHandshake,
  Layers,
  ArrowUpRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import { 
  KKUSB_PROFILE, 
  BUSINESS_UNITS, 
  MEMBER_SERVICES, 
  CORPORATE_PARTNERS, 
  NEWS_ARTICLES,
  CLIENT_DEMOGRAPHICS 
} from '@/lib/data/kkusb-data'

const unitIcons: Record<string, any> = {
  TrendingUp,
  ShieldCheck,
  ShoppingBag,
  Compass,
  Wrench,
  Utensils
}

export default async function HomePage() {
  // Query Prisma with graceful fallback
  let units = BUSINESS_UNITS
  let news = NEWS_ARTICLES

  try {
    const dbUnits = await prisma.unitUsaha.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
      take: 6
    })
    if (dbUnits && dbUnits.length > 0) {
      // Merge db data with icons/categories if available
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

    const dbNews = await prisma.news.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 4,
      include: { category: true }
    })
    if (dbNews && dbNews.length > 0) {
      news = dbNews.map(dbN => {
        const fallback = NEWS_ARTICLES.find(b => b.slug === dbN.slug) || NEWS_ARTICLES[0]
        return {
          id: dbN.id,
          title: dbN.title,
          slug: dbN.slug,
          category: (dbN.category?.name as any) || fallback.category,
          categorySlug: dbN.category?.slug || fallback.categorySlug,
          date: dbN.publishedAt ? new Date(dbN.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : fallback.date,
          author: dbN.author || fallback.author,
          readTime: fallback.readTime,
          excerpt: dbN.excerpt || fallback.excerpt,
          content: [dbN.content || fallback.content[0]],
          featuredImage: dbN.featuredImage || fallback.featuredImage,
          tags: fallback.tags
        }
      })
    }
  } catch (error) {
    // MySQL not reachable or offline: seamlessly use verified official data
  }

  const featuredArticle = news[0]
  const recentArticles = news.slice(1, 4)

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-[#079B49]/20 selection:text-[#075C35]">
      
      {/* =========================================================================
          SECTION 1 — CORPORATE HERO (Slalom Inspired Editorial Composition)
      ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-zinc-200/80 dark:border-zinc-800 bg-[#F6F8F6]/60 dark:bg-zinc-900/30">
        
        {/* Subtle geometric background accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#079B49]/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F4C430]/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm text-xs font-semibold text-[#075C35] dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-[#079B49] animate-pulse" />
                <span>Koperasi Karyawan Usaha Sejahtera Bersama (KKUSB)</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 leading-[1.12]">
                Sinergi Usaha, <br />
                <span className="relative inline-block mt-1">
                  <span className="bg-gradient-to-r from-[#079B49] via-[#0BA352] to-[#046A38] bg-clip-text text-transparent">
                    Tumbuh Bersama.
                  </span>
                  {/* Elegant decorative curved accent line */}
                  <svg 
                    className="absolute -bottom-2 left-0 w-full h-3 text-[#F4C430] opacity-85" 
                    viewBox="0 0 260 12" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path 
                      d="M3 9C60 3 180 2 257 8" 
                      stroke="currentColor" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                    />
                  </svg>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed font-normal">
                KKUSB berkomitmen menghadirkan layanan prima dan unit usaha terpadu guna mendukung kesejahteraan anggota serta mitra industri melalui pengelolaan koperasi yang profesional, modern, dan berkelanjutan.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-[#079B49] hover:bg-[#075C35] text-white h-12 px-7 rounded-full text-base font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <Link href="/tentang-kami">
                    Tentang KKUSB
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button 
                  asChild 
                  size="lg" 
                  variant="outline" 
                  className="border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-12 px-7 rounded-full text-base font-semibold transition-all"
                >
                  <Link href="/unit-usaha">
                    Jelajahi Unit Usaha
                  </Link>
                </Button>
              </div>

              {/* Quick credential highlights */}
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800/80 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">15+ Thn</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Dedikasi Sejak 2010</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">1.250+</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Anggota Aktif</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-[#079B49]">3 Kota</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Gresik, Tuban, Rembang</p>
                </div>
              </div>

            </div>

            {/* Right Visual (5 cols): Slalom-style authentic photography */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-zinc-100 dark:bg-zinc-900 aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image 
                  src="/images/hero-office.png" 
                  alt="Aktivitas Perkantoran dan Operasional KKUSB"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
                
                {/* Floating caption card */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-white/40 dark:border-zinc-800 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-950/60 text-[#079B49] flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        Koperasi Berbadan Hukum Resmi
                      </h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Nomor: 518/01/BH/437.58/2010 &bull; Gresik, Jawa Timur
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — INTRODUCTION TO KKUSB (Prophet-style Brand Narrative)
      ========================================================================= */}
      <section className="py-20 lg:py-28 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Narrative Text (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#079B49]">
                <span>Sekilas Profil KKUSB</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
                Membangun Kemandirian Ekonomi Melalui Semangat Gotong Royong
              </h2>

              <div className="space-y-4 text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                <p>
                  <strong>Koperasi Jasa Karyawan Usaha Sejahtera Bersama (KKUSB)</strong> didirikan sebagai wadah ekonomi bersama para pekerja dan karyawan institusi. Bertumpu pada asas kekeluargaan, KKUSB telah bertransformasi menjadi koperasi modern yang mengelola berbagai lini bisnis strategis.
                </p>
                <p>
                  Dengan tata kelola korporasi yang sehat (Good Corporate Governance), KKUSB tidak hanya memberikan fasilitas pinjaman dan simpanan syariah, namun juga mengoperasikan jaringan ritel USB Mart, biro perjalanan dinas & wisata, bengkel pemeliharaan armada, serta jasa pengadaan barang dan katering industri.
                </p>
              </div>

              {/* Value Pills */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F6F8F6] dark:bg-zinc-900/60">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#079B49]" />
                    Transparansi & Audit
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">Laporan pertanggungjawaban berkala dalam RAT terbuka.</p>
                </div>

                <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F6F8F6] dark:bg-zinc-900/60">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#079B49]" />
                    Distribusi SHU Adil
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">Pembagian Sisa Hasil Usaha sebanding partisipasi anggota.</p>
                </div>
              </div>

              <div className="pt-2">
                <Button asChild variant="outline" className="rounded-full border-zinc-300 dark:border-zinc-700">
                  <Link href="/tentang-kami">
                    Baca Sejarah & Visi Misi Lengkap &rarr;
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: Structural Quote / Highlights (5 cols) */}
            <div className="lg:col-span-5 bg-[#F6F8F6] dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Motto Koperasi</span>
                <blockquote className="text-2xl font-extrabold text-[#075C35] dark:text-emerald-400 leading-snug">
                  "{KKUSB_PROFILE.slogan}"
                </blockquote>
                <p className="text-xs text-zinc-500">
                  Prinsip kerja yang membimbing setiap langkah pelayanan kepada anggota dan mitra.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-sm">
                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-lg bg-green-100 text-[#079B49] flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">Kantor Pusat Gresik</p>
                    <p className="text-xs text-zinc-500">{KKUSB_PROFILE.headquarters.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-lg bg-green-100 text-[#079B49] flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">Jangkauan Anggota</p>
                    <p className="text-xs text-zinc-500">Terbuka bagi karyawan institusi kemitraan dan keluarga di seluruh regional.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — BUSINESS UNITS (Deloitte/Slalom Inspired Grid of 6 Units)
      ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#F6F8F6]/80 dark:bg-zinc-900/20 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6 max-w-6xl mx-auto">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">
                Portofolio Bisnis Terpadu
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                Unit Usaha Strategis KKUSB
              </h2>
              <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                Diversifikasi usaha yang dikelola secara profesional untuk melayani kebutuhan industri, operasional perusahaan, serta menopang pendapatan sisa hasil usaha.
              </p>
            </div>

            <Button asChild className="bg-[#079B49] hover:bg-[#075C35] text-white rounded-full shrink-0">
              <Link href="/unit-usaha">
                Lihat Seluruh Unit Usaha &rarr;
              </Link>
            </Button>
          </div>

          {/* Grid of 6 units */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {units.map((unit) => {
              const IconComp = unitIcons[unit.iconName] || TrendingUp
              return (
                <div 
                  key={unit.id}
                  className="group bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
                >
                  {/* Card Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <img 
                      src={unit.image} 
                      alt={unit.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 text-[11px] font-semibold bg-white/95 dark:bg-zinc-900/95 text-zinc-800 dark:text-zinc-200 px-2.5 py-1 rounded-md">
                      {unit.category}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-green-50 dark:bg-green-950/60 text-[#079B49] flex items-center justify-center shrink-0 mt-0.5">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#079B49] transition-colors leading-snug">
                        {unit.name}
                      </h3>
                    </div>

                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed flex-1">
                      {unit.shortDescription}
                    </p>

                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-[#079B49]">
                      <span className="text-zinc-400 font-normal">{unit.location}</span>
                      <Link 
                        href={`/unit-usaha/${unit.slug}`}
                        className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        Detail Layanan &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — SERVICES FOR MEMBERS (PixelSpoke Inspired Member Focus)
      ========================================================================= */}
      <section className="py-20 lg:py-28 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900 text-xs font-bold text-[#079B49]">
              <HeartHandshake className="h-3.5 w-3.5" />
              <span>Khusus Anggota Koperasi KKUSB</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Layanan Finansial & Kesejahteraan Anggota
            </h2>

            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Kami memisahkan secara jelas layanan keanggotaan internal dengan layanan komersial umum. Solusi keuangan di bawah ini dirancang khusus untuk memenuhi kebutuhan dan meningkatkan taraf hidup anggota KKUSB.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MEMBER_SERVICES.map((serv, i) => (
              <div 
                key={i}
                className="p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-[#F6F8F6]/60 dark:bg-zinc-900/40 hover:border-[#079B49]/40 transition-colors space-y-4 flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#079B49] bg-white dark:bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800">
                    {serv.badge}
                  </span>
                  <span className="text-xs text-zinc-400 font-semibold">0{i+1}</span>
                </div>

                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                  {serv.title}
                </h3>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1">
                  {serv.desc}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
                  {serv.points.map((pt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#079B49]" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* CTA Box in the grid */}
            <div className="p-7 rounded-2xl border border-dashed border-[#079B49] bg-green-50/50 dark:bg-green-950/20 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">Ingin Bergabung?</span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Pendaftaran Anggota Baru
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Bagi karyawan institusi yang ingin mendaftar keanggotaan KKUSB dan mengakses seluruh fasilitas pembiayaan serta SHU, silakan hubungi tim kesekretariatan.
                </p>
              </div>

              <Button asChild className="w-full bg-[#079B49] hover:bg-[#075C35] text-white rounded-xl">
                <Link href="/kontak">
                  Konsultasi Layanan Anggota
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — VALUES & ADVANTAGES (Good Corporate Governance)
      ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#F6F8F6]/80 dark:bg-zinc-900/30 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Header & Intro (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">
                Komitmen & Nilai Dasar
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
                Mengapa Memilih dan Bermitra dengan KKUSB?
              </h2>

              <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Kami menjunjung tinggi tata kelola yang bersih, kepatuhan regulasi, serta integritas operasional. Setiap keputusan diarahkan untuk menciptakan manfaat jangka panjang bagi anggota dan mitra kerja sama.
              </p>

              <div className="pt-2">
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/tentang-kami#tata-kelola">
                    Pelajari Pedoman Tata Kelola (GCG) &rarr;
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Pillars (7 cols) */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {KKUSB_PROFILE.values.map((val, i) => (
                <div 
                  key={i}
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3"
                >
                  <div className="h-9 w-9 rounded-xl bg-green-100/70 dark:bg-green-950/70 text-[#079B49] flex items-center justify-center font-bold text-sm">
                    0{i+1}
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {val.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 6 — LATEST NEWS & ACTIVITIES (Prophet Inspired Magazine Layout)
      ========================================================================= */}
      <section className="py-20 lg:py-28 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">
                Pemberitaan Resmi & Kegiatan
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                Kabar & Pengumuman KKUSB
              </h2>
              <p className="text-base text-zinc-600 dark:text-zinc-400">
                Informasi terkini mengenai agenda rapat anggota, program mitra industri, dan pelatihan staf.
              </p>
            </div>

            <Button asChild variant="outline" className="rounded-full shrink-0">
              <Link href="/berita">
                Lihat Semua Berita &rarr;
              </Link>
            </Button>
          </div>

          {/* Editorial Grid: 1 Big Featured + 3 Stacked Recent */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Featured Article (7 cols) */}
            {featuredArticle && (
              <div className="lg:col-span-7 group bg-[#F6F8F6]/60 dark:bg-zinc-900/40 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                  <img 
                    src={featuredArticle.featuredImage} 
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-white/95 dark:bg-zinc-900/95 text-xs font-bold text-[#079B49] px-3 py-1 rounded-full shadow-sm">
                    {featuredArticle.category}
                  </span>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#079B49]" />
                      {featuredArticle.date}
                    </span>
                    <span>&bull;</span>
                    <span>{featuredArticle.author}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#079B49] transition-colors leading-snug">
                    <Link href={`/berita/${featuredArticle.slug}`}>
                      {featuredArticle.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="pt-2">
                    <Link 
                      href={`/berita/${featuredArticle.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#079B49] hover:underline"
                    >
                      Baca Selengkapnya <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 3 Recent Side Articles (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {recentArticles.map((item) => (
                <div 
                  key={item.id}
                  className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-green-50/40 dark:hover:bg-zinc-900 transition-colors group space-y-2"
                >
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="font-semibold text-[#079B49] bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span>{item.date}</span>
                  </div>

                  <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#079B49] transition-colors leading-snug">
                    <Link href={`/berita/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h4>

                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
              ))}

              <div className="p-5 rounded-2xl bg-[#F6F8F6] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center space-y-2">
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Ingin mengikuti seluruh agenda publikasi?
                </p>
                <Button asChild size="sm" variant="outline" className="rounded-full text-xs">
                  <Link href="/berita">
                    Arsip Berita & Artikel
                  </Link>
                </Button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 7 — CORPORATE PARTNERS (Verified Logos & Multi-City Demographics)
      ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#F6F8F6]/80 dark:bg-zinc-900/30 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">
              Jejaring Kemitraan Strategis
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Dipercaya Klien & Mitra Industri Nasional
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              KKUSB menjalin kemitraan erat dengan BUMN terkemuka, holding industri semen, manufaktur otomotif, serta jaringan komersial di seluruh Nusantara.
            </p>
          </div>

          {/* Partner Cards Grid: Balanced and clean without floating weird spaces */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {CORPORATE_PARTNERS.map((partner) => (
              <div 
                key={partner.id}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between hover:border-[#079B49]/50 transition-colors group text-center min-h-[140px]"
              >
                <div className="my-auto">
                  <span className="text-lg sm:text-xl font-black text-zinc-800 dark:text-zinc-200 tracking-wider group-hover:text-[#079B49] transition-colors block">
                    {partner.logoText}
                  </span>
                  <p className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-1">
                    {partner.name}
                  </p>
                </div>
                <span className="text-[10px] text-zinc-400 bg-zinc-50 dark:bg-zinc-900 py-1 px-2 rounded-md">
                  {partner.category}
                </span>
              </div>
            ))}
          </div>

          {/* Demographics Summary Bar */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 justify-center md:justify-start">
                <MapPin className="h-4 w-4 text-[#079B49]" />
                Jangkauan Wilayah Klien & Layanan di Indonesia
              </h4>
              <p className="text-xs text-zinc-500">
                Gresik, Surabaya, Tuban, Rembang, Yogyakarta, Bandung, Jakarta, Padang, Kupang, Makassar, dan kota industri lainnya.
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="rounded-full shrink-0">
              <Link href="/mitra">
                Lihat Informasi Mitra Lengkap &rarr;
              </Link>
            </Button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 8 — CAREER OPPORTUNITIES (Work Culture & Recruitment Intro)
      ========================================================================= */}
      <section className="py-20 lg:py-28 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#079B49]">
                Karir & Pengembangan Bakat
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
                Bergabung dan Berkembang Bersama Keluarga Besar KKUSB
              </h2>

              <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Kami percaya bahwa kualitas pelayanan bertumpu pada integritas dan kapabilitas setiap individu. KKUSB membuka peluang karir profesional bagi talenta muda berdedikasi di bidang retail, akuntansi koperasi, logistik pengadaan, dan teknis otomotif.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F6F8F6] dark:bg-zinc-900/50">
                  <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Kekeluargaan</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Lingkungan kerja suportif dan humanis.</p>
                </div>
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F6F8F6] dark:bg-zinc-900/50">
                  <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Pelatihan Rutin</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Peningkatan kompetensi profesi berkala.</p>
                </div>
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F6F8F6] dark:bg-zinc-900/50">
                  <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Jaminan Kesejahteraan</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Perlindungan kesehatan & fasilitas koperasi.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button asChild className="bg-[#079B49] hover:bg-[#075C35] text-white rounded-full">
                  <Link href="/karir">
                    Lihat Posisi Lowongan Kerja &rarr;
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/portal-pelamar">
                    Portal Pelamar
                  </Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 aspect-[4/3] bg-zinc-100 dark:bg-zinc-900">
                <Image 
                  src="/images/career-team.png" 
                  alt="Budaya Kerja dan Rekrutmen KKUSB"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 9 — CONTACT CTA (Visually Strong Closing CTA)
      ========================================================================= */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-[#075C35] to-[#079B49] text-white relative overflow-hidden">
        
        {/* Subtle patterned rings */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full border border-white/10 pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-white/90">
            <Sparkles className="h-3.5 w-3.5 text-[#F4C430]" />
            <span>Kemitraan Koperasi & Komersial 2026</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Mari Tumbuh dan Berkembang Bersama KKUSB
          </h2>

          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed font-light">
            Baik untuk kebutuhan pengadaan material industri, kerja sama retail USB Mart, perjalanan dinas, maupun keanggotaan koperasi karyawan — tim kami siap memberikan solusi terbaik.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              asChild 
              size="lg" 
              className="bg-white hover:bg-zinc-100 text-[#075C35] font-bold h-12 px-8 rounded-full shadow-lg transition-all"
            >
              <Link href="/kontak">
                Hubungi Kami Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button 
              asChild 
              size="lg" 
              variant="ghost" 
              className="border-2 border-white/80 text-white bg-transparent hover:bg-white hover:text-[#075C35] h-12 px-8 rounded-full font-bold transition-all"
            >
              <Link href="/unit-usaha">
                Eksplorasi Portofolio Unit
              </Link>
            </Button>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-white/70">
            <span>Kantor Pusat: Ruko Kartini Megah Blok A3, Gresik</span>
            <span>&bull;</span>
            <span>Telp: 0821 1808 1681</span>
            <span>&bull;</span>
            <span>Email: kantorpusat@kkusb.co.id</span>
          </div>

        </div>
      </section>

    </div>
  )
}
